import type { Cipher } from './types';
import { A, alphaTable, exampleTable, levels, para, subst } from './util';

const R = [...A].reverse().join('');

export const atbash: Cipher = {
  id: 'atbash',
  name: '阿特巴希密碼',
  lv: 1,
  desc: '字母表倒過來對應：A↔Z、B↔Y……',
  params: [],
  encrypt: (s) => ({
    text: subst(s, R),
    hint: levels([
      [para('每個字母都換成另一個字母，而且換法是對稱的：A 換成某個字母，那個字母也會換回 A。')],
      [para('已經有人破解了這兩個字母：'), exampleTable(s, (c) => R[A.indexOf(c)]), para('它們在字母表裡的位置有什麼關係？一個從前面數，一個從後面數試試看。')],
      [para('把字母表正著寫一排，下面倒著寫一排（Z、Y、X……），上下對應的字母互換：A↔Z、B↔Y、C↔X……')],
      [para('完整對照表：上排與下排的字母互換。'), alphaTable(R)],
    ]),
  }),
  decrypt: (c) => subst(c, R),
};
