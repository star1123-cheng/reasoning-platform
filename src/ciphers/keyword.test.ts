import { describe, expect, it } from 'vitest';
import { keyword } from './keyword';
import { checkCipher } from './testkit';

describe('keyword', () => {
  it('已知向量', () => {
    expect(keyword.encrypt('abc', { key: 'zebras' }).text).toBe('ZEB');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(keyword));
});
