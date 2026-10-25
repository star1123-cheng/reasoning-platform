import { describe, expect, it } from 'vitest';
import { scytale } from './scytale';
import { checkCipher } from './testkit';

describe('scytale', () => {
  it('已知向量', () => {
    expect(scytale.encrypt('abcdef', { c: 2 }).text).toBe('ACEBDF');
    expect(scytale.encrypt('abc', { c: 2 }).text).toBe('ACBX');
    expect(scytale.encrypt('abc', { c: 999 }).note).toContain('每圈 12 字');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(scytale, { spaces: false, pad: true }));
});
