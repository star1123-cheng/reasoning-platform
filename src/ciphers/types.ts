// 密碼模組共用型別：提示與圖形都用結構化資料，由 React 元件渲染（不用 HTML 字串）

export type Rng = () => number;

export type Glyph = { k: 'pig'; i: number } | { k: 'man'; i: number; flag: boolean };
export type GlyphWord = Glyph[];

export type Cell = string | number;

export type HintBlock =
  | { k: 'p'; text: string }
  | { k: 'table'; rows: Cell[][] }
  | { k: 'legend'; items: { label: string; glyph?: Glyph; sub?: string }[] }
  | { k: 'book'; words: string[] };

export type ParamValue = string | number | boolean;
export type Params = Record<string, ParamValue>;

export type ParamDef = {
  k: string;
  l: string;
  t: 'number' | 'text' | 'select' | 'check' | 'area';
  v: ParamValue;
  o?: [ParamValue, string][];
};

export type CipherResult = {
  text?: string;
  glyphs?: GlyphWord[];
  hint: HintBlock[];
  note?: string;
};

export type Cipher = {
  id: string;
  name: string;
  lv: 1 | 2 | 3 | 4 | 5;
  desc: string;
  params: ParamDef[];
  encrypt(plain: string, params: Params, rng?: Rng): CipherResult;
  decrypt?(cipher: string, params: Params): string;
};
