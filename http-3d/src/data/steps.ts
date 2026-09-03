/** 幕次行为标识（封闭集合）。场景组件据此决定当前幕次该呈现什么。 */
export type Act = 'idle' | 'create' | 'fly1' | 'fly2' | 'process' | 'respond' | 'done';

export type Step = { caption: string; act: Act };

/**
 * 一次通信的分幕数据（只读）。act 供场景组件判断当前幕次该呈现什么。
 * 后续工单（02-04）会在场景里消费这些 act。
 */
export const STEPS: Step[] = [
  { caption: '点一下手机里的「下单」👇', act: 'idle' },
  { caption: '生成了一个包裹：里面是 JSON 数据，外面贴着 URL + Header 面单', act: 'create' },
  { caption: '包裹出发，飞过「快递站＝网络」', act: 'fly1' },
  { caption: '到达「仓库＝服务器」，开始拆包', act: 'fly2' },
  { caption: '服务器处理中…… ⚙️', act: 'process' },
  { caption: '仓库回传「签收单 200 OK」，飞回手机', act: 'respond' },
  { caption: '✅ 一次通信完成！前端＝寄快递，后端＝回签收单', act: 'done' },
];
