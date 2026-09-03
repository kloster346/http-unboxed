import { Canvas } from '@react-three/fiber';
import { useFlow } from './store/useFlow';
import Scene from './components/Scene';
import Controls from './ui/Controls';
import Caption from './ui/Caption';
import GetPost from './scenes/GetPost';

export default function App() {
  const flow = useFlow();
  return (
    <div className="app">
      <header className="bar">
        <div className="brand">
          <span className="logo">🚚</span> 一次通信，是怎么走的？ <small>· 3D · 文字最少版</small>
        </div>
        <div className="tabs">
          <button
            className={flow.scene === 'main' ? 'active' : ''}
            onClick={() => flow.setScene('main')}
          >
            📮 主流程
          </button>
          <button
            className={flow.scene === 'compare' ? 'active' : ''}
            onClick={() => flow.setScene('compare')}
          >
            ⚔️ GET vs POST
          </button>
        </div>
      </header>

      {flow.scene === 'main' ? (
        <>
          <div className="stage">
            <Canvas dpr={[1, 1.5]} camera={{ position: [4, 3, 6], fov: 50 }}>
              <Scene act={flow.act} onOrder={flow.next} playing={flow.isPlaying} />
            </Canvas>
          </div>
          <div className="dock">
            <Controls flow={flow} />
            <Caption text={flow.caption} />
          </div>
        </>
      ) : (
        <GetPost />
      )}
    </div>
  );
}
