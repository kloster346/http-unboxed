# HTTP 请求 3D 沉浸式教学演示（全新 img2threejs 版）

**Status:** ready-for-agent

> 概要：这是一个**从零新建**的 3D 教学应用（不基于旧 `http-3d` R3F 版本），用 img2threejs 生成真实道具资产，以"寄快递"比喻把 HTTP/API 抽象概念讲给非技术 PM。纯 Three.js + Vite + TypeScript。

## Problem Statement

PM 需要直观理解 HTTP/API 是怎么一回事，但纯文字/图表讲解难以建立直觉。需要一个**高级感、沉浸式**的 3D 演示，把 "URL / Header / Body / JSON / GET / POST" 用"寄快递"的比喻可视化，让 PM 在"逛展 + 点按"中完成认知闭环。现有版本（旧 http-3d）是 R3F 工程、纯色 primitive、无真实资产质感，视觉与叙事上限不足。

## Solution

从零构建一个纯 Three.js 应用：

- 以 **img2threejs** 为核心，生成 3 件"真实道具"资产：**快递箱/包裹、服务器机房机柜、手机**；并走 img2threejs 的 `intake → spec → build → review` 管线与质量门控。
- 视觉风格：**A 风格化 PBR 科技风**（深空蓝 + 全息数据流 + Bloom + ACES 色调映射 + 雾）。
- 交互：**混合**——自动导游（镜头驱动）+ 自由探索（拖拽轨道 + 跳章/回放）。
- **老板模式**开关：技术名词 ↔ 中文比喻即时切换。
- 叙事 **5 幕**：序章包裹 → 组装(URL/Header/Body) → 标准化(JSON) → 双路线(GET/POST) → 服务器响应(200 OK/回执/手机收件)。

## User Stories

1. 作为 PM，我想要在首幕看到一个漂浮的半透快递箱，以便知道自己将开始一场"寄快递"之旅。
2. 作为 PM，我想要点 [开始探索]，让镜头自动拉近并触发拆包，以便被引导进入讲解。
3. 作为 PM，我想要快递箱拆开后看到三块信息（地址带=URL、面单=Header、货舱=Body），以便理解一次请求携带了哪些东西。
4. 作为 PM，我想要悬停/点按每块信息时看到中文解释气泡，以便用生活比喻理解技术名词。
5. 作为 PM，我想要看到货物被 JSON 规整填满货舱，以便理解"数据用标准格式装载"。
6. 作为 PM，我想要看到 GET 与 POST 两条传送带并排对比（空箱去取件 vs 满箱去寄件），以便区分"查"和"增/改"。
7. 作为 PM，我想要看到盒子飞入服务器机房、机柜亮灯、吐出回执单（`{"status":"success"}`），以便理解"服务器处理并返回结果"。
8. 作为 PM，我想要手机端显示"已收货"，以便闭环理解"请求-响应-前端收到结果"。
9. 作为 PM，我想要一个"老板模式"开关，把 Token/JSON 等名词换成"身份证/货物清单"，以便对完全不懂技术的听众也能听懂。
10. 作为 PM，我想要自由拖拽旋转视角，以便自己在任意时刻细看某个模块。
11. 作为 PM，我想要跳转到任意一幕/回放上一幕，以便反复复习没看懂的段落。
12. 作为 PM，我想要看到播放/暂停，以便控制讲解节奏。
13. 作为讲师，我想要一个"自动导游"主线路，以便零操作就能完整讲一遍。
14. 作为讲师，我想要一个 Loading 进度条（0-100%），避免加载时白屏。
15. 作为开发者，我想要一个纯逻辑的流程控制模块，以便独立、快速地测试整个演示的"幕次推进与模式切换"。

## Implementation Decisions

