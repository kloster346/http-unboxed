import { useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useDemoSlide } from './useDemoSlide';

/** POST 小场景：去前台寄件——把货(数据)放在 Body，Header 带 Token。 */
export default function PostMini() {
  const pkg = useRef<THREE.Group>(null);
  const { trigger } = useDemoSlide(pkg, -0.7, 0.9);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />

      {/* 前台 */}
      <group position={[1.1, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 0.9, 0.7]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>

      {/* 包裹（货在 Body，Header 带 Token） */}
      <group ref={pkg} position={[-0.7, 0.9, 0.5]}>
        <mesh>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={0.35} />
        </mesh>
        <Html center position={[0, 0.32, 0]} distanceFactor={6}>
          <div className="mini-tag tag-body">Body·JSON + Token</div>
        </Html>
      </group>

      <Html center position={[0, 1.7, 0]} distanceFactor={6}>
        <button className="order-btn" onClick={trigger}>
          ▶ 演示：去寄件
        </button>
      </Html>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </>
  );
}
