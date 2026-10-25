import type { Cipher, Params } from './types';
import { levels, para, pick, words } from './util';

/** 原創短文：A–Z 每個字母都至少有一個單字開頭 */
export const BOOK =
  "A brave clerk discovered eleven faded green hats in Jasper's kitchen. Late at midnight nobody opened parcels; quiet rain slowly tapped upon velvet windows. Xavier yawned, zipped his old coat, and quickly read every hidden note. The keen inspector smiled, knowing just where Daniel kept the missing umbrella. Young Zoe gathered five black ink bottles, visited Oxford, and wrote xenial letters to Robert.";

export const bookWords = (b: unknown) => String(b ?? '').split(/\s+/).map((x) => x.replace(/[^A-Za-z]/g, '')).filter(Boolean);

const bookOf = (p: Params) => bookWords(p.b);

export const beale: Cipher = {
  id: 'beale',
  name: '比爾密碼（書本）',
  lv: 3,
  desc: '密文是數字，指向書中第幾個單字的第一個字母。',
  params: [{ k: 'b', l: '書本內容', t: 'area', v: BOOK }],
  encrypt(s, p, rng = Math.random) {
    const bw = bookOf(p);
    let miss = '';
    const text = words(s).map((w) => [...w].map((c) => {
      const ix = bw.map((x, i) => (x[0].toUpperCase() === c ? i + 1 : 0)).filter(Boolean);
      if (!ix.length) { if (!miss.includes(c)) miss += c; return '?'; }
      return ix[pick(rng, ix.length)];
    }).join(' ')).join(' / ');
    const first = text.split(/[\s/]+/)[0];
    return {
      text,
      hint: levels([
        [para('每個數字都指向下面這本書裡的某個位置；「/」分開單字。')],
        [para(`已經有人破解了第一個數字：${first} 指的是書中第 ${first} 個單字「${bw[+first - 1] ?? ''}」，代表字母「${bw[+first - 1]?.[0].toUpperCase() ?? ''}」。`)],
        [para('數字是書中的第幾個單字（從 1 開始數），取那個單字的第一個字母。同一個字母可能用不同數字表示。')],
      ], [para('書本（解題材料）：'), { k: 'book', words: bw }]),
      note: miss ? '書中缺少這些字母，顯示為 ?：' + miss : '書中字母足夠',
    };
  },
  decrypt(c, p) {
    const bw = bookOf(p);
    return c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((n) => bw[+n - 1]?.[0].toUpperCase() ?? '?').join('')).join(' ');
  },
};
