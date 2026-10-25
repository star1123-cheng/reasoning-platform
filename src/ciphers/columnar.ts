import type { Cipher, Params } from './types';
import { cl, colDecrypt, colEncrypt, keyOrder, letters, levels, para } from './util';

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
    const order: number[] = [];
    keyOrder(k).forEach((col, n) => { order[col] = n + 1; });
    return {
      text: colEncrypt(t, k),
      hint: levels([
        [para('字母本身沒有被換掉，只是順序被打亂了。原句被一列一列寫進表格，再一欄一欄讀出來。')],
        [para(`金鑰是「${k}」，有 ${k.length} 個字母，所以表格有 ${k.length} 欄，每欄 ${t.length / k.length} 個字母。`)],
        [para(`把密文每 ${t.length / k.length} 個字母切成一段。金鑰字母依 A→Z 排出順序（相同字母由左到右），第 1 段填進排第 1 的那欄，第 2 段填進排第 2 的那欄……，最後由左到右一列一列讀出。結尾的 X 是補位。`)],
        [para('格子圖：第二列的數字是填入順序。'), { k: 'table', rows: [[...k], order, ...Array.from({ length: t.length / k.length }, () => Array(k.length).fill('□'))] }],
      ]),
      note: '金鑰 ' + k,
    };
  },
  decrypt: (c, p) => colDecrypt(letters(c), keyOf(p)),
};
