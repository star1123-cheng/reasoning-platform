import type { Cipher } from './types';
import { A, words } from './util';

export const MORSE = '.- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..'.split(' ');

export const morse: Cipher = {
  id: 'morse',
  name: '摩斯密碼',
  lv: 1,
  desc: '用長短訊號表示字母。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => MORSE[A.indexOf(c)]).join(' ')).join(' / '),
    hint: [
      { k: 'p', text: '「.」是短音，「-」是長音，「/」是單字分隔。' },
      { k: 'legend', items: [...A].map((c, i) => ({ label: c, sub: MORSE[i] })) },
    ],
  }),
  decrypt: (c) =>
    c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((m) => A[MORSE.indexOf(m)] ?? '').join('')).join(' '),
};
