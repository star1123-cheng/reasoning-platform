import type { LockKind } from './types';

export const LOCKS: Record<LockKind, { name: string; rule: string }> = {
  digit: { name: '數字鎖', rule: '3–4 位數字' },
  letter: { name: '字母鎖', rule: '3–6 個英文字母' },
  dir: { name: '方向鎖', rule: '3–8 個方向，可輸入 U D L R 或 ↑ ↓ ← →' },
  free: { name: '關主核對', rule: '任意文字（1–20 字），由老師核對' },
};

const DIR: Record<string, string> = { U: '↑', D: '↓', L: '←', R: '→', '↑': '↑', '↓': '↓', '←': '←', '→': '→', 上: '↑', 下: '↓', 左: '←', 右: '→' };
export const OPPOSITE: Record<string, string> = { '↑': '↓', '↓': '↑', '←': '→', '→': '←' };
export const DIR_NAME: Record<string, string> = { '↑': '上', '↓': '下', '←': '左', '→': '右' };

/** 依鎖的種類正規化答案（學生作答與老師設定都用這個） */
export function normAnswer(lock: LockKind, raw: string): string {
  switch (lock) {
    case 'digit': return raw.replace(/\D/g, '');
    case 'letter': return raw.toUpperCase().replace(/[^A-Z]/g, '');
    case 'dir': return [...raw.toUpperCase()].map((c) => DIR[c] ?? '').join('');
    case 'free': return raw.trim().replace(/\s+/g, ' ').toUpperCase();
  }
}

/** 正規化後的答案是否符合鎖的格式；回傳錯誤訊息或 null */
export function lockError(lock: LockKind, a: string): string | null {
  switch (lock) {
    case 'digit':
      return /^\d{3,4}$/.test(a) ? null : '數字鎖需要 3–4 位數字';
    case 'letter':
      return /^[A-Z]{3,6}$/.test(a) ? null : '字母鎖需要 3–6 個英文字母';
    case 'dir': {
      const d = [...a];
      if (d.length < 3 || d.length > 8) return '方向鎖需要 3–8 個方向';
      for (let i = 1; i < d.length; i++) {
        if (d[i] === d[i - 1]) return `第 ${i} 和第 ${i + 1} 個方向相同；迷宮題要轉彎才讀得出來`;
        if (OPPOSITE[d[i]] === d[i - 1]) return `第 ${i} 和第 ${i + 1} 個方向相反（直接回頭），請換一個方向`;
      }
      return null;
    }
    case 'free':
      return a.length >= 1 && a.length <= 20 ? null : '答案需要 1–20 個字';
  }
}
