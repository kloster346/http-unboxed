import { useCallback, useEffect, useState } from 'react';
import { STEPS } from '../data/steps';

const AUTO_ADVANCE_MS = 2200;

/**
 * 流程状态机 —— 本工程流程的唯一事实来源（spec 预商定的测试 seam）。
 * 所有幕次推进（next/prev/replay/自动播）与播放状态都从这里出，
 * 3D 场景只消费 act，UI 只读 caption/steps。
 */
export function useFlow() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [scene, setScene] = useState<'main' | 'compare'>('main');
  const total = STEPS.length;

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, total - 1));
  }, [total]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const replay = useCallback(() => {
    setStep(0);
    setPlaying(false);
  }, []);

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);

  // 自动播：处于主流程时才每 AUTO_ADVANCE_MS 推进一幕（比较场景不推进幕次）。
  useEffect(() => {
    if (!playing || scene !== 'main') return;
    const id = setInterval(() => {
      setStep((s) => Math.min(s + 1, total - 1));
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [playing, scene, total]);

  // 到达最后一幕后自动停止播放。
  useEffect(() => {
    if (playing && scene === 'main' && step >= total - 1) setPlaying(false);
  }, [playing, scene, step, total]);

  const current = STEPS[step];

  return {
    step,
    total,
    steps: STEPS,
    caption: current.caption,
    act: current.act,
    next,
    prev,
    replay,
    play,
    pause,
    isPlaying: playing,
    scene,
    setScene,
  };
}
