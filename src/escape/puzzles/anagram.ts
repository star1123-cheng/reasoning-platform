import { shuffleChanged } from '../rng';
import type { PuzzleDef } from '../types';

export const anagramPuzzle: PuzzleDef = {
  kind: 'anagram',
  name: '字母重組',
  stars: 2,
  locks: ['letter'],
  desc: '被打亂的字母加一句提示，重新排成一個英文單字。',
  sample: { letter: 'LENS' },
  fields: [{ k: 'clue', l: '一句提示', t: 'text', v: '放大鏡裡的那片玻璃' }],
  check(a, f) {
    if (new Set(a).size === 1) return '字母全部相同，無法打亂';
    return f.clue?.trim() ? null : '請填寫一句提示';
  },
  build(a, f, { rng }) {
    return {
      card: [{ k: 'big', text: shuffleChanged([...a], rng).join(' ') }, { k: 'p', text: '提示：' + f.clue.trim() }],
      rules: '把這些字母重新排列成一個英文單字。',
      hints: ['先想想提示說的是什麼東西，再用英文拼拼看。', `第一個字母是 ${a[0]}。`],
    };
  },
};
