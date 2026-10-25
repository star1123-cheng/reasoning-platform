import type { Cipher } from './types';
import { A, words } from './util';

export const pigpen: Cipher = {
  id: 'pigpen',
  name: '共濟會密碼',
  lv: 2,
  desc: '用格子與點構成的符號代換字母。',
  params: [],
  encrypt: (s) => ({
    glyphs: words(s).map((w) => [...w].map((c) => ({ k: 'pig' as const, i: A.indexOf(c) }))),
    hint: [
      { k: 'p', text: '對照符號表，找出每個符號代表的字母：' },
      { k: 'legend', items: [...A].map((c, i) => ({ label: c, glyph: { k: 'pig' as const, i } })) },
    ],
  }),
};
