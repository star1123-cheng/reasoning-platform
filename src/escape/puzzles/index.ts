import type { PuzzleDef, PuzzleKind } from '../types';
import { anagramPuzzle } from './anagram';
import { cipherPuzzle } from './cipher';
import { clockPuzzle } from './clock';
import { colorPuzzle } from './color';
import { coordsPuzzle } from './coords';
import { countPuzzle } from './count';
import { equationPuzzle } from './equation';
import { mazePuzzle } from './maze';
import { mirrorPuzzle } from './mirror';
import { orderPuzzle } from './order';
import { quizPuzzle } from './quiz';
import { wordsearchPuzzle } from './wordsearch';

export const PUZZLES: PuzzleDef[] = [
  cipherPuzzle, quizPuzzle, orderPuzzle, wordsearchPuzzle, mazePuzzle, clockPuzzle,
  equationPuzzle, countPuzzle, coordsPuzzle, mirrorPuzzle, colorPuzzle, anagramPuzzle,
];

export const puzzleOf = (k: PuzzleKind): PuzzleDef => PUZZLES.find((p) => p.kind === k)!;

/** 實體道具建議：不自動產生，只列做法 */
export const PROPS: { name: string; how: string; time: string; pair: string }[] = [
  { name: '紫外光隱形墨水', how: '用螢光筆或隱形墨水筆寫下答案，學生用紫外光手電筒照出來。', time: '約 10 分鐘', pair: '鏡像文字、座標地圖' },
  { name: '透明片疊合', how: '把答案拆成兩張透明片上的筆畫，疊在一起才看得出來。', time: '約 20 分鐘', pair: '數一數、符號算式' },
  { name: '拼圖', how: '把印好的線索卡剪成 6–9 塊，拼好才看得到謎題。', time: '約 5 分鐘', pair: '任何線索卡' },
  { name: '實體鑰匙與磁鐵', how: '鑰匙放進上鎖的盒子，或用磁鐵吸在桌子底下。', time: '約 5 分鐘', pair: '關主核對' },
  { name: '聲音或錄音線索', how: '用手機錄一段敲擊聲、摩斯音或倒放的語音，學生要聽出內容。', time: '約 15 分鐘', pair: '密碼解碼（摩斯、敲擊）' },
  { name: '藏物', how: '把下一張線索卡夾在書頁、貼在抽屜底部或放進信封。', time: '約 5 分鐘', pair: '任何線索卡' },
];
