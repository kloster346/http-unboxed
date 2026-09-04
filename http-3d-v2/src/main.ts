import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createScenarioState, type SceneId } from './core/ScenarioState';
import { createOverlay } from './ui/overlay';
import { createIntro } from './scenes/intro';
import { createAssemble } from './scenes/assemble';
import { createStandardize } from './scenes/standardize';
import { createRoutes } from './scenes/routes';
import { createRespond } from './scenes/respond';
import { clearGroup, type SceneController } from './scenes/types';

const root = document.getElementById('root');
if (!root) throw new Error('缺失 #root 挂载点');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1e);
scene.fog = new THREE.FogExp2(0x0a0f1e, 0.018);
const grid = new THREE.GridHelper(20, 20, 0x1d2b5e, 0x101a3a);
scene.add(grid);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0a0f1e);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
root.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x3a6ff0, 0x0a0f1e, 1.2));
const dir = new THREE.DirectionalLight(0xffffff, 1.4);
dir.position.set(3, 4, 5);
scene.add(dir);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 后期合成：Bloom 发光 + ACES 色调映射（OutputPass）
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.65,
  0.5,
  0.18,
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const state = createScenarioState();
createOverlay(root, state);

// Loading 进度条（0-100%），避免白屏
const bootEl = document.getElementById('boot');
const loadEl = document.createElement('div');
loadEl.style.cssText =
  'position:fixed;inset:0;background:#0a0f1e;z-index:55;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;transition:opacity .5s';
const bar = document.createElement('div');
bar.style.cssText = 'width:240px;height:6px;background:rgba(20,32,64,.8);border-radius:3px;overflow:hidden';
const fill = document.createElement('div');
fill.style.cssText = 'width:0%;height:100%;background:linear-gradient(90deg,#0aa6c9,#00bfff);transition:width .2s';
bar.appendChild(fill);
const lbl = document.createElement('div');
lbl.style.cssText = 'color:#7fa8ff;font-size:14px';
lbl.textContent = '加载中 0%';
loadEl.append(bar, lbl);
document.body.appendChild(loadEl);

let boot = 0;
let bootDone = false;
const updateBoot = (delta: number) => {
  boot = Math.min(boot + delta * 60, 100);
  fill.style.width = `${Math.round(boot)}%`;
  lbl.textContent = `加载中 ${Math.round(boot)}%`;
  if (boot >= 100 && !bootDone) {
    bootDone = true;
    loadEl.style.opacity = '0';
    bootEl?.remove();
    setTimeout(() => loadEl.remove(), 500);
  }
};

// 场景宿主：按 state.sceneId 切换展示对应幕
const content = new THREE.Group();
scene.add(content);
let current: SceneController | null = null;

const mount = (id: SceneId) => {
  current?.dispose?.();
  clearGroup(content);
  switch (id) {
    case 'intro':
      current = createIntro(content, camera, controls, root, () => state.advance());
      break;
    case 'assemble':
      current = createAssemble(content, camera, root, state);
      break;
    case 'standardize':
      current = createStandardize(content, root, state);
      break;
    case 'routes':
      current = createRoutes(content, root, state);
      break;
    case 'respond':
      current = createRespond(content, camera, controls, root, state);
      break;
    default:
      current = { update: () => {} };
      break;
  }
};

let lastScene = state.sceneId;
mount(state.sceneId);

const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  updateBoot(delta);
  if (state.sceneId !== lastScene) {
    lastScene = state.sceneId;
    mount(state.sceneId);
  }
  current?.update?.(delta);
  controls.update();
  composer.render();
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
