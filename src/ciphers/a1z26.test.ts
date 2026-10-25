import { describe, expect, it } from 'vitest';
import { a1z26 } from './a1z26';
import { checkCipher } from './testkit';

describe('a1z26', () => {
  it('已知向量', () => {
    expect(a1z26.encrypt('a z', {}).text).toBe('1  /  26');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(a1z26));
});
