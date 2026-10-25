import type { Cipher, Params } from './types';
import { letters } from './util';

const rowsOf = (p: Params) => Math.min(6, Math.max(2, Number(p.n) || 3));

/** 每個位置落在第幾排（上下上下） */
const pattern = (len: number, n: number) => {
  const out: number[] = [];
  let r = 0, d = 1;
  for (let i = 0; i < len; i++) {
    out.push(r);
    if (r === 0) d = 1;
    else if (r === n - 1) d = -1;
    r += d;
  }
  return out;
};

export const railfence: Cipher = {
  id: 'railfence',
  name: '柵欄密碼',
  lv: 2,
  desc: '字母以上下斜線排進幾排，再逐排讀出。',
  params: [{ k: 'n', l: '排數（2–6）', t: 'number', v: 3 }],
  encrypt(s, p) {
    const n = rowsOf(p), t = letters(s), pat = pattern(t.length, n);
    const text = Array.from({ length: n }, (_, r) => [...t].filter((_, i) => pat[i] === r).join('')).join('');
    const grid = Array.from({ length: n }, (_, r) => pat.map((x) => (x === r ? '□' : '')));
    return {
      text,
      hint: [
        { k: 'p', text: `密文共 ${t.length} 個字母。依「上下上下」的斜線填入 ${n} 排（□ 是要填字母的格子，先填第一排再填第二排……），再沿著斜線讀回原句。` },
        { k: 'table', rows: grid },
      ],
      note: n + ' 排',
    };
  },
  decrypt(c, p) {
    const n = rowsOf(p), t = letters(c), pat = pattern(t.length, n), out: string[] = [];
    let k = 0;
    for (let r = 0; r < n; r++) pat.forEach((x, i) => { if (x === r) out[i] = t[k++]; });
    return out.join('');
  },
};
