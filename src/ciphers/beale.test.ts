import { describe, expect, it } from 'vitest';
import { BOOK, beale, bookWords } from './beale';
import { checkCipher, fixedRng } from './testkit';

describe('beale', () => {
  it('已知向量', () => {
    expect(beale.encrypt('ab', { b: BOOK }, fixedRng(0)).text).toBe('1 2');
    const r = beale.encrypt('THE KEY IS UNDER THE DESK', { b: BOOK });
    expect(r.text).not.toContain('?');
    expect(r.note).toBe('書中字母足夠');
    // 預設書本 A–Z 都有開頭字
    expect(new Set(bookWords(BOOK).map((w) => w[0].toUpperCase())).size).toBe(26);
    expect(beale.encrypt('q', { b: 'only words' }).note).toContain('Q');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(beale));
});
