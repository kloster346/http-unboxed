import * as THREE from 'three';
import type { ScenarioState } from '../core/ScenarioState';
import type { SceneController } from './types';

const FIELDS = [
  { key: 'user', meta: '用户名', value: 'xiaoming' },
  { key: 'price', meta: '价格', value: '99.90' },
  { key: 'id', meta: '订单号', value: '1001' },
];

export function createStandardize(
  parent: THREE.Group,
  container: HTMLElement,
  state: ScenarioState,
): SceneController {
  const group = new THREE.Group();
  parent.add(group);

  // 货舱容器（半透绿）
  const cargoGeo = new THREE.BoxGeometry(2.2, 1.6, 2.2);
  const cargo = new THREE.Mesh(
    cargoGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.22,
      metalness: 0.1,
      roughness: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  cargo.position.set(0, 1.2, 0);
  group.add(cargo);
  const cargoEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(cargoGeo),
    new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.8 }),
  );
  cargoEdges.position.set(0, 1.2, 0);
  group.add(cargoEdges);

  // 数据流粒子（货舱内流动）
  const count = 400;
  const base = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    base[i * 3] = (Math.random() - 0.5) * 2;
    base[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
    base[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(base, 3));
  const pts = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0x7fffc4, size: 0.035, transparent: true, opacity: 0.9 }),
  );
  pts.position.set(0, 1.2, 0);
  group.add(pts);

  // DOM JSON 面板（逐条浮现）
  const panel = document.createElement('div');
  panel.className = 'json-panel';
  panel.style.cssText =
    'position:absolute;left:50%;top:38%;transform:translateX(-50%);z-index:15;pointer-events:none;' +
    'background:rgba(8,26,22,.8);border:1px solid rgba(0,255,136,.5);border-radius:10px;' +
    'padding:14px 20px;min-width:260px;font-family:monospace;color:#9fffcf;box-shadow:0 0 20px rgba(0,255,136,.25)';
  container.appendChild(panel);

  const rows = FIELDS.map((f) => {
    const row = document.createElement('div');
    row.className = 'json-row';
    row.style.cssText =
      'opacity:0;transform:translateY(10px);transition:opacity .5s,transform .5s;margin:4px 0;font-size:15px';
    panel.appendChild(row);
    return { row, field: f };
  });

  const renderRow = (row: HTMLElement, f: (typeof FIELDS)[number]) => {
    const key = state.bossMode ? f.meta : f.key;
    row.textContent = `"${key}": "${f.value}"`;
  };
  rows.forEach((r) => renderRow(r.row, r.field));

  let t = 0;
  let shown = 0;
  const INTERVAL = 0.65;
  let lastBoss = state.bossMode;

  return {
    update(delta) {
      // 粒子流动
      const p = geo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = p.getY(i) + delta * 0.25;
        if (y > 0.7) y = -0.7;
        p.setY(i, y);
      }
      p.needsUpdate = true;

      // JSON 卡片逐条浮现
      t += delta;
      if (shown < rows.length && t >= shown * INTERVAL) {
        rows[shown].row.style.opacity = '1';
        rows[shown].row.style.transform = 'translateY(0)';
        shown += 1;
      }

      // 老板模式字段切换
      if (state.bossMode !== lastBoss) {
        lastBoss = state.bossMode;
        rows.forEach((r) => renderRow(r.row, r.field));
      }
    },
    dispose() {
      panel.remove();
    },
  };
}
