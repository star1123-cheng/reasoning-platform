import { describe, expect, it } from 'vitest';
import { polybius } from './polybius';
import { checkCipher } from './testkit';

describe('polybius', () => {
  it('已知向量', () => {
    expect(polybius.encrypt('HI', {}).text).toBe('23 24');
    expect(polybius.encrypt('J', {}).text).toBe('24');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(polybius));
});
