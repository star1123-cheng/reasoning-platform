import type { Cipher } from './types';
import { A, gridTable, words } from './util';

const P5 = A.replace('J', '');

export const polybius: Cipher = {
  id: 'polybius',
  name: '波利比奧斯方陣',
  lv: 2,
  desc: '每個字母變成「行＋列」兩位數字。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => { const i = P5.indexOf(c === 'J' ? 'I' : c); return `${((i / 5) | 0) + 1}${(i % 5) + 1}`; }).join(' ')).join('  /  '),
    hint: [{ k: 'p', text: '前一個數字是行、後一個是列，I 與 J 共用一格；「/」代表單字分隔。' }, gridTable(P5)],
  }),
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((n) => P5[(+n[0] - 1) * 5 + +n[1] - 1] ?? '').join('')).join(' '),
};
