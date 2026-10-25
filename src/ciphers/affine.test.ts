import { describe, expect, it } from 'vitest';
import { affine } from './affine';
import { checkCipher } from './testkit';

describe('affine', () => {
  it('已知向量', () => {
    expect(affine.encrypt('AFFINE CIPHER', { a: 5, b: 8 }).text).toBe('IHHWVC SWFRCP');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(affine));
});
