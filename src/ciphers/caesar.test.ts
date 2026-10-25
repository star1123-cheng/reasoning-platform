import { describe, expect, it } from 'vitest';
import { caesar } from './caesar';
import { checkCipher } from './testkit';

describe('caesar', () => {
  it('已知向量', () => {
    expect(caesar.encrypt('hello, world', { n: 3 }).text).toBe('KHOOR ZRUOG');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(caesar));
});
