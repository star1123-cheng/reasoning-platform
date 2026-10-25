import { A } from '../../ciphers/util';
import { shuffle } from '../rng';
import type { PuzzleDef } from '../types';

/** 一行一題：題目｜正確答案｜錯誤選項…（全形或半形直線都可以） */
export const parseQuiz = (text: string) =>
  text.split('\n').map((l) => l.split(/[|｜]/).map((x) => x.trim()).filter(Boolean)).filter((x) => x.length > 0);

export const quizPuzzle: PuzzleDef = {
  kind: 'quiz',
  name: '選擇題答題卡',
  stars: 1,
  locks: ['digit', 'letter'],
  desc: '每題選出正確答案，把選項代號依題號排起來就是密碼。適合複習課堂內容。',
  sample: { digit: '415', letter: 'MAP' },
  fields: [{
    k: 'qs', l: '題目（一行一題：題目｜正確答案｜錯誤選項｜錯誤選項…）', t: 'area',
    v: '台灣最高的山是？｜玉山｜雪山｜合歡山｜阿里山\n一年有幾個月？｜12｜10｜11｜13\n水在攝氏幾度結冰？｜0 度｜10 度｜100 度｜-10 度',
    help: '題數要等於答案的位數；每題 2–4 個選項，第一個選項寫正確答案，系統會自動打亂。',
  }],
  check(a, f) {
    const qs = parseQuiz(f.qs ?? '');
    if (qs.length !== a.length) return `答案有 ${a.length} 位，需要 ${a.length} 題（目前 ${qs.length} 題）`;
    const bad = qs.findIndex((q) => q.length < 3 || q.length > 5);
    return bad >= 0 ? `第 ${bad + 1} 題需要題目加 2–4 個選項` : null;
  },
  build(a, f, { rng }) {
    const pool = /\d/.test(a[0]) ? '0123456789' : A;
    const qs = parseQuiz(f.qs);
    const items = qs.map(([q, right, ...wrong], i) => {
      const others = shuffle([...pool].filter((x) => x !== a[i]), rng).slice(0, wrong.length);
      const opts = shuffle([{ label: a[i], text: right }, ...wrong.map((w, j) => ({ label: others[j], text: w }))], rng);
      return { q, opts };
    });
    return {
      card: [{ k: 'quiz', items }],
      rules: '每題選出正確答案，把它前面的代號依題號順序寫下來，就是密碼。',
      hints: ['一題對應密碼的一位：第 1 題的代號是第 1 位。', `第 1 題的答案是「${qs[0][1]}」。`],
    };
  },
};
