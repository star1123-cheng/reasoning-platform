import type { Cipher } from './types';
import { A, exampleTable, levels, para, words } from './util';

export const binary: Cipher = {
  id: 'binary',
  name: '二進位 ASCII',
  lv: 2,
  desc: '每個字母是 8 個 0／1。',
  params: [],
  encrypt: (s) => {
    const bin = (c: string) => c.charCodeAt(0).toString(2).padStart(8, '0');
    return {
      text: words(s).map((w) => [...w].map(bin).join(' ')).join('  /  '),
      hint: levels([
        [para('電腦只認得 0 和 1。每 8 個 0／1 代表一個字母，「/」分開單字。')],
        [para('已經有人破解了這兩個字母：'), exampleTable(s, bin), para('每個字母的開頭都一樣（010），只有後面不同。')],
        [
          para('由左到右，每一位代表的數字是 128、64、32、16、8、4、2、1；把 1 所在位置的數字加起來，就是字母的電腦編號（ASCII）：A=65、B=66、C=67……'),
          { k: 'table', rows: [[128, 64, 32, 16, 8, 4, 2, 1]] },
        ],
        [para('完整編號表：'), { k: 'legend', items: [...A].map((c, i) => ({ label: c, sub: '=' + (65 + i) })) }],
      ]),
    };
  },
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join('')).join(' '),
};
