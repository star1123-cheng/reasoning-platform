import { describe, expect, it } from 'vitest';
import { adfgvx } from './adfgvx';
import { checkCipher } from './testkit';

describe('adfgvx', () => {
  it('已知向量', () => {
    expect(adfgvx.encrypt('a', { key: 'CARGO' }).text).toBe('DA');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(adfgvx, { spaces: false }));
});
