import { describe, expect, it } from 'vitest';
import { acrostic } from './acrostic';
import { checkCipher } from './testkit';

describe('acrostic', () => {
  it('已知向量', () => {
    expect(acrostic.encrypt('cat', {}).text).toBe('Cat Apple Tree');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(acrostic));
});
