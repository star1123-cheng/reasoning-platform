import type { Cipher } from './types';
import { cl, levels, letters, para, rows5, square } from './util';

/** 兩兩分組：同字或結尾補 X；若該字母本身是 X 則補 Q */
export const digraphs = (s: string): [string, string][] => {
  const t = s.replace(/J/g, 'I'), r: [string, string][] = [];
  for (let i = 0; i < t.length;) {
    const a = t[i], b = t[i + 1];
    if (!b || a === b) { r.push([a, a === 'X' ? 'Q' : 'X']); i++; }
    else { r.push([a, b]); i += 2; }
  }
  return r;
};

/** dir=1 加密（右、下），dir=4 解密（左、上；mod 5 下的 −1） */
const pf = (g: string, a: string, b: string, dir: number) => {
  const x = g.indexOf(a), y = g.indexOf(b), r1 = (x / 5) | 0, c1 = x % 5, r2 = (y / 5) | 0, c2 = y % 5;
  if (r1 === r2) return g[r1 * 5 + ((c1 + dir) % 5)] + g[r2 * 5 + ((c2 + dir) % 5)];
  if (c1 === c2) return g[((r1 + dir) % 5) * 5 + c1] + g[((r2 + dir) % 5) * 5 + c2];
  return g[r1 * 5 + c2] + g[r2 * 5 + c1];
};

export const playfair: Cipher = {
  id: 'playfair',
  name: 'Playfair 密碼',
  lv: 4,
  desc: '兩個字母一組，依方陣位置關係代換。',
  params: [{ k: 'key', l: '關鍵字', t: 'text', v: 'MONARCHY' }],
  encrypt(s, p) {
    const g = square(p.key), d = digraphs(letters(s));
    return {
      text: d.map(([a, b]) => pf(g, a, b, 1)).join(' '),
      hint: levels([
        [para('密文兩個字母一組，一組一組解。每組的兩個字母，都要在方陣裡找出位置，看它們的位置關係。')],
        [para(`已經有人破解了第一組：密文「${pf(g, d[0][0], d[0][1], 1)}」原本是「${d[0].join('')}」。在方陣裡圈出這四個字母，看看它們的位置。`)],
        [para('解密規則：兩字在同一列→各取左邊一格（最左邊回到最右邊）；在同一行→各取上面一格；都不同→各取「自己這一列、對方那一行」的字母（四個字母剛好是長方形的四個角）。I/J 同格；解出後拿掉夾在相同字母之間或結尾的 X（XX 之間用 Q）。')],
      ], [para('方陣（解題材料）：'), { k: 'table', rows: rows5(g) }]),
      note: '關鍵字 ' + cl(p.key) + '；明文分組：' + d.map((x) => x.join('')).join(' '),
    };
  },
  /** 回傳含補位字母的明文分組（不自動去掉 X） */
  decrypt(c, p) {
    const g = square(p.key), t = letters(c);
    return (t.match(/.{2}/g) || []).map((x) => pf(g, x[0], x[1], 4)).join('');
  },
};
