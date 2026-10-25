import { describe, expect, it } from 'vitest';
import { goldbug } from './goldbug';
import { checkCipher } from './testkit';

describe('goldbug', () => {
  it('已知向量', () => {
    expect(goldbug.encrypt('good glass', {}).text).toBe('3 ‡ ‡ †    3 0 5 ; ;');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(goldbug));
});
