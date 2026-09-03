import NodeLabel from './NodeLabel';
import type { Act } from '../data/steps';
import { HUB_POS } from '../data/positions';

/** 网络节点（快递站）——数据球飞过它。fly1 幕次高亮。 */
export default function Hub({ act }: { act: Act }) {
  const lit = act === 'fly1';
  return (
    <group position={[HUB_POS.x, HUB_POS.y, HUB_POS.z]}>
      <mesh>
        <torusGeometry args={[0.5, 0.12, 16, 40]} />
        <meshStandardMaterial
          color={lit ? '#38bdf8' : '#334155'}
          emissive={lit ? '#0ea5e9' : '#000000'}
          emissiveIntensity={lit ? 1 : 0}
        />
      </mesh>
      <NodeLabel text="🏬 快递站 · 网络" position={[0, 1.05, 0]} />
    </group>
  );
}
