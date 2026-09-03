import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Act } from '../data/steps';
import { WAREHOUSE_POS } from '../data/positions';

/** 服务器节点的拆包/处理动画：一个在仓库上方旋转的齿轮。process 及之后幕次出现。 */
export default function Processing({ act }: { act: Act }) {
  const gear = useRef<THREE.Group>(null);
  // fly2(到达/开始拆包) 起旋转，done(完成) 停止
  const spinning = ['fly2', 'process', 'respond'].includes(act);

  useFrame((_, dt) => {
    if (gear.current && spinning) gear.current.rotation.z += dt * 3.5;
  });

  return (
    <group position={[WAREHOUSE_POS.x, WAREHOUSE_POS.y + 0.9, WAREHOUSE_POS.z]}>
      {spinning && (
        <group ref={gear}>
          <mesh>
            <torusGeometry args={[0.28, 0.07, 8, 20]} />
            <meshStandardMaterial color="#fbbf24" emissive="#b45309" emissiveIntensity={0.5} />
          </mesh>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0]} rotation={[0, 0, a]}>
                <boxGeometry args={[0.12, 0.08, 0.1]} />
                <meshStandardMaterial color="#fbbf24" />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
