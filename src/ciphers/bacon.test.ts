import { describe, expect, it } from 'vitest';
import { bacon } from './bacon';
import { checkCipher } from './testkit';

describe('bacon', () => {
  it('已知向量', () => {
    expect(bacon.encrypt('abz', { m: 'ab' }).text).toBe('AAAAA AAAAB BBAAB');
    expect(bacon.encrypt('b', { m: 'c', c: 'abcde' }).text).toBe('abcdE');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(bacon));
  it('大小寫偽裝也能解回', () => checkCipher(bacon, { params: { m: 'c' }, spaces: false }));
});
