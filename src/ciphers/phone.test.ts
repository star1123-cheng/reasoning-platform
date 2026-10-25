import { describe, expect, it } from 'vitest';
import { phone } from './phone';
import { checkCipher } from './testkit';

describe('phone', () => {
  it('已知向量', () => {
    expect(phone.encrypt('HI sz', {}).text).toBe('44 444 / 7777 9999');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(phone));
});
