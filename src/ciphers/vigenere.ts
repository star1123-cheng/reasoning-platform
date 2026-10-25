import type { Cipher, Params } from './types';
import { A, cl, mapLetters, mod } from './util';

const keyOf = (p: Params) => cl(p.key) || 'KEY';

export const vigenere: Cipher = {
  id: 'vigenere',
  name: '維吉尼亞密碼',
  lv: 3,
  desc: '用一組金鑰字母，逐字決定平移多少。',
  params: [{ k: 'key', l: '金鑰（英文字母）', t: 'text', v: 'KEY' }],
  encrypt(s, p) {
    const k = keyOf(p);
    return {
      text: mapLetters(s, (i, j) => A[(i + A.indexOf(k[j % k.length])) % 26]),
      hint: [{ k: 'p', text: '金鑰字母依序重複使用；A=0、B=1、C=2……，每個密文字母要往回退金鑰字母對應的格數。' }],
      note: '金鑰 ' + k,
    };
  },
  decrypt(c, p) {
    const k = keyOf(p);
    return mapLetters(c, (i, j) => A[mod(i - A.indexOf(k[j % k.length]))]);
  },
};
