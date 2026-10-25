import { CIPHERS, cipherById } from '../../ciphers';
import { defaults } from '../../ciphers/util';
import type { PuzzleDef } from '../types';

const CHOICES = CIPHERS.filter((c) => c.lv <= 3);

export const cipherPuzzle: PuzzleDef = {
  kind: 'cipher',
  name: '密碼解碼',
  stars: 2,
  locks: ['letter'],
  desc: '把答案用密碼模組加密，學生照解碼提示還原。',
  sample: { letter: 'LAMP' },
  fields: [{ k: 'cipher', l: '使用的密碼', t: 'select', v: 'caesar', o: CHOICES.map((c) => [c.id, `${'★'.repeat(c.lv)} ${c.name}`]) }],
  check: (_a, f) => (cipherById(f.cipher) ? null : '請選擇一種密碼'),
  build(a, f, { rng }) {
    const c = cipherById(f.cipher)!;
    const result = c.encrypt(a, defaults(c.params), rng);
    return {
      card: [{ k: 'cipher', result }],
      rules: '照解碼提示，把密文一個字母一個字母還原，就是密碼。',
      hints: ['先看解碼提示裡的對照表或規則，再對照密文。', `這是「${c.name}」：${c.desc}`],
      note: result.note,
    };
  },
};
