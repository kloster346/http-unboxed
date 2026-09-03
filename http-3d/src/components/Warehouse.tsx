import NodeLabel from './NodeLabel';
import type { Act } from '../data/steps';

/** 仓库 / 服务器节点。fly2 及之后幕次高亮。 */
export default function Warehouse({ act }: { act: Act }) {
  const lit = ['fly2', 'process', 'respond', 'done'].includes(act);
  return (
    <group position={[2.3, 0.7, 0]}>
      <mesh>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color="#f97316"
          emissive={lit ? '#f97316' : '#000000'}
          emissiveIntensity={lit ? 0.8 : 0}
        />
      </mesh>
      <NodeLabel text="🏭 仓库 · 服务器" />
    </group>
  );
}
