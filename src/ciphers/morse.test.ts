import { describe, expect, it } from 'vitest';
import { morse } from './morse';
import { checkCipher } from './testkit';

describe('morse', () => {
  it('已知向量', () => {
    expect(morse.encrypt('sos', {}).text).toBe('... --- ...');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(morse));
});
