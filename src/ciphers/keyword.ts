import type { Cipher, Params } from './types';
import { A, alphaTable, cl, subst, unsubst } from './util';

const table = (p: Params) => [...new Set(cl(p.key) + A)].join('');

export const keyword: Cipher = {
  id: 'keyword',
  name: '關鍵字代換',
  lv: 2,
  desc: '字母表以關鍵字開頭，其餘依序排列。',
  params: [{ k: 'key', l: '關鍵字', t: 'text', v: 'ZEBRAS' }],
  encrypt(s, p) {
    const to = table(p);
    return { text: subst(s, to), hint: [{ k: 'p', text: '上排字母以下排字母代替：' }, alphaTable(to)], note: '關鍵字 ' + cl(p.key) };
  },
  decrypt: (c, p) => unsubst(c, table(p)),
};
