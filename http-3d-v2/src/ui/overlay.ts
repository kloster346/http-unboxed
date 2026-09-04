import type { ScenarioState } from '../core/ScenarioState';

function el(tag: string, className = '', text = ''): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function createOverlay(root: HTMLElement, state: ScenarioState): void {
  const layer = el('div', 'overlay');

  // 右上：老板模式开关
  const top = el('div', 'hud-top');
  const bossLabel = el('label', 'boss');
  const bossToggle = el('input') as HTMLInputElement;
  bossToggle.type = 'checkbox';
  bossToggle.className = 'boss-toggle';
  bossLabel.appendChild(bossToggle);
  bossLabel.appendChild(el('span', '', '老板模式'));
  top.appendChild(bossLabel);

  // 底部：幕数 + 字幕 + 控制
  const bottom = el('div', 'hud-bottom');
  const progress = el('div', 'hud-progress');
  const caption = el('div', 'hud-caption');
  const controls = el('div', 'hud-controls');

  const prevBtn = el('button', 'ctrl', '上一幕') as HTMLButtonElement;
  const playBtn = el('button', 'ctrl', '播放') as HTMLButtonElement;
  const replayBtn = el('button', 'ctrl', '重播') as HTMLButtonElement;
  const nextBtn = el('button', 'ctrl', '下一幕') as HTMLButtonElement;
  controls.append(prevBtn, playBtn, replayBtn, nextBtn);

  bottom.append(progress, caption, controls);
  layer.append(top, bottom);
  root.appendChild(layer);

  const update = () => {
    progress.textContent = `第 ${state.index + 1} / ${state.total} 幕`;
    caption.textContent = state.caption;
    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === state.total - 1;
    playBtn.textContent = state.playing ? '暂停' : '播放';
    bossToggle.checked = state.bossMode;
  };

  nextBtn.addEventListener('click', () => {
    state.advance();
    update();
  });
  prevBtn.addEventListener('click', () => {
    state.back();
    update();
  });
  replayBtn.addEventListener('click', () => {
    state.replay();
    update();
  });
  playBtn.addEventListener('click', () => {
    state.playing ? state.pause() : state.play();
    update();
  });
  bossToggle.addEventListener('change', () => {
    state.toggleBossMode();
    update();
  });

  update();
}
