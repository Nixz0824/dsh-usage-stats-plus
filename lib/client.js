/**
 * dsh-usage-stats — browser half.
 *
 * Hand-written `__ModuleLoader__` bundle (no build step): a sidebar footer
 * action that opens a floating panel with provider balances, subscription
 * quota windows, a Codex-style blue daily token-usage heatmap, per-day
 * provider/model breakdowns, and cache hit rates. Data comes from the server
 * half's loopback-only endpoints via same-origin fetch.
 */
window.__ModuleLoader__.load({
	id: "dsh-usage-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let primitives = require("@deepseek-ai/dsh-client-ui-primitives");

		//#region css
		const css = [
			".usg_layer{flex:none;align-items:center;width:100%;height:49px;margin:8px 0 0;display:flex;position:relative}",
			".usg_footerButtons{align-items:center;width:100%;display:flex}",
			".usg_badge{width:100%;height:49px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;align-items:center;gap:8px;padding:0 8px 0 6px;font-family:inherit;font-size:14px;display:inline-flex;overflow:hidden}",
			".usg_badge:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}",
			".usg_badge[data-active]{background:var(--dsw-alias-interactive-bg-hover)}",
			".usg_badgeLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}",
			".usg_badgeCount{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;flex:none;margin-left:auto;font-size:12px;line-height:16px}",
			".usg_layer.usg_rail{width:36px;height:36px;margin:0}",
			".usg_layer.usg_rail .usg_badge{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;padding:0}",
			".usg_layer.usg_rail .usg_footerButtons{flex-direction:column;gap:2px}",
			".usg_panel{z-index:30;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);width:480px;max-width:calc(100vw - 24px);max-height:74vh;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);--usg-ink:var(--dsw-alias-label-primary);--usg-ink-soft:color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent);--usg-cellEmpty:rgba(128,128,128,0.14);border-radius:12px;flex-direction:column;display:flex;position:fixed;bottom:128px;left:12px;overflow:hidden}",
			".usg_header{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);flex:none;justify-content:space-between;align-items:center;min-height:52px;padding:10px 12px 10px 16px;display:flex}",
			".usg_headerLeft{align-items:center;gap:8px;display:flex}",
			".usg_headerLogo{width:20px;height:20px;color:var(--usg-ink);flex:none;display:block}",
			".usg_title{color:var(--dsw-alias-label-primary);font-size:16px;font-weight:600;line-height:24px}",
			".usg_headerActions{align-items:center;gap:2px;display:flex}",
			".usg_iconButton{cursor:pointer;width:28px;height:28px;color:var(--dsw-alias-label-tertiary);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;display:inline-flex}",
			".usg_iconButton:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}",
			".usg_iconButton:active{background:var(--dsw-alias-interactive-bg-hover-solid)}",
			".usg_spin{animation:usg_spin .8s linear infinite}",
			"@keyframes usg_spin{to{transform:rotate(360deg)}}",
			".usg_body{flex:1;min-height:0;padding:18px 16px 14px;overflow-y:auto}",
			".usg_section{margin-top:16px}",
			".usg_sectionTitle{color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:600;line-height:20px;margin:0 0 8px}",
			".usg_note{color:var(--dsw-alias-label-tertiary);margin:4px 0;font-size:12px;line-height:18px}",
			".usg_error{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);border-radius:8px;justify-content:space-between;align-items:flex-start;gap:8px;margin:4px 0;padding:7px 8px;font-size:12px;line-height:18px;display:flex}",
			".usg_retry{color:inherit;font:inherit;cursor:pointer;background:0 0;border:none;flex:none;padding:0}",
			".usg_balanceGrid{align-items:start;justify-content:space-between;gap:16px;display:flex}",
			".usg_balanceMain{flex-direction:column;gap:2px;display:flex}",
			".usg_balanceAmount{color:var(--dsw-alias-label-primary);font-size:30px;font-weight:600;line-height:36px;font-variant-numeric:tabular-nums;letter-spacing:-0.01em}",
			".usg_balanceLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
			".usg_balanceSpend{flex-direction:column;gap:2px;display:flex;align-items:flex-end}",
			".usg_balanceSpendValue{color:var(--dsw-alias-label-primary);font-size:17px;font-weight:600;line-height:36px;font-variant-numeric:tabular-nums}",
			".usg_balanceSpendLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
			".usg_quotaList{flex-direction:column;gap:8px;display:flex}",
			".usg_quotaRow{display:flex;flex-direction:column;gap:4px}",
			".usg_quotaMeta{align-items:baseline;gap:8px;display:flex}",
			".usg_quotaLabel{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}",
			".usg_quotaValue{color:var(--dsw-alias-label-primary);margin-left:auto;font-size:12px;font-weight:600;line-height:16px;font-variant-numeric:tabular-nums}",
			".usg_quotaReset{color:var(--dsw-alias-label-caption);font-size:9px;line-height:14px;white-space:nowrap}",
			".usg_quotaTrack{height:6px;background:var(--dsw-alias-fill-l2);border-radius:999px;overflow:hidden}",
			".usg_quotaFill{height:100%;background:var(--usg-ink);border-radius:inherit;min-width:2px;transition:width .2s ease}",
			".usg_quotaEmpty{color:var(--dsw-alias-label-tertiary);margin:0;font-size:11px;line-height:17px}",
			".usg_statsRow{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:8px 0}",
			".usg_stat{min-width:0;flex-direction:column;gap:4px;display:flex}",
			".usg_stat+.usg_stat{border-left:1px solid var(--dsw-alias-border-l1);padding-left:12px}",
			".usg_statValue{color:var(--dsw-alias-label-primary);font-size:17px;font-weight:600;line-height:24px;font-variant-numeric:tabular-nums;white-space:nowrap}",
			".usg_statLabel{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}",
			".usg_hitRow{border-top:1px solid var(--dsw-alias-border-l1);justify-content:space-between;align-items:baseline;padding-top:8px;font-size:11px;line-height:16px;display:flex}",
			".usg_hitLabel{color:var(--dsw-alias-label-tertiary)}",
			".usg_hitValue{color:var(--dsw-alias-label-primary);font-weight:600;font-variant-numeric:tabular-nums}",
			".usg_hitBar{height:4px;background:var(--dsw-alias-fill-l2);border-radius:999px;margin-top:5px;overflow:hidden}",
			".usg_hitBarFill{height:100%;background:var(--usg-ink);border-radius:inherit;transition:width .2s ease}",
			".usg_heatHeader{justify-content:space-between;align-items:center;margin-bottom:8px;display:flex}",
			".usg_heatHeader .usg_sectionTitle{flex:none;margin:0}",
			".usg_activity{min-width:0}",
			".usg_activityWeeks{display:grid;grid-template-columns:repeat(var(--usg-weeks,53),minmax(0,1fr));gap:2px;width:100%}",
			".usg_activityWeek{display:grid;grid-template-rows:repeat(7,1fr);gap:2px}",
			".usg_activityCell{width:100%;aspect-ratio:1/1;border:0;border-radius:2px;background:var(--usg-cellEmpty);padding:0;cursor:pointer;display:block}",
			".usg_activityCell:hover{box-shadow:0 0 0 1px var(--dsw-alias-label-secondary)}",
			".usg_activityCell[data-today]{box-shadow:0 0 0 1px var(--usg-ink)}",
			".usg_activityCell[data-today]:hover{box-shadow:0 0 0 1px var(--usg-ink)}",
			".usg_activityCell[data-selected]{box-shadow:0 0 0 1px var(--dsw-alias-label-primary)}",
			".usg_activityCell[data-selected]:hover{box-shadow:0 0 0 1px var(--dsw-alias-label-primary)}",
			".usg_activityFuture{width:100%;aspect-ratio:1/1;background:transparent}",
			".usg_activityMonths{position:relative;height:16px;margin-top:5px}",
			".usg_activityMonthLabel{position:absolute;top:0;transform:translateX(-50%);color:var(--dsw-alias-label-tertiary);font-size:9px;line-height:14px;white-space:nowrap}",
			".usg_activityTabs{align-items:center;gap:2px;display:flex}",
			".usg_activityTab{cursor:pointer;color:var(--dsw-alias-label-tertiary);background:0 0;border:none;border-radius:6px;padding:2px 8px;font-size:11px;line-height:16px}",
			".usg_activityTab:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}",
			".usg_activityTab[data-active]{color:var(--usg-ink);background:var(--usg-ink-soft)}",
			".usg_weeklyBars{display:grid;grid-template-columns:repeat(var(--usg-weeks,53),minmax(0,1fr));gap:2px;width:100%;height:56px;align-items:end}",
			".usg_weeklyBar{width:100%;min-height:2px;background:var(--usg-ink);opacity:.55;border-radius:2px 2px 0 0}",
			".usg_cumulativeSvg{width:100%;height:64px;display:block}",
			".usg_detailHeader{align-items:center;gap:8px;display:flex}",
			".usg_days{flex-direction:column;display:flex}",
			".usg_back{cursor:pointer;width:26px;height:26px;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;display:inline-flex;flex:none}",
			".usg_back:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}",
			".usg_detailDate{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:20px}",
			".usg_detailHit{color:var(--dsw-alias-label-tertiary);margin-left:auto;font-size:11px;line-height:20px;font-variant-numeric:tabular-nums}",
			".usg_detailSummary{color:var(--dsw-alias-label-secondary);margin:6px 0 8px;font-size:12px;line-height:18px;font-variant-numeric:tabular-nums}",
			".usg_modelRow{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;margin-bottom:8px;padding:8px 10px;display:flex;flex-direction:column;gap:4px}",
			".usg_modelRow:last-child{margin-bottom:0}",
			".usg_modelHead{align-items:center;gap:8px;display:flex}",
			".usg_modelName{color:var(--dsw-alias-label-primary);min-width:0;text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:12px;font-weight:500;line-height:18px;overflow:hidden}",
			".usg_modelTokens{color:var(--dsw-alias-label-primary);flex:none;font-size:12px;line-height:18px;font-variant-numeric:tabular-nums}",
			".usg_modelHit{color:var(--dsw-alias-label-tertiary);flex:none;width:56px;font-size:11px;line-height:18px;font-variant-numeric:tabular-nums;text-align:right}",
			".usg_modelBarTrack{background:var(--dsw-alias-fill-l2);border-radius:2px;height:5px;overflow:hidden}",
			".usg_modelBar{background:var(--usg-ink);border-radius:2px;height:5px}",
			".usg_modelMeta{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;font-variant-numeric:tabular-nums}",
			".usg_footerNote{color:var(--dsw-alias-label-caption);margin-top:6px;font-size:11px;line-height:16px;font-variant-numeric:tabular-nums}"
		].join("");
		const tagId = "dsh-usage-stats/UsageStats.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-usage-stats";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const S = {
			layer: "usg_layer",
			rail: "usg_rail",
			footerButtons: "usg_footerButtons",
			badge: "usg_badge",
			badgeLabel: "usg_badgeLabel",
			badgeCount: "usg_badgeCount",
			panel: "usg_panel",
			header: "usg_header",
			headerLeft: "usg_headerLeft",
			title: "usg_title",
			headerActions: "usg_headerActions",
			iconButton: "usg_iconButton",
			body: "usg_body",
			section: "usg_section",
			sectionTitle: "usg_sectionTitle",
			note: "usg_note",
			error: "usg_error",
			retry: "usg_retry",
			headerLogo: "usg_headerLogo",
			quotaList: "usg_quotaList",
			quotaRow: "usg_quotaRow",
			quotaMeta: "usg_quotaMeta",
			quotaLabel: "usg_quotaLabel",
			quotaValue: "usg_quotaValue",
			quotaReset: "usg_quotaReset",
			quotaTrack: "usg_quotaTrack",
			quotaFill: "usg_quotaFill",
			quotaEmpty: "usg_quotaEmpty",
			balanceGrid: "usg_balanceGrid",
			balanceMain: "usg_balanceMain",
			balanceAmount: "usg_balanceAmount",
			balanceLabel: "usg_balanceLabel",
			balanceSpend: "usg_balanceSpend",
			balanceSpendValue: "usg_balanceSpendValue",
			balanceSpendLabel: "usg_balanceSpendLabel",
			statsRow: "usg_statsRow",
			stat: "usg_stat",
			statValue: "usg_statValue",
			statLabel: "usg_statLabel",
			spin: "usg_spin",
			hitRow: "usg_hitRow",
			hitLabel: "usg_hitLabel",
			hitValue: "usg_hitValue",
			hitBar: "usg_hitBar",
			hitBarFill: "usg_hitBarFill",
			heatHeader: "usg_heatHeader",
			activity: "usg_activity",
			activityWeeks: "usg_activityWeeks",
			activityWeek: "usg_activityWeek",
			activityCell: "usg_activityCell",
			activityFuture: "usg_activityFuture",
			activityMonths: "usg_activityMonths",
			activityMonthLabel: "usg_activityMonthLabel",
			activityTabs: "usg_activityTabs",
			activityTab: "usg_activityTab",
			weeklyBars: "usg_weeklyBars",
			weeklyBar: "usg_weeklyBar",
			cumulativeSvg: "usg_cumulativeSvg",
			detailHeader: "usg_detailHeader",
			days: "usg_days",
			back: "usg_back",
			detailDate: "usg_detailDate",
			detailHit: "usg_detailHit",
			detailSummary: "usg_detailSummary",
			modelRow: "usg_modelRow",
			modelHead: "usg_modelHead",
			modelName: "usg_modelName",
			modelTokens: "usg_modelTokens",
			modelHit: "usg_modelHit",
			modelBarTrack: "usg_modelBarTrack",
			modelBar: "usg_modelBar",
			modelMeta: "usg_modelMeta",
			footerNote: "usg_footerNote"
		};
		//#endregion

		//#region helpers
		/** Local `YYYY-MM-DD` for a Date. */
		function dayKeyOf(date) {
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			return `${date.getFullYear()}-${month}-${day}`;
		}

		/** Today's local `YYYY-MM-DD`. */
		function todayKey() {
			return dayKeyOf(new Date());
		}

		/** Group thousands. */
		function fmt(n) {
			return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		/** Compact form: 1234 → "1.2k". */
		function fmtCompact(n) {
			if (n < 1000) return String(n);
			if (n < 1000000) return `${(n / 1000).toFixed(n < 10000 ? 1 : 0)}k`;
			return `${(n / 1000000).toFixed(1)}m`;
		}

		/** Hit-rate display: null/undefined → "—". */
		function fmtHit(hitRate) {
			return hitRate === null || hitRate === void 0 ? "—" : `${hitRate}%`;
		}

		/** Currency-aware amount: `¥ 36.44` / `$ 12.00` (Intl, fallback keeps the raw value). */
		function fmtCurrency(amount, currency) {
			if (amount === void 0 || amount === null) return "—";
			const numeric = Number(amount);
			if (!Number.isFinite(numeric)) return "—";
			try {
				return new Intl.NumberFormat(undefined, { style: "currency", currency: currency ?? "CNY" }).format(numeric);
			} catch {
				return `${currency ?? "CNY"} ${amount}`;
			}
		}

		/**
		 * Per-request staleness guard: each `start()` bumps a private counter and
		 * only the most recent start may `isCurrent()`. Usage and balance each
		 * hold their OWN loader, so the two never invalidate each other (the
		 * shared-counter race that dropped the first usage response).
		 */
		function createLoader() {
			let current = 0;
			return {
				start: () => ++current,
				isCurrent: (id) => id === current
			};
		}

		/**
		 * Normalize server-provided account metadata for the single selector.
		 * Adapter/mode selection belongs to the server registry, never UI guesses.
		 */
		function buildProviderChoices(providers) {
			return Array.isArray(providers) ? providers.map((provider) => ({
				...provider,
				accountMode: provider.accountMode ?? "balance"
			})) : [];
		}

		/** Locale-safe template interpolation: `t("key", {a})` replaces `{a}`. */
		function interpolate(template, params) {
			if (params === void 0) return template;
			return template.replace(/\{(\w+)\}/g, (match, key) => (Object.hasOwn(params, key) ? String(params[key]) : match));
		}

		async function fetchJson(path) {
			const response = await fetch(path, { headers: { accept: "application/json" } });
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const payload = await response.json();
			if (payload === null || typeof payload !== "object") throw new Error("unexpected response");
			return payload;
		}

		/** Monday-based weekday index: 0 = Monday … 6 = Sunday. */
		function mondayIndex(date) {
			return (date.getDay() + 6) % 7;
		}

		/**
		 * Rolling 12-month activity timeline (Codex-style): columns = weeks
		 * (Mon-first), rows = weekdays, one cell per day. The range starts at
		 * the Monday of the week containing the first day of the month 11
		 * months ago and ends with the week containing today; days after today
		 * are future cells (rendered inert, no interaction).
		 * @param dayMap - date key → day entry map (`{ tokens, cacheHitRate }`).
		 * @param now - anchor Date (today).
		 * @returns `{ weeks, monthLabels, thresholds, weekTotals, cumulative }`:
		 *   `weeks` is `[{ key, tokens, hitRate, isFuture }][]` (7 per week);
		 *   `monthLabels` is `[{ label, weekIndex }]` (first-week of each month,
		 *   collision-pruned); `thresholds` are 25/50/75 quantiles of non-zero
		 *   tokens; `cumulative` is `[{ key, total }]` in day order.
		 */
		function buildActivity(dayMap, now) {
			const today = dayKeyOf(now);
			const rangeStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
			const gridStart = new Date(rangeStart);
			gridStart.setDate(gridStart.getDate() - mondayIndex(rangeStart));
			const cursor = new Date(gridStart);
			const weeks = [];
			const nonZero = [];
			for (let guard = 0; guard < 54; guard += 1) {
				const week = [];
				let hasToday = false;
				for (let d = 0; d < 7; d += 1) {
					const key = dayKeyOf(cursor);
					const entry = dayMap.get(key);
					const tokens = entry?.tokens ?? 0;
					const isFuture = key > today;
					if (!isFuture && tokens > 0) nonZero.push(tokens);
					if (key === today) hasToday = true;
					week.push({ key, tokens, hitRate: entry?.cacheHitRate ?? null, isFuture });
					cursor.setDate(cursor.getDate() + 1);
				}
				weeks.push(week);
				if (hasToday) break;
			}
			const thresholds = activityThresholds(nonZero);
			const monthLabels = [];
			for (let m = 0; m < 12; m += 1) {
				const monthStart = new Date(now.getFullYear(), now.getMonth() - 11 + m, 1);
				// 该月 1 号所在的周列（周一起始；floor 保证落在周末的 1 号仍属当周）。
				const weekIndex = Math.floor((monthStart.getTime() - gridStart.getTime()) / (7 * 86400000));
				if (weekIndex < 0) continue;
				monthLabels.push({ label: `${monthStart.getMonth() + 1}月`, weekIndex });
			}
			const weekTotals = weeks.map((week) => week.reduce((sum, cell) => sum + (cell.isFuture ? 0 : cell.tokens), 0));
			let running = 0;
			const cumulative = [];
			for (const week of weeks) {
				for (const cell of week) {
					if (cell.isFuture) continue;
					running += cell.tokens;
					cumulative.push({ key: cell.key, total: running });
				}
			}
			return { weeks, monthLabels, thresholds, weekTotals, cumulative };
		}

		/** 活动色阶：黑白灰单色系（与顶栏鲸鱼 Logo 同源）。4 个非零等级按
		 * 非零值的 25/50/75 分位数分档；色值用 color-mix 从 --usg-ink
		 * （明暗主题自适应：浅色主题 = 黑→浅灰，深色主题 = 白→深灰）混出，
		 * 最高级为纯墨色，零用量为中性灰。
		 */
		const ACTIVITY_ALPHAS = [0, 0.3, 0.5, 0.72, 1];

		/** 官方 DeepSeek 鲸鱼 Logo（官方 favicon.svg 的 path 数据，viewBox 0 0 50 50）。 */
		const WHALE_LOGO_PATH = "M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z";
		function activityThresholds(values) {
			const sorted = [...values].sort((a, b) => a - b);
			if (sorted.length === 0) return [];
			const quantile = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
			return [quantile(0.25), quantile(0.5), quantile(0.75)];
		}
		function activityLevelOf(tokens, thresholds) {
			if (tokens <= 0) return 0;
			if (thresholds.length === 0) return 4;
			if (tokens <= thresholds[0]) return 1;
			if (tokens <= thresholds[1]) return 2;
			if (tokens <= thresholds[2]) return 3;
			return 4;
		}
		function activityBackground(level) {
			if (level <= 0) return "var(--usg-cellEmpty)";
			const percent = Math.round(ACTIVITY_ALPHAS[level] * 100);
			return `color-mix(in srgb, var(--usg-ink) ${percent}%, transparent)`;
		}
		//#endregion

		//#region UsageStatsPanel
		/**
		 * Sidebar footer action: badge + floating panel with balance and usage.
		 * @param props - `wide` from the sidebar shell, `t` bound by the slot runtime.
		 */
		function UsageStatsPanel({ wide, t }) {
			const translate = (key, params) => interpolate(t !== void 0 ? t(key) : key, params);
			const [open, setOpen] = react.useState(false);
			const [usage, setUsage] = react.useState(null);
			const [usageError, setUsageError] = react.useState(null);
			const [selectedDay, setSelectedDay] = react.useState(null);
			const [activityView, setActivityView] = react.useState("daily");
			const [providers, setProviders] = react.useState([]);
			const [providersLoaded, setProvidersLoaded] = react.useState(false);
			const [selectedProvider, setSelectedProvider] = react.useState(null);
			const [account, setAccount] = react.useState(null);
			const [accountLoading, setAccountLoading] = react.useState(false);
			const [accountError, setAccountError] = react.useState(null);
			const [refreshedAt, setRefreshedAt] = react.useState(null);
			const mountedRef = react.useRef(true);
			const usageLoaderRef = react.useRef(null);
			const accountLoaderRef = react.useRef(null);
			if (usageLoaderRef.current === null) usageLoaderRef.current = createLoader();
			if (accountLoaderRef.current === null) accountLoaderRef.current = createLoader();
			const providerChoices = react.useMemo(() => buildProviderChoices(providers), [providers]);
			const selectedProviderInfo = providerChoices.find((provider) => provider.id === selectedProvider) ?? null;

			const loadUsage = react.useCallback(() => {
				const seq = usageLoaderRef.current.start();
				setUsageError(null);
				fetchJson("/api/usage-stats/usage").then((payload) => {
					if (!mountedRef.current || !usageLoaderRef.current.isCurrent(seq)) return;
					if (payload.ok !== true) {
						setUsageError(payload.message ?? "usage aggregation failed");
						return;
					}
					setUsage(payload);
					setRefreshedAt(Date.now());
				}).catch((error) => {
					if (!mountedRef.current || !usageLoaderRef.current.isCurrent(seq)) return;
					setUsageError(error instanceof Error ? error.message : String(error));
				});
			}, []);

			const loadProviders = react.useCallback(() => {
				fetchJson("/api/usage-stats/providers").then((payload) => {
					if (!mountedRef.current) return;
					if (payload.ok !== true) {
						setProvidersLoaded(true);
						return;
					}
					const list = Array.isArray(payload.providers) ? payload.providers : [];
					setProviders(list);
					setProvidersLoaded(true);
				}).catch(() => { setProvidersLoaded(true); });
			}, []);

			const loadAccount = react.useCallback((providerId, force = false) => {
				const seq = accountLoaderRef.current.start();
				setAccountLoading(true);
				setAccountError(null);
				const target = providerId;
				if (target === null) {
					setAccountLoading(false);
					setAccountError("no providers");
					return;
				}
				const query = `?provider=${encodeURIComponent(target)}${force ? "&refresh=1" : ""}`;
				fetchJson(`/api/usage-stats/account${query}`).then((payload) => {
					if (!mountedRef.current || !accountLoaderRef.current.isCurrent(seq)) return;
					if (payload.ok !== true) {
						setAccountError(payload.message ?? "account fetch failed");
						return;
					}
					setAccount(payload.account);
					setRefreshedAt(payload.account?.fetchedAt ?? Date.now());
				}).catch((error) => {
					if (!mountedRef.current || !accountLoaderRef.current.isCurrent(seq)) return;
					setAccountError(error instanceof Error ? error.message : String(error));
				}).finally(() => {
					if (mountedRef.current && accountLoaderRef.current.isCurrent(seq)) setAccountLoading(false);
				});
			}, []);

			react.useEffect(() => {
				mountedRef.current = true;
				return () => {
					mountedRef.current = false;
				};
			}, []);

			// Keep exactly one valid provider selected across independent provider
			// and subscription responses. DeepSeek remains the initial preference.
			react.useEffect(() => {
				if (!providersLoaded || providerChoices.length === 0) return;
				setSelectedProvider((current) => {
					if (current !== null && providerChoices.some((provider) => provider.id === current)) return current;
					return providerChoices.find((provider) => provider.id === "deepseek-official" && provider.configured)?.id
						?? providerChoices.find((provider) => provider.id === "deepseek")?.id
						?? providerChoices.find((provider) => provider.configured)?.id
						?? providerChoices[0].id;
				});
			}, [providerChoices, providersLoaded]);

			react.useEffect(() => {
				if (!open) return;
				loadUsage();
				loadProviders();
				const usageTimer = window.setInterval(loadUsage, 60000);
				const providerTimer = window.setInterval(loadProviders, 300000);
				return () => {
					window.clearInterval(usageTimer);
					window.clearInterval(providerTimer);
				};
			}, [open, loadUsage, loadProviders]);

			// Fetch exactly the selected account. The server refreshes all providers
			// in the background; this request normally reads its five-minute cache.
			react.useEffect(() => {
				if (!open || selectedProvider === null) return;
				loadAccount(selectedProvider);
				const timer = window.setInterval(() => loadAccount(selectedProvider), 300000);
				return () => {
					window.clearInterval(timer);
				};
			}, [open, selectedProvider, loadAccount]);

			const dayMap = react.useMemo(() => {
				const map = new Map();
				if (usage !== null && Array.isArray(usage.days)) {
					for (const day of usage.days) map.set(day.date, day);
				}
				return map;
			}, [usage]);

			// Drop a stale selection when refreshed data no longer has that day.
			react.useEffect(() => {
				if (selectedDay !== null && !dayMap.has(selectedDay)) setSelectedDay(null);
			}, [dayMap, selectedDay]);

			const activity = react.useMemo(() => buildActivity(dayMap, new Date()), [dayMap]);

			const stats = react.useMemo(() => {
				if (usage === null || !Array.isArray(usage.days)) return null;
				const today = todayKey();
				const month = today.slice(0, 7);
				let todayEntry = null;
				let dayTokens = 0;
				let monthTokens = 0;
				let total = usage.total?.tokens ?? 0;
				for (const day of usage.days) {
					if (day.date === today) {
						dayTokens = day.tokens ?? 0;
						todayEntry = day;
					}
					if (day.date.startsWith(month)) monthTokens += day.tokens ?? 0;
				}
				return {
					dayTokens,
					monthTokens,
					total,
					todayHit: todayEntry?.cacheHitRate ?? null,
					todayEntry
				};
			}, [usage]);

			const todayCost = react.useMemo(() => {
				if (stats === null || stats.todayEntry === null || stats.todayEntry === void 0) return null;
				const cost = stats.todayEntry.cost;
				return typeof cost === "number" && Number.isFinite(cost) ? cost : null;
			}, [stats]);

			const selectedEntry = selectedDay !== null ? dayMap.get(selectedDay) ?? null : null;
			const badgeCount = stats !== null ? fmtCompact(stats.dayTokens) : null;

			const retry = () => {
				loadUsage();
				loadProviders();
				if (selectedProvider !== null) loadAccount(selectedProvider, true);
			};

			const updatedLabel = refreshedAt === null ? "" : translate("panel.updatedAt", {
				time: new Date(refreshedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
			});

			return react_jsx_runtime.jsxs("div", {
				className: wide ? S.layer : `${S.layer} ${S.rail}`,
				children: [
					open && react_jsx_runtime.jsxs("section", {
						className: S.panel,
						"data-usage-stats-panel": true,
						"aria-label": translate("panel.title"),
						children: [
							react_jsx_runtime.jsxs("header", {
								className: S.header,
								children: [
									react_jsx_runtime.jsxs("div", {
										className: S.headerLeft,
										children: [
											react_jsx_runtime.jsx("svg", {
												className: S.headerLogo,
												viewBox: "0 0 50 50",
												"aria-hidden": true,
												children: react_jsx_runtime.jsx("path", { d: WHALE_LOGO_PATH, fill: "currentColor", fillRule: "nonzero" })
											}),
											react_jsx_runtime.jsx("span", { className: S.title, children: translate("panel.title") })
										]
									}),
									react_jsx_runtime.jsxs("div", {
										className: S.headerActions,
										children: [
											react_jsx_runtime.jsx(primitives.Tooltip, {
												label: translate("action.refresh"),
												side: "bottom",
												delayMs: 500,
												children: react_jsx_runtime.jsx("button", {
													type: "button",
													className: `${S.iconButton}${accountLoading ? ` ${S.spin}` : ""}`,
													"aria-label": translate("action.refresh"),
													onClick: retry,
													children: react_jsx_runtime.jsx(primitives.IconRefreshOutline14, { size: 14 })
												})
											}),
											react_jsx_runtime.jsx(primitives.Tooltip, {
												label: translate("action.close"),
												side: "bottom",
												delayMs: 500,
												children: react_jsx_runtime.jsx("button", {
													type: "button",
													className: S.iconButton,
													"aria-label": translate("action.close"),
													onClick: () => setOpen(false),
													children: react_jsx_runtime.jsx(primitives.IconCloseOutline16, { size: 14 })
												})
											})
										]
									})
								]
							}),
							react_jsx_runtime.jsxs("div", {
								className: S.body,
								children: [
									selectedEntry !== null ? react_jsx_runtime.jsx(DayDetail, {
										day: selectedEntry,
										translate,
										onBack: () => setSelectedDay(null)
									}) : react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
										children: [
											selectedProviderInfo !== null && react_jsx_runtime.jsx(ProviderAccountCard, {
												provider: selectedProviderInfo,
												account: account?.id === selectedProvider ? account : null,
												accountLoading,
												accountError,
												translate,
												todayCost,
												onRetry: () => loadAccount(selectedProvider, true)
											}, selectedProviderInfo.id),
											react_jsx_runtime.jsx("section", {
												className: S.section,
												children: react_jsx_runtime.jsx("h3", { className: S.sectionTitle, children: translate("usage.title") })
											}),
											stats === null && usageError === null ? react_jsx_runtime.jsx("p", { className: S.note, children: translate("usage.loading") }) : null,
											usageError !== null ? react_jsx_runtime.jsxs("div", {
												className: S.error,
												children: [
													react_jsx_runtime.jsx("span", { children: translate("usage.error", { message: usageError }) }),
													react_jsx_runtime.jsx("button", {
														type: "button",
														className: S.retry,
														onClick: loadUsage,
														children: translate("action.retry")
													})
												]
											}) : null,
											stats !== null && react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
												children: [
													react_jsx_runtime.jsxs("div", {
														className: S.statsRow,
														children: [
															react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.today") }), react_jsx_runtime.jsx("span", { className: S.statValue, title: `${fmt(stats.dayTokens)} Tokens`, children: fmtCompact(stats.dayTokens) })] }),
															react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.month") }), react_jsx_runtime.jsx("span", { className: S.statValue, title: `${fmt(stats.monthTokens)} Tokens`, children: fmtCompact(stats.monthTokens) })] }),
															react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.total") }), react_jsx_runtime.jsx("span", { className: S.statValue, title: `${fmt(stats.total)} Tokens`, children: fmtCompact(stats.total) })] })
														]
													}),
													react_jsx_runtime.jsxs("div", {
														className: S.hitRow,
														children: [
															react_jsx_runtime.jsx("span", { className: S.hitLabel, children: translate("usage.hitRate") }),
															react_jsx_runtime.jsx("span", { className: S.hitValue, children: fmtHit(stats.todayHit) })
														]
													}),
													react_jsx_runtime.jsx("div", {
														className: S.hitBar,
														children: react_jsx_runtime.jsx("div", {
															className: S.hitBarFill,
															style: { width: `${stats.todayHit === null || stats.todayHit === void 0 ? 0 : Math.max(0, Math.min(100, stats.todayHit))}%` }
														})
													})
												]
											}),
											usage !== null && usageError === null && react_jsx_runtime.jsxs("section", {
												className: S.section,
												children: [
													react_jsx_runtime.jsxs("div", {
														className: S.heatHeader,
														children: [
															react_jsx_runtime.jsx("h3", { className: S.sectionTitle, children: translate("usage.activity.title") }),
															react_jsx_runtime.jsxs("div", {
																className: S.activityTabs,
																children: [
																	["daily", "weekly", "cumulative"].map((view) => react_jsx_runtime.jsx("button", {
																		type: "button",
																		className: S.activityTab,
																		"data-active": activityView === view ? "" : void 0,
																		"aria-pressed": activityView === view,
																		onClick: () => setActivityView(view),
																		children: translate(`usage.activity.${view}`)
																	}, view))
																]
															})
														]
													}),
													react_jsx_runtime.jsx(ActivityTimeline, {
														activity,
														view: activityView,
														translate,
														selectedKey: selectedDay,
														onSelect: setSelectedDay
													})
												]
											}),
											updatedLabel !== "" && react_jsx_runtime.jsx("p", { className: S.footerNote, children: updatedLabel })
										]
									})
								]
							})
						]
					}),
					react_jsx_runtime.jsx("div", {
						className: S.footerButtons,
						children: react_jsx_runtime.jsxs("button", {
							type: "button",
							className: S.badge,
							"data-usage-stats-badge": true,
							"aria-label": translate("panel.badge"),
							"aria-expanded": open,
							onClick: () => setOpen((value) => !value),
							children: [
								react_jsx_runtime.jsx(primitives.IconDataOutline16, { size: wide ? 14 : 18 }),
								wide && react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
									children: [
										react_jsx_runtime.jsx("span", { className: S.badgeLabel, children: translate("panel.badge") }),
										badgeCount !== null && react_jsx_runtime.jsx("span", { className: S.badgeCount, children: badgeCount })
									]
								})
							]
						})
					})
				]
			});
		}

		/** Balance-mode body: flat summary grid (available balance + today's spend). */
		function BalanceContent({ balance, state, message, translate, onRetry, todayCost, allChannel }) {
			if (state === "loading" || balance === null && state === "ok") return react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("balance.loading") });
			if (state === "unsupported") return react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("balance.unsupported") });
			if (state === "no-credential") return react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("balance.noCredential", { ref: message ?? "" }) });
			if (state === "error") return react_jsx_runtime.jsxs("div", {
				className: S.error,
				children: [
					react_jsx_runtime.jsx("span", { children: translate("balance.error", { message: message ?? "" }) }),
					react_jsx_runtime.jsx("button", { type: "button", className: S.retry, onClick: onRetry, children: translate("action.retry") })
				]
			});
			const showAllChannel = typeof allChannel === "number" && Number.isFinite(allChannel);
			const exactCost = todayCost === null || todayCost === void 0 ? null : todayCost;
			const spendValue = showAllChannel
				? fmtCurrency(allChannel, "CNY")
				: exactCost === null ? "—" : fmtCurrency(exactCost, "CNY");
			const spendLabel = showAllChannel ? translate("usage.todaySpendAllChannel") : translate("usage.todaySpend");
			const spendHint = showAllChannel
				? translate("usage.todaySpendAllChannelHint", { dshCost: exactCost === null ? "—" : fmtCurrency(exactCost, "CNY") })
				: translate("usage.todaySpendHint");
			return react_jsx_runtime.jsxs("div", {
				className: S.balanceGrid,
				children: [
					react_jsx_runtime.jsxs("div", {
						className: S.balanceMain,
						children: [
							react_jsx_runtime.jsx("span", { className: S.balanceAmount, children: balance.unlimited ? "∞" : fmtCurrency(balance.remaining, balance.currency) }),
							react_jsx_runtime.jsx("span", { className: S.balanceLabel, children: translate("balance.remaining") })
						]
					}),
					react_jsx_runtime.jsxs("div", {
						className: S.balanceSpend,
						title: spendHint,
						children: [
							react_jsx_runtime.jsx("span", { className: S.balanceSpendValue, children: spendValue }),
							react_jsx_runtime.jsx("span", { className: S.balanceSpendLabel, children: spendLabel })
						]
					})
				]
			});
		}

		function quotaLabel(kind, translate) {
			if (kind === "session") return translate("subscription.window.session");
			if (kind === "daily") return translate("subscription.window.daily");
			if (kind === "weekly") return translate("subscription.window.weekly");
			if (kind === "monthly") return translate("subscription.window.monthly");
			if (kind === "quota") return translate("subscription.window.quota");
			if (kind === "billing") return translate("subscription.window.mcp");
			return kind;
		}

		function resetLabel(resetsAt, translate) {
			if (typeof resetsAt !== "string") return "";
			const date = new Date(resetsAt);
			if (Number.isNaN(date.getTime())) return "";
			return translate("subscription.resets", {
				time: date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
			});
		}

		/** Percentage-window body rendered inside the shared provider account frame. */
		function SubscriptionContent({ provider, translate }) {
			const windows = Array.isArray(provider.windows) ? provider.windows : [];
			const status = typeof provider.status === "string" ? provider.status : "unavailable";
			const emptyMessage = status === "not-configured"
				? translate("subscription.notConfigured", { refs: Array.isArray(provider.missingCredentials) ? provider.missingCredentials.join(" + ") : "" })
				: status === "unauthorized" ? translate("subscription.unauthorized")
					: status === "rate-limited" ? translate("subscription.rateLimited")
						: status === "invalid-response" ? translate("account.invalidResponse")
							: status === "unsupported" ? translate("balance.unsupported")
								: translate("subscription.unavailable");
			return (status === "ok" || provider.stale === true) && windows.length > 0 ? react_jsx_runtime.jsx("div", {
						className: S.quotaList,
						children: windows.map((window) => {
							const used = Math.max(0, Math.min(100, Number(window.usedPercent) || 0));
							return react_jsx_runtime.jsxs("div", {
								className: S.quotaRow,
								children: [
									react_jsx_runtime.jsxs("div", {
										className: S.quotaMeta,
										children: [
											react_jsx_runtime.jsx("span", { className: S.quotaLabel, children: quotaLabel(window.kind, translate) }),
											react_jsx_runtime.jsx("span", { className: S.quotaReset, children: resetLabel(window.resetsAt, translate) }),
											react_jsx_runtime.jsx("span", { className: S.quotaValue, children: translate("subscription.used", { value: used.toFixed(used % 1 === 0 ? 0 : 1) }) })
										]
									}),
									react_jsx_runtime.jsx("div", {
										className: S.quotaTrack,
										role: "progressbar",
										"aria-label": quotaLabel(window.kind, translate),
										"aria-valuemin": 0,
										"aria-valuemax": 100,
										"aria-valuenow": used,
										children: react_jsx_runtime.jsx("div", { className: S.quotaFill, style: { width: `${used}%` } })
									})
								]
							}, window.kind);
						})
					}) : react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: emptyMessage });
		}

		/**
		 * The single account view: balance mode renders the flat summary grid
		 * (available balance + today's spend); subscription mode renders its
		 * quota windows. No provider identity chrome — the DeepSeek whale in
		 * the panel header is the only brand surface.
		 */
		function ProviderAccountCard({ provider, account, accountLoading, accountError, translate, onRetry, todayCost }) {
			const mode = account?.mode ?? provider.accountMode ?? "balance";
			const subscriptionMode = mode === "subscription";
			const status = accountLoading && account === null ? "loading" : account?.status ?? "unavailable";
			const allChannel = account?.allChannel?.estimate ?? null;
			const balanceState = accountLoading && account === null ? "loading"
				: accountError !== null ? "error"
					: status === "not-configured" ? "no-credential"
						: status === "unsupported" ? "unsupported"
							: account?.balance !== null && account?.balance !== void 0 ? "ok" : "error";
			const balanceMessage = accountError ?? account?.missingCredentials?.[0] ?? status;
			return subscriptionMode
				? accountError !== null ? react_jsx_runtime.jsxs("div", {
					className: S.error,
					children: [
						react_jsx_runtime.jsx("span", { children: translate("subscription.error", { message: accountError }) }),
						react_jsx_runtime.jsx("button", { type: "button", className: S.retry, onClick: onRetry, children: translate("action.retry") })
					]
				}) : accountLoading && account === null
					? react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("subscription.loading") })
					: react_jsx_runtime.jsx(SubscriptionContent, { provider: account ?? { status: "unavailable", windows: [] }, translate })
				: react_jsx_runtime.jsx(BalanceContent, { balance: account?.balance ?? null, state: balanceState, message: balanceMessage, translate, onRetry, todayCost, allChannel });
		}

		/**
		 * One day's per-model breakdown. `day` is the wire day entry carrying
		 * `tokens`, `cacheHitRate`, and `models` (descending by tokens).
		 */
		function DayDetail({ day, translate, onBack }) {
			const models = Array.isArray(day.models) ? day.models : [];
			const totalTokens = day.tokens ?? 0;
			return react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
				children: [
					react_jsx_runtime.jsxs("div", {
						className: S.detailHeader,
						children: [
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: S.back,
								"aria-label": translate("usage.back"),
								onClick: onBack,
								children: react_jsx_runtime.jsx(primitives.IconChevronLeftOutline14, { size: 14 })
							}),
							react_jsx_runtime.jsx("span", { className: S.detailDate, children: dayLabel(day.date, translate) }),
							react_jsx_runtime.jsx("span", { className: S.detailHit, children: `${translate("usage.hitRate")} ${fmtHit(day.cacheHitRate)}` })
						]
					}),
					react_jsx_runtime.jsx("p", {
						className: S.detailSummary,
						children: `${translate("usage.total")} ${fmt(totalTokens)} · ${translate("usage.input")} ${fmt(day.inputTokens ?? 0)} · ${translate("usage.output")} ${fmt(day.outputTokens ?? 0)} · ${translate("usage.cacheRead")} ${fmt(day.cacheReadTokens ?? 0)}`
					}),
					react_jsx_runtime.jsx("div", {
						className: S.days,
						children: models.length === 0 ? react_jsx_runtime.jsx("p", { className: S.note, children: translate("usage.noModels") }) : models.map((model) => {
							const share = totalTokens > 0 ? Math.max(3, Math.round(100 * (model.tokens ?? 0) / totalTokens)) : 0;
							return react_jsx_runtime.jsxs("div", {
								className: S.modelRow,
								children: [
									react_jsx_runtime.jsxs("div", {
										className: S.modelHead,
										children: [
											react_jsx_runtime.jsx("span", { className: S.modelName, title: model.model, children: modelLabelOf(model.model, translate) }),
											react_jsx_runtime.jsx("span", { className: S.modelTokens, children: fmt(model.tokens ?? 0) }),
											react_jsx_runtime.jsx("span", { className: S.modelHit, children: fmtHit(model.cacheHitRate) })
										]
									}),
									react_jsx_runtime.jsx("div", {
										className: S.modelBarTrack,
										children: react_jsx_runtime.jsx("div", { className: S.modelBar, style: { width: `${share}%` } })
									}),
									react_jsx_runtime.jsx("div", {
										className: S.modelMeta,
										children: `${translate("usage.input")} ${fmt(model.inputTokens ?? 0)} · ${translate("usage.output")} ${fmt(model.outputTokens ?? 0)} · ${translate("usage.cacheRead")} ${fmt(model.cacheReadTokens ?? 0)}`
									})
								]
							}, model.model);
						})
					})
				]
			});
		}

		/**
		 * Codex-style Token activity timeline: 7 weekday rows × 52–53 week
		 * columns covering the rolling 12 months. Views: daily (heatmap),
		 * weekly (per-week bars), cumulative (sparkline). Cells are quiet
		 * buttons that open the per-day detail; future cells render inert.
		 */
		function ActivityTimeline({ activity, view, translate, selectedKey, onSelect }) {
			const select = typeof onSelect === "function" ? onSelect : () => {};
			const weeks = activity.weeks;
			const gridStyle = { "--usg-weeks": String(weeks.length) };
			const today = todayKey();
			const cellTitle = (cell) => {
				const hit = cell.hitRate === null || cell.hitRate === void 0 ? "" : ` · ${translate("usage.hitRate")} ${cell.hitRate}%`;
				return `${Number(cell.key.slice(5, 7))}月${Number(cell.key.slice(8, 10))}日 · ${fmt(cell.tokens)} Tokens${hit}`;
			};
			const monthLabels = activity.monthLabels.map((entry, index) => react_jsx_runtime.jsx("span", {
				className: S.activityMonthLabel,
				style: { left: `${((entry.weekIndex + 0.5) / weeks.length) * 100}%` },
				children: entry.label
			}, `${entry.label}-${index}`));
			const renderDaily = () => react_jsx_runtime.jsx("div", {
				className: S.activityWeeks,
				style: gridStyle,
				children: weeks.map((week, weekIndex) => react_jsx_runtime.jsx("div", {
					className: S.activityWeek,
					children: week.map((cell) => {
						if (cell.isFuture) return react_jsx_runtime.jsx("span", { className: S.activityFuture, "aria-hidden": true }, cell.key);
						const level = activityLevelOf(cell.tokens, activity.thresholds);
						return react_jsx_runtime.jsx("button", {
							type: "button",
							className: S.activityCell,
							"data-today": cell.key === today ? "" : void 0,
							"data-selected": selectedKey === cell.key ? "" : void 0,
							style: { background: activityBackground(level) },
							title: cellTitle(cell),
							"aria-label": cellTitle(cell),
							onClick: () => select(cell.key)
						}, cell.key);
					})
				}, weekIndex))
			});
			const maxWeek = Math.max(1, ...activity.weekTotals);
			const renderWeekly = () => react_jsx_runtime.jsx("div", {
				className: S.weeklyBars,
				style: gridStyle,
				children: activity.weekTotals.map((total, weekIndex) => {
					const week = weeks[weekIndex];
					const first = week.find((cell) => !cell.isFuture);
					const range = first === void 0 ? "" : `${Number(first.key.slice(5, 7))}月${Number(first.key.slice(8, 10))}日`;
					return react_jsx_runtime.jsx("div", {
						className: S.weeklyBar,
						style: total > 0 ? { height: `${Math.max(8, Math.round(100 * total / maxWeek))}%` } : { height: "2px", opacity: 0.18 },
						title: `${range} · ${fmt(total)} Tokens`
					}, weekIndex);
				})
			});
			const renderCumulative = () => {
				const points = activity.cumulative;
				if (points.length < 2) {
					return react_jsx_runtime.jsx("div", { className: S.weeklyBars, style: gridStyle });
				}
				const maxTotal = Math.max(1, points[points.length - 1].total);
				const coords = points.map((point, index) => `${(100 * index / (points.length - 1)).toFixed(3)},${(100 - 100 * point.total / maxTotal).toFixed(3)}`).join(" ");
				return react_jsx_runtime.jsx("svg", {
					className: S.cumulativeSvg,
					viewBox: "0 0 100 100",
					preserveAspectRatio: "none",
					"aria-label": translate("usage.activity.cumulative"),
					children: [
						react_jsx_runtime.jsx("polygon", { points: `${coords} 100,100 0,100`, fill: "var(--usg-ink)", opacity: 0.08 }),
						react_jsx_runtime.jsx("polyline", { points: coords, fill: "none", stroke: "var(--usg-ink)", strokeWidth: 1.5, vectorEffect: "non-scaling-stroke", strokeLinejoin: "round" })
					]
				});
			};
			return react_jsx_runtime.jsxs("div", {
				className: S.activity,
				children: [
					view === "weekly" ? renderWeekly() : view === "cumulative" ? renderCumulative() : renderDaily(),
					react_jsx_runtime.jsx("div", { className: S.activityMonths, children: monthLabels })
				]
			});
		}

		/** `YYYY-MM-DD` → `MM-DD 周X` display label. */
		function dayLabel(key, translate) {
			const [, month, day] = key.split("-");
			const date = new Date(Number(key.slice(0, 4)), Number(month) - 1, Number(day));
			const weekdays = [translate("weekday.sun"), translate("weekday.mon"), translate("weekday.tue"), translate("weekday.wed"), translate("weekday.thu"), translate("weekday.fri"), translate("weekday.sat")];
			return `${month}-${day} ${weekdays[date.getDay()]}`;
		}

		function modelLabelOf(key, translate) {
			if (typeof key !== "string") return "";
			const slash = key.indexOf("/");
			if (slash === -1) return key;
			const provider = key.slice(0, slash);
			const model = key.slice(slash + 1);
			const providerLabel = provider === "unknown" ? translate("usage.unknownModel") : provider;
			const modelLabel = model === "unknown" || model === "" ? translate("usage.unknownModel") : model;
			return `${providerLabel} · ${modelLabel}`;
		}
		//#endregion

		//#region locales
		/** `usageStats` namespace dictionaries (the zh key set is the source of truth). */
		const NS = "usageStats";
		const zh = {
			"panel.title": "用量与余额",
			"panel.badge": "用量/余额",
			"account.invalidResponse": "供应商返回了无法识别的额度数据。",
			"balance.unsupported": "该供应商没有公开的余额查询接口。",
			"balance.remaining": "可用余额",
			"balance.loading": "正在查询余额…",
			"balance.noCredential": "未配置 {ref}（请编辑 ~/.dsh/.credentials.yaml）",
			"balance.error": "余额获取失败：{message}",
			"subscription.title": "订阅额度",
			"subscription.loading": "正在查询订阅额度…",
			"subscription.error": "订阅额度获取失败：{message}",
			"subscription.window.session": "5 小时窗口",
			"subscription.window.daily": "每日窗口",
			"subscription.window.weekly": "每周窗口",
			"subscription.window.monthly": "每月窗口",
			"subscription.window.quota": "总额度",
			"subscription.window.mcp": "MCP 月度额度",
			"subscription.used": "已用 {value}%",
			"subscription.resets": "{time} 重置",
			"subscription.notConfigured": "配置 {refs} 后显示真实订阅比例。",
			"subscription.unauthorized": "凭据已失效，请更新后重试。",
			"subscription.rateLimited": "供应商暂时限制查询，请稍后重试。",
			"subscription.unavailable": "供应商没有返回可识别的额度窗口。",
			"usage.title": "Token 用量",
			"usage.today": "今日",
			"usage.month": "本月",
			"usage.total": "累计",
			"usage.loading": "正在统计用量…",
			"usage.error": "用量统计失败：{message}",
			"usage.activity.title": "Token 活动",
			"usage.activity.daily": "每日",
			"usage.activity.weekly": "每周",
			"usage.activity.cumulative": "累计",
			"usage.back": "返回",
			"usage.hitRate": "缓存命中率",
			"usage.hit.today": "今日缓存命中率",
			"usage.todaySpend": "今日消耗（DSH 内）",
			"usage.todaySpendHint": "仅统计经由 DSH 发出的 API 请求（按官方峰谷价逐事件计价）。开放平台账单含网页版、App 及其它客户端的全部用量，金额通常更高。",
			"usage.todaySpendAllChannel": "今日消耗（全渠道估）",
			"usage.todaySpendAllChannelHint": "按官方余额差值估算，覆盖网页版、App 及其它客户端用量；DSH 内精确 {dshCost}。",
			"usage.input": "输入",
			"usage.output": "输出",
			"usage.cacheRead": "缓存读",
			"usage.unknownModel": "未知模型",
			"usage.noModels": "这一天没有分模型数据。",
			"action.refresh": "刷新",
			"action.retry": "重试",
			"action.close": "关闭",
			"panel.updatedAt": "更新于 {time}",
			"weekday.mon": "一",
			"weekday.tue": "二",
			"weekday.wed": "三",
			"weekday.thu": "四",
			"weekday.fri": "五",
			"weekday.sat": "六",
			"weekday.sun": "日"
		};
		const en = {
			"panel.title": "Usage & Balance",
			"panel.badge": "Usage/Balance",
			"account.invalidResponse": "The provider returned unrecognized quota data.",
			"balance.unsupported": "This provider has no public balance interface.",
			"balance.remaining": "Available balance",
			"balance.loading": "Fetching balance…",
			"balance.noCredential": "{ref} is not configured (edit ~/.dsh/.credentials.yaml)",
			"balance.error": "Balance fetch failed: {message}",
			"subscription.title": "Subscription usage",
			"subscription.loading": "Fetching subscription usage…",
			"subscription.error": "Subscription usage failed: {message}",
			"subscription.window.session": "5-hour window",
			"subscription.window.daily": "Daily window",
			"subscription.window.weekly": "Weekly window",
			"subscription.window.monthly": "Monthly window",
			"subscription.window.quota": "Total quota",
			"subscription.window.mcp": "Monthly MCP quota",
			"subscription.used": "{value}% used",
			"subscription.resets": "Resets {time}",
			"subscription.notConfigured": "Configure {refs} to show live subscription usage.",
			"subscription.unauthorized": "The credential has expired; update it and retry.",
			"subscription.rateLimited": "The provider is rate limiting checks; retry later.",
			"subscription.unavailable": "The provider returned no recognizable quota windows.",
			"usage.title": "Token usage",
			"usage.today": "Today",
			"usage.month": "This month",
			"usage.total": "All time",
			"usage.loading": "Aggregating usage…",
			"usage.error": "Usage aggregation failed: {message}",
			"usage.activity.title": "Token activity",
			"usage.activity.daily": "Daily",
			"usage.activity.weekly": "Weekly",
			"usage.activity.cumulative": "Cumulative",
			"usage.back": "Back",
			"usage.hitRate": "Cache hit rate",
			"usage.hit.today": "Today's cache hit rate",
			"usage.todaySpend": "Today's spend (DSH only)",
			"usage.todaySpendHint": "Counts only API requests routed through DSH, priced per event at official peak/off-peak rates. The platform bill also includes web, app, and other client usage.",
			"usage.todaySpendAllChannel": "Today's spend (all-channel est.)",
			"usage.todaySpendAllChannelHint": "Estimated from the official balance delta, covering web/App/other clients; DSH-only exact {dshCost}.",
			"usage.input": "Input",
			"usage.output": "Output",
			"usage.cacheRead": "Cache read",
			"usage.unknownModel": "Unknown model",
			"usage.noModels": "No per-model data for this day.",
			"action.refresh": "Refresh",
			"action.retry": "Retry",
			"action.close": "Close",
			"panel.updatedAt": "Updated at {time}",
			"weekday.mon": "M",
			"weekday.tue": "T",
			"weekday.wed": "W",
			"weekday.thu": "T",
			"weekday.fri": "F",
			"weekday.sat": "S",
			"weekday.sun": "S"
		};
		//#endregion

		//#region plugin body
		/** Services required by the client plugin body. */
		const inject = ["slots", "locale"];

		/**
		 * Client plugin body: register the dictionaries and the sidebar footer action.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "usage-stats: dictionaries");
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "usage-stats",
				locale: NS,
				order: 10
			}, UsageStatsPanel));
		}
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		exports.UsageStatsPanel = UsageStatsPanel;
		exports.DayDetail = DayDetail;
		exports.ProviderAccountCard = ProviderAccountCard;
		exports.ActivityTimeline = ActivityTimeline;
		exports.buildActivity = buildActivity;
		exports.createLoader = createLoader;
		exports.buildProviderChoices = buildProviderChoices;
		exports.modelLabelOf = modelLabelOf;
		exports.fmt = fmt;
		exports.fmtCurrency = fmtCurrency;
		return module.exports;
	}
});
