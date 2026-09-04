import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
const grid = new THREE.GridHelper(20, 20, 0x1d2b5e, 0x101a3a);
scene.add(grid);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0a0f1e);
root.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x3a6ff0, 0x0a0f1e, 1.2));
const dir = new THREE.DirectionalLight(0xffffff, 1.4);
dir.position.set(3, 4, 5);
scene.add(dir);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const state = createScenarioState();
createOverlay(root, state);

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
  if (state.sceneId !== lastScene) {
    lastScene = state.sceneId;
    mount(state.sceneId);
  }
  current?.update?.(delta);
  controls.update();
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
