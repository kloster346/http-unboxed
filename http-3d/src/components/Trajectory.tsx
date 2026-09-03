import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { PHONE_POS, HUB_POS, WAREHOUSE_POS } from '../data/positions';

/** 数据球飞行的发光轨迹：手机 → 快递站 → 仓库。 */
export default function Trajectory() {
  const curve = new THREE.CatmullRomCurve3([PHONE_POS, HUB_POS, WAREHOUSE_POS]);
  const points = Array.from(curve.getPoints(60), (p) => [p.x, p.y, p.z] as [number, number, number]);
  return <Line points={points} color="#fb923c" lineWidth={2.5} transparent opacity={0.55} />;
}
