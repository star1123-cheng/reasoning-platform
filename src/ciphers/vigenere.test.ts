import { describe, expect, it } from 'vitest';
import { vigenere } from './vigenere';
import { checkCipher } from './testkit';

describe('vigenere', () => {
  it('已知向量', () => {
    expect(vigenere.encrypt('ATTACKATDAWN', { key: 'LEMON' }).text).toBe('LXFOPVEFRNHR');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(vigenere));
});
