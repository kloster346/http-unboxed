import { useRef } from 'react';
import * as THREE from 'three';
import type { Act } from '../data/steps';
import Phone from './Phone';
import DataBall from './DataBall';
import Warehouse from './Warehouse';
import Hub from './Hub';
import Trajectory from './Trajectory';
import CameraRig from './CameraRig';
import Processing from './Processing';
import Signature from './Signature';
import BloomEffect from './BloomEffect';

/**
 * 主流程 3D 场景（工单 04）：手机 + 快递站(网络) + 数据球(飞行) + 仓库，
 * 拆包处理(齿轮) + 回传 200 OK 签收球，相机电影式跟拍。
 */
export default function Scene({ act, onOrder }: { act: Act; onOrder: () => void }) {
  const ballPos = useRef(new THREE.Vector3(0, 1.9, 0));
  return (
    <>
      <color attach="background" args={['#0b1220']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} />
      <pointLight position={[-2.3, 2.2, 1.5]} intensity={0.7} color="#38bdf8" />

      <CameraRig target={ballPos} />
      <Trajectory />
      <Phone act={act} onOrder={onOrder} />
      <Hub act={act} />
      <DataBall act={act} reportPos={ballPos} />
      <Processing act={act} />
      <Warehouse act={act} />
      <Signature act={act} reportPos={ballPos} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <gridHelper args={[24, 24, '#1f2733', '#161e2b']} position={[0, 0, 0]} />
      <BloomEffect />    </>
  );
}
