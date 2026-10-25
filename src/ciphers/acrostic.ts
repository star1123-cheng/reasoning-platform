import type { Cipher } from './types';
import { A, levels, para, words } from './util';

const BK = 'Apple Bird Cat Door Egg Fish Gold Hat Ink Jar Key Lamp Moon Nest Owl Pen Queen Rain Star Tree Umbrella Voice Wolf Xray Yarn Zoo'.split(' ');

export const acrostic: Cipher = {
  id: 'acrostic',
  name: '藏頭密碼',
  lv: 1,
  desc: '每個詞的第一個字母才是答案。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => BK[A.indexOf(c)]).join(' ')).join('\n'),
    hint: levels([
      [para('這些詞連起來讀不通，是障眼法。每一行藏著答案的一個單字。')],
      [para(`已經有人破解了第一行：答案是「${words(s)[0] ?? ''}」。對照看看，它藏在哪裡？`)],
      [para('只看每個詞的第一個字母，由左到右連起來。')],
    ]),
  }),
  decrypt: (c) => c.split('\n').map((l) => l.trim().split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join('')).filter(Boolean).join(' '),
};
