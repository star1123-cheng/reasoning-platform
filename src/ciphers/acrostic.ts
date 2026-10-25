import type { Cipher } from './types';
import { A, words } from './util';

const BK = 'Apple Bird Cat Door Egg Fish Gold Hat Ink Jar Key Lamp Moon Nest Owl Pen Queen Rain Star Tree Umbrella Voice Wolf Xray Yarn Zoo'.split(' ');

export const acrostic: Cipher = {
  id: 'acrostic',
  name: '藏頭密碼',
  lv: 1,
  desc: '每個詞的第一個字母才是答案。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => BK[A.indexOf(c)]).join(' ')).join('\n'),
    hint: [{ k: 'p', text: '每一行是一個單字；只看每個詞的第一個字母，其餘是障眼法。' }],
  }),
  decrypt: (c) => c.split('\n').map((l) => l.trim().split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join('')).filter(Boolean).join(' '),
};
