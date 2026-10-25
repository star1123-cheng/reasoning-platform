import type { Cell } from '../../ciphers';
import { A } from '../../ciphers/util';
import { shuffle } from '../rng';
import type { PuzzleDef } from '../types';

const COLS = 'ABCDEF';

export const coordsPuzzle: PuzzleDef = {
  kind: 'coords',
  name: '座標地圖',
  stars: 1,
  locks: ['letter'],
  desc: '6×6 字母方格與一串座標（例如 B3），依序取出字母。',
  sample: { letter: 'KEYS' },
  fields: [],
  build(a, _f, { rng }) {
    const spots = shuffle([...Array(36).keys()], rng).slice(0, a.length);
    const cells = Array.from({ length: 36 }, () => A[Math.floor(rng() * 26)]);
    spots.forEach((p, i) => { cells[p] = a[i]; });
    const coords = spots.map((p) => COLS[p % 6] + (((p / 6) | 0) + 1));
    const rows: Cell[][] = [['', ...COLS], ...Array.from({ length: 6 }, (_, r): Cell[] => [r + 1, ...cells.slice(r * 6, r * 6 + 6)])];
    return {
      card: [{ k: 'table', rows }, { k: 'big', text: coords.join(' → ') }],
      rules: '依序找出每個座標上的字母（英文字母是欄、數字是列），連起來就是密碼。',
      hints: [`${coords[0]} 指的是 ${coords[0][0]} 欄、第 ${coords[0].slice(1)} 列。`, `第一個字母是 ${a[0]}。`],
    };
  },
};
