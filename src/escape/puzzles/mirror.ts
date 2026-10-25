import type { PuzzleDef } from '../types';

export const mirrorText = (a: string, sentence: string) =>
  (sentence.includes('{答案}') ? sentence : `${sentence.trim()} {答案}`).replace('{答案}', a);

export const mirrorPuzzle: PuzzleDef = {
  kind: 'mirror',
  name: '鏡像文字',
  stars: 1,
  locks: ['digit', 'letter', 'dir', 'free'],
  desc: '左右顛倒的文字，用鏡子或對著燈從背面讀。',
  sample: { digit: '9047', letter: 'OPEN', dir: '←↑→↓', free: '書架第三層' },
  fields: [{ k: 'sentence', l: '句子（用 {答案} 標出答案的位置）', t: 'text', v: '密碼是 {答案}' }],
  check: (_a, f) => ((f.sentence ?? '').length <= 60 ? null : '句子最多 60 字'),
  build(a, f) {
    const first = [...a][0];
    return {
      card: [{ k: 'big', text: mirrorText(a, f.sentence ?? ''), mirror: true }],
      rules: '這段文字左右顛倒了。拿鏡子照，或把紙翻到背面對著光看。',
      hints: ['文字是反的，從右往左一個字一個字讀也可以。', `答案的第一個字是「${first}」。`],
    };
  },
};
