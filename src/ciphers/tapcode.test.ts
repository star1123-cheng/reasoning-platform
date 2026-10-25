import { describe, expect, it } from 'vitest';
import { tapcode } from './tapcode';
import { checkCipher } from './testkit';

describe('tapcode', () => {
  it('已知向量', () => {
    expect(tapcode.encrypt('a', {}).text).toBe('• •');
    // K 與 C 同格，解密回 C
    expect(tapcode.decrypt!(tapcode.encrypt('k', {}).text!, {})).toBe('C');
  });
  it('共用檢查（K 解回 C）', () => checkCipher(tapcode, { fix: (s) => s.replace(/K/g, 'C') }));
});
