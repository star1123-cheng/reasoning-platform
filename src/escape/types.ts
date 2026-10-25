import type { CipherResult, HintBlock, Rng } from '../ciphers';

export type LockKind = 'digit' | 'letter' | 'dir' | 'free';

export type PuzzleKind =
  | 'cipher' | 'quiz' | 'order' | 'wordsearch' | 'maze' | 'clock'
  | 'equation' | 'count' | 'coords' | 'mirror' | 'color' | 'anagram';

export type ShapeName = 'star' | 'circle' | 'triangle' | 'square' | 'heart' | 'diamond';
export type ColorId = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'brown' | 'black' | 'gray';

/** 線索卡上的內容區塊（純資料，由 CardView 畫出） */
export type CardBlock =
  | HintBlock
  | { k: 'big'; text: string; mirror?: boolean }
  | { k: 'list'; items: string[] }
  | { k: 'quiz'; items: { q: string; opts: { label: string; text: string }[] }[] }
  | { k: 'maze'; w: number; h: number; open: number[]; start: number; end: number }
  | { k: 'clock'; h: number; m: number }
  | { k: 'shapes'; cols: number; cells: (ShapeName | null)[] }
  | { k: 'shape-order'; items: ShapeName[] }
  | { k: 'dots'; colors: ColorId[] }
  | { k: 'colors'; items: { c: ColorId; d: string }[] }
  | { k: 'cipher'; result: CipherResult };

export type FieldDef = {
  k: string;
  l: string;
  t: 'text' | 'area' | 'select';
  v: string;
  o?: [string, string][];
  help?: string;
};

export type FieldValues = Record<string, string>;

export type BuildCtx = { rng: Rng };

export type Built = {
  card: CardBlock[];
  /** 卡片上的規則說明（高手模式移到提示表第一段） */
  rules: string;
  /** 提示表的方向提示、關鍵提示（第三段固定為答案） */
  hints: [string, string];
  /** 給關主的說明 */
  note?: string;
  /** 放在別處的線索（例如顏色對照表放前一關卡片背面） */
  elsewhere?: { title: string; blocks: CardBlock[] };
};

export type PuzzleDef = {
  kind: PuzzleKind;
  name: string;
  stars: 1 | 2 | 3;
  locks: LockKind[];
  desc: string;
  /** 各種鎖的範例答案（切換類型時自動填入，必須通過檢查） */
  sample: Partial<Record<LockKind, string>>;
  fields: FieldDef[];
  /** 答案已依鎖正規化並通過鎖的檢查；回傳錯誤訊息或 null */
  check?(answer: string, f: FieldValues, lock: LockKind): string | null;
  build(answer: string, f: FieldValues, ctx: BuildCtx): Built;
};

export type Stage = {
  scene: string;
  kind: PuzzleKind;
  lock: LockKind;
  answer: string;
  fields: FieldValues;
};

export type Room = {
  v: 1;
  title: string;
  intro: string;
  hard: boolean;
  final: string;
  seed: number;
  stages: Stage[];
};
