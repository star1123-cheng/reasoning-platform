import type { Cipher } from './types';
import { A, alphaTable, words } from './util';

export const GOLDBUG = '5 2 - † 8 1 3 4 6 ¶ ( 0 9 * ‡ . ¿ ) ; ? ¢ ] [ ‖ : §'.split(' ');

export const goldbug: Cipher = {
  id: 'goldbug',
  name: '黃金蟲密碼',
  lv: 2,
  desc: '愛倫坡《金甲蟲》式的符號代換。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => GOLDBUG[A.indexOf(c)]).join(' ')).join('    '),
    hint: [{ k: 'p', text: '每個符號對應一個字母，單字之間空比較寬：' }, alphaTable(GOLDBUG)],
  }),
  decrypt: (c) => c.trim().split(/ {2,}/).map((w) => w.split(' ').map((x) => A[GOLDBUG.indexOf(x)] ?? '').join('')).join(' '),
};
