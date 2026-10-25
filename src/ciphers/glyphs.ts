// 共濟會與跳舞小人的圖形幾何（純資料，由 React 的 GlyphSvg 畫出）

export type Shape = { w: number; h: number; d: string; dots: [number, number][]; head?: [number, number] };

/** 共濟會：A–I 井字無點、J–R 井字有點、S–V X 字無點、W–Z X 字有點 */
export const pigShape = (i: number): Shape => {
  let d = '', dot = false, x = 12, y = 12;
  if (i < 18) {
    const c = i % 9, r = (c / 3) | 0, k = c % 3;
    dot = i >= 9;
    if (k > 0) d += 'M4 4V20';
    if (k < 2) d += 'M20 4V20';
    if (r > 0) d += 'M4 4H20';
    if (r < 2) d += 'M4 20H20';
  } else {
    const j = i - 18, s = j % 4;
    dot = j >= 4;
    d = ['M4 4L12 12L20 4', 'M4 4L12 12L4 20', 'M20 4L12 12L20 20', 'M4 20L12 12L20 20'][s];
    [x, y] = ([[12, 7], [7, 12], [17, 12], [12, 17]] as const)[s];
  }
  return { w: 24, h: 24, d, dots: dot ? [[x, y]] : [] };
};

/** 跳舞小人：每個字母對應一組手腳姿勢；flag 為單字結尾的旗子 */
export const manShape = (i: number, flag: boolean): Shape => {
  const c = (i * 7 + 3) % 54;
  const la = [[6, 6], [5, 12], [7, 19]][c % 3];
  const ra = [[22, 6], [23, 12], [21, 19]][((c / 3) | 0) % 3];
  const ll = [[8, 29], [5, 25], [11, 30]][((c / 9) | 0) % 3];
  const rl = [[20, 29], [23, 25], [17, 30]][(c / 27) | 0];
  const d = `M14 9V21M14 12L${la}M14 12L${ra}M14 21L${ll}M14 21L${rl}` + (flag ? `M${ra[0]} ${ra[1]}v-6h5v4h-5` : '');
  return { w: 28, h: 32, d, dots: [], head: [14, 6] };
};
