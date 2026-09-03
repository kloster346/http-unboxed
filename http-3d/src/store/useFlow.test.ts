import { renderHook, act } from '@testing-library/react';
import { useFlow } from './useFlow';
import { STEPS } from '../data/steps';

describe('useFlow', () => {
  it('starts at step 0 with the first caption and the right total', () => {
    const { result } = renderHook(() => useFlow());
    expect(result.current.step).toBe(0);
    expect(result.current.caption).toBe(STEPS[0].caption);
    expect(result.current.act).toBe(STEPS[0].act);
    expect(result.current.total).toBe(STEPS.length);
  });

  it('idle → create 生成数据球并贴面单（act/caption）', () => {
    const { result } = renderHook(() => useFlow());
    expect(result.current.act).toBe('idle');
    act(() => result.current.next());
    expect(result.current.act).toBe('create');
    expect(result.current.caption).toBe(STEPS[1].caption);
  });

  it('create → fly1 → fly2 数据球飞行（act/caption）', () => {
    const { result } = renderHook(() => useFlow());
    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.act).toBe('fly1');
    expect(result.current.caption).toBe(STEPS[2].caption);
    act(() => result.current.next());
    expect(result.current.act).toBe('fly2');
    expect(result.current.caption).toBe(STEPS[3].caption);
  });

  it('fly2 → process → respond → done 处理/回传/完成（act/caption）', () => {
    const { result } = renderHook(() => useFlow());
    act(() => result.current.next()); // create
    act(() => result.current.next()); // fly1
    act(() => result.current.next()); // fly2
    act(() => result.current.next()); // process
    expect(result.current.act).toBe('process');
    expect(result.current.caption).toBe(STEPS[4].caption);
    act(() => result.current.next());
    expect(result.current.act).toBe('respond');
    expect(result.current.caption).toBe(STEPS[5].caption);
    act(() => result.current.next());
    expect(result.current.act).toBe('done');
    expect(result.current.caption).toBe(STEPS[6].caption);
  });

  it('next advances one step', () => {
    const { result } = renderHook(() => useFlow());
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
    expect(result.current.caption).toBe(STEPS[1].caption);
  });

  it('next clamps at the last step', () => {
    const { result } = renderHook(() => useFlow());
    act(() => {
      for (let i = 0; i < STEPS.length + 2; i++) result.current.next();
    });
    expect(result.current.step).toBe(STEPS.length - 1);
  });

  it('prev goes back one step', () => {
    const { result } = renderHook(() => useFlow());
    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.step).toBe(2);
    act(() => result.current.prev());
    expect(result.current.step).toBe(1);
  });

  it('prev clamps at 0', () => {
    const { result } = renderHook(() => useFlow());
    act(() => result.current.prev());
    expect(result.current.step).toBe(0);
  });

  it('play/pause toggle isPlaying', () => {
    const { result } = renderHook(() => useFlow());
    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(true);
    act(() => result.current.pause());
    expect(result.current.isPlaying).toBe(false);
  });

  it('replay resets to step 0 and stops playing', () => {
    const { result } = renderHook(() => useFlow());
    act(() => {
      result.current.next();
      result.current.play();
    });
    expect(result.current.step).toBe(1);
    expect(result.current.isPlaying).toBe(true);
    act(() => result.current.replay());
    expect(result.current.step).toBe(0);
    expect(result.current.isPlaying).toBe(false);
  });

  it('exposes the full read-only steps list', () => {
    const { result } = renderHook(() => useFlow());
    expect(result.current.steps).toBe(STEPS);
  });

  it('auto-advances while playing and stops at the last step', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFlow());
    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(true);
    act(() => vi.advanceTimersByTime(2200));
    expect(result.current.step).toBe(1);
    act(() => vi.advanceTimersByTime(2200 * (STEPS.length - 2)));
    expect(result.current.step).toBe(STEPS.length - 1);
    act(() => vi.advanceTimersByTime(2200));
    expect(result.current.isPlaying).toBe(false);
    vi.useRealTimers();
  });
});
