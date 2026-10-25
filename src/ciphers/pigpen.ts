import type { Cipher, HintBlock } from './types';
import { A, levels, topLetters, words } from './util';

const pig = (c: string) => ({ k: 'pig' as const, i: A.indexOf(c) });

export const pigpen: Cipher = {
  id: 'pigpen',
  name: '共濟會密碼',
  lv: 2,
  desc: '用格子與點構成的符號代換字母。',
  params: [],
  encrypt: (s) => {
    const cards: HintBlock[][] = [
      [{ k: 'p', text: '每個符號都是某個格子的一部分。仔細看：有的符號是直角的框，有的是尖尖的 V 形，有的裡面還多了一個點。' }],
      [
        { k: 'p', text: '已經有人破解了這幾個符號：' },
        { k: 'legend', items: topLetters(s).map((c) => ({ label: c, glyph: pig(c) })) },
        { k: 'p', text: '它們在格子裡的什麼位置？其他符號能不能用同樣的方法推出來？' },
      ],
      [
        { k: 'p', text: '照下面畫出四個格子，把字母從 A 開始依序填進去：第 1 個井字格由左到右、由上到下填 A–I，第 2 個（有點）填 J–R；第 1 個 X 字格依上、左、右、下填 S–V，第 2 個（有點）填 W–Z。填完後，比一比每個字母周圍的線條。' },
        { k: 'pigGrid' },
      ],
      [
        { k: 'p', text: '完整對照表：' },
        { k: 'legend', items: [...A].map((c) => ({ label: c, glyph: pig(c) })) },
      ],
    ];
    return {
      glyphs: words(s).map((w) => [...w].map(pig)),
      hint: levels(cards),
    };
  },
};
