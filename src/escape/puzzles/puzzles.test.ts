import { describe, expect, it } from 'vitest';
import { cipherById } from '../../ciphers';
import { defaults } from '../../ciphers/util';
import { lockError, normAnswer } from '../locks';
import { seeded } from '../rng';
import type { Built, CardBlock, FieldValues, LockKind, PuzzleKind } from '../types';
import { PUZZLES, puzzleOf } from './index';
import { parseTime } from './clock';
import { SYMBOLS } from './equation';
import { ASKED } from './count';
import { countWord } from './wordsearch';
import { solveMaze } from './maze';

const fieldsOf = (k: PuzzleKind, over: FieldValues = {}) => ({ ...Object.fromEntries(puzzleOf(k).fields.map((f) => [f.k, f.v])), ...over });
const build = (k: PuzzleKind, a: string, f: FieldValues = {}, seed = 1): Built => puzzleOf(k).build(a, fieldsOf(k, f), { rng: seeded(seed) });
const block = <K extends CardBlock['k']>(b: Built, k: K) => b.card.find((x) => x.k === k) as Extract<CardBlock, { k: K }>;

describe('謎題總表', () => {
  it('12 種，各自的範例答案都通過鎖與類型檢查', () => {
    expect(PUZZLES).toHaveLength(12);
    for (const p of PUZZLES) {
      for (const lock of p.locks) {
        const a = normAnswer(lock, p.sample[lock]!);
        expect(lockError(lock, a), `${p.name} ${lock}`).toBeNull();
        expect(p.check?.(a, fieldsOf(p.kind), lock) ?? null, `${p.name} ${lock}`).toBeNull();
        const b = p.build(a, fieldsOf(p.kind), { rng: seeded(7) });
        expect(b.card.length).toBeGreaterThan(0);
        expect(b.rules).not.toBe('');
      }
    }
  });
  it('同一個 seed 產生相同結果', () => {
    expect(build('wordsearch', 'SAFE', {}, 42)).toEqual(build('wordsearch', 'SAFE', {}, 42));
  });
});

describe('密碼解碼', () => {
  it('用卡片上的密文解得回答案', () => {
    const r = block(build('cipher', 'LAMP', { cipher: 'vigenere' }), 'cipher').result;
    const c = cipherById('vigenere')!;
    expect(c.decrypt!(r.text!, defaults(c.params))).toBe('LAMP');
  });
});

describe('選擇題答題卡', () => {
  it('正確選項的代號依題號排出答案，每題代號不重複', () => {
    const q = block(build('quiz', '415'), 'quiz');
    const rights = ['玉山', '12', '0 度'];
    expect(q.items.map((it, i) => it.opts.find((o) => o.text === rights[i])!.label).join('')).toBe('415');
    for (const it of q.items) expect(new Set(it.opts.map((o) => o.label)).size).toBe(it.opts.length);
  });
  it('題數不符時報錯', () => {
    expect(puzzleOf('quiz').check!('1234', fieldsOf('quiz'), 'digit')).toContain('需要 4 題');
  });
});

describe('排序題', () => {
  it('依正確順序讀出代號＝答案，且卡片順序已打亂', () => {
    const b = build('order', '3142');
    const list = block(b, 'list').items;
    const correct = ['日出', '中午', '日落', '半夜'];
    expect(correct.map((x) => list.find((l) => l.endsWith(x))!.slice(1, 2)).join('')).toBe('3142');
    expect(list.map((l) => l.slice(3))).not.toEqual(correct);
  });
});

describe('找字遊戲', () => {
  it('每個單字恰好出現一次，剩下的格子拼出答案', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const b = build('wordsearch', 'SAFE', {}, seed);
      const rows = block(b, 'table').rows as string[][];
      const n = rows.length, cells = rows.flat();
      const words = (block(b, 'p').text.replace('單字：', '')).split('、');
      const used = new Set<number>();
      for (const w of words) {
        expect(countWord(cells, n, w), w).toBe(1);
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const idx = [...w].map((_, i) => (r + dr * i) * n + c + dc * i);
          if (idx.every((p, i) => r + dr * i < n && c + dc * i < n && cells[p] === w[i])) idx.forEach((p) => used.add(p));
        }
      }
      expect(cells.filter((_, i) => !used.has(i)).join('')).toBe('SAFE');
    }
  });
});

