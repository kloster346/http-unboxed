import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import type { Act } from '../data/steps';
import { PHONE_POS, WAREHOUSE_POS, RETURN_MID_POS } from '../data/positions';
import type { MutableRefObject } from 'react';

/** 签收球（响应用）：respond 幕次从仓库沿返回轨迹飞回手机；done 到达手机。 */
export default function Signature({
  act,
  reportPos,
}: {
  act: Act;
  reportPos: MutableRefObject<THREE.Vector3>;
}) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef({ value: 0 });
  const curve = useMemo(() => new THREE.CatmullRomCurve3([WAREHOUSE_POS, RETURN_MID_POS, PHONE_POS]), []);
  const visible = act === 'respond' || act === 'done';

  useEffect(() => {
    let tween: ReturnType<typeof gsap.to> | undefined;
    if (act === 'respond') {
      progress.current.value = 0;
      tween = gsap.to(progress.current, { value: 1, duration: 1.4, ease: 'power2.inOut' });
    } else if (act === 'done') {
      progress.current.value = 1;
    } else {
      progress.current.value = 0;
    }
    return () => {
      tween?.kill();
    };
  }, [act]);

  useFrame(() => {
    if (group.current) {
      const pos = curve.getPoint(THREE.MathUtils.clamp(progress.current.value, 0, 1));
      group.current.position.copy(pos);
      if (visible) reportPos.current.copy(pos);
    }
  });

  return (
    <group ref={group} position={[WAREHOUSE_POS.x, WAREHOUSE_POS.y, WAREHOUSE_POS.z]}>
      {visible && (
        <>
          <mesh>
            <sphereGeometry args={[0.32, 32, 32]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.9} />
          </mesh>
          <Html center position={[0.6, 0.05, 0]} distanceFactor={8}>
            <div className="ball-tags">
              <div className="tag tag-ok">200 OK</div>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
