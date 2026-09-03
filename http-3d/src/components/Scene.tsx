import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
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
 * 主流程 3D 场景（工单 07）：手机 + 快递站 + 数据球 + 仓库，拆包/回传，
 * 电影式跟拍（playing 或未拖拽时），暂停后可拖拽环视（OrbitControls），重播复位相机。
 */
export default function Scene({
  act,
  onOrder,
  playing,
}: {
  act: Act;
  onOrder: () => void;
  playing: boolean;
}) {
  const ballPos = useRef(new THREE.Vector3(0, 1.9, 0));
  const [isUserDragging, setIsUserDragging] = useState(false);

  // 单一相机所有权：用户抓取(OrbitControls onStart)即让位给拖拽；否则跟拍。
  const followCamera = !isUserDragging;

  // 幕次推进或开始自动播时，结束探索、交还相机给跟拍；回到 idle(重播/起点)时复位取景点。
  useEffect(() => {
    setIsUserDragging(false);
    if (act === 'idle') ballPos.current.set(0, 1.9, 0);
  }, [act, playing]);

  return (
    <>
      <color attach="background" args={['#0b1220']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} />
      <pointLight position={[-2.3, 2.2, 1.5]} intensity={0.7} color="#38bdf8" />

      {/* 跟拍与 OrbitControls 在同一时刻互斥控制相机：跟拍途中 OrbitControls 被动待机，
         用户抓取(onStart)时 isUserDragging=true，跟拍停止、交由 OrbitControls 环视。 */}
      <CameraRig target={ballPos} active={followCamera} />
      <OrbitControls
        enabled={!playing}
        makeDefault
        target={ballPos.current}
        onStart={() => setIsUserDragging(true)}
      />
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
      <BloomEffect />
    </>
  );
}
