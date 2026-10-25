import type { Cipher } from './types';
import { words } from './util';

const KP = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];

export const phone: Cipher = {
  id: 'phone',
  name: '手機九宮格',
  lv: 1,
  desc: '數字按幾次，就是該鍵上第幾個字母。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => { const k = KP.findIndex((x) => x.includes(c)); return String(k + 2).repeat(KP[k].indexOf(c) + 1); }).join(' ')).join(' / '),
    hint: [
      { k: 'p', text: '數字重複幾次，就取該鍵上第幾個字母；空格分隔字母，「/」分隔單字。' },
      { k: 'table', rows: KP.map((x, i) => [i + 2, x]) },
    ],
  }),
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((g) => KP[+g[0] - 2]?.[g.length - 1] ?? '').join('')).join(' '),
};
