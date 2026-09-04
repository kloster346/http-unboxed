import * as THREE from 'three';

export interface TextSprite {
  sprite: THREE.Sprite;
  setText(text: string): void;
}

export function makeTextSprite(opts: {
  text: string;
  color?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  scale: [number, number];
}): TextSprite {
  const { text, color = '#e6f0ff', width = 512, height = 160, fontSize = 52, scale } = opts;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  const draw = (t: string) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(t, width / 2, height / 2);
    tex.needsUpdate = true;
  };
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sprite.scale.set(scale[0], scale[1], 1);
  draw(text);
  return { sprite, setText: draw };
}
