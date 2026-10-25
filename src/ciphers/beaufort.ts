import type { Cipher, Params } from './types';
import { A, cl, mapLetters, mod } from './util';

const keyOf = (p: Params) => cl(p.key) || 'KEY';
const run = (s: string, k: string) => mapLetters(s, (i, j) => A[mod(A.indexOf(k[j % k.length]) - i)]);

export const beaufort: Cipher = {
  id: 'beaufort',
  name: '博福特密碼',
  lv: 3,
  desc: '維吉尼亞的鏡像版：金鑰字母減明文字母。',
  params: [{ k: 'key', l: '金鑰（英文字母）', t: 'text', v: 'KEY' }],
  encrypt(s, p) {
    const k = keyOf(p);
    return {
      text: run(s, k),
      hint: [{ k: 'p', text: 'A=0、B=1……；密文＝金鑰字母−明文字母（不足加 26）。解密用完全相同的算法。' }],
      note: '金鑰 ' + k,
    };
  },
  // 博福特加解密相同
  decrypt: (c, p) => run(c, keyOf(p)),
};
