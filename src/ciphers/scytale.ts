import type { Cipher, Params } from './types';
import { letters, levels, para } from './util';

const perTurn = (p: Params) => Math.min(12, Math.max(2, Number(p.c) || 4));

export const scytale: Cipher = {
  id: 'scytale',
  name: '木棒密碼',
  lv: 2,
  desc: '把文字繞在木棒上，換個方向讀。',
  params: [{ k: 'c', l: '每圈字數（2–12）', t: 'number', v: 4 }],
  encrypt(s, p) {
    const c = perTurn(p);
    let t = letters(s);
    while (t.length % c) t += 'X';
    const r = t.length / c;
    let o = '';
    for (let k = 0; k < c; k++) for (let j = 0; j < r; j++) o += t[j * c + k];
    return {
      text: o,
      hint: levels([
        [para('字母本身沒有被換掉，只是順序被打亂了。想像把一條長紙條一圈一圈纏在木棒上寫字，拆下來後字母就分散了。')],
        [para(`密文共 ${t.length} 個字母。原句的第 1 個字母是密文的第 1 個，原句的第 2 個字母是密文的第 ${r + 1} 個。`)],
        [para(`把密文每 ${r} 個字母一組，由上往下寫成一直行，寫滿一行就換到右邊下一行，最後一列一列橫著讀。結尾的 X 是補位字母。`)],
        [para('格子圖：先由上往下填第一直行，再填第二直行……，最後由左到右橫著讀。'), { k: 'table', rows: Array.from({ length: r }, () => Array(c).fill('□')) }],
      ]),
      note: `每圈 ${c} 字，補 X 至 ${t.length} 字`,
    };
  },
  decrypt(cx, p) {
    const c = perTurn(p), o = letters(cx), r = o.length / c;
    let t = '';
    for (let j = 0; j < r; j++) for (let k = 0; k < c; k++) t += o[k * r + j];
    return t;
  },
};
