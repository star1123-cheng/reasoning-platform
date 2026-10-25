import { describe, expect, it } from 'vitest';
import { pigpen } from './pigpen';
import { pigShape } from './glyphs';
import { checkCipher } from './testkit';

describe('pigpen', () => {
  it('已知向量', () => {
    const shapes = new Set([...Array(26).keys()].map((i) => JSON.stringify(pigShape(i))));
    expect(shapes.size).toBe(26);
    expect(pigpen.encrypt('ab c', {}).glyphs).toEqual([[{ k: 'pig', i: 0 }, { k: 'pig', i: 1 }], [{ k: 'pig', i: 2 }]]);
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(pigpen));
});