- **全新工程，纯 Three.js + Vite + TypeScript**（不用 React/R3F）。img2threejs 输出的是纯 Three.js 工厂（`createXxxModel(spec)`），直接复用、零桥接。
- **唯一主 seam（测试接缝）：`ScenarioState` 纯 TS 流程状态机**（非 React）。它承载全部"外部可观测"流程逻辑：当前幕、是否播放、老板模式、字幕（双语）。其余（3D 场景渲染、资产加载、词表）不设独立 seam。
  - 内联状态 shape（源自需求设计）：
    ```ts
    interface ScenarioState {
      sceneId: string;        // 当前幕 id
      index: number;          // 幕序号
      bossMode: boolean;      // 老板模式（中/英）
      playing: boolean;       // 是否播放中
      caption: string;        // 当前字幕（按 bossMode 取双语）
    }
    // 动作：play / pause / advance / back / replay / toggleBossMode / goto(index)
    // 外部行为：advance 到末尾应禁止；back 到开头应禁止；切老板模式字幕即换语言
    ```
- **场景管理 `SceneManager`**：管理 5 幕的场景切换与销毁，避免内存泄漏。
- **`AssetLoader`**：异步加载 img2threejs 工厂产物（快递箱/机柜/手机），提供加载进度；资产必须**可拆解、可点击**，并带**动画锚点**（机柜亮灯、回执弹出）。
- **渲染**：`WebGLRenderer` 用 ACES 色调映射 + Bloom(postprocessing) + Fog；`resize` 响应；UI 覆盖层绝对定位。
- **老板模式**：一套**双语映射表**（技术名词 ↔ 中文比喻），由 `ScenarioState` 的 `bossMode` 派发到字幕/标签。
- **性能**：桌面优先 60fps；img2threejs 资产 `targetTriangles ≤ 60k`；合并静态网格；Bloom 阈值/分辨率、dpr 设上限。
- **概念信息块**（URL/Header/Body 面板、JSON 卡、数据流粒子、传送带初版）用**程序化几何**（全息面板 + canvas 生成纹理 + 发光边），不写实，保证概念清晰、可控字。

## Testing Decisions

- 好的测试**只测外部可观测行为，不测实现细节**：给 `ScenarioState` 输入动作，断言输出（幕次、边界禁用、bossMode、字幕文案），绝不断言 3D 场景内部。
- **被测模块**：仅 `ScenarioState`（纯 TS、无 DOM/Three 依赖，确定性最强）。
- **不测**：3D 场景内部（渲染正确性交给 img2threejs 自身的 turntable/多角度门控）；`AssetLoader`（异步加载，非业务逻辑）；`AssetLoader` 与词表不单独设缝。
- **Prior art**：旧 `http-3d` 的 `useFlow` 状态机单测（14 例）——同样模式：初始状态 + 前/后转换 + 边界禁用 + 字幕输出 + 场景切换 + 播放/暂停 + bossMode。本 seam 是其"去 React 化"的纯 TS 版本，测试思路同源。

## Out of Scope

- 移动端适配与满帧（本阶段只管桌面 60fps）。
- 音效/环境音。
- 额外 HTTP 概念（状态码、HTTP 方法族、安全/TLS、缓存、多请求并发等）——首版只讲 URL/Header/Body/JSON/GET/POST。
- 后端真实请求逻辑（纯前端演示，不发真实网络请求）。
- 旧 `http-3d`(R3F) 的复用/迁移与其测试。

## Further Notes

- **部署形态**：复用现有 `http-unboxed` 仓库，未来在 `dev` 分支新建子目录（如 `/http-3d-v2`），走 `dev → PR → main` 流程，GitHub Pages 随 main 自动部署。
- **img2threejs**：每件资产一条 `state.json` + `qualityContract`，严格走其门控（3 修正/pass，6 总；turntable/多角度；可拆解可点击）。参考图用 **CC0/公开图库** + 接受风格化产出。
- **未决待办（O1–O5）**：参考图具体来源（我选图→用户审）、每幕讲稿（比喻话术+技术点名）、老板模式双语词典、运镜脚本、音效取舍。这些在执行时逐项关闭，不阻塞 spec 定稿。
