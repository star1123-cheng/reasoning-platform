import { shuffle } from '../rng';
import type { ColorId, PuzzleDef } from '../types';

export const COLORS: { id: ColorId; name: string; hex: string }[] = [
  { id: 'red', name: '紅', hex: '#d32f2f' },
  { id: 'orange', name: '橙', hex: '#f57c00' },
  { id: 'yellow', name: '黃', hex: '#fbc02d' },
  { id: 'green', name: '綠', hex: '#388e3c' },
  { id: 'blue', name: '藍', hex: '#1976d2' },
  { id: 'purple', name: '紫', hex: '#7b1fa2' },
  { id: 'pink', name: '粉紅', hex: '#f06292' },
  { id: 'brown', name: '棕', hex: '#795548' },
  { id: 'black', name: '黑', hex: '#212121' },
  { id: 'gray', name: '灰', hex: '#9e9e9e' },
];
export const colorName = (id: ColorId) => COLORS.find((c) => c.id === id)!.name;

export const colorPuzzle: PuzzleDef = {
  kind: 'color',
  name: '顏色對照',
  stars: 2,
  locks: ['digit'],
  desc: '一排彩色圓點；顏色與數字的對照表放在前一關卡片的背面，形成跨卡線索。',
  sample: { digit: '5820' },
  fields: [],
  build(a, _f, { rng }) {
    const map = shuffle(COLORS.map((c) => c.id), rng); // map[d] = 代表數字 d 的顏色
    const colors = [...a].map((d) => map[+d]);
    return {
      card: [{ k: 'dots', colors }],
      rules: '每個圓點代表一個數字。顏色和數字的對照表藏在別的地方，找到它再依序換成數字。',
      hints: ['對照表在前一關卡片的背面（第 1 關則在答案紙上）。', `第一個顏色是${colorName(colors[0])}色，代表 ${a[0]}。`],
      elsewhere: { title: '顏色對照表', blocks: [{ k: 'colors', items: map.map((c, d) => ({ c, d: String(d) })) }] },
    };
  },
};
