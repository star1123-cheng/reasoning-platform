import type { Cipher } from './types';
import { cl, gridTable, letters, square } from './util';

export const bifid: Cipher = {
  id: 'bifid',
  name: 'Bifid 雙分密碼',
  lv: 4,
  desc: '先轉成方陣座標，再打散重組。',
  params: [{ k: 'key', l: '方陣關鍵字（可留空）', t: 'text', v: '' }],
  encrypt(s, p) {
    const g = square(p.key), t = [...letters(s).replace(/J/g, 'I')];
    const q = [...t.map((c) => ((g.indexOf(c) / 5) | 0) + 1), ...t.map((c) => (g.indexOf(c) % 5) + 1)];
    let o = '';
    for (let i = 0; i < q.length; i += 2) o += g[(q[i] - 1) * 5 + q[i + 1] - 1];
    return {
      text: o,
      hint: [
        { k: 'p', text: '密文每個字母換成「行、列」兩個數字，全部排成一長串後切成前後兩半：前半是明文各字母的行號、後半是列號，依序配對即可讀出。' },
        gridTable(g),
      ],
      note: '方陣關鍵字 ' + (cl(p.key) || '（無）'),
    };
  },
  decrypt(c, p) {
    const g = square(p.key), t = [...letters(c)], n = t.length;
    const q = t.flatMap((ch) => [((g.indexOf(ch) / 5) | 0) + 1, (g.indexOf(ch) % 5) + 1]);
    return Array.from({ length: n }, (_, i) => g[(q[i] - 1) * 5 + q[n + i] - 1]).join('');
  },
};
