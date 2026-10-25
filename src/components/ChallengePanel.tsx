import { useEffect, useMemo, useState } from 'react';
import { cipherById } from '../ciphers';
import { CASES, isCorrect } from '../challenges/cases';
import { load, save } from '../storage';
import { HintView, PuzzleView } from './HintView';

type Msg = { kind: 'ok' | 'no' | 'hint' | 'sol'; text: string } | null;

const KEY = 'rp-solved';
const LV_NAME = ['入門', '進階', '高手'];

export function ChallengePanel() {
  const [cc, setCc] = useState(0);
  // 已破案以標題記錄並存在瀏覽器，重新整理不會消失；案件增減也不會錯位
  const [solved, setSolved] = useState<Set<string>>(() => {
    const v = load<unknown>(KEY, []);
    return new Set(Array.isArray(v) ? v.filter((t) => CASES.some((c) => c.t === t)) : []);
  });
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<Msg>(null);
  const x = CASES[cc];

  useEffect(() => save(KEY, [...solved]), [solved]);

  const puzzle = useMemo(() => {
    if (!x.c) return null;
    const [id, plain, p] = x.c;
    return cipherById(id)!.encrypt(plain, p);
  }, [x]);

  const choose = (i: number) => {
    setCc(i);
    setInput('');
    setMsg(null);
  };

  const check = () => {
    if (isCorrect(x, input)) {
      setSolved((s) => new Set(s).add(x.t));
      setMsg({ kind: 'ok', text: x.e });
    } else setMsg({ kind: 'no', text: '還差一點，再想想線索。' });
  };

  return (
    <>
      <p className="desc">依經典推理小說的情節改寫（白話摘要，非原文）。讀完線索，輸入你的推論。已破案 {solved.size} / {CASES.length} 案。</p>
      <div className="chips np">
        {[1, 2, 3].map((lv) => (
          <div className="chip-group" key={lv}>
            <div className="gh">{'★'.repeat(lv)} {LV_NAME[lv - 1]}</div>
            {CASES.map((c, i) => c.lv === lv && (
              <button key={c.t} type="button" className="chip" aria-pressed={i === cc} onClick={() => choose(i)}>
                {c.t}{solved.has(c.t) ? ' ✓' : ''}
              </button>
            ))}
          </div>
        ))}
        {solved.size > 0 && (
          <button type="button" className="b g sm" onClick={() => window.confirm('要清除所有「已破案」紀錄嗎？') && setSolved(new Set())}>清除破案紀錄</button>
        )}
      </div>
      <article className="box">
        {solved.has(x.t) && <span className="stamp">已破案</span>}
        <span className="tag">案件 {cc + 1}</span>
        <h2 className="case-t">{x.t}</h2>
        <p className="sub">{x.au}　難度 {'★'.repeat(x.lv)}</p>
        <p>{x.s}</p>
        {puzzle && (
          <>
            <PuzzleView r={puzzle} />
            <details>
              <summary>解碼對照表</summary>
              <HintView blocks={puzzle.hint} />
            </details>
          </>
        )}
        <p><b>{x.q}</b></p>
        <label htmlFor="ca">你的推論</label>
        <input id="ca" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} />
        <div className="row">
          <button type="button" className="b" onClick={check}>檢查答案</button>
          <button type="button" className="b g" onClick={() => setMsg({ kind: 'hint', text: x.h })}>提示</button>
          <button type="button" className="b g" onClick={() => setMsg({ kind: 'sol', text: x.e })}>看解答</button>
        </div>
        <p aria-live="polite">
          {msg?.kind === 'ok' && <><b>破案！</b>{msg.text}</>}
          {msg?.kind === 'no' && msg.text}
          {msg?.kind === 'hint' && '提示：' + msg.text}
          {msg?.kind === 'sol' && '解答：' + msg.text}
        </p>
      </article>
    </>
  );
}
