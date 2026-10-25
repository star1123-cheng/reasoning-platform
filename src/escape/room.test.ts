import { describe, expect, it } from 'vitest';
import { lockError, normAnswer } from './locks';
import { buildRoom, newStage, SAMPLE_ROOM, sanitizeRoom, splitFinal } from './room';

describe('鎖', () => {
  it('正規化：數字、字母、方向', () => {
    expect(normAnswer('digit', ' 3-4 5 ')).toBe('345');
    expect(normAnswer('letter', 'la mp!')).toBe('LAMP');
    expect(normAnswer('dir', 'u r d →')).toBe('↑→↓→');
  });
  it('方向鎖不可連續相同或直接回頭', () => {
    expect(lockError('dir', '↑↑→')).toContain('相同');
    expect(lockError('dir', '↑↓→')).toContain('相反');
    expect(lockError('dir', '↑→↓')).toBeNull();
    expect(lockError('digit', '12')).not.toBeNull();
    expect(lockError('letter', 'ABCDEFG')).not.toBeNull();
  });
});

describe('碎片', () => {
  it('字數不多於關數：一關一字，多的關卡沒有碎片', () => {
    expect(splitFinal('FREE', 5)).toEqual(['F', 'R', 'E', 'E', '']);
    expect(splitFinal('', 2)).toEqual(['', '']);
  });
  it('字數多於關數：平均分段', () => {
    expect(splitFinal('ABCDEFG', 3)).toEqual(['ABC', 'DE', 'FG']);
  });
});

describe('範例房間', () => {
  it('5 關全部可產生，碎片拼成 TRUTH', () => {
    const r = buildRoom(SAMPLE_ROOM);
    expect(r.ok).toBe(true);
    expect(r.stages.map((s) => s.fragment).join('')).toBe('TRUTH');
  });
  it('答案不合格時標出錯誤並暫停產出', () => {
    const r = buildRoom({ ...SAMPLE_ROOM, stages: [{ ...newStage('clock'), answer: '999' }] });
    expect(r.ok).toBe(false);
    expect(r.stages[0].error).toContain('時鐘');
  });
  it('顏色題的對照表印在前一關背面；第 1 關則放答案紙', () => {
    const r = buildRoom({ ...SAMPLE_ROOM, stages: [newStage('clock'), newStage('color')] });
    expect(r.stages[0].back?.title).toBe('顏色對照表');
    const r2 = buildRoom({ ...SAMPLE_ROOM, stages: [newStage('color')] });
    expect(r2.sheetExtra?.title).toBe('顏色對照表');
  });
});

describe('匯入檢查', () => {
  it('合格資料原樣通過', () => {
    expect(sanitizeRoom(JSON.parse(JSON.stringify(SAMPLE_ROOM)))).toEqual(SAMPLE_ROOM);
  });
  it('格式錯誤時丟出中文錯誤', () => {
    expect(() => sanitizeRoom(null)).toThrow('不是房間資料');
    expect(() => sanitizeRoom({ ...SAMPLE_ROOM, v: 2 })).toThrow('版本');
    expect(() => sanitizeRoom({ ...SAMPLE_ROOM, stages: [] })).toThrow('關卡數');
    expect(() => sanitizeRoom({ ...SAMPLE_ROOM, title: 'x'.repeat(41) })).toThrow('房間名稱');
    expect(() => sanitizeRoom({ ...SAMPLE_ROOM, stages: [{ ...SAMPLE_ROOM.stages[0], kind: 'hack' }] })).toThrow('謎題類型');
  });
});
