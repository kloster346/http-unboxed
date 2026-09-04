import * as THREE from 'three';

export interface SceneController {
  update(delta: number): void;
  dispose?: () => void;
}

function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
  const list = Array.isArray(material) ? material : [material];
  for (const mat of list) {
    const withMap = mat as THREE.Material & {
      map?: THREE.Texture | null;
      emissiveMap?: THREE.Texture | null;
      alphaMap?: THREE.Texture | null;
    };
    withMap.map?.dispose?.();
    withMap.emissiveMap?.dispose?.();
    withMap.alphaMap?.dispose?.();
    mat.dispose();
  }
}

export function clearGroup(group: THREE.Object3D): void {
  for (const child of [...group.children]) {
    clearGroup(child);
    const c = child as unknown as {
      geometry?: { dispose?: () => void };
      material?: THREE.Material | THREE.Material[];
    };
    c.geometry?.dispose?.();
    if (c.material) disposeMaterial(c.material);
    group.remove(child);
  }
}
