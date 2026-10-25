import { describe, expect, it } from 'vitest';
import { cipherById } from '../ciphers';
import { CASES, isCorrect } from './cases';

describe('精選挑戰', () => {
  it('共 7 案，難度 1–3', () => {
    expect(CASES).toHaveLength(7);
    expect(CASES.every((c) => c.lv >= 1 && c.lv <= 3)).toBe(true);
  });
  it('內嵌密碼都指向存在的密碼 id', () => {
    for (const c of CASES.filter((x) => x.c)) expect(cipherById(c.c![0])).toBeDefined();
  });
  it('判定：大小寫與空白正規化，包含關鍵詞即對', () => {
    const elsie = CASES[1];
    expect(isCorrect(elsie, '  ElSiE ')).toBe(true);
    expect(isCorrect(CASES[2], 'Good   Glass')).toBe(true);
    expect(isCorrect(elsie, '')).toBe(false);
    expect(isCorrect(elsie, 'alice')).toBe(false);
  });
});
