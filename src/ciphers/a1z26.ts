import type { Cipher } from './types';
import { A, words } from './util';

export const a1z26: Cipher = {
  id: 'a1z26',
  name: '數字密碼 A1Z26',
  lv: 1,
  desc: 'A=1、B=2……Z=26。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => A.indexOf(c) + 1).join('-')).join('  /  '),
    hint: [{ k: 'p', text: 'A=1、B=2、C=3……Z=26；「-」連接同一單字的字母，「/」是單字分隔。' }],
  }),
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split('-').map((n) => A[+n - 1] ?? '').join('')).join(' '),
};
