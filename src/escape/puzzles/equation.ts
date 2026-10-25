import type { PuzzleDef } from '../types';

export const SYMBOLS = ['★', '●', '▲', '■'];

/** 依序可解的算式：第一行只有一種符號，之後每行多一個新符號 */
export function makeEquations(a: string) {
  const uniq = [...new Set(a)];
  const sym = new Map(uniq.map((d, i) => [d, SYMBOLS[i]]));
  const v = uniq.map(Number);
  const lines = [`${SYMBOLS[0]} + ${SYMBOLS[0]} + ${SYMBOLS[0]} = ${v[0] * 3}`];
  for (let i = 1; i < uniq.length; i++) {
    const p = SYMBOLS[i - 1], s = SYMBOLS[i];
    lines.push(v[i] >= v[i - 1] ? `${s} − ${p} = ${v[i] - v[i - 1]}` : `${p} − ${s} = ${v[i - 1] - v[i]}`);
  }
  return { lines, code: [...a].map((d) => sym.get(d)!).join(' ') };
}

export const equationPuzzle: PuzzleDef = {
  kind: 'equation',
  name: '符號算式',
  stars: 2,
  locks: ['digit'],
  desc: '用符號寫成的算式，算出每個符號代表的數字，再依指定順序排列。',
  sample: { digit: '2718' },
  fields: [],
  build(a) {
    const { lines, code } = makeEquations(a);
    return {
      card: [{ k: 'big', text: lines.join('\n') }, { k: 'p', text: '密碼：' + code }],
      rules: '每個符號代表一個 0–9 的數字。先算出每個符號，再依「密碼」那一行的順序寫出數字。',
      hints: ['從只有一種符號的第一行開始算。', `${SYMBOLS[0]} = ${[...new Set(a)][0]}`],
    };
  },
};
