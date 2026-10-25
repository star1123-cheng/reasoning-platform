import { describe, expect, it } from 'vitest';
import { foursquare } from './foursquare';
import { checkCipher } from './testkit';

describe('foursquare', () => {
  it('已知向量', () => {
    // 本平台方陣採 I/J 同格（維基百科範例是拿掉 Q，結果不同）；以下為手算驗證
    expect(foursquare.encrypt('help', { k1: 'EXAMPLE', k2: 'KEYWORD' }).text).toBe('FY NF');
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(foursquare, { spaces: false, pad: true }));
});
