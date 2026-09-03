import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const root = document.getElementById('root');
if (!root) throw new Error('缺失 #root 挂载点');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1e);
// 数据网格地面（氛围）
const grid = new THREE.GridHelper(20, 20, 0x1d2b5e, 0x101a3a);
scene.add(grid);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0a0f1e);
root.appendChild(renderer.domElement);

// 灯光
scene.add(new THREE.HemisphereLight(0x3a6ff0, 0x0a0f1e, 1.2));
const dir = new THREE.DirectionalLight(0xffffff, 1.4);
dir.position.set(3, 4, 5);
scene.add(dir);

// 占位"包裹"：科技蓝发光多面体
const geo = new THREE.IcosahedronGeometry(1, 0);
const mat = new THREE.MeshStandardMaterial({
  color: 0x00bfff,
  emissive: 0x005a8f,
  metalness: 0.35,
  roughness: 0.4,
});
const packet = new THREE.Mesh(geo, mat);
scene.add(packet);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const animate = () => {
  requestAnimationFrame(animate);
  packet.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
