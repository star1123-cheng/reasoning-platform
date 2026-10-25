import { describe, expect, it } from 'vitest';
import { binary } from './binary';
import { checkCipher } from './testkit';

describe('binary', () => {
  it('已知向量', () => {
    expect(binary.encrypt('A', {}).text).toBe('01000001');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(binary));
});
