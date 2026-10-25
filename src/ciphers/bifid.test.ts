import { describe, expect, it } from 'vitest';
import { bifid } from './bifid';
import { checkCipher } from './testkit';

describe('bifid', () => {
  it('已知向量', () => {
    expect(bifid.encrypt('flee at once', { key: 'BGWKZQPNDSIOAXEFCLUMTHYVR' }).text).toBe('UAEOLWRINS');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(bifid, { spaces: false }));
});
