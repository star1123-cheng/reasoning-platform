import { describe, expect, it } from 'vitest';
import { pigpen } from './pigpen';
import { pigShape } from './glyphs';
import { checkCipher } from './testkit';

describe('pigpen', () => {
  it('已知向量', () => {
    const shapes = new Set([...Array(26).keys()].map((i) => JSON.stringify(pigShape(i))));
    expect(shapes.size).toBe(26);
    expect(pigpen.encrypt('ab c', {}).glyphs).toEqual([[{ k: 'pig', i: 0 }, { k: 'pig', i: 1 }], [{ k: 'pig', i: 2 }]]);
  });
  it('分層提示卡：由淺到深，最後一張才是完整對照表', () => {
    const levels = pigpen.encrypt('THE KEY IS UNDER THE DESK', {}).hint.find((b) => b.k === 'levels');
    if (levels?.k !== 'levels') throw new Error('缺少分層提示卡');
    expect(levels.cards).toHaveLength(4);
    // 提示卡 2：明文中最常出現的兩個字母（E 五次；T、H、K 都兩次，取先出現的 T）
    const ex = levels.cards[1].find((b) => b.k === 'legend');
    expect(ex?.k === 'legend' && ex.items.map((x) => x.label)).toEqual(['E', 'T']);
    expect(levels.cards[2].some((b) => b.k === 'pigGrid')).toBe(true);
    const full = levels.cards[3].find((b) => b.k === 'legend');
    expect(full?.k === 'legend' && full.items).toHaveLength(26);
    // 前三張不能出現完整對照表
    for (const c of levels.cards.slice(0, 3)) {
      for (const b of c) if (b.k === 'legend') expect(b.items.length).toBeLessThan(26);
    }
  });
  it('共用檢查：大小寫、標點、來回', () => checkCipher(pigpen));
});
