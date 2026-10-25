import type { Cipher } from './types';
import { A, levels, para, pick, words } from './util';

export const interleave: Cipher = {
  id: 'interleave',
  name: '交錯干擾碼',
  lv: 1,
  desc: '每個字母後面藏一個多餘字母。',
  params: [],
  encrypt: (s, _p, rng = Math.random) => {
    const text = words(s).map((w) => [...w].map((c) => c + A[pick(rng, 26)]).join('')).join(' ');
    const w0 = words(s)[0] ?? '', c0 = words(text)[0] ?? '';
    return {
      text,
      hint: levels([
        [para('每個單字都比原本長了一倍：真正的字母之間，混進了沒有意義的干擾字母。')],
        [para(`已經有人破解了第一個單字：「${c0}」其實是「${w0}」。哪些字母是真的、哪些是干擾？`)],
        [para('每個單字只看第 1、3、5……個字母（單數位置），第 2、4、6……個字母都是干擾。')],
      ]),
    };
  },
  decrypt: (c) => words(c).map((w) => [...w].filter((_, i) => i % 2 === 0).join('')).join(' '),
};
