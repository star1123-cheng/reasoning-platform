import type { Cell, Cipher, Params } from './types';
import { cl, colDecrypt, colEncrypt, letters, levels, para } from './util';

const G6 = 'NA1C3H8TB2OME5WRPD4F6G7I9J0KLQSUVXYZ';
const AD = 'ADFGVX';
const keyOf = (p: Params) => cl(p.key) || 'CARGO';

export const adfgvx: Cipher = {
  id: 'adfgvx',
  name: 'ADFGVX 密碼',
  lv: 5,
  desc: '一戰德軍密碼：方陣代換後再欄位換位。',
  params: [{ k: 'key', l: '換位金鑰', t: 'text', v: 'CARGO' }],
  encrypt(s, p) {
    const k = keyOf(p);
    const m = [...letters(s)].map((c) => { const i = G6.indexOf(c); return AD[(i / 6) | 0] + AD[i % 6]; }).join('');
    return {
      text: colEncrypt(m, k).replace(/(.{5})/g, '$1 ').trim(),
      hint: levels([
        [para('密文只有 A、D、F、G、V、X 六種字母。加密分兩步：先用方陣把每個字母換成兩個符號，再把所有符號的順序打亂。解密要倒過來做。')],
        [para(`已經有人破解了一個字母：原文第一個字母「${letters(s)[0] ?? ''}」在方陣裡是「${m.slice(0, 2)}」。另外，金鑰是「${k}」，共 ${m.length} 個符號。`)],
        [para(`解密：依金鑰字母順序（A→Z，相同字母由左到右）把密文分到 ${k.length} 欄（金鑰由左到右的前幾欄可能多一格），一列一列讀出，再兩個符號一組查方陣（先找列、再找行）。`)],
      ], [para('方陣（解題材料）：'), { k: 'table', rows: [[' ', ...AD], ...[0, 1, 2, 3, 4, 5].map((r): Cell[] => [AD[r], ...G6.slice(r * 6, r * 6 + 6)])] }]),
      note: '金鑰 ' + k,
    };
  },
  decrypt(c, p) {
    const m = colDecrypt(c.replace(/[^ADFGVX]/g, ''), keyOf(p));
    return (m.match(/.{2}/g) || []).map((x) => G6[AD.indexOf(x[0]) * 6 + AD.indexOf(x[1])]).join('');
  },
};
