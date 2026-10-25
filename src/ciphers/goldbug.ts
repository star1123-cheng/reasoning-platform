import type { Cipher } from './types';
import { A, alphaTable, exampleTable, levels, para, words } from './util';

export const GOLDBUG = '5 2 - † 8 1 3 4 6 ¶ ( 0 9 * ‡ . ¿ ) ; ? ¢ ] [ ‖ : §'.split(' ');

export const goldbug: Cipher = {
  id: 'goldbug',
  name: '黃金蟲密碼',
  lv: 2,
  desc: '愛倫坡《金甲蟲》式的符號代換。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => GOLDBUG[A.indexOf(c)]).join(' ')).join('    '),
    hint: levels([
      [para('每個符號代表一個字母，同樣的符號就是同一個字母；單字之間的空白比較寬。')],
      [para('已經有人破解了這兩個符號：'), exampleTable(s, (c) => GOLDBUG[A.indexOf(c)]), para('把它們填進謎題，看看哪些短單字（例如 THE、IS）有可能出現。')],
      [
        para('《金甲蟲》主角的方法：先數每個符號出現幾次，最多的很可能是 E，其次是 T、A、O。下面是 A 到 M 的符號：'),
        { k: 'table', rows: [[...A.slice(0, 13)], GOLDBUG.slice(0, 13)] },
      ],
      [para('完整對照表：上排字母、下排符號。'), alphaTable(GOLDBUG)],
    ]),
  }),
  decrypt: (c) => c.trim().split(/ {2,}/).map((w) => w.split(' ').map((x) => A[GOLDBUG.indexOf(x)] ?? '').join('')).join(' '),
};
