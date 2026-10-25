import type { Cipher } from './types';
import { A, blankGrid, exampleTable, gridTable, levels, para, words } from './util';

const PT = A.replace('K', '');

export const tapcode: Cipher = {
  id: 'tapcode',
  name: '敲擊密碼 Tap Code',
  lv: 2,
  desc: '用敲幾下表示方陣的行與列（囚犯敲牆傳訊）。',
  params: [],
  encrypt: (s) => {
    const code = (c: string) => { const i = PT.indexOf(c === 'K' ? 'C' : c); return '•'.repeat(((i / 5) | 0) + 1) + ' ' + '•'.repeat((i % 5) + 1); };
    return {
      text: words(s).map((w) => [...w].map(code).join('   ')).join('  /  '),
      hint: levels([
        [para('每個字母是兩串點（敲兩次牆），每串最多 5 點；「/」分開單字。想一想：兩個 1–5 的數字可以表示什麼位置？')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, code)],
        [para('把 A 到 Z 依序填進 5×5 的方格（由左到右、由上到下；K 和 C 擠同一格），第一串點是第幾列、第二串點是第幾行。'), blankGrid()],
        [para('完整方陣：'), gridTable(PT)],
      ]),
    };
  },
  decrypt: (c) =>
    c.trim().split(/\s*\/\s*/).map((w) => w.split(/ {3}/).map((g) => { const [r, k] = g.trim().split(' '); return PT[(r.length - 1) * 5 + k.length - 1] ?? ''; }).join('')).join(' '),
};
