import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { SceneController } from './types';
import { easeInOutCubic } from './ease';
import { makeTextSprite } from './sprites';
import { createShippingBoxModel } from '../assets/createShippingBoxModel';

export function createIntro(
  parent: THREE.Group,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  container: HTMLElement,
  onComplete: () => void,
): SceneController {
  // ---- 半透快递箱 + 边缘发光 ----
  const group = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(1.8, 1.6, 1.8);
  const box = createShippingBoxModel();
  group.add(box);
  box.scale.setScalar(1.25);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(boxGeo),
    new THREE.LineBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.9 }),
  );
  group.add(edges);

  // ---- 内部 "?" 粒子点云 + 中心 "?" ----
  const count = 220;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = Math.random() - 0.5;
    pos[i * 3 + 1] = Math.random() - 0.5;
    pos[i * 3 + 2] = Math.random() - 0.5;
  }
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dots = new THREE.Points(
    dotsGeo,
    new THREE.PointsMaterial({ color: 0x7fd4ff, size: 0.04, transparent: true, opacity: 0.9 }),
  );
  group.add(dots);

  const question = makeTextSprite({
    text: '?',
    color: '#a0e6ff',
    width: 128,
    height: 128,
    fontSize: 96,
    scale: [0.9, 0.9],
  }).sprite;
  question.position.y = 0.1;
  group.add(question);

  group.position.set(0, 1.2, 0);
  parent.add(group);

  // ---- 拆包碎片（初始隐藏）----
  const shards = new THREE.Group();
  shards.visible = false;
  const shardGeo = new THREE.BoxGeometry(0.28, 0.28, 0.05);
  const shardCount = 16;
  const shardList: THREE.Mesh[] = [];
  const shardVel: THREE.Vector3[] = [];
  for (let i = 0; i < shardCount; i++) {
    const sh = new THREE.Mesh(
      shardGeo,
      new THREE.MeshBasicMaterial({
        color: 0x00bfff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      }),
    );
    sh.position.set(
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.5) * 1.6,
      (Math.random() - 0.5) * 1.8,
    );
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    shardVel.push(dir.multiplyScalar(2.2 + Math.random() * 1.2));
    sh.userData.rot = new THREE.Vector3(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    shards.add(sh);
    shardList.push(sh);
  }
  parent.add(shards);

  // ---- [开始探索] 按钮 ----
  const btn = document.createElement('button');
  btn.textContent = '开始探索';
  btn.style.cssText =
    'position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);z-index:20;pointer-events:auto;' +
    'background:linear-gradient(135deg,#0aa6c9,#0064a0);color:#fff;border:none;border-radius:10px;' +
    'padding:12px 28px;font-size:16px;cursor:pointer;box-shadow:0 0 20px rgba(0,191,255,0.6)';
  container.appendChild(btn);

  // ---- 镜头缓动（Ease In Out，>=1.5s；缓动期间禁用阻尼）----
  const camStart = camera.position.clone();
  const camEnd = new THREE.Vector3(0, 1.2, 3.2);
  const DURATION = 1.8;
  let tween = 0;
  let active = false;
  let completed = false;

  const startExplosion = () => {
    group.visible = false;
    shards.visible = true;
    shards.position.copy(group.position);
  };

  btn.addEventListener('click', () => {
    btn.remove();
    active = true;
    tween = 0;
    startExplosion();
  });

  return {
    update(delta) {
      dots.rotation.y += delta * 0.5;
      question.rotation.y += delta * 1.2;

      if (active && tween < 1) {
        tween = Math.min(tween + delta / DURATION, 1);
        const e = easeInOutCubic(tween);
        camera.position.lerpVectors(camStart, camEnd, e);
        controls.target.set(0, 1.2, 0);
        controls.enableDamping = false;
        controls.update();
      }
      if (tween >= 1 && controls.enableDamping === false) {
        controls.enableDamping = true;
      }

      if (active && tween >= 1 && !completed) {
        completed = true;
        onComplete();
      }

      if (shards.visible) {
        for (let i = 0; i < shardList.length; i++) {
          const sh = shardList[i];
          sh.position.addScaledVector(shardVel[i], delta);
          const r = sh.userData.rot as THREE.Vector3;
          sh.rotation.x += r.x * delta;
          sh.rotation.y += r.y * delta;
          sh.rotation.z += r.z * delta;
          const m = sh.material as THREE.MeshBasicMaterial;
          m.opacity = Math.max(m.opacity - delta * 0.7, 0);
        }
      }
    },
    dispose() {
      btn.remove();
    },
  };
}
