import NodeLabel from './NodeLabel';

/** 仓库 / 服务器节点。 */
export default function Warehouse() {
  return (
    <group position={[2.3, 0.7, 0]}>
      <mesh>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <NodeLabel text="🏭 仓库 · 服务器" />
    </group>
  );
}
