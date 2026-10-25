import type { Cipher } from './types';
import { A, cl, exampleTable, levels, para, words } from './util';

const ba = (c: string) => A.indexOf(c).toString(2).padStart(5, '0').replace(/0/g, 'A').replace(/1/g, 'B');
const fromBits = (b: string) => A[parseInt(b.replace(/A/g, '0').replace(/B/g, '1'), 2)] ?? '';

export const bacon: Cipher = {
  id: 'bacon',
  name: '培根密碼',
  lv: 2,
  desc: '每個字母變成 5 個 A/B，可藏在大小寫裡。',
  params: [
    { k: 'm', l: '呈現方式', t: 'select', o: [['ab', 'A/B 字串'], ['c', '大小寫偽裝']], v: 'ab' },
    { k: 'c', l: '偽裝用文字（大小寫模式）', t: 'text', v: 'the quick brown fox jumps over the lazy dog' },
  ],
  encrypt(s, p) {
    const b = words(s).map((w) => [...w].map(ba));
    let text: string;
    if (p.m === 'c') {
      const cv = cl(p.c).toLowerCase() || 'abcdefghij', q = b.flat().join('');
      text = [...q].map((x, i) => (x === 'B' ? cv[i % cv.length].toUpperCase() : cv[i % cv.length])).join('');
    } else text = b.map((x) => x.join(' ')).join(' / ');
    return {
      text,
      hint: levels([
        [para(p.m === 'c'
          ? '這句話的意思不重要，重要的是字母的大小寫。每 5 個字母一組代表一個答案字母。'
          : '每 5 個 A/B 是一個字母，「/」分開單字。')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, ba), para(p.m === 'c' ? '大寫是 A 還是 B？小寫呢？' : 'AAAAA 會是哪個字母？')],
        [para((p.m === 'c' ? '小寫＝A、大寫＝B。' : '') + '依字母順序排：AAAAA = A、AAAAB = B、AAABA = C、AAABB = D……就像只用 A、B 兩種符號來數數。')],
        [para('完整對照表：'), { k: 'legend', items: [...A].map((c) => ({ label: c, sub: ba(c) })) }],
      ]),
      note: p.m === 'c' ? '偽裝文字不夠長時會重複使用' : undefined,
    };
  },
  decrypt(c, p) {
    if (p.m === 'c') {
      const bits = [...c.replace(/[^A-Za-z]/g, '')].map((x) => (x === x.toUpperCase() ? 'B' : 'A')).join('');
      return (bits.match(/.{5}/g) || []).map(fromBits).join('');
    }
    return c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map(fromBits).join('')).join(' ');
  },
};
