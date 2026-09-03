import { useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useDemoSlide } from './useDemoSlide';

/** GET 小场景：去快递柜取件——把取件码(参数)写在 URL，Body 空、无货物。 */
export default function GetMini() {
  const pkg = useRef<THREE.Group>(null);
  const { trigger } = useDemoSlide(pkg, -0.7, 0.95);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />

      {/* 快递柜 */}
      <group position={[1.1, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 1.5, 0.4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.35, 0.21]}>
          <planeGeometry args={[0.6, 0.3]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, -0.35, 0.21]}>
          <planeGeometry args={[0.6, 0.3]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* 包裹（取件码在 URL，Body 空/无货） */}
      <group ref={pkg} position={[-0.7, 0.5, 0.6]}>
        <mesh>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.4} />
        </mesh>
        <Html center position={[0, 0.32, 0]} distanceFactor={6}>
          <div className="mini-tag tag-url">取件码 ?page=1</div>
        </Html>
      </group>

      <Html center position={[0, 1.7, 0]} distanceFactor={6}>
        <button className="order-btn" onClick={trigger}>
          ▶ 演示：去取件
        </button>
      </Html>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </>
  );
}
