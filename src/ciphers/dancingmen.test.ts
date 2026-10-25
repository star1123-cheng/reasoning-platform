import { describe, expect, it } from 'vitest';
import { dancingmen } from './dancingmen';
import { manShape } from './glyphs';
import { checkCipher } from './testkit';

describe('dancingmen', () => {
  it('已知向量', () => {
    const shapes = new Set([...Array(26).keys()].map((i) => manShape(i, false).d));
    expect(shapes.size).toBe(26);
    const g = dancingmen.encrypt('ab c', { f: true }).glyphs!;
    expect(g.map((w) => w.map((x) => x.k === 'man' && x.flag))).toEqual([[false, true], [true]]);
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(dancingmen));
});
