import type { Cipher, Params } from './types';
import { pick, words } from './util';

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
    return {
      text,
      hint: [{ k: 'p', text: '每個數字代表下面書中的第幾個單字，取它的第一個字母：' }, { k: 'book', words: bw }],
      note: miss ? '書中缺少這些字母，顯示為 ?：' + miss : '書中字母足夠',
    };
  },
  decrypt(c, p) {
    const bw = bookOf(p);
    return c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((n) => bw[+n - 1]?.[0].toUpperCase() ?? '?').join('')).join(' ');
  },
};
