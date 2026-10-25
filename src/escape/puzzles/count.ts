import { randInt, shuffle } from '../rng';
import type { PuzzleDef, ShapeName } from '../types';

export const ASKED: ShapeName[] = ['star', 'circle', 'triangle', 'square'];
export const SHAPE_NAME: Record<ShapeName, string> = { star: '星星', circle: '圓形', triangle: '三角形', square: '方形', heart: '愛心', diamond: '菱形' };

export const countPuzzle: PuzzleDef = {
  kind: 'count',
  name: '數一數',
  stars: 1,
  locks: ['digit'],
  desc: '散落各種圖形的方格；依指定順序數出每種圖形的數量。',
  sample: { digit: '3527' },
  fields: [],
  build(a, _f, { rng }) {
    const asked = ASKED.slice(0, a.length);
    const bag: ShapeName[] = asked.flatMap((s, i) => Array(+a[i]).fill(s));
    // 干擾圖形：不在題目裡，但要一起忽略
    bag.push(...Array(randInt(rng, 3, 6)).fill('diamond'), ...Array(randInt(rng, 2, 4)).fill('heart'));
    const cols = 7, total = cols * cols;
    const cells = shuffle([...bag, ...Array(total - bag.length).fill(null)], rng) as (ShapeName | null)[];
    return {
      card: [{ k: 'shape-order', items: asked }, { k: 'shapes', cols, cells }],
      rules: '依照上面的順序，數一數每種圖形各有幾個，數量依序就是密碼（沒有出現就是 0）。愛心和菱形不用數。',
      hints: ['數完一種就在旁邊打勾，比較不會數錯。', `${SHAPE_NAME[asked[0]]}有 ${a[0]} 個。`],
    };
  },
};