describe('方向迷宮', () => {
  it('起點到終點只有一條路，轉彎方向＝答案', () => {
    for (const a of ['↑→↓→', '←↑→↓←↑', '→↓←↓→↑→↓']) {
      for (const seed of [1, 9, 77]) {
        const m = block(build('maze', a, {}, seed), 'maze');
        expect(solveMaze(m)).toBe(a);
        // 樹狀迷宮：通道數＝格子數−1（沒有迴圈 → 路線唯一）
        const edges = m.open.reduce((s, v) => s + [1, 2, 4, 8].filter((b) => v & b).length, 0) / 2;
        expect(edges).toBe(m.w * m.h - 1);
      }
    }
  });
});

describe('時鐘', () => {
  it('解析時間並拒絕不合理的答案', () => {
    expect(parseTime('345')).toEqual({ h: 3, m: 45 });
    expect(parseTime('1030')).toEqual({ h: 10, m: 30 });
    expect(parseTime('1360')).toBeNull();
    expect(parseTime('0845')).toBeNull();
    expect(block(build('clock', '1205'), 'clock')).toEqual({ k: 'clock', h: 12, m: 5 });
  });
});

describe('符號算式', () => {
  it('窮舉所有符號值，只有一組解且排出答案', () => {
    for (const a of ['2718', '1000', '9090', '5555', '0123']) {
      const b = build('equation', a);
      const lines = block(b, 'big').text.split('\n');
      const syms = SYMBOLS.filter((s) => lines.some((l) => l.includes(s)));
      const sols: string[] = [];
      const tryAll = (i: number, v: Record<string, number>) => {
        if (i === syms.length) {
          const ok = lines.every((l) => {
            const [lhs, rhs] = l.split(' = ');
            const expr = syms.reduce((e, s) => e.split(s).join(String(v[s])), lhs).replace(/−/g, '-');
            return Function(`return ${expr}`)() === +rhs;
          });
          if (ok) sols.push(block(b, 'p').text.replace('密碼：', '').split(' ').map((s) => v[s]).join(''));
          return;
        }
        for (let d = 0; d <= 9; d++) tryAll(i + 1, { ...v, [syms[i]]: d });
      };
      tryAll(0, {});
      expect(sols).toEqual([a]);
    }
  });
});

describe('數一數', () => {
  it('每種圖形的數量依序＝答案', () => {
    const b = build('count', '3507');
    const cells = block(b, 'shapes').cells;
    expect(ASKED.map((s) => cells.filter((c) => c === s).length).join('')).toBe('3507');
  });
});

describe('座標地圖', () => {
  it('照座標取字母＝答案', () => {
    const b = build('coords', 'KEYS');
    const rows = block(b, 'table').rows;
    const coords = block(b, 'big').text.split(' → ');
    expect(coords.map((c) => rows[+c.slice(1)][' ABCDEF'.indexOf(c[0])]).join('')).toBe('KEYS');
  });
});

describe('鏡像文字', () => {
  it('答案放進句子並標記左右顛倒', () => {
    expect(block(build('mirror', 'OPEN'), 'big')).toEqual({ k: 'big', text: '密碼是 OPEN', mirror: true });
    expect(block(build('mirror', '9047', { sentence: '請輸入' }), 'big').text).toBe('請輸入 9047');
  });
});

describe('顏色對照', () => {
  it('圓點顏色經背面對照表換回數字＝答案，對照表十色不重複', () => {
    const b = build('color', '5820');
    const map = (b.elsewhere!.blocks[0] as Extract<CardBlock, { k: 'colors' }>).items;
    expect(new Set(map.map((x) => x.c)).size).toBe(10);
    expect(block(b, 'dots').colors.map((c) => map.find((x) => x.c === c)!.d).join('')).toBe('5820');
  });
});

describe('字母重組', () => {
  it('字母相同但順序不同', () => {
    const t = block(build('anagram', 'LENS'), 'big').text.replace(/ /g, '');
    expect([...t].sort().join('')).toBe('ELNS');
    expect(t).not.toBe('LENS');
    expect(puzzleOf('anagram').check!('AAA', fieldsOf('anagram'), 'letter' as LockKind)).toContain('相同');
  });
});
