import { shuffleChanged } from '../rng';
import type { PuzzleDef } from '../types';

const lines = (t: string) => t.split('\n').map((x) => x.trim()).filter(Boolean);

export const orderPuzzle: PuzzleDef = {
  kind: 'order',
  name: '排序題',
  stars: 1,
  locks: ['digit', 'letter'],
  desc: '打亂的項目各有代號，依正確順序排好後讀出代號。可用在時間先後、大小、步驟。',
  sample: { digit: '3142', letter: 'LOCK' },
  fields: [
    { k: 'rule', l: '排序依據（寫在卡片上）', t: 'text', v: '依一天中的時間，由早到晚' },
    { k: 'items', l: '項目（一行一個，依「正確順序」輸入）', t: 'area', v: '日出\n中午\n日落\n半夜', help: '項目數要等於答案的位數，系統會自動打亂。' },
  ],
  check(a, f) {
    const it = lines(f.items ?? '');
    if (it.length !== a.length) return `答案有 ${a.length} 位，需要 ${a.length} 個項目（目前 ${it.length} 個）`;
    if (new Set(it).size !== it.length) return '項目不可重複';
    return f.rule?.trim() ? null : '請填寫排序依據';
  },
  build(a, f, { rng }) {
    const it = lines(f.items);
    const shown = shuffleChanged(it.map((x, i) => `【${a[i]}】${x}`), rng);
    return {
      card: [{ k: 'p', text: '排序依據：' + f.rule.trim() }, { k: 'list', items: shown }],
      rules: '依照排序依據把項目排好，再依序讀出【 】裡的代號。',
      hints: ['先不要管代號，只把項目排好順序。', `排第一的是「${it[0]}」。`],
    };
  },
};
