# 01: 工程骨架 + 首个 3D 场景（tracer bullet）

**What to build:** R3F + Vite + TypeScript 工程能 `npm run dev` / `npm run build`；Canvas 渲染一个带灯光的首个 3D 场景（一个节点 + 初始数据球）；`useFlow` 状态机有首两幕、prev/next 导航与一句字幕；`useFlow` 有 Vitest 单测。整条链（栈 → 状态 → UI → 测试）从这里打通。

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] 本地 dev 能启动并渲染 3D 场景（含灯光、相机、一个节点与数据球）
- [ ] `npm run build` 能产出静态产物
- [ ] `useFlow` 初始幕次正确，`next`/`prev` 生效且到底/到顶被正确禁用
- [ ] `useFlow` 单测通过（初始状态 + next/prev 转换 + 字幕输出）
