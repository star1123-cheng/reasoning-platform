import type { Cell, Cipher } from './types';
import { cl, levels, letters, para, rows5, square } from './util';

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
    const enc = ([a, b]: string) => { const [ra, ca] = rc(g, a), [rb, cb] = rc(g, b); return at(g1, ra, cb) + at(g2, rb, ca); };
    return {
      text: pr.map(enc).join(' '),
      hint: levels([
        [para('密文兩個字母一組。四個方陣中，左上和右下是照字母順序排的普通方陣，右上和左下是打亂的方陣；密文字母都在打亂的方陣裡。')],
        [para(`已經有人破解了第一組：密文「${enc(pr[0])}」原本是「${pr[0]}」。在四個方陣裡圈出這四個字母，看看它們的位置。`)],
        [para('解密：第一個密文字母在右上方陣找，第二個在左下方陣找；兩個字母畫出長方形，另外兩個角落在左上與右下的普通方陣裡——左上的是原文第一字，右下的是原文第二字。')],
      ], [para('四個方陣（解題材料）：'), { k: 'table', rows: [...top, Array(11).fill(''), ...bot] }]),
      note: `關鍵字 ${cl(p.k1)} / ${cl(p.k2)}；明文分組：${pr.join(' ')}`,
    };
  },
  decrypt(c, p) {
    const g = square(''), g1 = square(p.k1), g2 = square(p.k2);
    return (letters(c).match(/.{2}/g) || []).map(([x, y]) => { const [r1, c1] = rc(g1, x), [r2, c2] = rc(g2, y); return at(g, r1, c2) + at(g, r2, c1); }).join('');
  },
};
