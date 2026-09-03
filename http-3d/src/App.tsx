import { Canvas } from '@react-three/fiber';
import { useFlow } from './store/useFlow';
import Scene from './components/Scene';
import Controls from './ui/Controls';
import Caption from './ui/Caption';

export default function App() {
  const flow = useFlow();
  return (
    <div className="app">
      <header className="bar">
        <div className="brand">
          <span className="logo">🚚</span> 一次通信，是怎么走的？ <small>· 3D · 文字最少版</small>
        </div>
      </header>
      <div className="stage">
        <Canvas camera={{ position: [4, 3, 6], fov: 50 }}>
          <Scene act={flow.act} />
        </Canvas>
      </div>
      <div className="dock">
        <Controls flow={flow} />
        <Caption text={flow.caption} />
      </div>
    </div>
  );
}
