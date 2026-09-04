# HTTP 3D 沉浸式教学演示（http-3d-v2）

用「寄快递」比喻，把 HTTP/API 的抽象概念（URL / Header / Body / JSON / GET / POST）做成**高级感的 3D 沉浸式动画**，讲给非技术 PM。
核心资产由 **img2threejs** 生成（快递箱 / 服务器机柜 / 手机），整体采用**风格化 PBR 科技风**（深空蓝 + 全息数据流 + Bloom 发光）。

## 技术栈

- **Three.js**（纯 Three.js，非 R3F）
- **Vite + TypeScript**（strict）
- **postprocessing**：ACES 色调映射 + UnrealBloomPass 发光 + Fog
- **img2threejs**：真实道具资产生成（规划中，当前为程序化占位）
- **Vitest**：单测（核心状态机 seam）

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（热更新）
npm run dev

# 生产构建（产出纯静态 dist/ 到任意静态托管）
npm run build

# 预览构建产物
npm run preview

# 测试 / 类型检查
npm test
npm run type-check
```

## 功能与交互

**5 幕叙事**（底部 [下一幕]/[上一幕]/[播放]/[重播] 导航，鼠标拖拽旋转视角）：

1. **序章**：半透快递箱 + 内部「?」粒子 → 点 [开始探索] 镜头缓动拉近 + 拆包
2. **第 1 幕·组装**：URL / Header / Body 三块全息面板，悬停放大 + 解释气泡
3. **第 2 幕·标准化**：货物被 JSON 规整（user/price/id 字段逐条浮现，数据流粒子填充）
4. **第 3 幕·双路线**：GET（淡蓝空箱·取件）vs POST（橙黄满箱·寄件），可切换聚焦
5. **第 4 幕·服务器响应**：盒子飞入机房，机柜亮灯，回执单弹出（200 OK），手机「已收货」，[重新播放]

**老板模式**：右上开关，技术名词 ↔ 中文比喻即时切换。

## 部署到 GitHub Pages

工程位于仓库子目录 `http-3d-v2`，构建产物是纯静态（`vite.config.ts` 设 `base: './'`），可直接托管到任意静态服务器 / GitHub Pages。

**方式 A（推荐，自动）**：在仓库根配置 GitHub Actions，监听 `main` 的 push，`npm ci && npm run build` 后用 `upload-pages-artifact` / `deploy-pages` 部署 `http-3d-v2/dist`。仓库 Settings → Pages 选择来源为 GitHub Actions。

**方式 B（手动）**：`npm run build` 后将 `http-3d-v2/dist` 内容推送到 Pages 分支 / 目录。

> 注意：产物是 ES Module，**不要直接双击 `index.html`**（浏览器模块安全策略会拦截），需用 `python -m http.server`、`npx serve` 或托管访问。

## 目录结构

```
http-3d-v2/
├─ src/
│  ├─ core/ScenarioState.ts   流程状态机（唯一测试接缝 seam）
│  ├─ scenes/                 各幕场景（intro/assemble/standardize/routes/respond）
│  ├─ ui/overlay.ts           HUD 覆盖层（字幕/幕数/导航/老板模式）
│  └─ main.ts                 入口：场景管理 + 后期合成 + Loading
├─ index.html
└─ package.json
```

## 可调参数

- **视觉**（`src/main.ts`）：Bloom 强度/阈值/半径、ACES 曝光、雾密度。
- **幕文案**（`src/core/ScenarioState.ts`）：`CAPTIONS` 双语映射、`SCENE_ORDER` 幕序。
- **场景内容**（`src/scenes/*.ts`）：各幕几何 / 交互 / 动画。

## 说明

- 当前机柜、手机为**程序化占位**，后续由 img2threejs 资产替换（工单 04/09/10）。
- 单测聚焦 `ScenarioState` 外部可观测行为（幕次推进、边界、老板模式、字幕），不测 3D 场景内部。
