import type { Cipher } from './types';
import { A, alphaTable, subst } from './util';

const R = [...A].reverse().join('');

export const atbash: Cipher = {
  id: 'atbash',
  name: '阿特巴希密碼',
  lv: 1,
  desc: '字母表倒過來對應：A↔Z、B↔Y……',
  params: [],
  encrypt: (s) => ({ text: subst(s, R), hint: [{ k: 'p', text: '上排與下排的字母互換：' }, alphaTable(R)] }),
  decrypt: (c) => subst(c, R),
};
