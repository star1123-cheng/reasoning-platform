import type { Cipher } from './types';
import { A, pick, words } from './util';

export const interleave: Cipher = {
  id: 'interleave',
  name: '交錯干擾碼',
  lv: 1,
  desc: '每個字母後面藏一個多餘字母。',
  params: [],
  encrypt: (s, _p, rng = Math.random) => ({
    text: words(s).map((w) => [...w].map((c) => c + A[pick(rng, 26)]).join('')).join(' '),
    hint: [{ k: 'p', text: '每個單字只看第 1、3、5……個字母，其餘都是干擾。' }],
  }),
  decrypt: (c) => words(c).map((w) => [...w].filter((_, i) => i % 2 === 0).join('')).join(' '),
};
