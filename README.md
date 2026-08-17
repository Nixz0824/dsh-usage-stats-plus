# dsh-usage-stats-plus

[中文](#zhongwen) · [English](#english)

> DSH「用量与余额」面板增强版 —— 官方余额实时拉取 · 逐事件精确计价 · 全渠道消耗估算 · Codex 风格活动时间轴。
>
> Enhanced DSH usage & balance panel — live official balance, per-event pricing, all-channel spend estimates, and a Codex-style activity timeline.

Fork of [Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) (MIT), based on v0.2.0.

![License](https://img.shields.io/github/license/Nixz0824/dsh-usage-stats-plus)
![DSH](https://img.shields.io/badge/DSH-0.1.x-blue)

![Usage and balance panel / 用量与余额面板](docs/images/usage-panel.png)

---

<h2 id="zhongwen">中文</h2>

Fork 自 [Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats)（MIT），在其 v0.2.0 基础上做了**计价引擎重构**与**UI 结构级重构**。

### 特性

- **余额 = 官方实时值**：`GET /user/balance` 直接拉取，5 分钟缓存 + 手动刷新，无任何本地估算
- **今日消耗（DSH 内）精确计价**：从会话日志逐事件（每个用量样本带精确时间戳）按官方峰谷价目表计价，缓存写按未命中价计
- **今日消耗（全渠道估）**：官方余额接口的每日快照差值估算，覆盖网页版 / App / 其它客户端的用量——唯一能对齐开放平台账单数字的口径（需有前一日快照，次日生效）
- **Codex 风格 Token 活动时间轴**：滚动 12 个月，7 行 × 51–53 周列，quantile 分档着色，支持 每日 / 每周 / 累计 三视图
- **黑白灰单色系**：与 DeepSeek 官方鲸鱼 Logo 同源的墨色系统，明暗主题自适应
- 无新增运行时依赖（纯 JS，免构建）

### 安装

```bash
dsh plugin --profile web add "link:<本目录绝对路径>"   # 本地源码
# 或发布后：
dsh plugin --profile web add dsh-usage-stats-plus       # npm
# 或：
dsh plugin --profile web add github:Nixz0824/dsh-usage-stats-plus
```

装完**刷新浏览器页面**（客户端 bundle 随页面加载）。重启后由 profile bundles 自动装配。

### 计价口径（与官方账单核对过）

数据源：官方价格文档 <https://api-docs.deepseek.com/zh-cn/quick_start/pricing>（2026-08-17 生效，元 / 百万 tokens）：

| 模型 | 时段 | 缓存命中 | 输入(未命中) | 输出 |
| --- | --- | ---: | ---: | ---: |
| V4-Pro | 高峰 9:00–12:00 / 14:00–18:00（北京时间） | 0.30 | 9.0 | 27.0 |
| V4-Pro | 空闲 | 0.15 | 4.5 | 13.5 |
| V4-Flash | 高峰 | 0.10 | 3.0 | 9.0 |
| V4-Flash | 空闲 | 0.05 | 1.5 | 4.5 |

- **2026-08-17 00:00（北京时间）之前**自动使用旧版统一价：V4-Pro 命中 0.025 / 未命中 3.0 / 输出 6.0；V4-Flash 0.02 / 1.0 / 2.0
- 缓存写入按输入未命中价计费；高峰判定按**北京时间**（与机器时区无关）
- 每个用量样本按自己的时间戳取价档，**同 turn:step 重复上报按替换语义退旧加新**，不会重复计费
- 其他模型 / 供应商默认不计价（显示 unknown 而非假 0），可用 `config.prices` 补充

### 配置

在 profile 的 `cordis.patch.yml`（或本包 `cordis.patch.yml` 的 insert 条目）里覆盖：

```yaml
- insert:
    - id: usage-stats
      name: dsh-usage-stats-plus
      config:
        prices:
          "deepseek-v4-pro": { peak: { hit: 0.30, miss: 9.0, output: 27.0 }, offpeak: { hit: 0.15, miss: 4.5, output: 13.5 } }
          # "some-other-model": { hit: 2, miss: 4, output: 8 }   # 全天一口价
          # default: { hit: 0.1, miss: 1, output: 4 }
```

### 工作原理

```
Host（Node）
├── lib/pricing.js     官方峰谷价目 + 旧价期 + 北京时间峰谷判定（逐事件计价）
├── lib/usage.js       会话事件 → 每日/每模型 token 分桶 + 精确成本（替换语义）
├── lib/index.js       增量聚合 + 持久缓存 + /api/usage-stats/* 五个只读回环接口
│                      + 每日余额快照（全渠道消耗差值估算）
└── lib/accounts.js    官方余额/订阅额度拉取（loopback-only，无密钥入库）

Client（浏览器，lib/client.js）
├── 余额卡：可用余额（官方实时）+ 今日消耗（全渠道估优先，DSH 内精确兜底，hover 说明口径）
├── Token 用量：今日/本月/累计 + 缓存命中率细条
└── Token 活动：12 个月时间轴，每日(热力图)/每周(柱)/累计(曲线) 三视图
```

### 与上游 v0.2.0 的差异（见 docs/CHANGES.md）

- 计价：官方峰谷价（含 8-17 前旧价期）、北京时间峰谷窗口修正、逐事件精确计价与替换语义
- 新增「全渠道消耗」余额差值估算
- UI 重构：删除月历与品牌行，Codex 风格活动时间轴 + 黑白灰单色系 + 顶栏官方鲸鱼 Logo
- 保持：API 路由、刷新/关闭/交互逻辑、locale 双语、明暗主题机制

### 开发

```bash
npm run check   # node --check 全部 lib 文件
```

无构建步骤（纯 JS bundle，`lib/client.js` 为官方 ModuleLoader 格式手写产物）。

### License

MIT，保留上游 `dsh-usage-stats contributors`（2026）版权声明。感谢 [Ychris12138](https://github.com/Ychris12138/dsh-usage-stats) 的原版。

---

<h2 id="english">English</h2>

Fork of [Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) (MIT). This release rebuilds the pricing engine and the panel layout on top of v0.2.0.

### Features

- **Balance is the official live value**: fetched from `GET /user/balance`, 5-minute cache plus manual refresh, no local estimate
- **Today's spend (inside DSH) is priced per event**: every usage sample in the session log is billed from the official peak / off-peak table, using that sample's timestamp; cache writes are billed at the miss rate
- **Today's spend (all-channel estimate)**: day-over-day difference of official balance snapshots, covering the website / App / other clients — the only figure that lines up with the Open Platform bill (needs yesterday's snapshot; takes effect the next day)
- **Codex-style token activity timeline**: rolling 12 months, 7 rows × 51–53 week columns, quantile shading, with Daily / Weekly / Cumulative views
- **Ink monochrome UI**: same ink system as the official DeepSeek whale mark, follows light and dark theme
- No extra runtime dependencies (plain JS, no build step)

### Install

```bash
dsh plugin --profile web add "link:<absolute-path-to-this-folder>"   # local source
# or after publish:
dsh plugin --profile web add dsh-usage-stats-plus                    # npm
# or:
dsh plugin --profile web add github:Nixz0824/dsh-usage-stats-plus
```

**Reload the browser page** after install (the client bundle loads with the page). A restart lets profile bundles mount it automatically.

### Pricing rules (checked against the official bill)

Source: official pricing docs <https://api-docs.deepseek.com/quick_start/pricing> (effective 2026-08-17, CNY / million tokens):

| Model | Window | Cache hit | Input (miss) | Output |
| --- | --- | ---: | ---: | ---: |
| V4-Pro | Peak 09:00–12:00 / 14:00–18:00 (Beijing time) | 0.30 | 9.0 | 27.0 |
| V4-Pro | Off-peak | 0.15 | 4.5 | 13.5 |
| V4-Flash | Peak | 0.10 | 3.0 | 9.0 |
| V4-Flash | Off-peak | 0.05 | 1.5 | 4.5 |

- **Before 2026-08-17 00:00 (Beijing time)** the old flat rates apply automatically: V4-Pro hit 0.025 / miss 3.0 / output 6.0; V4-Flash 0.02 / 1.0 / 2.0
- Cache writes are billed at the input-miss rate; peak hours are **Beijing time** (independent of the machine timezone)
- Each usage sample picks its own rate from its timestamp; **repeat reports for the same turn:step replace the old sample** (subtract old, add new) and are not double-counted
- Other models / providers are left unpriced (`unknown`, not a fake 0). Add them with `config.prices`

### Config

Override in the profile `cordis.patch.yml` (or in this package's `cordis.patch.yml` insert):

```yaml
- insert:
    - id: usage-stats
      name: dsh-usage-stats-plus
      config:
        prices:
          "deepseek-v4-pro": { peak: { hit: 0.30, miss: 9.0, output: 27.0 }, offpeak: { hit: 0.15, miss: 4.5, output: 13.5 } }
          # "some-other-model": { hit: 2, miss: 4, output: 8 }   # flat all-day rate
          # default: { hit: 0.1, miss: 1, output: 4 }
```

### How it works

```
Host (Node)
├── lib/pricing.js     official peak/off-peak table + legacy period + Beijing peak windows
├── lib/usage.js       session events → per-day / per-model token buckets + exact cost
├── lib/index.js       incremental fold + persistent cache + five read-only /api/usage-stats/* loopback routes
│                      + daily balance snapshots (all-channel spend estimate)
└── lib/accounts.js    official balance / subscription quota (loopback only, no secrets on disk)

Client (browser, lib/client.js)
├── Balance card: available balance (official live) + today's spend (all-channel first, DSH-exact fallback)
├── Token usage: today / this month / all-time + cache-hit bar
└── Token activity: 12-month timeline, Daily (heatmap) / Weekly (bars) / Cumulative (curve)
```

### Differences from upstream v0.2.0 (see docs/CHANGES.md)

- Pricing: official peak/off-peak rates (plus the pre-8-17 legacy period), Beijing peak windows, per-event pricing with replace semantics
- New all-channel spend estimate from balance snapshots
- UI: calendar and brand row removed; Codex-style activity timeline + ink monochrome + official whale mark in the header
- Unchanged: API routes, refresh / close / interaction logic, bilingual locale, light/dark theme hook

### Development

```bash
npm run check   # node --check every file under lib/
```

No build step (`lib/client.js` is a hand-written official ModuleLoader bundle).

### License

MIT. Keeps the upstream `dsh-usage-stats contributors` (2026) copyright notice. Thanks to [Ychris12138](https://github.com/Ychris12138/dsh-usage-stats) for the original plugin.
