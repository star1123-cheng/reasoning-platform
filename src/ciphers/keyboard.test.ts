import { describe, expect, it } from 'vitest';
import { keyboard } from './keyboard';
import { checkCipher } from './testkit';

describe('keyboard', () => {
  it('已知向量', () => {
    expect(keyboard.encrypt('QPLM', { m: 'r' }).text).toBe('WQAZ');
    expect(keyboard.encrypt('abz', { m: 'q' }).text).toBe('QWM');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(keyboard));
  it('QWE 模式也能來回', () => checkCipher(keyboard, { params: { m: 'q' } }));
});
