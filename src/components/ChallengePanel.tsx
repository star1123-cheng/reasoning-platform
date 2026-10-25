import { useMemo, useState } from 'react';
import { cipherById } from '../ciphers';
import { CASES, isCorrect } from '../challenges/cases';
import { HintView, PuzzleView } from './HintView';

type Msg = { kind: 'ok' | 'no' | 'hint' | 'sol'; text: string } | null;

export function ChallengePanel() {
  const [cc, setCc] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(() => new Set());
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<Msg>(null);
  const x = CASES[cc];

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
      setSolved((s) => new Set(s).add(cc));
      setMsg({ kind: 'ok', text: x.e });
    } else setMsg({ kind: 'no', text: '還差一點，再想想線索。' });
  };

  return (
    <>
      <p className="desc">依經典推理小說的情節改寫（白話摘要，非原文）。讀完線索，輸入你的推論。</p>
      <div className="chips np">
        {CASES.map((c, i) => (
          <button key={c.t} type="button" className="chip" aria-pressed={i === cc} onClick={() => choose(i)}>
            {c.t}{solved.has(i) ? ' ✓' : ''}<small>{'★'.repeat(c.lv)}</small>
          </button>
        ))}
      </div>
      <article className="box">
        {solved.has(cc) && <span className="stamp">已破案</span>}
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
