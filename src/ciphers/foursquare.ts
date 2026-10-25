import type { Cell, Cipher } from './types';
import { cl, letters, rows5, square } from './util';

const at = (g: string, r: number, c: number) => g[r * 5 + c];
const rc = (g: string, ch: string) => { const i = g.indexOf(ch); return [(i / 5) | 0, i % 5] as const; };

export const foursquare: Cipher = {
  id: 'foursquare',
  name: '四方密碼 Four-Square',
  lv: 4,
  desc: '兩個標準方陣加兩個關鍵字方陣。',
  params: [
    { k: 'k1', l: '關鍵字一（右上）', t: 'text', v: 'EXAMPLE' },
    { k: 'k2', l: '關鍵字二（左下）', t: 'text', v: 'KEYWORD' },
  ],
  encrypt(s, p) {
    const g = square(''), g1 = square(p.k1), g2 = square(p.k2);
    const pr = (letters(s).replace(/J/g, 'I').match(/.{1,2}/g) || []).map((x) => x.padEnd(2, 'X'));
    const top = rows5(g).map((r, i): Cell[] => [...r, '', ...rows5(g1)[i]]);
    const bot = rows5(g2).map((r, i): Cell[] => [...r, '', ...rows5(g)[i]]);
    return {
      text: pr.map(([a, b]) => { const [ra, ca] = rc(g, a), [rb, cb] = rc(g, b); return at(g1, ra, cb) + at(g2, rb, ca); }).join(' '),
      hint: [
        { k: 'p', text: '明文兩兩一組：第一字在左上、第二字在右下的標準方陣找位置；密文第一字取右上方陣「第一字的行、第二字的列」，第二字取左下方陣「第二字的行、第一字的列」。解密則反過來。' },
        { k: 'table', rows: [...top, Array(11).fill(''), ...bot] },
      ],
      note: `關鍵字 ${cl(p.k1)} / ${cl(p.k2)}；明文分組：${pr.join(' ')}`,
    };
  },
  decrypt(c, p) {
    const g = square(''), g1 = square(p.k1), g2 = square(p.k2);
    return (letters(c).match(/.{2}/g) || []).map(([x, y]) => { const [r1, c1] = rc(g1, x), [r2, c2] = rc(g2, y); return at(g, r1, c2) + at(g, r2, c1); }).join('');
  },
};
