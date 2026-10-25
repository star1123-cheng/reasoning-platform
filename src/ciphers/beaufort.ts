import type { Cipher, Params } from './types';
import { A, cl, levels, letters, mapLetters, mod, numberTable, para } from './util';

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
    const text = run(s, k);
    return {
      text,
      hint: levels([
        [para('這是維吉尼亞密碼的鏡像版：每個字母換成什麼，由一組輪流使用的金鑰字母決定，但算法是「減法」。')],
        [para(`已經有人破解了第一個字母：密文的「${letters(text)[0] ?? ''}」原本是「${letters(s)[0] ?? ''}」。`)],
        [para('把字母換成數字（A=0、B=1……）。密文＝金鑰字母−明文字母，不夠減就加 26。神奇的是，解密用完全一樣的算法：明文＝金鑰字母−密文字母。')],
        [para('字母編號表：'), numberTable()],
      ]),
      note: '金鑰 ' + k,
    };
  },
  // 博福特加解密相同
  decrypt: (c, p) => run(c, keyOf(p)),
};
