import type { Act } from '../data/steps';
import Phone from './Phone';
import DataBall from './DataBall';
import Warehouse from './Warehouse';

/**
 * 主流程 3D 场景（工单 02）：手机 + 数据球(带 JSON/URL/Header 面单标签) + 仓库。
 * 后续工单（03-04）再加：网络节点(快递站)、飞行轨迹、拆包处理、回传签收球。
 */
export default function Scene({ act, onOrder }: { act: Act; onOrder: () => void }) {
  return (
    <>
      <color attach="background" args={['#0b1220']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} />
      <pointLight position={[-2.3, 2.2, 1.5]} intensity={0.7} color="#38bdf8" />

      <Phone act={act} onOrder={onOrder} />
      <DataBall act={act} />
      <Warehouse />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <gridHelper args={[24, 24, '#1f2733', '#161e2b']} position={[0, 0, 0]} />
    </>
  );
}
