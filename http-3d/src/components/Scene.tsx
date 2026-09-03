import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Act } from '../data/steps';

/**
 * 首个 3D 场景（工单 01）：一个带灯光的场景 + 一个节点(仓库) + 一只数据球。
 * 后续工单（02-04）会在此基础上升级为完整的“寄快递”流程动画。
 */
export default function Scene({ act }: { act: Act }) {
  const ball = useRef<THREE.Mesh>(null);
  const done = act === 'done';

  useFrame((_, dt) => {
    if (ball.current) ball.current.rotation.y += dt * 0.5;
  });

  return (
    <>
      <color attach="background" args={['#0b1220']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} />

      {/* 节点（仓库/服务器） */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>

      {/* 数据球 */}
      <mesh ref={ball} position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive={done ? '#16a34a' : '#0ea5e9'}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <gridHelper args={[24, 24, '#1f2733', '#161e2b']} position={[0, 0, 0]} />
    </>
  );
}
