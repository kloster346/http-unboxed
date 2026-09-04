export interface CaptionPair {
  meta: string;
  tech: string;
}

export function forBoss(pair: CaptionPair, bossMode: boolean): string {
  return bossMode ? pair.meta : pair.tech;
}
