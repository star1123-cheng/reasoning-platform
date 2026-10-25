import type { Cipher, Params } from './types';
import { A, alphaTable, cl, exampleTable, levels, para, subst, unsubst } from './util';

const table = (p: Params) => [...new Set(cl(p.key) + A)].join('');

export const keyword: Cipher = {
  id: 'keyword',
  name: '關鍵字代換',
  lv: 2,
  desc: '字母表以關鍵字開頭，其餘依序排列。',
  params: [{ k: 'key', l: '關鍵字', t: 'text', v: 'ZEBRAS' }],
  encrypt(s, p) {
    const to = table(p);
    const k = [...new Set(cl(p.key))].join('');
    return {
      text: subst(s, to),
      hint: levels([
        [para('每個字母都換成另一個字母。替換用的字母表不是照順序排的：開頭藏了一個英文單字（關鍵字）。')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, (c) => to[A.indexOf(c)])],
        [para(`關鍵字是「${k || '（無）'}」。把關鍵字寫在 A、B、C……的下面（重複的字母只寫一次），接著依序寫上還沒用過的字母。`)],
        [para('完整對照表：上排原文、下排密文。'), alphaTable(to)],
      ]),
      note: '關鍵字 ' + cl(p.key),
    };
  },
  decrypt: (c, p) => unsubst(c, table(p)),
};
