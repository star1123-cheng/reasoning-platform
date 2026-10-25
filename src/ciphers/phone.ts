import type { Cipher } from './types';
import { exampleTable, levels, para, words } from './util';

const KP = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];

export const phone: Cipher = {
  id: 'phone',
  name: '手機九宮格',
  lv: 1,
  desc: '數字按幾次，就是該鍵上第幾個字母。',
  params: [],
  encrypt: (s) => {
    const code = (c: string) => { const k = KP.findIndex((x) => x.includes(c)); return String(k + 2).repeat(KP[k].indexOf(c) + 1); };
    return {
      text: words(s).map((w) => [...w].map(code).join(' ')).join(' / '),
      hint: levels([
        [para('看看舊式手機（或電話）的數字鍵：2 到 9 的按鍵上，還印著英文字母。空格分開字母，「/」分開單字。')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, code), para('數字是哪個鍵？數字重複了幾次？')],
        [para('數字代表按鍵，重複幾次就是鍵上第幾個字母。例如 2 = A、22 = B、222 = C。')],
        [para('完整按鍵表：'), { k: 'table', rows: KP.map((x, i) => [i + 2, x]) }],
      ]),
    };
  },
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((g) => KP[+g[0] - 2]?.[g.length - 1] ?? '').join('')).join(' '),
};
