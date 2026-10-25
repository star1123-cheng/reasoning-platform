import { describe, expect, it } from 'vitest';
import { railfence } from './railfence';
import { checkCipher } from './testkit';

describe('railfence', () => {
  it('已知向量', () => {
    expect(railfence.encrypt('WE ARE DISCOVERED FLEE AT ONCE', { n: 3 }).text).toBe('WECRLTEERDSOEEFEAOCAIVDEN');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(railfence, { spaces: false }));
});
