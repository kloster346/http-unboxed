# 08: 交付——build 静态 + 部署说明

**What to build:** `npm run build` 产出纯静态 `dist/`（相对 base 配置，兼容任意静态托管）；写入 README，说明 dev / build / 本地静态交付方式；用浏览器静态打开验证可跑。

**Blocked by:** 06 后处理发光 + 视觉打磨、07 交互打磨 + 性能

**Status:** ready-for-agent

- [ ] `npm run build` 产出纯静态 `dist/`
- [ ] `base` 配置为相对路径，兼容任意静态托管
- [ ] README 含 dev / build / 本地静态交付说明
- [ ] 用静态方式打开并验证主流程与 GET vs POST 场景可跑
