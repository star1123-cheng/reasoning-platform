import type { Cell, HintBlock, ParamDef, Params, Rng } from './types';

export const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** 取得單字陣列：轉大寫、只留 A–Z，空白當分隔 */
export const words = (s: string): string[] =>
  s.toUpperCase().split(/\s+/).map((w) => w.replace(/[^A-Z]/g, '')).filter(Boolean);

/** 正規化：所有密碼都吃這個格式（單字間一個空白） */
export const norm = (s: string): string => words(s).join(' ');

/** 只留字母、不留空白 */
export const letters = (s: string): string => words(s).join('');

/** 金鑰清理：只取 A–Z */
export const cl = (k: unknown): string => String(k ?? '').toUpperCase().replace(/[^A-Z]/g, '');

export const mod = (n: number, m = 26): number => ((n % m) + m) % m;

/** 與原型的 `+p.n||d` 相同：空值、0、非數字都用預設值 */
export const numOr = (v: unknown, d: number): number => Number(v) || d;

export const pick = (rng: Rng, n: number): number => Math.floor(rng() * n);

/** 逐字母代換，保留單字間空白；pos 是第幾個字母（從 0 起） */
export const mapLetters = (s: string, f: (i: number, pos: number) => string): string => {
  let pos = 0;
  return norm(s).replace(/[A-Z]/g, (c) => f(A.indexOf(c), pos++));
};

/** 用 26 字母的代換表加密／解密 */
export const subst = (s: string, to: string) => mapLetters(s, (i) => to[i]);
export const unsubst = (s: string, to: string) => mapLetters(s, (i) => A[to.indexOf(A[i])]);

/** 上下兩排字母對照表 */
export const alphaTable = (to: string | string[]): HintBlock => {
  const t = [...to];
  return { k: 'table', rows: [[...A.slice(0, 13)], t.slice(0, 13), [...A.slice(13)], t.slice(13)] };
};

/** 5×5 方陣（I/J 同格），關鍵字去重後開頭 */
export const square = (k: unknown): string => [...new Set((cl(k) + A).replace(/J/g, 'I'))].join('');

export const rows5 = (g: string): string[][] => [0, 1, 2, 3, 4].map((r) => [...g.slice(r * 5, r * 5 + 5)]);

/** 附行列編號的 5×5 方陣表 */
export const gridTable = (g: string): HintBlock => ({
  k: 'table',
  rows: [['', 1, 2, 3, 4, 5], ...rows5(g).map((r, i): Cell[] => [i + 1, ...r])],
});

/** 依金鑰字母順序（相同字母由左到右）逐欄讀出；欄長可不一致 */
export const keyOrder = (k: string): number[] =>
  [...k].map((c, i) => [c, i] as const).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1])).map((x) => x[1]);

export const colEncrypt = (t: string, k: string): string => {
  const n = k.length;
  let r = '';
  for (const i of keyOrder(k)) for (let j = i; j < t.length; j += n) r += t[j];
  return r;
};

export const colDecrypt = (c: string, k: string): string => {
  const n = k.length, out: string[] = new Array(c.length);
  let p = 0;
  for (const i of keyOrder(k)) for (let j = i; j < c.length; j += n) out[j] = c[p++];
  return out.join('');
};

/** 依參數定義取得預設值 */
export const defaults = (defs: ParamDef[]): Params => Object.fromEntries(defs.map((d) => [d.k, d.v]));

/** 純文字提示段落 */
export const para = (text: string): HintBlock => ({ k: 'p', text });

/**
 * 分層提示：由淺到深（方向 → 已知例子 → 規則 → 完整對照表），學生卡住時才逐張翻開。
 * tools 是解題本來就需要的材料（例如書本、方陣），不算答案，一直顯示在提示卡上方。
 */
export const levels = (cards: HintBlock[][], tools: HintBlock[] = []): HintBlock[] => [
  para('卡住時才翻開下一張提示卡，盡量用最少的提示破解。'),
  ...tools,
  { k: 'levels', cards },
];

/** 已知例子：取明文中出現最多次的 n 個字母（同次數取先出現的） */
export const topLetters = (s: string, n = 2): string[] => {
  const m = new Map<string, number>();
  for (const c of letters(s)) m.set(c, (m.get(c) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([c]) => c);
};

/** 已知例子表：上排原文字母、下排加密後的樣子 */
export const exampleTable = (s: string, enc: (c: string) => Cell): HintBlock => {
  const ex = topLetters(s);
  return { k: 'table', rows: [['原文', ...ex], ['密文', ...ex.map(enc)]] };
};

/** 字母編號表（A=0……Z=25），給需要計算的密碼使用 */
export const numberTable = (): HintBlock => ({
  k: 'table',
  rows: [[...A.slice(0, 13)], [...Array(13).keys()], [...A.slice(13)], [...Array(13).keys()].map((i) => i + 13)],
});

/** 空白 5×5 方陣（附行列編號），讓學生自己填字母 */
export const blankGrid = (): HintBlock => gridTable(' '.repeat(25));
