export type SceneId = 'intro' | 'assemble' | 'standardize' | 'routes' | 'respond';

export interface CaptionPair {
  tech: string;
  meta: string;
}

export const SCENE_ORDER: readonly SceneId[] = [
  'intro',
  'assemble',
  'standardize',
  'routes',
  'respond',
];

export const SCENE_TOTAL = SCENE_ORDER.length;

export const CAPTIONS: Record<SceneId, CaptionPair> = {
  intro: { tech: '一次 HTTP 请求的开始', meta: '把包裹寄出去' },
  assemble: { tech: 'URL + Header + Body', meta: '地址带 + 面单 + 货物' },
  standardize: { tech: 'JSON 序列化', meta: '货物用清单标准化' },
  routes: { tech: 'GET vs POST', meta: '取件 vs 寄件' },
  respond: { tech: '200 OK 响应', meta: '顺利签收' },
};

export interface ScenarioStateOptions {
  sceneId?: SceneId;
  bossMode?: boolean;
  playing?: boolean;
}

export interface ScenarioState {
  readonly sceneId: SceneId;
  readonly index: number;
  readonly total: number;
  readonly bossMode: boolean;
  readonly playing: boolean;
  readonly caption: string;
  play(): void;
  pause(): void;
  toggleBossMode(): void;
  advance(): void;
  back(): void;
  replay(): void;
  goto(index: number): void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function createScenarioState(opts: ScenarioStateOptions = {}): ScenarioState {
  let index = clamp(SCENE_ORDER.indexOf(opts.sceneId ?? 'intro'), 0, SCENE_TOTAL - 1);
  let bossMode = opts.bossMode ?? false;
  let playing = opts.playing ?? false;

  const caption = () => CAPTIONS[SCENE_ORDER[index]][bossMode ? 'meta' : 'tech'];

  return {
    get sceneId() {
      return SCENE_ORDER[index];
    },
    get index() {
      return index;
    },
    get total() {
      return SCENE_TOTAL;
    },
    get bossMode() {
      return bossMode;
    },
    get playing() {
      return playing;
    },
    get caption() {
      return caption();
    },
    play() {
      playing = true;
    },
    pause() {
      playing = false;
    },
    toggleBossMode() {
      bossMode = !bossMode;
    },
    advance() {
      if (index < SCENE_TOTAL - 1) index += 1;
    },
    back() {
      if (index > 0) index -= 1;
    },
    replay() {
      index = 0;
    },
    goto(i: number) {
      index = clamp(i, 0, SCENE_TOTAL - 1);
    },
  };
}
