# Security

`dsh-usage-stats-plus` is a local DSH plugin. It reads session logs and official DeepSeek account endpoints already configured in the harness.

- No third-party analytics.
- API credentials stay in DSH's credential store; this plugin does not write keys to disk in its own files.
- The `/api/usage-stats/*` routes are loopback-only helpers used by the Web UI.

Report issues at https://github.com/Nixz0824/dsh-usage-stats-plus/issues
