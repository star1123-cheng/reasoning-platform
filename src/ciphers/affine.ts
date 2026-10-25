import type { Cipher, Params } from './types';
import { A, alphaTable, mod, numOr, subst, unsubst } from './util';

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
      hint: [{ k: 'p', text: `加密公式：E(x)=(${a}x+${b}) mod 26，A=0、B=1……。可只給公式提高難度，或附對照表：` }, alphaTable(to)],
      note: `a=${a}，b=${b}`,
    };
  },
  decrypt(c, p) {
    const { a, b } = ab(p);
    return unsubst(c, table(a, b));
  },
};
