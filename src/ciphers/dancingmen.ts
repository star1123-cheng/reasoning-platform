import type { Cipher } from './types';
import { A, words } from './util';

export const dancingmen: Cipher = {
  id: 'dancingmen',
  name: '跳舞小人',
  lv: 2,
  desc: '福爾摩斯《跳舞的人》，每個字母是一個姿勢。',
  params: [{ k: 'f', l: '單字結尾的小人手持旗子', t: 'check', v: false }],
  encrypt: (s, p) => ({
    glyphs: words(s).map((w) => [...w].map((c, i) => ({ k: 'man' as const, i: A.indexOf(c), flag: !!p.f && i === w.length - 1 }))),
    hint: [
      { k: 'p', text: (p.f ? '手持旗子的小人表示單字的結尾。' : '') + '對照下表解讀每個小人：' },
      { k: 'legend', items: [...A].map((c, i) => ({ label: c, glyph: { k: 'man' as const, i, flag: false } })) },
    ],
    note: p.f ? '有旗子' : '無旗子（適合中低年級）',
  }),
};
