import { describe, expect, it } from 'vitest';
import { cipherById } from '../ciphers';
import { CASES, isCorrect } from './cases';

const byTitle = (t: string) => CASES.find((c) => c.t === t)!;

describe('精選挑戰', () => {
  it('共 16 案，難度 1–3，標題不重複且依難度排序', () => {
    expect(CASES).toHaveLength(16);
    expect(CASES.every((c) => c.lv >= 1 && c.lv <= 3)).toBe(true);
    expect(new Set(CASES.map((c) => c.t)).size).toBe(CASES.length);
    expect(CASES.map((c) => c.lv)).toEqual([...CASES.map((c) => c.lv)].sort());
  });
  it('內嵌密碼都指向存在的密碼 id，且解得回答案、不出現 ?', () => {
    for (const c of CASES.filter((x) => x.c)) {
      const [id, plain, p] = c.c!;
      const cipher = cipherById(id);
      expect(cipher).toBeDefined();
      const r = cipher!.encrypt(plain, p);
      if (r.text) expect(r.text).not.toContain('?');
      if (cipher!.decrypt) expect(cipher!.decrypt(r.text!, p)).toBe(plain);
      expect(isCorrect(c, plain)).toBe(true);
    }
  });
  it('每案的解答說明都會被判對', () => {
    for (const c of CASES) expect(isCorrect(c, c.e)).toBe(true);
  });
  it('判定：大小寫與空白正規化，包含關鍵詞即對', () => {
    const elsie = byTitle('跳舞的人');
    expect(isCorrect(elsie, '  ElSiE ')).toBe(true);
    expect(isCorrect(byTitle('金甲蟲'), 'Good   Glass')).toBe(true);
    expect(isCorrect(elsie, '')).toBe(false);
    expect(isCorrect(elsie, 'alice')).toBe(false);
  });
  it('排除詞：「不熟」不會因為含「熟」而判對', () => {
    const c = byTitle('銀斑駒');
    expect(isCorrect(c, '是熟人')).toBe(true);
    expect(isCorrect(c, '狗跟他不熟')).toBe(false);
    expect(isCorrect(byTitle('歪唇男人'), '乞丐和他不是同一個人')).toBe(false);
  });
  it('英文關鍵詞以單字邊界比對：paper 不會配到 ape', () => {
    const c = byTitle('莫格街凶殺案');
    expect(isCorrect(c, 'an ape')).toBe(true);
    expect(isCorrect(c, 'paper')).toBe(false);
  });
  it('字條藏字題：每隔兩個字讀一個就是答案', () => {
    const w = byTitle('格洛里亞・斯科特號').s.match(/「(.+)」/)![1].replace(/[^A-Za-z ]/g, '').split(' ');
    expect(w.filter((_, i) => i % 3 === 0).join(' ').toLowerCase()).toBe('the game is up');
  });
});
