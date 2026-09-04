import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ScenarioState } from '../core/ScenarioState';
import type { SceneController } from './types';
import { easeInOutCubic } from './ease';
import { makeTextSprite } from './sprites';

export function createRespond(
  parent: THREE.Group,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  container: HTMLElement,
  state: ScenarioState,
): SceneController {
  const group = new THREE.Group();
  parent.add(group);

  // 机柜排
  const lights: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const rack = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.6, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x2a3a5e, metalness: 0.6, roughness: 0.4 }),
    );
    rack.position.set((i - 1) * 1.1, 0.9, -2);
    group.add(rack);
    for (let j = 0; j < 4; j++) {
      const lit = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.12, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x0a3d2a, emissive: 0x00ff88, emissiveIntensity: 0 }),
      );
      lit.position.set(0, 0.6 - j * 0.3, 0.37);
      rack.add(lit);
      lights.push(lit);
    }
  }

  // 盒子（飞入机柜）
  const box = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 0),
    new THREE.MeshStandardMaterial({ color: 0x00bfff, emissive: 0x005a8f, emissiveIntensity: 0.5, metalness: 0.2, roughness: 0.4 }),
  );
  box.position.set(-6, 0.9, -1);
  group.add(box);

  // 回执单（弹出）
  const receipt = makeTextSprite({ text: '{"status":"success"}', color: '#9fffcf', scale: [4.4, 1.3] }).sprite;
  receipt.position.set(0, 0.4, 1.6);
  receipt.visible = false;
  group.add(receipt);

  // 手机 + 屏幕"已收货"
  const phone = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.9, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x1a2733, metalness: 0.7, roughness: 0.3 }),
  );
  phone.position.set(3.4, 1.6, 0.6);
  group.add(phone);
  const screenText = makeTextSprite({ text: '已收货', color: '#7fffc4', scale: [3.6, 1.2] }).sprite;
  screenText.position.set(3.4, 1.6, 0.75);
  screenText.visible = false;
  group.add(screenText);

  // [重新播放] 按钮
  const replayBtn = document.createElement('button');
  replayBtn.textContent = '重新播放';
  replayBtn.style.cssText =
    'position:absolute;left:50%;bottom:60px;transform:translateX(-50%);z-index:20;pointer-events:auto;' +
    'background:linear-gradient(135deg,#0aa6c9,#0064a0);color:#fff;border:none;border-radius:10px;' +
    'padding:10px 24px;font-size:15px;cursor:pointer;box-shadow:0 0 20px rgba(0,191,255,.6);display:none';
  container.appendChild(replayBtn);
  replayBtn.addEventListener('click', () => state.replay());

  // 镜头初始：看机房全景
  camera.position.set(0, 2.2, 7);
  controls.target.set(0, 1.0, 0);
  controls.update();

  const camStart = camera.position.clone();
  const camEnd = new THREE.Vector3(0, 1.0, 3.2);
  let elapsed = 0;
  let shownReceipt = false;
  let shownPhone = false;
  let done = false;

  return {
    update(delta) {
      elapsed += delta;

      // 阶段1：盒子飞入 + 机柜灯渐亮
      box.position.x = Math.min(-6 + elapsed * 3.2, 0);
      const li = Math.min(elapsed / 1.2, 1);
      for (const l of lights) {
        (l.material as THREE.MeshStandardMaterial).emissiveIntensity = li * 1.4;
      }

      // 阶段2：回执单弹出
      if (elapsed >= 1.2 && !shownReceipt) {
        shownReceipt = true;
        receipt.visible = true;
      }
      if (receipt.visible) {
        receipt.position.y = 0.4 + Math.min((elapsed - 1.2) * 0.4, 1.0);
      }

      // 阶段3：镜头特写回执 + 手机已收货（缓动期间禁用阻尼）
      if (elapsed >= 2.2) {
        const t = easeInOutCubic(Math.min((elapsed - 2.2) / 1.6, 1));
        camera.position.lerpVectors(camStart, camEnd, t);
        controls.target.set(0, 1.0, 1.6);
        controls.enableDamping = false;
        controls.update();
      }
      if (elapsed >= 3.8 && !controls.enableDamping) {
        controls.enableDamping = true;
      }
      if (elapsed >= 2.6 && !shownPhone) {
        shownPhone = true;
        screenText.visible = true;
      }

      // 阶段4：显示重播
      if (elapsed >= 3.4 && !done) {
        done = true;
        replayBtn.style.display = 'block';
      }
    },
    dispose() {
      replayBtn.remove();
    },
  };
}
