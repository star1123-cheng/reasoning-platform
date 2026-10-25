import type { Rng } from '../ciphers';

/** 可重現的亂數：同一個 seed 每次產生相同的謎題，列印與線上試玩才會一致 */
export const seeded = (seed: number): Rng => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const randInt = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

export const shuffle = <T,>(a: readonly T[], rng: Rng): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

/** 打亂但保證不等於原順序（長度 ≥ 2 且元素不全相同時） */
export const shuffleChanged = <T,>(a: readonly T[], rng: Rng): T[] => {
  for (let i = 0; i < 50; i++) {
    const r = shuffle(a, rng);
    if (r.some((x, j) => x !== a[j])) return r;
  }
  return [...a];
};
