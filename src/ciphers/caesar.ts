import type { Cipher } from './types';
import { A, alphaTable, mod, numOr, subst, unsubst } from './util';

const table = (n: number) => [...A].map((_, i) => A[(i + n) % 26]).join('');

export const caesar: Cipher = {
  id: 'caesar',
  name: '凱撒密碼',
  lv: 1,
  desc: '每個字母往後平移固定位數。',
  params: [{ k: 'n', l: '位移數', t: 'number', v: 3 }],
  encrypt(s, p) {
    const n = mod(numOr(p.n, 0)), to = table(n);
    return { text: subst(s, to), hint: [{ k: 'p', text: '每個字母都被換成對照表下方的字母：' }, alphaTable(to)], note: '位移 ' + n };
  },
  decrypt: (c, p) => unsubst(c, table(mod(numOr(p.n, 0)))),
};
