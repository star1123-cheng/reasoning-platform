import type { Cipher } from './types';
import { words } from './util';

export const binary: Cipher = {
  id: 'binary',
  name: '二進位 ASCII',
  lv: 2,
  desc: '每個字母是 8 個 0／1。',
  params: [],
  encrypt: (s) => ({
    text: words(s).map((w) => [...w].map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')).join('  /  '),
    hint: [
      { k: 'p', text: '每 8 位是一個字母。由左到右的位值是 128、64、32、16、8、4、2、1，相加得到 ASCII 編號（A=65、B=66……）。' },
      { k: 'table', rows: [[128, 64, 32, 16, 8, 4, 2, 1]] },
    ],
  }),
  decrypt: (c) => c.trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join('')).join(' '),
};
