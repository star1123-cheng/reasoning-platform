import type { Cipher, Params } from './types';
import { letters } from './util';

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
      hint: [{ k: 'p', text: `每 ${r} 個字母排成一直行，由上往下填滿一行後換下一行，最後橫著讀。結尾的 X 是補位字母。` }],
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
