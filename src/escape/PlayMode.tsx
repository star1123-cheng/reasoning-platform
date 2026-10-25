import { useState } from 'react';
import { CardBlockView, ClueCard } from './CardView';
import { normAnswer } from './locks';
import { normFinal, type BuiltRoom } from './room';
import type { Room } from './types';

type Phase = 'intro' | 'stage' | 'final' | 'done';

export function PlayMode({ room, built }: { room: Room; built: BuiltRoom }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [cur, setCur] = useState(0);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');
  const [hintLv, setHintLv] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [started, setStarted] = useState(0);
  const [doneAt, setDoneAt] = useState(0);
  const [code, setCode] = useState('');
  const st = built.stages, s = st[cur];

  const reset = () => {
    setPhase('intro'); setCur(0); setInput(''); setMsg(''); setHintLv(0); setHintsUsed(0); setWrong(0); setCode('');
  };
  const finish = () => { setDoneAt(Date.now()); setPhase('done'); };

  const check = () => {
    if (phase === 'final') {
      if (normFinal(input) === built.final) finish();
      else { setWrong((w) => w + 1); setMsg('密語不對，檢查一下碎片的順序。'); }
      return;
    }
    if (normAnswer(s.stage.lock, input) === s.answer) {
      setMsg(s.fragment ? `解鎖成功！得到碎片「${s.fragment}」。` : '解鎖成功！');
      setInput(''); setHintLv(0);
      if (cur + 1 < st.length) setCur(cur + 1);
      else if (built.final) setPhase('final');
      else finish();
    } else {
      setWrong((w) => w + 1);
      setMsg('鎖沒有打開，再試一次。');
    }
  };

  const nextHint = () => { setHintLv((h) => Math.min(3, h + 1)); setHintsUsed((n) => n + 1); };

  const frags = (
    built.final ? (
      <div className="frags" aria-label="已收集的碎片">
        {st.map((x, i) => x.fragment && <span key={i} className={i < cur || phase !== 'stage' ? 'lit' : ''}>{i < cur || phase !== 'stage' ? x.fragment : '？'}</span>)}
      </div>
    ) : null
  );

  if (phase === 'intro') {
    return (
      <div className="box">
        <span className="tag">線上試玩</span>
        <h2 className="doc-title">{room.title}</h2>
        <p>{room.intro}</p>
        <p className="mut">共 {st.length} 關。答錯不扣分，卡關時可以看提示。資料只存在這個頁面，不會上傳。</p>
        <button type="button" className="b" onClick={() => { setStarted(Date.now()); setPhase('stage'); }}>開始挑戰</button>
      </div>
    );
  }

  if (phase === 'done') {
    const valid = /^\d{4,6}$/.test(code);
    const mins = Math.max(1, Math.round((doneAt - started) / 60000));
    return (
      <div className="box cert">
        <span className="tag">完成證書</span>
        <h2 className="doc-title">{room.title}</h2>
        <label htmlFor="cert-code">班級代號＋座號（例如 50101）</label>
        <input id="cert-code" inputMode="numeric" value={code} maxLength={6} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} style={{ maxWidth: 200, textAlign: 'center' }} />
        {valid && (
          <>
            <p><b>{code}</b> 成功逃出密室！</p>
            <p className="mut">用時約 {mins} 分鐘・看了 {hintsUsed} 次提示・嘗試錯誤 {wrong} 次</p>
            <span className="stamp">老師認證</span>
          </>
        )}
        <div className="row" style={{ justifyContent: 'center' }}>
          <button type="button" className="b g" onClick={() => window.print()} disabled={!valid}>列印證書</button>
          <button type="button" className="b g np" onClick={reset}>再玩一次</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="box np">
        <div className="stage-h">
          <span>{phase === 'final' ? '最後一步' : `第 ${cur + 1} / ${st.length} 關`}</span>
          <button type="button" className="b g sm" onClick={reset}>重新開始</button>
        </div>
        {frags}
      </div>
      {phase === 'stage' && <ClueCard s={s} hard={room.hard} showBack={false} />}
      {phase === 'stage' && cur > 0 && st[cur - 1].back && (
        <details className="box note">
          <summary>翻看上一張卡片的背面</summary>
          <ClueBack built={built} i={cur - 1} />
        </details>
      )}
      {phase === 'stage' && cur === 0 && built.sheetExtra && (
        <details className="box note">
          <summary>答案紙上的{built.sheetExtra.title}</summary>
          <ClueBack built={built} i={-1} />
        </details>
      )}
      <div className="box">
        <label htmlFor="play-ans">{phase === 'final' ? '把碎片拼成最終密語' : '輸入答案'}</label>
        <input id="play-ans" value={input} autoComplete="off" onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} />
        <div className="row">
          <button type="button" className="b" onClick={check}>{phase === 'final' ? '逃出密室' : '開鎖'}</button>
          {phase === 'stage' && <button type="button" className="b g" onClick={nextHint} disabled={hintLv >= 3}>{hintLv === 0 ? '看提示' : hintLv < 3 ? '下一段提示' : '已看完提示'}</button>}
        </div>
        <p aria-live="polite">{msg}</p>
        {phase === 'stage' && hintLv > 0 && s.built && (
          <ol className="mut">
            <li>{room.hard ? s.built.rules : s.built.hints[0]}</li>
            {hintLv > 1 && <li>{s.built.hints[1]}</li>}
            {hintLv > 2 && <li>答案：{s.answer}</li>}
          </ol>
        )}
      </div>
    </>
  );
}

function ClueBack({ built, i }: { built: BuiltRoom; i: number }) {
  const back = i < 0 ? built.sheetExtra : built.stages[i].back;
  return <>{back?.blocks.map((b, j) => <CardBlockView key={j} b={b} />)}</>;
}
