import { describe, expect, it } from 'vitest';
import { digraphs, playfair } from './playfair';
import { checkCipher } from './testkit';

describe('playfair', () => {
  it('已知向量', () => {
    expect(playfair.encrypt('hide the gold in the tree stump', { key: 'PLAYFAIR EXAMPLE' }).text).toBe('BM OD ZB XD NA BE KU DM UI XM MO UV IF');
    // XX 之間補 Q
    expect(digraphs('XX')).toEqual([['X', 'Q'], ['X', 'Q']]);
    expect(digraphs('BALLOON')).toEqual([['B', 'A'], ['L', 'X'], ['L', 'O'], ['O', 'N']]);
  });
  it('凌亂輸入與來回', () => {
    checkCipher(playfair, { spaces: false, pad: true, params: {} });
  });
});
