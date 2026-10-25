import type { Cipher } from './types';
import { caesar } from './caesar';
import { atbash } from './atbash';
import { morse } from './morse';
import { keyboard } from './keyboard';
import { interleave } from './interleave';
import { a1z26 } from './a1z26';
import { phone } from './phone';
import { acrostic } from './acrostic';
import { polybius } from './polybius';
import { railfence } from './railfence';
import { scytale } from './scytale';
import { pigpen } from './pigpen';
import { dancingmen } from './dancingmen';
import { goldbug } from './goldbug';
import { keyword } from './keyword';
import { tapcode } from './tapcode';
import { bacon } from './bacon';
import { binary } from './binary';
import { vigenere } from './vigenere';
import { beale } from './beale';
import { affine } from './affine';
import { beaufort } from './beaufort';
import { columnar } from './columnar';
import { playfair } from './playfair';
import { foursquare } from './foursquare';
import { bifid } from './bifid';
import { adfgvx } from './adfgvx';

export * from './types';

/** 依選單順序（難度分組）排列；證物編號＝索引＋1 */
export const CIPHERS: Cipher[] = [
  caesar, atbash, morse, keyboard, interleave, a1z26, phone, acrostic,
  polybius, railfence, scytale, pigpen, dancingmen, goldbug, keyword, tapcode, bacon, binary,
  vigenere, beale, affine, beaufort, columnar,
  playfair, foursquare, bifid,
  adfgvx,
];

export const cipherById = (id: string): Cipher | undefined => CIPHERS.find((c) => c.id === id);

export const LEVEL_NAMES = ['入門', '進階', '挑戰', '高手', '專家'];

/** 暫不實作，只在選單列出並停用 */
export const OTHER_CIPHERS: [string, string][] = [
  ['Enigma 恩尼格瑪', '三個轉子加接線板，要模擬整台機器'],
  ['旋轉柵格 Grille', '需要實體鏤空卡，並旋轉四次'],
  ['Nihilist 虛無主義', '方陣座標再做數字加法'],
  ['Porta', '13 組字母表，兩兩互換'],
  ['Autokey', '金鑰接上明文，逐字展開'],
];
