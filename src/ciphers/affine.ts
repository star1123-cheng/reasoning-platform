import type { Cipher, Params } from './types';
import { A, alphaTable, exampleTable, levels, mod, numOr, para, subst, unsubst } from './util';

const COPRIME = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
const ab = (p: Params) => {
  const a = Number(p.a);
  return { a: COPRIME.includes(a) ? a : 5, b: mod(numOr(p.b, 0)) };
};
const table = (a: number, b: number) => [...A].map((_, i) => A[(a * i + b) % 26]).join('');

export const affine: Cipher = {
  id: 'affine',
  name: '仿射密碼',
  lv: 3,
  desc: '用公式 (a×字母編號＋b) 代換。',
  params: [
    { k: 'a', l: 'a（需與 26 互質）', t: 'select', o: COPRIME.map((x) => [x, String(x)]), v: 5 },
    { k: 'b', l: 'b', t: 'number', v: 8 },
  ],
  encrypt(s, p) {
    const { a, b } = ab(p), to = table(a, b);
    return {
      text: subst(s, to),
      hint: levels([
        [para('每個字母都換成另一個字母，換法由一條數學公式決定：先把字母換成數字，乘一個數，再加一個數。')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, (c) => to[A.indexOf(c)])],
        [para(`加密公式：密文編號＝(${a}×原文編號＋${b}) 除以 26 的餘數，A=0、B=1……Z=25。試著把 A 到 Z 都算一遍，做出對照表。`)],
        [para('完整對照表：上排原文、下排密文。'), alphaTable(to)],
      ]),
      note: `a=${a}，b=${b}`,
    };
  },
  decrypt(c, p) {
    const { a, b } = ab(p);
    return unsubst(c, table(a, b));
  },
};
