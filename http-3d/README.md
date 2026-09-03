# 给 PM 的 HTTP/API 3D 动画演示（http-3d）

用 **React Three Fiber（Three.js）** 做的 3D 交互演示，把"前端请求 = 寄快递"讲给不懂技术的产品经理。**文字最少**，靠"发光数据球沿轨迹飞行"讲概念：URL / Header / Body / JSON / GET / POST / 状态码。

## 技术栈

- React 18 + TypeScript + Vite
- `@react-three/fiber`（R3F）+ `@react-three/drei`（OrbitControls / Trail / Html / Line）+ `@react-three/postprocessing`（Bloom 发光）
- `gsap` / `@gsap/react`（动画编排）
- `vitest` + `@testing-library/react`（单元测试，seam = `useFlow` 状态机）

## 运行（开发）

```bash
npm install
npm run dev          # 打开 http://localhost:5173
npm test             # 单元测试（useFlow 状态机）
npm run type-check   # 类型检查
```

## 交付（纯静态）

```bash
npm run build        # 产出 dist/（相对 base，可放任意静态托管）
```

`vite.config.ts` 已设 `base: './'`，所以 `dist/` 是纯静态、路径相对，可直接：

- **本地看**：在 `dist/` 里起个静态服务（如 `python -m http.server 8000`）再打开；
- **对 PM 演示**：把 `dist/` 整个文件夹发给对方，或用任意静态托管（GitHub Pages / Vercel / Netlify / 内网 server）托管后给一个链接。

## 使用

- 顶部 **📮 主流程** 与 **⚔️ GET vs POST** 切换场景。
- 主流程控制条：`⏮ 上一步`、`▶ 自动播`、`下一步 ⏭`、`↺ 重播`。自动播按节奏跑完一遍；`重播` 复位幕次并重置相机。
- 暂停后可**拖拽鼠标**环视 3D 场景；点自动播后恢复"电影跟随"。
- **主流程**（一次通信）：下单 → 生成数据球(JSON + URL + Header) → 飞过快递站(网络) → 进仓库(服务器) → 拆包处理(齿轮) → 回传 200 OK 签收球 → 手机亮「已收货」。
- **GET vs POST**：左侧 GET（取件码在 URL、无包裹、明文/幂等）、右侧 POST（货在 Body、带 Token、较安全/非幂等）。

## 定制

- 分幕文案与幕次：`src/data/steps.ts`
- 关键点坐标：`src/data/positions.ts`
- 对比场景要点：`src/scenes/GetPost.tsx`
- 标签文字 / Bloom / 轨迹颜色：`src/components/{DataBall,Signature,Trajectory,BloomEffect}.tsx`、`src/styles.css`

## 说明

- 纯前端 mock 演示，不依赖后端、网络字体或外部 3D 模型。
- 当前业务例子是通用电商示例，可自行换成实际业务（见 `src/scenes/GetPost.tsx` 与 `src/data/*`）。
