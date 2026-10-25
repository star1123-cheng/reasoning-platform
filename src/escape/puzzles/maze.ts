import type { Rng } from '../../ciphers';
import { DIR_NAME } from '../locks';
import { shuffle } from '../rng';
import type { PuzzleDef } from '../types';

// 方向迷宮：先畫出照答案轉彎的路線，再用「樹狀生長」補滿其餘格子，保證起點到終點只有一條路
export const N = 1, E = 2, S = 4, W = 8;
const STEP: Record<string, [number, number, number, number]> = { '↑': [-1, 0, N, S], '→': [0, 1, E, W], '↓': [1, 0, S, N], '←': [0, -1, W, E] };

export type Maze = { w: number; h: number; open: number[]; start: number; end: number };

/** 回溯搜尋：每段依序試幾種長度，走不通就退回上一段 */
function carvePath(dirs: string[], n: number, rng: Rng, lens: number[]): number[] | null {
  let budget = 20000;
  const walk = (k: number, r: number, c: number, path: number[], seen: Set<number>): number[] | null => {
    if (k === dirs.length) return path;
    if (--budget < 0) return null;
    const [dr, dc] = STEP[dirs[k]];
    for (const len of shuffle(lens, rng)) {
      const add: number[] = [];
      let rr = r, cc = c, ok = true;
      for (let i = 0; i < len && ok; i++) {
        rr += dr; cc += dc;
        const p = rr * n + cc;
        ok = rr >= 0 && cc >= 0 && rr < n && cc < n && !seen.has(p) && !add.includes(p);
        add.push(p);
      }
      if (!ok) continue;
      add.forEach((p) => seen.add(p));
      const res = walk(k + 1, rr, cc, [...path, ...add], seen);
      if (res) return res;
      add.forEach((p) => seen.delete(p));
    }
    return null;
  };
  for (const p0 of shuffle([...Array(n * n).keys()], rng).slice(0, 30)) {
    const res = walk(0, (p0 / n) | 0, p0 % n, [p0], new Set([p0]));
    if (res) return res;
  }
  return null;
}

export function makeMaze(answer: string, rng: Rng): Maze | null {
  const dirs = [...answer];
  for (let n = dirs.length <= 4 ? 7 : 8; n <= 11; n++) {
    const path = carvePath(dirs, n, rng, [2, 3]) ?? carvePath(dirs, n, rng, [1, 2, 3, 4]);
    if (!path) continue;
    const open = Array(n * n).fill(0), seen = new Set(path);
    const link = (a: number, b: number) => {
      const ar = (a / n) | 0, br = (b / n) | 0;
      const d = br < ar ? '↑' : br > ar ? '↓' : b > a ? '→' : '←';
      open[a] |= STEP[d][2];
      open[b] |= STEP[d][3];
    };
    for (let i = 1; i < path.length; i++) link(path[i - 1], path[i]);
    // 從路線向外隨機生長，每個新格子只接一條邊 → 整體是一棵樹
    const frontier: [number, number][] = [];
    const addFrontier = (p: number) => {
      const r = (p / n) | 0, c = p % n;
      for (const [dr, dc] of Object.values(STEP)) {
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && cc >= 0 && rr < n && cc < n && !seen.has(rr * n + cc)) frontier.push([p, rr * n + cc]);
      }
    };
    shuffle(path, rng).forEach(addFrontier);
    while (frontier.length) {
      const [from, to] = frontier.splice(Math.floor(rng() * frontier.length), 1)[0];
      if (seen.has(to)) continue;
      seen.add(to);
      link(from, to);
      addFrontier(to);
    }
    return { w: n, h: n, open, start: path[0], end: path[path.length - 1] };
  }
  return null;
}

/** 走迷宮（BFS）並把路線壓縮成「每次轉彎的方向」 */
export function solveMaze(m: Maze): string {
  const prev = new Map<number, number>([[m.start, -1]]), q = [m.start];
  while (q.length) {
    const p = q.shift()!, r = (p / m.w) | 0, c = p % m.w;
    for (const [dr, dc, bit] of Object.values(STEP)) {
      const t = (r + dr) * m.w + c + dc;
      if (m.open[p] & bit && !prev.has(t)) { prev.set(t, p); q.push(t); }
    }
  }
  const path: number[] = [];
  for (let p = m.end; p !== -1; p = prev.get(p)!) path.unshift(p);
  let out = '';
  for (let i = 1; i < path.length; i++) {
    const d = path[i] - path[i - 1] === 1 ? '→' : path[i] - path[i - 1] === -1 ? '←' : path[i] > path[i - 1] ? '↓' : '↑';
    if (out[out.length - 1] !== d) out += d;
  }
  return out;
}

export const mazePuzzle: PuzzleDef = {
  kind: 'maze',
  name: '方向迷宮',
  stars: 2,
  locks: ['dir'],
  desc: '方格迷宮；從起點走到終點，每轉一次彎記下新的方向。',
  sample: { dir: '↑→↓→' },
  fields: [],
  build(a, _f, { rng }) {
    const m = makeMaze(a, rng);
    if (!m) throw new Error('迷宮產生失敗，請換一組方向');
    return {
      card: [{ k: 'maze', ...m }],
      rules: '從「起」走到「終」。出發的第一步和之後每次轉彎，都記下前進的方向，依序就是方向鎖的密碼。',
      hints: ['出發時往哪個方向走？那就是第 1 個方向。', `第一步往${DIR_NAME[a[0]]}走。`],
    };
  },
};
