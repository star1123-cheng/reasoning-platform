import type { Cipher, Params } from './types';
import { cl, colDecrypt, colEncrypt, letters } from './util';

const keyOf = (p: Params) => cl(p.key) || 'ZEBRA';

export const columnar: Cipher = {
  id: 'columnar',
  name: '欄位換位密碼',
  lv: 3,
  desc: '依金鑰字母順序，一欄一欄讀出。',
  params: [{ k: 'key', l: '金鑰（英文字母）', t: 'text', v: 'ZEBRA' }],
  encrypt(s, p) {
    const k = keyOf(p);
    let t = letters(s);
    while (t.length % k.length) t += 'X';
    return {
      text: colEncrypt(t, k),
      hint: [{ k: 'p', text: `金鑰：${k}。把密文依金鑰字母的字母順序（A→Z，相同字母由左到右）填進各欄，每欄 ${t.length / k.length} 個字母，再依金鑰原本由左到右逐列讀出。結尾的 X 是補位。` }],
      note: '金鑰 ' + k,
    };
  },
  decrypt: (c, p) => colDecrypt(letters(c), keyOf(p)),
};
