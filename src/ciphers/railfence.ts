import type { Cipher, Params } from './types';
import { letters, levels, para } from './util';

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
      hint: levels([
        [para('字母本身沒有被換掉，只是順序被打亂了。試著把密文排成好幾排。')],
        [para(`密文共 ${t.length} 個字母，原本排成 ${n} 排。密文的第一個字母，就是原句的第一個字母。`)],
        [para(`原句寫的時候是沿著斜線「往下、往上、往下……」在 ${n} 排之間來回寫；加密時再一排一排讀出來。所以解密時，要先算出每一排有幾個字母，依序填回去。`)],
        [para('格子圖：□ 是要填字母的位置。先把密文由左到右填滿第一排，再填第二排……，最後沿著斜線讀回原句。'), { k: 'table', rows: grid }],
      ]),
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
