import type { Cipher } from './types';
import { A, exampleTable, levels, para, words } from './util';

export const MORSE = '.- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..'.split(' ');

export const morse: Cipher = {
  id: 'morse',
  name: '摩斯密碼',
  lv: 1,
  desc: '用長短訊號表示字母。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => MORSE[A.indexOf(c)]).join(' ')).join(' / '),
    hint: levels([
      [para('「.」是短音，「-」是長音；空格分開字母，「/」分開單字。每一組點和線代表一個字母。')],
      [para('已經有人破解了這兩個字母：'), exampleTable(s, (c) => MORSE[A.indexOf(c)])],
      [
        para('越常用的字母，點線越短。只有一兩個訊號的字母如下，其他字母都是三、四個訊號：'),
        { k: 'legend', items: [...'ETIANM'].map((c) => ({ label: c, sub: MORSE[A.indexOf(c)] })) },
      ],
      [para('完整對照表：'), { k: 'legend', items: [...A].map((c, i) => ({ label: c, sub: MORSE[i] })) }],
    ]),
  }),
  decrypt: (c) =>
    c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((m) => A[MORSE.indexOf(m)] ?? '').join('')).join(' '),
};
