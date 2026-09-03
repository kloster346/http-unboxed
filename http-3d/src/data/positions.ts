import * as THREE from 'three';

/** 数据球飞行轨迹的关键点（单一事实来源，供 Trajectory / DataBall / 节点组件共用）。 */
export const PHONE_POS = new THREE.Vector3(-2.3, 1.7, 0); // 手机处（数据球起点）
export const HUB_POS = new THREE.Vector3(0, 2.6, 0); // 快递站（网络）
export const WAREHOUSE_POS = new THREE.Vector3(2.3, 1.74, 0); // 仓库顶面（数据球落点）
