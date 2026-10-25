import { lockError, normAnswer } from './locks';
import { PUZZLES, puzzleOf } from './puzzles';
import { seeded } from './rng';
import type { Built, CardBlock, LockKind, PuzzleKind, Room, Stage } from './types';

export const MAX_STAGES = 10;

export type BuiltStage = {
  no: number;
  stage: Stage;
  answer: string;
  fragment: string;
  error?: string;
  built?: Built;
  /** 印在這張卡片背面的線索（下一關的顏色對照表） */
  back?: { title: string; blocks: CardBlock[] };
};

export type BuiltRoom = {
  stages: BuiltStage[];
  ok: boolean;
  final: string;
  /** 第 1 關是顏色題時，對照表印在答案紙上 */
  sheetExtra?: { title: string; blocks: CardBlock[] };
};

/** 最終密語拆成碎片：字數不多於關數時一關一字，否則平均分段 */
export function splitFinal(final: string, n: number): string[] {
  const ch = [...final];
  if (ch.length <= n) return Array.from({ length: n }, (_, i) => ch[i] ?? '');
  const out: string[] = [];
  let p = 0;
  for (let i = 0; i < n; i++) {
    const size = Math.floor(ch.length / n) + (i < ch.length % n ? 1 : 0);
    out.push(ch.slice(p, p + size).join(''));
    p += size;
  }
  return out;
}

export const normFinal = (s: string) => s.trim().replace(/\s+/g, '').toUpperCase();

/** 單一關卡的答案錯誤（鎖格式 → 類型限制） */
export function stageError(s: Stage): string | null {
  const def = puzzleOf(s.kind);
  if (!def.locks.includes(s.lock)) return `「${def.name}」不能搭配這種鎖`;
  const a = normAnswer(s.lock, s.answer);
  return lockError(s.lock, a) ?? def.check?.(a, s.fields, s.lock) ?? null;
}

export function buildRoom(room: Room): BuiltRoom {
  const frags = splitFinal(normFinal(room.final), room.stages.length);
  const stages: BuiltStage[] = room.stages.map((stage, i) => {
    const answer = normAnswer(stage.lock, stage.answer);
    const base = { no: i + 1, stage, answer, fragment: frags[i] };
    const error = stageError(stage);
    if (error) return { ...base, error };
    // 同一個 seed 產生相同謎題；少數隨機排版失敗時換下一個 seed 重試
    for (let t = 0; t < 6; t++) {
      try {
        return { ...base, built: puzzleOf(stage.kind).build(answer, stage.fields, { rng: seeded(room.seed + i * 7919 + t * 104729) }) };
      } catch (e) {
        if (t === 5) return { ...base, error: (e as Error).message };
      }
    }
    return { ...base, error: '產生失敗' };
  });
  let sheetExtra: BuiltRoom['sheetExtra'];
  stages.forEach((s, i) => {
    const el = s.built?.elsewhere;
    if (!el) return;
    if (i === 0) sheetExtra = el;
    else stages[i - 1].back = el;
  });
  return { stages, ok: stages.length > 0 && stages.every((s) => !s.error), final: normFinal(room.final), sheetExtra };
}

/** 切換謎題類型時的預設關卡（範例答案保證通過檢查） */
export function newStage(kind: PuzzleKind = 'cipher', scene = ''): Stage {
  const def = puzzleOf(kind), lock = def.locks[0];
  return { scene, kind, lock, answer: def.sample[lock] ?? '', fields: Object.fromEntries(def.fields.map((f) => [f.k, f.v])) };
}

export const SAMPLE_ROOM: Room = {
  v: 1,
  title: '偵探事務所失竊案',
  intro: '事務所的金色放大鏡不見了！竊賊留下一連串謎題，解開每一道鎖，收集碎片，拼出真相。',
  hard: false,
  final: 'TRUTH',
  seed: 20261026,
  stages: [
    { ...newStage('cipher', '門縫裡塞著一張紙條，上面的字母全都怪怪的。'), answer: 'LAMP' },
    { ...newStage('maze', '檯燈底下壓著一張地圖，通往書房的路彎彎曲曲。'), answer: '↑→↓→' },
    { ...newStage('clock', '書房的時鐘停了，指針好像在暗示什麼。'), answer: '345' },
    { ...newStage('equation', '保險箱上貼著一排奇怪的符號算式。'), answer: '2718' },
    { ...newStage('wordsearch', '保險箱裡只有一張字母方格，最後的答案就藏在裡面。'), answer: 'SAFE' },
  ],
};

const LOCK_KINDS: LockKind[] = ['digit', 'letter', 'dir', 'free'];
const str = (v: unknown, max: number, name: string): string => {
  if (typeof v !== 'string') throw new Error(`「${name}」格式錯誤`);
  if (v.length > max) throw new Error(`「${name}」超過 ${max} 字`);
  return v;
};

/** 匯入 JSON 時驗證格式與長度；不合格就丟出錯誤，不覆蓋目前的房間 */
export function sanitizeRoom(x: unknown): Room {
  if (!x || typeof x !== 'object') throw new Error('檔案內容不是房間資料');
  const o = x as Record<string, unknown>;
  if (o.v !== 1) throw new Error('不支援的檔案版本');
  if (!Array.isArray(o.stages) || o.stages.length < 1 || o.stages.length > MAX_STAGES) throw new Error(`關卡數需要 1–${MAX_STAGES} 關`);
  const kinds = PUZZLES.map((p) => p.kind);
  const stages = o.stages.map((s: unknown, i: number): Stage => {
    if (!s || typeof s !== 'object') throw new Error(`第 ${i + 1} 關格式錯誤`);
    const t = s as Record<string, unknown>;
    if (!kinds.includes(t.kind as PuzzleKind)) throw new Error(`第 ${i + 1} 關的謎題類型不存在`);
    if (!LOCK_KINDS.includes(t.lock as LockKind)) throw new Error(`第 ${i + 1} 關的鎖不存在`);
    const def = puzzleOf(t.kind as PuzzleKind);
    const rawF = (t.fields && typeof t.fields === 'object' ? t.fields : {}) as Record<string, unknown>;
    const fields = Object.fromEntries(def.fields.map((f) => [f.k, rawF[f.k] === undefined ? f.v : str(rawF[f.k], 2000, `第 ${i + 1} 關 ${f.l}`)]));
    return {
      scene: str(t.scene ?? '', 300, `第 ${i + 1} 關場景`),
      kind: t.kind as PuzzleKind,
      lock: t.lock as LockKind,
      answer: str(t.answer, 40, `第 ${i + 1} 關答案`),
      fields,
    };
  });
  return {
    v: 1,
    title: str(o.title, 40, '房間名稱'),
    intro: str(o.intro ?? '', 500, '開場故事'),
    hard: o.hard === true,
    final: str(o.final ?? '', 20, '最終密語'),
    seed: Number.isInteger(o.seed) ? (o.seed as number) : 1,
    stages,
  };
}
