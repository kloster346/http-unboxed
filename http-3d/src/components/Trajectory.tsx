import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { PHONE_POS, HUB_POS, WAREHOUSE_POS, RETURN_MID_POS } from '../data/positions';

/** 数据球飞行的发光轨迹：橙 = 去程(手机→快递站→仓库)，蓝 = 回程(仓库→手机)。 */
export default function Trajectory() {
  const outCurve = new THREE.CatmullRomCurve3([PHONE_POS, HUB_POS, WAREHOUSE_POS]);
  const retCurve = new THREE.CatmullRomCurve3([WAREHOUSE_POS, RETURN_MID_POS, PHONE_POS]);
  const toPoints = (curve: THREE.CatmullRomCurve3) =>
    Array.from(curve.getPoints(60), (p) => [p.x, p.y, p.z] as [number, number, number]);
  return (
    <>
      <Line points={toPoints(outCurve)} color="#fb923c" lineWidth={2.5} transparent opacity={0.55} />
      <Line points={toPoints(retCurve)} color="#38bdf8" lineWidth={2.5} transparent opacity={0.35} />
    </>
  );
}
