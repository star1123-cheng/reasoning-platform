import type { Cipher } from './types';
import { cl, gridTable, letters, levels, para, square } from './util';

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
      hint: levels([
        [para('每個字母在方陣裡都有「第幾列、第幾行」兩個數字。這個密碼把數字打散又重新組合了。')],
        [para(`已經有人破解了第一個字母：原文「${t[0] ?? ''}」的列號，就是整串數字的第 1 個；行號在整串數字的正中間之後第 1 個。`)],
        [para('把密文每個字母換成「列、行」兩個數字，全部排成一長串，再從中間切成前後兩半：前半是原文各字母的列號、後半是行號，依序配對，查方陣讀出原文。')],
      ], [gridTable(g)]),
      note: '方陣關鍵字 ' + (cl(p.key) || '（無）'),
    };
  },
  decrypt(c, p) {
    const g = square(p.key), t = [...letters(c)], n = t.length;
    const q = t.flatMap((ch) => [((g.indexOf(ch) / 5) | 0) + 1, (g.indexOf(ch) % 5) + 1]);
    return Array.from({ length: n }, (_, i) => g[(q[i] - 1) * 5 + q[n + i] - 1]).join('');
  },
};
