import { Html } from '@react-three/drei';
import NodeLabel from './NodeLabel';
import type { Act } from '../data/steps';

/** 手机节点（前端）。点「下单」触发进入 create 幕次。 */
export default function Phone({ act, onOrder }: { act: Act; onOrder: () => void }) {
  return (
    <group position={[-2.3, 0.5, 0]}>
      {/* 机身 */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.9, 1.6, 0.16]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {/* 屏幕 */}
      <mesh position={[0, 0.12, 0.09]}>
        <planeGeometry args={[0.7, 1.2]} />
        <meshBasicMaterial color={act === 'done' ? '#16a34a' : '#0ea5e9'} />
      </mesh>

      {/* 下单按钮：仅在 idle 幕次出现 */}
      {act === 'idle' && (
        <Html center position={[0, -0.62, 0.14]} distanceFactor={7}>
          <button className="order-btn" onClick={onOrder}>
            ✓ 下单
          </button>
        </Html>
      )}

      {/* 完成：手机亮起「已收货」 */}
      {act === 'done' && (
        <Html center position={[0, -0.62, 0.14]} distanceFactor={7}>
          <div className="tag tag-ok received">✓ 已收货</div>
        </Html>
      )}

      <NodeLabel text="📱 手机 · 前端" />
    </group>
  );
}
