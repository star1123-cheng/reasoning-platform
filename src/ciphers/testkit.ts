// 各密碼測試共用：正規化（大小寫、標點、數字、多餘空白）與加解密來回
import { expect } from 'vitest';
import type { Cipher, Params } from './types';
import { defaults, letters, norm } from './util';

export const fixedRng = (v = 0) => () => v;

const MESSY = '  the Key, is 42   UNDER the desk!! ';
const CLEAN = 'THE KEY IS UNDER THE DESK';

type Opts = {
  params?: Params;
  /** 解密結果是否保留單字空白（換位類不保留） */
  spaces?: boolean;
  /** 解密結果結尾可能有補位 X */
  pad?: boolean;
  /** 解密後預期的改變（例如 Tap Code 的 K 會變成 C） */
  fix?: (s: string) => string;
};

export function checkCipher(c: Cipher, o: Opts = {}) {
  const p = { ...defaults(c.params), ...o.params };
  const messy = c.encrypt(MESSY, p, fixedRng(0.37)), clean = c.encrypt(CLEAN, p, fixedRng(0.37));
  // 非字母字元一律忽略：凌亂輸入與乾淨輸入產生相同謎題
  expect(messy).toEqual(clean);
  // 文字或圖形二擇一，提示不可為空
  expect(Boolean(clean.text) || Boolean(clean.glyphs?.length)).toBe(true);
  expect(clean.hint.length).toBeGreaterThan(0);
  if (clean.text) expect(clean.text).not.toMatch(/undefined|NaN/);
  if (c.decrypt && clean.text) {
    let back = c.decrypt(clean.text, p);
    const base = o.spaces === false ? letters(CLEAN) : norm(CLEAN);
    const want = o.fix ? o.fix(base) : base;
    if (o.spaces === false) back = back.replace(/\s/g, '');
    if (o.pad) back = back.slice(0, want.length);
    expect(back).toBe(want);
  }
}
