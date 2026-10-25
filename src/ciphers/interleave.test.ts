import { describe, expect, it } from 'vitest';
import { interleave } from './interleave';
import { checkCipher, fixedRng } from './testkit';

describe('interleave', () => {
  it('已知向量', () => {
    expect(interleave.encrypt('hi', {}, fixedRng(0)).text).toBe('HAIA');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(interleave));
});
