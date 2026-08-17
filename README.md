# dsh-usage-stats-plus

> DSH「用量与余额」面板增强版 —— 官方余额实时拉取 · 逐事件精确计价 · 全渠道消耗估算 · Codex 风格活动时间轴。

Fork 自 [Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats)（MIT），在其 v0.2.0 基础上做了**计价引擎重构**与**UI 结构级重构**。

![License](https://img.shields.io/github/license/Nixz0824/dsh-usage-stats-plus)
![DSH](https://img.shields.io/badge/DSH-0.1.x-blue)

## 特性

- **余额 = 官方实时值**：`GET /user/balance` 直接拉取，5 分钟缓存 + 手动刷新，无任何本地估算
- **今日消耗（DSH 内）精确计价**：从会话日志逐事件（每个用量样本带精确时间戳）按官方峰谷价目表计价，缓存写按未命中价计
- **今日消耗（全渠道估）**：官方余额接口的每日快照差值估算，覆盖网页版 / App / 其它客户端的用量——唯一能对齐开放平台账单数字的口径（需有前一日快照，次日生效）
- **Codex 风格 Token 活动时间轴**：滚动 12 个月，7 行 × 51–53 周列，quantile 分档着色，支持 每日 / 每周 / 累计 三视图
- **黑白灰单色系**：与 DeepSeek 官方鲸鱼 Logo 同源的墨色系统，明暗主题自适应
- 明暗主题自适应、无新增运行时依赖（纯 JS，免构建）

## 安装

```bash
dsh plugin --profile web add "link:<本目录绝对路径>"   # 本地源码
# 或发布后：
dsh plugin --profile web add dsh-usage-stats-plus       # npm
# 或：
dsh plugin --profile web add github:Nixz0824/dsh-usage-stats-plus
```

装完**刷新浏览器页面**（客户端 bundle 随页面加载）。重启后由 profile bundles 自动装配。

## 计价口径（与官方账单核对过）

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

## 配置

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

## 工作原理

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

## 与上游 v0.2.0 的差异（见 docs/CHANGES.md）

- 计价：官方峰谷价（含 8-17 前旧价期）、北京时间峰谷窗口修正、逐事件精确计价与替换语义
- 新增「全渠道消耗」余额差值估算
- UI 重构：删除月历与品牌行，Codex 风格活动时间轴 + 黑白灰单色系 + 顶栏官方鲸鱼 Logo
- 保持：API 路由、刷新/关闭/交互逻辑、locale 双语、明暗主题机制

## 开发

```bash
npm run check   # node --check 全部 lib 文件
```

无构建步骤（纯 JS bundle，`lib/client.js` 为官方 ModuleLoader 格式手写产物）。

## License

MIT，保留上游 `dsh-usage-stats contributors`（2026）版权声明。感谢 [Ychris12138](https://github.com/Ychris12138/dsh-usage-stats) 的原版。
