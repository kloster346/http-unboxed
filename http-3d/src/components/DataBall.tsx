import { Html } from '@react-three/drei';
import type { Act } from '../data/steps';

/**
 * 数据球（工单 02）：create 及之后幕次出现，带 JSON / URL / Header 面单标签。
 * 标签随幕次出现；后续工单（03-04）会让它沿轨迹飞行、拆包、回传签收球。
 */
export default function DataBall({ act }: { act: Act }) {
  const visible = act !== 'idle';
  return (
    <group position={[-2.3, 1.7, 0]}>
      {visible && (
        <>
          <mesh>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.7} />
          </mesh>
          <Html center position={[0.6, 0.05, 0]} distanceFactor={8}>
            <div className="ball-tags">
              <div className="tag tag-json">JSON</div>
              <div className="tag tag-url">URL地址</div>
              <div className="tag tag-header">Header·Token</div>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
