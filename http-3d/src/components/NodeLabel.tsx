import { Html } from '@react-three/drei';

/** 3D 节点上方的文本标签（drei Html 覆盖层）。 */
export default function NodeLabel({
  text,
  position = [0, 1.02, 0.06],
  distanceFactor = 7,
}: {
  text: string;
  position?: [number, number, number];
  distanceFactor?: number;
}) {
  return (
    <Html center position={position} distanceFactor={distanceFactor}>
      <div className="node-label">{text}</div>
    </Html>
  );
}
