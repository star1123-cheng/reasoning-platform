import type { Rng } from '../../ciphers';
import { shuffle } from '../rng';
import type { PuzzleDef } from '../types';

// 找字遊戲：圈完所有單字後，剩下的格子由左到右、由上到下剛好拼出答案
const DIRS: [number, number][] = [[0, 1], [1, 0]]; // 橫向（左→右）、直向（上→下）
const BANK = 'CAT DOG SUN KEY BOX PEN INK OWL MOON STAR BOOK DOOR LAMP CODE LOCK NOTE RING BELL ROSE TREE FISH BIRD CAKE MILK RAIN SNOW CLOCK CHAIR TABLE PAPER'.split(' ');

export const wordList = (t: string) =>
  [...new Set(t.split(/[\s,，、]+/).map((w) => w.toUpperCase().replace(/[^A-Z]/g, '')).filter((w) => w.length >= 2))];

type Grid = { n: number; cells: string[] };

const tryPlace = (g: Grid, w: string, rng: Rng, tries = 80): boolean => {
  for (let t = 0; t < tries; t++) {
    const [dr, dc] = DIRS[Math.floor(rng() * DIRS.length)];
    const r0 = Math.floor(rng() * (g.n - dr * (w.length - 1)));
    const c0 = Math.floor(rng() * (g.n - dc * (w.length - 1)));
    const idx = [...w].map((_, i) => (r0 + dr * i) * g.n + c0 + dc * i);
    if (idx.every((p, i) => !g.cells[p] || g.cells[p] === w[i])) {
      idx.forEach((p, i) => { g.cells[p] = w[i]; });
      return true;
    }
  }
  return false;
};

/** 計算單字在方格中（橫、直）出現幾次 */
export const countWord = (cells: string[], n: number, w: string) => {
  let k = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) for (const [dr, dc] of DIRS) {
    let ok = true;
    for (let i = 0; i < w.length && ok; i++) {
      const rr = r + dr * i, cc = c + dc * i;
      ok = rr < n && cc < n && cells[rr * n + cc] === w[i];
    }
    if (ok) k++;
  }
  return k;
};

export function makeWordSearch(words: string[], answer: string, rng: Rng): { n: number; cells: string[]; words: string[] } | null {
  const longest = Math.max(...words.map((w) => w.length));
  const total = words.reduce((s, w) => s + w.length, 0) + answer.length;
  for (let n = Math.max(5, longest, Math.ceil(Math.sqrt(total))); n <= 12; n++) {
    for (let att = 0; att < 60; att++) {
      const g: Grid = { n, cells: Array(n * n).fill('') };
      const used = [...words].sort((a, b) => b.length - a.length);
      if (!used.every((w) => tryPlace(g, w, rng))) continue;
      let free = g.cells.filter((c) => !c).length;
      if (free < answer.length) continue;
      // 用內建詞庫補到「空格數＝答案長度」
      for (const w of shuffle(BANK, rng)) {
        if (free === answer.length) break;
        if (used.includes(w) || w.length > n) continue;
        const snap = [...g.cells];
        if (tryPlace(g, w, rng, 30)) {
          const f2 = g.cells.filter((c) => !c).length;
          if (f2 >= answer.length && f2 < free) { free = f2; used.push(w); } else g.cells = snap;
        }
      }
      if (free !== answer.length) continue;
      let k = 0;
      const cells = g.cells.map((c) => c || answer[k++]);
      // 每個單字只能出現一次，學生才不會圈錯
      if (used.every((w) => countWord(cells, n, w) === 1)) return { n, cells, words: used };
    }
  }
  return null;
}

export const wordsearchPuzzle: PuzzleDef = {
  kind: 'wordsearch',
  name: '找字遊戲',
  stars: 2,
  locks: ['letter'],
  desc: '字母方格與單字清單；圈完所有單字後，剩下的字母依序讀出就是密碼。',
  sample: { letter: 'SAFE' },
  fields: [{ k: 'words', l: '要藏的單字（空白或換行分隔，2 個字母以上）', t: 'area', v: 'CLUE LENS PIPE HAT MAP', help: '單字不夠時系統會用內建詞庫補足，讓剩下的格子剛好拼出答案。' }],
  check(a, f, _l) {
    const ws = wordList(f.words ?? '');
    if (!ws.length) return '請至少輸入一個單字';
    if (ws.some((w) => w.length > 12)) return '單字最長 12 個字母';
    if (ws.length > 12) return '單字最多 12 個';
    return makeWordSearch(ws, a, () => 0.5) || makeWordSearch(ws, a, Math.random) ? null : '排不出剛好的方格，請減少單字或換一個答案';
  },
  build(a, f, { rng }) {
    const res = makeWordSearch(wordList(f.words), a, rng);
    if (!res) throw new Error('排不出剛好的方格，請減少單字或換一個答案');
    const rows = Array.from({ length: res.n }, (_, r) => res.cells.slice(r * res.n, r * res.n + res.n));
    return {
      card: [{ k: 'table', rows }, { k: 'p', text: '單字：' + [...res.words].sort().join('、') }],
      rules: '單字都是橫向（左→右）或直向（上→下）。圈出所有單字後，把沒被圈到的字母由左到右、由上到下讀出來。',
      hints: ['先找最長的單字，比較容易定位。', `剩下的第一個字母是 ${a[0]}。`],
      note: res.words.length > wordList(f.words).length ? '系統補了詞庫單字：' + res.words.filter((w) => !wordList(f.words).includes(w)).join('、') : undefined,
    };
  },
};
