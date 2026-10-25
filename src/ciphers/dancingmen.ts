import type { Cipher } from './types';
import { A, levels, para, topLetters, words } from './util';

const man = (c: string) => ({ k: 'man' as const, i: A.indexOf(c), flag: false });

export const dancingmen: Cipher = {
  id: 'dancingmen',
  name: '跳舞小人',
  lv: 2,
  desc: '福爾摩斯《跳舞的人》，每個字母是一個姿勢。',
  params: [{ k: 'f', l: '單字結尾的小人手持旗子', t: 'check', v: false }],
  encrypt: (s, p) => ({
    glyphs: words(s).map((w) => [...w].map((c, i) => ({ k: 'man' as const, i: A.indexOf(c), flag: !!p.f && i === w.length - 1 }))),
    hint: levels([
      [para('每個小人代表一個字母，姿勢一樣就是同一個字母。' + (p.f ? '手上拿旗子的小人，是一個單字的最後一個字母。' : '每一小段是一個單字。'))],
      [
        para('已經有人破解了這兩個小人：'),
        { k: 'legend', items: topLetters(s).map((c) => ({ label: c, glyph: man(c) })) },
        para('把它們填進謎題，看看哪些短單字（例如 THE、IS）有可能出現。'),
      ],
      [
        para('福爾摩斯的方法：英文最常出現的字母是 E，其次是 T、A、O。下面是 A 到 M 的小人：'),
        { k: 'legend', items: [...A.slice(0, 13)].map((c) => ({ label: c, glyph: man(c) })) },
      ],
      [para('完整對照表：'), { k: 'legend', items: [...A].map((c) => ({ label: c, glyph: man(c) })) }],
    ]),
    note: p.f ? '有旗子' : '無旗子（適合中低年級）',
  }),
};
