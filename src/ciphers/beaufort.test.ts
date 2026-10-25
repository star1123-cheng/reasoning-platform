import { describe, expect, it } from 'vitest';
import { beaufort } from './beaufort';
import { checkCipher } from './testkit';

describe('beaufort', () => {
  it('已知向量', () => {
    expect(beaufort.encrypt('ab', { key: 'KEY' }).text).toBe('KD');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(beaufort));
});
