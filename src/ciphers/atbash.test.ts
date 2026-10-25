import { describe, expect, it } from 'vitest';
import { atbash } from './atbash';
import { checkCipher } from './testkit';

describe('atbash', () => {
  it('已知向量', () => {
    expect(atbash.encrypt('Hello', {}).text).toBe('SVOOL');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(atbash));
});
