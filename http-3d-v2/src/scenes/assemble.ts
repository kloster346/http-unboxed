import * as THREE from 'three';
import type { ScenarioState } from '../core/ScenarioState';
import type { SceneController } from './types';
import { forBoss, type CaptionPair } from '../core/captions';
import { makeTextSprite } from './sprites';

interface Block {
  key: string;
  label: string;
  meta: string;
  color: number;
  pos: [number, number, number];
  desc: CaptionPair;
}

const BLOCKS: Block[] = [
  {
    key: 'url',
    label: 'URL',
    meta: '收件地址',
    color: 0x00bfff,
    pos: [-2.4, 0.6, 0],
    desc: { tech: '统一资源定位符，标识要访问的地址', meta: '收件地址，告诉快递送到哪' },
  },
  {
    key: 'header',
    label: 'Header',
    meta: '面单',
    color: 0xffd700,
    pos: [0, 0.75, 0],
    desc: { tech: '请求头，携带身份/格式等元信息', meta: '面单外露信息，如身份证 / Token' },
  },
  {
    key: 'body',
    label: 'Body',
    meta: '货物',
    color: 0x00ff88,
    pos: [2.4, 0.6, 0],
    desc: { tech: '请求体，携带实际发送的数据', meta: '包裹里的货物内容' },
  },
];

export function createAssemble(
  parent: THREE.Group,
  camera: THREE.PerspectiveCamera,
  container: HTMLElement,
  state: ScenarioState,
): SceneController {
  const group = new THREE.Group();
  parent.add(group);

  const holders: THREE.Mesh[] = [];
  const labels: { setText: (t: string) => void }[] = [];

  const infoEl = document.createElement('div');
  infoEl.className = 'hud-info';
  infoEl.style.cssText =
    'position:absolute;top:18%;left:50%;transform:translateX(-50%);z-index:15;pointer-events:none;' +
    'background:rgba(10,22,40,.85);border:1px solid rgba(0,191,255,.5);border-radius:10px;' +
    'padding:12px 18px;max-width:440px;text-align:center;font-size:15px;color:#e6f0ff;display:none';
  container.appendChild(infoEl);

  BLOCKS.forEach((b) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.9, 0.5),
      new THREE.MeshStandardMaterial({
        color: b.color,
        emissive: b.color,
        emissiveIntensity: 0.35,
        metalness: 0.2,
        roughness: 0.4,
        transparent: true,
        opacity: 0.85,
      }),
    );
    mesh.position.set(b.pos[0], b.pos[1], b.pos[2]);
    mesh.userData.block = b;
    group.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: b.color, transparent: true, opacity: 0.9 }),
    );
    edges.position.set(b.pos[0], b.pos[1], b.pos[2]);
    group.add(edges);

    const label = makeTextSprite({ text: b.label, color: '#e6f0ff', scale: [1.7, 0.85], fontSize: 54 });
    label.sprite.position.set(b.pos[0], b.pos[1] + 0.85, b.pos[2]);
    group.add(label.sprite);
    labels.push(label);

    holders.push(mesh);
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const resolve = (cx: number, cy: number) => {
    pointer.x = (cx / window.innerWidth) * 2 - 1;
    pointer.y = -(cy / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(holders, false);
    holders.forEach((h) => h.scale.setScalar(1));
    if (hits.length) {
      const obj = hits[0].object as THREE.Mesh;
      obj.scale.setScalar(1.2);
      const b = obj.userData.block as Block;
      infoEl.style.display = 'block';
      infoEl.textContent = `${forBoss({ meta: b.meta, tech: b.label }, state.bossMode)}：${forBoss(b.desc, state.bossMode)}`;
    } else {
      infoEl.style.display = 'none';
    }
  };
  const onMove = (e: PointerEvent) => resolve(e.clientX, e.clientY);
  const onClick = (e: MouseEvent) => resolve(e.clientX, e.clientY);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('click', onClick);

  let lastBoss = state.bossMode;
  const refreshLabels = () =>
    BLOCKS.forEach((b, i) => labels[i].setText(forBoss({ meta: b.meta, tech: b.label }, state.bossMode)));
  refreshLabels();

  return {
    update() {
      if (state.bossMode !== lastBoss) {
        lastBoss = state.bossMode;
        refreshLabels();
      }
    },
    dispose() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
      infoEl.remove();
    },
  };
}
