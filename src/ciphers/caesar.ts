import type { Cipher } from './types';
import { A, alphaTable, exampleTable, levels, mod, numOr, para, subst, unsubst } from './util';

const table = (n: number) => [...A].map((_, i) => A[(i + n) % 26]).join('');

export const caesar: Cipher = {
  id: 'caesar',
  name: '凱撒密碼',
  lv: 1,
  desc: '每個字母往後平移固定位數。',
  params: [{ k: 'n', l: '位移數', t: 'number', v: 3 }],
  encrypt(s, p) {
    const n = mod(numOr(p.n, 0)), to = table(n);
    return {
      text: subst(s, to),
      hint: levels([
        [para('每個字母都換成了字母表中另一個字母，而且所有字母移動的距離都一樣。')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, (c) => to[A.indexOf(c)]), para('從原文字母數到密文字母，往後移了幾格？')],
        [para(`每個字母都往後移 ${n} 格，超過 Z 就回到 A 繼續數。解密時往前移 ${n} 格。`)],
        [para('完整對照表：上排原文、下排密文。'), alphaTable(to)],
      ]),
      note: '位移 ' + n,
    };
  },
  decrypt: (c, p) => unsubst(c, table(mod(numOr(p.n, 0)))),
};
