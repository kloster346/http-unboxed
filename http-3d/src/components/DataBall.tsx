import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import type { Act } from '../data/steps';
import { PHONE_POS, HUB_POS, WAREHOUSE_POS } from '../data/positions';
import type { MutableRefObject } from 'react';

/**
 * 数据球（工单 03）：create 及之后出现，沿轨迹从手机飞到快递站、再到仓库。
 * 飞行用 GSAP 推进沿 CatmullRom 曲线的进度；相机跟拍通过 reportPos 上报位置。
 */
export default function DataBall({
  act,
  reportPos,
}: {
  act: Act;
  reportPos: MutableRefObject<THREE.Vector3>;
}) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef({ value: 0 });
  const curve = useMemo(() => new THREE.CatmullRomCurve3([PHONE_POS, HUB_POS, WAREHOUSE_POS]), []);
  const visible = act !== 'idle';

  useEffect(() => {
    let tween: ReturnType<typeof gsap.to> | undefined;
    if (act === 'idle' || act === 'create') {
      progress.current.value = 0;
    } else if (act === 'fly1') {
      tween = gsap.to(progress.current, { value: 0.5, duration: 1.1, ease: 'power2.inOut' });
    } else if (act === 'fly2') {
      tween = gsap.to(progress.current, { value: 1, duration: 1.1, ease: 'power2.inOut' });
    } else {
      // process / respond / done：球已到达仓库
      progress.current.value = 1;
    }
    // 幕次切换（含上一步/重播）时终止旧 tween，保证复位生效
    return () => {
      tween?.kill();
    };
  }, [act]);

  useFrame(() => {
    if (group.current) {
      const t = THREE.MathUtils.clamp(progress.current.value, 0, 1);
      const pos = curve.getPoint(t);
      group.current.position.copy(pos);
      if (visible) reportPos.current.copy(pos);
    }
  });

  return (
    <group ref={group} position={[PHONE_POS.x, PHONE_POS.y, PHONE_POS.z]}>
      {visible && (
        <>
          <mesh>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.7} />
          </mesh>
          <Html center position={[0.6, 0.05, 0]} distanceFactor={8}>
            <div className="ball-tags">
              <div className="tag tag-json">JSON</div>
              <div className="tag tag-url">URL地址</div>
              <div className="tag tag-header">Header·Token</div>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
