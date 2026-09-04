import * as THREE from 'three';
import type { ScenarioState } from '../core/ScenarioState';
import type { SceneController } from './types';
import { forBoss, type CaptionPair } from '../core/captions';

type FocusKey = 'get' | 'post';

const INFO: Record<FocusKey, CaptionPair> = {
  get: { tech: 'GET：从服务器获取数据（只读、无 Body）', meta: '去快递柜取件（查）' },
  post: { tech: 'POST：向服务器提交数据（可带 Body）', meta: '去前台寄件（增/改）' },
};

function makeGlow(color: number, scale: number): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  if (ctx) {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sp.scale.set(scale, scale, 1);
  return sp;
}

export function createRoutes(
  parent: THREE.Group,
  container: HTMLElement,
  state: ScenarioState,
): SceneController {
  const group = new THREE.Group();
  parent.add(group);

  interface Package {
    mesh: THREE.Mesh;
    glow: THREE.Sprite;
    x: number;
    dir: number;
    speed: number;
  }
  function buildPackage(color: number, full: boolean, y: number, z: number): Package {
    const mesh = full
      ? new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.45, 0),
          new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.6,
            metalness: 0.2,
            roughness: 0.3,
          }),
        )
      : new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.55, 0.55),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 }),
        );
    mesh.position.set(-2.4, y, z);
    const glow = makeGlow(color, full ? 1.5 : 0.8);
    glow.position.set(-2.4, y, z);
    group.add(mesh);
    group.add(glow);
    return { mesh, glow, x: -2.4, dir: 1, speed: full ? 1.2 : 1.7 };
  }

  const belts: { mesh: THREE.Mesh; stripes: THREE.Mesh[]; z: number }[] = [];
  function buildBelt(color: number, y: number, z: number) {
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.12, 0.85),
      new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.5, metalness: 0.2, roughness: 0.5 }),
    );
    belt.position.set(0, y, z);
    group.add(belt);
    const stripeMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
    const stripes: THREE.Mesh[] = [];
    for (let i = 0; i < 10; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.8), stripeMat);
      s.position.set(-2.5 + i * 0.55, y + 0.08, z);
      belt.add(s);
      stripes.push(s);
    }
    belts.push({ mesh: belt, stripes, z });
  }
  buildBelt(0x33bbff, 0.6, -1.3);
  buildBelt(0xff8a2a, 0.6, 1.3);

  const getPack = buildPackage(0x9fd8ff, false, 1.0, -1.3);
  const postPack = buildPackage(0xffb347, true, 1.0, 1.3);

  const panel = document.createElement('div');
  panel.className = 'routes-panel';
  panel.style.cssText =
    'position:absolute;left:50%;bottom:96px;transform:translateX(-50%);z-index:15;pointer-events:none;' +
    'background:rgba(10,22,40,.8);border:1px solid rgba(0,191,255,.5);border-radius:10px;padding:10px 16px;color:#e6f0ff;font-size:15px;text-align:center';
  container.appendChild(panel);

  const bar = document.createElement('div');
  bar.className = 'routes-bar';
  bar.style.cssText =
    'position:absolute;left:50%;bottom:48px;transform:translateX(-50%);z-index:15;display:flex;gap:10px;pointer-events:auto';
  const btnGet = document.createElement('button');
  btnGet.textContent = 'GET 场景';
  const btnPost = document.createElement('button');
  btnPost.textContent = 'POST 场景';
  for (const b of [btnGet, btnPost]) {
    b.style.cssText =
      'background:rgba(20,32,64,.8);color:#e6f0ff;border:1px solid rgba(0,191,255,.5);border-radius:8px;padding:8px 16px;cursor:pointer;pointer-events:auto';
  }
  bar.append(btnGet, btnPost);
  container.appendChild(bar);

  let focus: FocusKey = 'get';
  const applyFocus = () => {
    panel.textContent = forBoss(INFO[focus], state.bossMode);
    const getScale = focus === 'get' ? 1 : 0.7;
    const postScale = focus === 'post' ? 1 : 0.7;
    getPack.glow.scale.setScalar(0.8 * getScale);
    postPack.glow.scale.setScalar(1.5 * postScale);
  };
  btnGet.addEventListener('click', () => {
    focus = 'get';
    applyFocus();
  });
  btnPost.addEventListener('click', () => {
    focus = 'post';
    applyFocus();
  });
  applyFocus();

  let lastBoss = state.bossMode;

  return {
    update(delta) {
      for (const belt of belts) {
        for (const s of belt.stripes) {
          s.position.x += delta * 1.5;
          if (s.position.x > 2.8) s.position.x = -2.8;
        }
      }
      const movePack = (p: Package) => {
        p.x += p.dir * p.speed * delta;
        if (p.x > 2.4) p.dir = -1;
        if (p.x < -2.4) p.dir = 1;
        p.mesh.position.x = p.x;
        p.glow.position.x = p.x;
      };
      movePack(getPack);
      movePack(postPack);

      if (state.bossMode !== lastBoss) {
        lastBoss = state.bossMode;
        panel.textContent = forBoss(INFO[focus], state.bossMode);
      }
    },
    dispose() {
      panel.remove();
      bar.remove();
    },
  };
}
