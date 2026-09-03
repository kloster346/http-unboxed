import { useFlow } from '../store/useFlow';

export default function Controls({ flow }: { flow: ReturnType<typeof useFlow> }) {
  return (
    <div className="controls">
      <button onClick={flow.prev} disabled={flow.step === 0}>
        ⏮ 上一步
      </button>
      <button className="play" onClick={flow.isPlaying ? flow.pause : flow.play}>
        {flow.isPlaying ? '⏸ 暂停' : '▶ 自动播'}
      </button>
      <button onClick={flow.next} disabled={flow.step === flow.total - 1}>
        下一步 ⏭
      </button>
      <button onClick={flow.replay}>↺ 重播</button>
      <span className="count">
        {flow.step + 1} / {flow.total}
      </span>
    </div>
  );
}
