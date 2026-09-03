# 04: img2threejs 资产① 快递箱/包裹

**What to build:** 用一张 CC0 参考图，走 img2threejs 管线（intake→spec→build→review，含 state.json 门控）生成 `createBoxModel(spec)` 工厂；经 AssetLoader 按需加载并能在场景中渲染一个写实、可拆解、可点击的快递箱。

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] 快递箱资产通过 img2threejs 多角度 / 可拆解 / 可点击门控
- [ ] AssetLoader 能加载并渲染该资产
- [ ] 产出为纯 Three.js 工厂，与场景解耦
