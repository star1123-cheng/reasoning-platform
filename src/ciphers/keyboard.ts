import type { Cipher, Params } from './types';
import { A, alphaTable, subst, unsubst } from './util';

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
      hint: [
        { k: 'p', text: p.m === 'q' ? '把鍵盤由左到右、由上到下的字母，依序對應 A、B、C……：' : '對照你的鍵盤，每個字母都換成它右邊的鍵（行尾回到行首）：' },
        alphaTable(to),
      ],
    };
  },
  decrypt: (c, p) => unsubst(c, table(p)),
};
