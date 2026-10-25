import type { Cipher } from './types';
import { A, gridTable, words } from './util';

const PT = A.replace('K', '');

export const tapcode: Cipher = {
  id: 'tapcode',
  name: '敲擊密碼 Tap Code',
  lv: 2,
  desc: '用敲幾下表示方陣的行與列（囚犯敲牆傳訊）。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => { const i = PT.indexOf(c === 'K' ? 'C' : c); return '•'.repeat(((i / 5) | 0) + 1) + ' ' + '•'.repeat((i % 5) + 1); }).join('   ')).join('  /  '),
    hint: [{ k: 'p', text: '每組兩串點：第一串是行、第二串是列，K 與 C 共用一格；「/」分隔單字。' }, gridTable(PT)],
  }),
  decrypt: (c) =>
    c.trim().split(/\s*\/\s*/).map((w) => w.split(/ {3}/).map((g) => { const [r, k] = g.trim().split(' '); return PT[(r.length - 1) * 5 + k.length - 1] ?? ''; }).join('')).join(' '),
};
