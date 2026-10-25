import type { Cipher } from './types';
import { A, blankGrid, exampleTable, gridTable, levels, para, words } from './util';

const P5 = A.replace('J', '');

export const polybius: Cipher = {
  id: 'polybius',
  name: '波利比奧斯方陣',
  lv: 2,
  desc: '每個字母變成「行＋列」兩位數字。',
  params: [],
  encrypt: (s) => {
    const code = (c: string) => { const i = P5.indexOf(c === 'J' ? 'I' : c); return `${((i / 5) | 0) + 1}${(i % 5) + 1}`; };
    return {
      text: words(s).map((w) => [...w].map(code).join(' ')).join('  /  '),
      hint: levels([
        [para('每兩個數字代表一個字母，而且數字只有 1 到 5。「/」分開單字。想一想：什麼東西會用兩個 1–5 的數字來表示位置？')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, code)],
        [para('把 A 到 Z 依序填進 5×5 的方格（由左到右、由上到下；I 和 J 擠同一格），前一個數字是第幾列、後一個是第幾行。'), blankGrid()],
        [para('完整方陣：'), gridTable(P5)],
      ]),
    };
  },
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((n) => P5[(+n[0] - 1) * 5 + +n[1] - 1] ?? '').join('')).join(' '),
};
