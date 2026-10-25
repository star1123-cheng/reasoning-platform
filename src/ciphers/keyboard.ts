import type { Cipher, Params } from './types';
import { A, alphaTable, exampleTable, levels, para, subst, unsubst } from './util';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const QWE = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const RIGHT = [...A].map((c) => { const r = ROWS.find((x) => x.includes(c))!; return r[(r.indexOf(c) + 1) % r.length]; }).join('');
const table = (p: Params) => (p.m === 'q' ? QWE : RIGHT);

export const keyboard: Cipher = {
  id: 'keyboard',
  name: '鍵盤密碼',
  lv: 1,
  desc: '把字母換成鍵盤上相鄰的鍵，或依鍵盤順序重新編號。',
  params: [{ k: 'm', l: '類型', t: 'select', o: [['r', '右移一格'], ['q', 'QWE（依鍵盤順序）']], v: 'r' }],
  encrypt(s, p) {
    const to = table(p);
    return {
      text: subst(s, to),
      hint: levels([
        [para('這個密碼和電腦鍵盤有關，準備一個鍵盤（或鍵盤的圖）來對照。')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, (c) => to[A.indexOf(c)]), para('在鍵盤上找找這幾個鍵，它們的位置有什麼關係？')],
        [para(p.m === 'q'
          ? '鍵盤字母由左到右、由上到下是 Q W E R T Y……，依序代表 A B C D E F……。'
          : '每個字母都換成鍵盤上它右邊的那個鍵；一排最右邊的鍵回到同一排最左邊（P→Q、L→A、M→Z）。解密時往左找。')],
        [para('完整對照表：上排原文、下排密文。'), alphaTable(to)],
      ]),
    };
  },
  decrypt: (c, p) => unsubst(c, table(p)),
};
