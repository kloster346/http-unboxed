# 01: 工程骨架 + 播放器遥控器状态机（tracer bullet）

**What to build:** 全新纯 Three.js + Vite + TS 工程能 `npm run dev` / `build` / `test`；一个可渲染的空 3D 场景（灯光+相机）；"播放器遥控器"(`ScenarioState`) 状态机具备初始幕、切幕与一句字幕；`ScenarioState` 有 Vitest 单测。整条"栈 → 状态 → 渲染 → 测试"从这打通。

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `npm run dev` 能启动并渲染一个带灯光/相机的 3D 场景
- [ ] `npm run build` 出静态产物
- [ ] `ScenarioState` 初始幕正确，`advance`/`back` 生效且到顶/到底被禁用
- [ ] `ScenarioState` 单测通过（初始 + 前后转换 + 字幕输出）
