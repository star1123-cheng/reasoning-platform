import type { Cipher, Params } from './types';
import { A, cl, levels, letters, mapLetters, mod, numberTable, para } from './util';

const keyOf = (p: Params) => cl(p.key) || 'KEY';

export const vigenere: Cipher = {
  id: 'vigenere',
  name: '維吉尼亞密碼',
  lv: 3,
  desc: '用一組金鑰字母，逐字決定平移多少。',
  params: [{ k: 'key', l: '金鑰（英文字母）', t: 'text', v: 'KEY' }],
  encrypt(s, p) {
    const k = keyOf(p);
    const text = mapLetters(s, (i, j) => A[(i + A.indexOf(k[j % k.length])) % 26]);
    return {
      text,
      hint: levels([
        [para('這是凱撒密碼的升級版：每個字母都往後平移，但每個字母移動的格數不一樣，由一組金鑰字母輪流決定。')],
        [para(`已經有人破解了第一個字母：密文的「${letters(text)[0] ?? ''}」原本是「${letters(s)[0] ?? ''}」。它往後移了幾格？`)],
        [para('金鑰字母依序重複使用（用完再從頭開始）。把字母換成數字（A=0、B=1、C=2……），每個密文字母要往前退「對應金鑰字母的數字」那麼多格，不夠就從 Z 繼續往回數。')],
        [para('字母編號表：'), numberTable()],
      ]),
      note: '金鑰 ' + k,
    };
  },
  decrypt(c, p) {
    const k = keyOf(p);
    return mapLetters(c, (i, j) => A[mod(i - A.indexOf(k[j % k.length]))]);
  },
};
