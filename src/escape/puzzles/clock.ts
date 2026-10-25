import type { PuzzleDef } from '../types';

/** 345 → 3:45；1030 → 10:30 */
export const parseTime = (a: string): { h: number; m: number } | null => {
  const h = +a.slice(0, a.length - 2), m = +a.slice(-2);
  if (a.length === 3 && h >= 1 && h <= 9 && m <= 59) return { h, m };
  if (a.length === 4 && h >= 10 && h <= 12 && m <= 59) return { h, m };
  return null;
};

export const clockPuzzle: PuzzleDef = {
  kind: 'clock',
  name: '時鐘',
  stars: 1,
  locks: ['digit'],
  desc: '一個指針時鐘；時與分連起來就是密碼。',
  sample: { digit: '345' },
  fields: [],
  check: (a) => (parseTime(a) ? null : '時鐘題的答案要是時間：3 位數如 345（3:45），4 位數如 1030（10:30，時為 10–12），分鐘 00–59'),
  build(a) {
    const t = parseTime(a)!;
    return {
      card: [{ k: 'clock', h: t.h, m: t.m }],
      rules: '把時鐘上的「時」和「分」連起來寫（3:45 → 345，10:05 → 1005）。',
      hints: ['短針是時、長針是分；長針每走一小格是 1 分鐘。', `時針在 ${t.h} 附近。`],
    };
  },
};
