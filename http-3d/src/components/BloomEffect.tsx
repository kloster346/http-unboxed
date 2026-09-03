import { EffectComposer, Bloom } from '@react-three/postprocessing';

const BLOOM_THRESHOLD = 0.22;
const BLOOM_INTENSITY = 0.55;

/** 统一的 Bloom 后处理发光（主流程与 GET/POST 小场景共用，保证光效一致）。 */
export default function BloomEffect() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={BLOOM_THRESHOLD} intensity={BLOOM_INTENSITY} mipmapBlur />
    </EffectComposer>
  );
}
