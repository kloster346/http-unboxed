import { Canvas } from '@react-three/fiber';
import GetMini from './GetMini';
import PostMini from './PostMini';

/** GET vs POST 对比视图：两个并排 3D 小场景 + 差异要点 + 一句话总结。 */
export default function GetPost() {
  return (
    <div className="cmp-wrap">
      <div className="cmp-card get">
        <div className="cmp-title">📮 GET · 查 = 去快递柜取件</div>
        <div className="cmp-stage">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.4, 4.2], fov: 45 }}>
            <GetMini />
          </Canvas>
        </div>
        <ul className="cmp-points">
          <li>把「取件码（参数）」写在地址栏 URL 上</li>
          <li>没有包裹（Body 空）——拿到的是商品列表</li>
          <li>明文可见 · 有长度限制 · 幂等（取一次不多一个）</li>
        </ul>
      </div>

      <div className="cmp-card post">
        <div className="cmp-title">🏪 POST · 增/改 = 去前台寄件</div>
        <div className="cmp-stage">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.4, 4.2], fov: 45 }}>
            <PostMini />
          </Canvas>
        </div>
        <ul className="cmp-points">
          <li>把「货物（数据）」放在包裹 Body 里</li>
          <li>Header 带 Token（验身）+ Body 是 JSON</li>
          <li>较安全 · 能传大体积 · 非幂等（寄一次多一个）</li>
        </ul>
      </div>

      <div className="cmp-foot">
        <b>一句话记：</b>GET 是把「取件码」写在门上（看得见、有长度限制、查一次不变）；POST 是把「货」装进包里交给前台（看不见、量大、每寄一次多一单）。前端 90% 只用到 GET 和 POST。
      </div>
    </div>
  );
}
