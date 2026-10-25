import { describe, expect, it } from 'vitest';
import { columnar } from './columnar';
import { checkCipher } from './testkit';

describe('columnar', () => {
  it('已知向量', () => {
    expect(columnar.encrypt('abcdef', { key: 'BA' }).text).toBe('BDFACE');
    // 重複字母由左到右
    expect(columnar.encrypt('abcd', { key: 'AA' }).text).toBe('ACBD');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(columnar, { spaces: false, pad: true }));
});
