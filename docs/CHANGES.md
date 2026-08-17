# CHANGES —— dsh-usage-stats-plus v0.3.0（相对上游 dsh-usage-stats v0.2.0）

## 计价引擎（Host）

- 新增 `lib/pricing.js`：官方 DeepSeek V4 峰谷价目表 + 2026-08-17 前旧版统一价 + 北京时间峰谷判定（9:00–12:00 / 14:00–18:00，与机器时区无关）
- `lib/usage.js`：折叠事件时同步累加**精确成本**；同 turn:step 重复样本的替换语义对成本同样生效（退旧加新）
- `lib/index.js`：
  - 聚合缓存版本 v5（改动计价规则后全量重折叠，历史按各自生效期价格重算）
  - 新增**每日余额快照**（`dailyBalance`，随账户接口落盘），提供 `account.allChannel` 全渠道消耗差值估算
  - `/api/usage-stats/account` 返回 `allChannel: { estimate, fromDay, toDay }`
- `config.prices` 支持用户覆盖价目（含 default 兜底）

## UI 重构（Client，lib/client.js）

- 删除：单月月历（7×5 布局）、月份导航、星期表头、"少□多"图例、品牌行（供应商/实时 Badge/DS 字母图标）、全部蓝色系
- 新增：**Codex 风格 Token 活动时间轴**（滚动 12 个月，7 行 × 51–53 周列，quantile 4 档墨色阶），每日 / 每周 / 累计三视图（真实交互）
- 新增：**黑白灰单色系**（`--usg-ink` 明暗自适应），顶栏内联官方鲸鱼 Logo（官方 favicon.svg path 数据）
- 余额区：扁平双列（可用余额 + 今日消耗），无卡片化；消耗数值优先显示「全渠道估」，hover 说明口径与 DSH 内精确值
- 月份标签：12 个月全显示，按每月 1 号所在周列绝对定位居中（floor 语义，周末 1 号不错周）

## 修正的已知偏差（社区价格表交叉核对）

- 高峰时段由「9:00–14:00」修正为官方「9:00–12:00、14:00–18:00（北京时间）」
- 历史日期（2026-08-17 前）改按旧版统一价计价
