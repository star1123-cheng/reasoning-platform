import type { Cipher } from './types';
import { A, exampleTable, levels, para, words } from './util';

export const a1z26: Cipher = {
  id: 'a1z26',
  name: '數字密碼 A1Z26',
  lv: 1,
  desc: 'A=1、B=2……Z=26。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => A.indexOf(c) + 1).join('-')).join('  /  '),
    hint: levels([
      [para('每個數字代表一個字母，數字都在 1 到 26 之間；「-」連接同一個單字的字母，「/」分開單字。')],
      [para('已經有人破解了這兩個數字：'), exampleTable(s, (c) => A.indexOf(c) + 1), para('英文字母一共有幾個？這些字母排第幾個？')],
      [para('依字母順序編號：A=1、B=2、C=3……Z=26。')],
      [para('完整對照表：'), { k: 'legend', items: [...A].map((c, i) => ({ label: c, sub: '=' + (i + 1) })) }],
    ]),
  }),
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split('-').map((n) => A[+n - 1] ?? '').join('')).join(' '),
};
