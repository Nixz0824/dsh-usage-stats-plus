/**
 * dsh-usage-stats — DeepSeek V4 峰谷计价模型（人民币 / 百万 tokens）。
 *
 * 官方 api-docs.deepseek.com/zh-cn/quick_start/pricing（2026-08-17 生效）：
 *   高峰时段 = 北京时间 9:00–12:00 与 14:00–18:00（其余为空闲，价格为高峰一半）
 *   V4-Pro   高峰：命中 0.30 / 未命中 9.0 / 输出 27.0；空闲：0.15 / 4.5 / 13.5
 *   V4-Flash 高峰：命中 0.10 / 未命中 3.0 / 输出 9.0； 空闲：0.05 / 1.5 / 4.5
 *   缓存写入（cacheWrite）按输入未命中价计费。
 *
 * 2026-08-17 00:00（北京时间）之前为旧版统一价（无峰谷）：
 *   V4-Pro   命中 0.025 / 未命中 3.0 / 输出 6.0
 *   V4-Flash 命中 0.02  / 未命中 1.0 / 输出 2.0
 *
 * 事件级精确计价：costOf(modelKey, timeMs, buckets) 按每个用量样本的时间戳
 * 落在旧价期还是新价期、峰时还是谷时逐条计算。未知模型默认不计价，可在
 * 插件配置 config.prices 中补充（用户覆盖优先于官方表）。
 *
 * @module dsh-usage-stats/pricing
 */

/** 新价生效时刻：2026-08-17 00:00 北京时间 = UTC 2026-08-16T16:00Z。 */
const NEW_PRICING_EPOCH = Date.UTC(2026, 7, 16, 16, 0, 0);

/** 北京时间的小时（与机器时区无关）。 */
function beijingHour(timeMs) {
	return new Date(timeMs + 8 * 3600 * 1000).getUTCHours();
}

/** 高峰窗口：北京时间 9:00–12:00、14:00–18:00（左闭右开）。 */
export function isPeakHour(timeMs) {
	const h = beijingHour(timeMs);
	return (h >= 9 && h < 12) || (h >= 14 && h < 18);
}

/** 官方价目表：model id（不含 provider 前缀）→ 旧价 / 新价两期。 */
const OFFICIAL = {
	"deepseek-v4-pro": {
		legacy: { hit: 0.025, miss: 3.0, output: 6.0 },
		current: {
			peak: { hit: 0.3, miss: 9.0, output: 27.0 },
			offpeak: { hit: 0.15, miss: 4.5, output: 13.5 }
		}
	},
	"deepseek-v4-flash": {
		legacy: { hit: 0.02, miss: 1.0, output: 2.0 },
		current: {
			peak: { hit: 0.1, miss: 3.0, output: 9.0 },
			offpeak: { hit: 0.05, miss: 1.5, output: 4.5 }
		}
	},
	"deepseek-v4-flash-0731": {
		legacy: { hit: 0.02, miss: 1.0, output: 2.0 },
		current: {
			peak: { hit: 0.1, miss: 3.0, output: 9.0 },
			offpeak: { hit: 0.05, miss: 1.5, output: 4.5 }
		}
	}
};

/** 校验单档价格对象，非法字段按 0 处理。 */
function tierOf(raw) {
	if (raw === null || typeof raw !== "object") return null;
	const hit = Number(raw.hit);
	const miss = Number(raw.miss);
	const output = Number(raw.output);
	if (![hit, miss, output].some(Number.isFinite)) return null;
	return {
		hit: Number.isFinite(hit) ? hit : 0,
		miss: Number.isFinite(miss) ? miss : 0,
		output: Number.isFinite(output) ? output : 0
	};
}

/**
 * 解析某模型在给定时刻应使用的单价档。优先级：用户覆盖（完整
 * `provider/model` 键、裸 model 键、`default` 键，条目可为 `{ peak,
 * offpeak }` 或全天一口价 `{ hit, miss, output }`）→ 官方表（按生效期
 * 自动选旧价/新价，新价再按峰谷取档）。
 */
function resolveEntry(prices, modelKey, timeMs) {
	const bare = typeof modelKey === "string" ? modelKey.slice(modelKey.lastIndexOf("/") + 1) : "";
	if (prices !== null && typeof prices === "object") {
		for (const key of [modelKey, bare, "default"]) {
			const entry = prices[key];
			if (entry === null || typeof entry !== "object") continue;
			if (entry.peak !== void 0 && entry.offpeak !== void 0) {
				const peak = tierOf(entry.peak);
				const offpeak = tierOf(entry.offpeak);
				if (peak !== null && offpeak !== null) return { peak, offpeak };
				continue;
			}
			const flat = tierOf(entry);
			if (flat !== null) return flat;
		}
	}
	const official = OFFICIAL[bare];
	if (official === void 0) return null;
	if (timeMs < NEW_PRICING_EPOCH) return tierOf(official.legacy);
	const current = official.current;
	const peak = tierOf(current.peak);
	const offpeak = tierOf(current.offpeak);
	return peak !== null && offpeak !== null ? { peak, offpeak } : null;
}

/**
 * 单次用量样本的精确成本（元）。
 * @param modelKey - `provider/model` 归属键。
 * @param timeMs - 样本事件的毫秒时间戳（决定价格期与峰/谷档）。
 * @param buckets - `{ inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens }`。
 * @param prices - 用户价格覆盖表（可为空对象）。
 * @returns 成本（元）；未知模型或无效配置返回 0。
 */
export function costOf(modelKey, timeMs, buckets, prices = {}) {
	if (buckets === null || typeof buckets !== "object") return 0;
	const entry = resolveEntry(prices ?? {}, modelKey, timeMs);
	if (entry === null) return 0;
	const tier = entry.peak !== void 0 ? (isPeakHour(timeMs) ? entry.peak : entry.offpeak) : entry;
	const missTokens = (Number(buckets.inputTokens) || 0) + (Number(buckets.cacheWriteTokens) || 0);
	const hitTokens = Number(buckets.cacheReadTokens) || 0;
	const outTokens = Number(buckets.outputTokens) || 0;
	return (missTokens * tier.miss + hitTokens * tier.hit + outTokens * tier.output) / 1_000_000;
}
