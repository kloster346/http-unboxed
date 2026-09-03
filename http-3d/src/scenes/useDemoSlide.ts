import { useEffect, useState } from 'react';
import * as THREE from 'three';
import type { RefObject } from 'react';
import gsap from 'gsap';

/**
 * 演示滑动：把 group 沿 x 从 fromX 滑到 toX 再滑回（用于 GET/POST 小场景的演示动画）。
 */
export function useDemoSlide(groupRef: RefObject<THREE.Group | null>, fromX: number, toX: number) {
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (!demo || !groupRef.current) return;
    const tween = gsap.to(groupRef.current.position, { x: toX, duration: 0.9, ease: 'power2.inOut' });
    const t = setTimeout(() => {
      if (groupRef.current) {
        gsap.to(groupRef.current.position, { x: fromX, duration: 0.7, ease: 'power2.inOut' });
      }
      setDemo(false);
    }, 1600);
    return () => {
      tween.kill();
      clearTimeout(t);
    };
  }, [demo, groupRef, fromX, toX]);

  return { trigger: () => setDemo(true) };
}
