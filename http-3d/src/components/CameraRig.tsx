import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { MutableRefObject } from 'react';

const CAMERA_OFFSET = new THREE.Vector3(0, 2.0, 5.4);
const FOLLOW_LERP = 0.07;

/** 电影式跟拍相机：active 时跟随 target（数据球）位置并始终注视它；否则让位给 OrbitControls。 */
export default function CameraRig({
  target,
  active,
}: {
  target: MutableRefObject<THREE.Vector3>;
  active: boolean;
}) {
  const desired = new THREE.Vector3();

  useFrame(({ camera }) => {
    if (!active) return;
    const t = target.current;
    if (!t) return;
    desired.copy(t).add(CAMERA_OFFSET);
    camera.position.lerp(desired, FOLLOW_LERP);
    camera.lookAt(t);
  });

  return null;
}
