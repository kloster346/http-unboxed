import * as THREE from 'three';

export interface SceneController {
  update(delta: number): void;
  dispose?: () => void;
}

export function clearGroup(group: THREE.Object3D): void {
  for (const child of [...group.children]) {
    clearGroup(child);
    const c = child as unknown as {
      geometry?: { dispose?: () => void };
      material?: { dispose?: () => void } | { dispose?: () => void }[];
    };
    c.geometry?.dispose?.();
    if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose?.());
    else c.material?.dispose?.();
    group.remove(child);
  }
}
