import { useEffect, useMemo, useState } from 'react';
import { CIPHERS, LEVEL_NAMES, OTHER_CIPHERS, type Params } from '../ciphers';
import { defaults, norm } from '../ciphers/util';
import { HintView, PuzzleView } from './HintView';
import { ParamFields } from './ParamFields';

export function CipherPanel() {
  const [cur, setCur] = useState(0);
  const [answer, setAnswer] = useState('THE KEY IS UNDER THE DESK');
  const [params, setParams] = useState<Params>(() => defaults(CIPHERS[0].params));
  const [nonce, setNonce] = useState(0);
  const [withAns, setWithAns] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');
  const c = CIPHERS[cur];
  const s = norm(answer);

  // 有隨機成分的密碼，按「重新產生」時 nonce 改變才重算
  const r = useMemo(() => (s && nonce >= 0 ? c.encrypt(s, params) : null), [c, s, params, nonce]);

  // 「列印時附答案」勾選當下就套用，Ctrl+P 也有效
  useEffect(() => {
    document.body.classList.toggle('pa', withAns);
    return () => document.body.classList.remove('pa');
  }, [withAns]);

  const choose = (i: number) => {
    setCur(i);
    setParams(defaults(CIPHERS[i].params));
  };

  const copy = async () => {
    if (!r?.text) return;
    try {
      await navigator.clipboard.writeText(r.text);
      setCopyMsg('已複製');
    } catch {
      setCopyMsg('請手動選取複製');
    }
    setTimeout(() => setCopyMsg(''), 1500);
  };

  const isGlyph = !!r?.glyphs;

  return (
    <>
      <div className="chips np">
        {[1, 2, 3, 4, 5].map((lv) => (
          <div className="chip-group" key={lv}>
            <div className="gh">{'★'.repeat(lv)} {LEVEL_NAMES[lv - 1]}</div>
            {CIPHERS.map((x, i) => x.lv === lv && (
              <button key={x.id} type="button" className="chip" aria-pressed={i === cur} onClick={() => choose(i)}>{x.name}</button>
            ))}
          </div>
        ))}
        <div className="chip-group">
          <div className="gh">其他（暫不實作）</div>
          {OTHER_CIPHERS.map(([n, why]) => (
            <button key={n} type="button" className="chip" disabled>{n}<small>步驟太繁瑣：{why}</small></button>
          ))}
        </div>
      </div>

      <div className="box np">
        <p className="desc">難度 {'★'.repeat(c.lv)} {LEVEL_NAMES[c.lv - 1]}　{c.desc}</p>
        <label htmlFor="ans">答案（英文字母，可含空格）</label>
        <textarea id="ans" rows={2} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <ParamFields defs={c.params} values={params} onChange={setParams} prefix="p" />
        <div className="row">
          <button type="button" className="b" onClick={() => setNonce((n) => n + 1)}>重新產生</button>
          <button type="button" className="b g" onClick={copy} disabled={!r?.text} title={isGlyph ? '圖形謎題無法複製成文字，請用列印或截圖' : undefined}>
            {copyMsg || '複製謎題'}
          </button>
          <button type="button" className="b g" onClick={() => window.print()}>列印學習單</button>
          <label className="inline">
            <input type="checkbox" checked={withAns} onChange={(e) => setWithAns(e.target.checked)} />列印時附答案
          </label>
        </div>
      </div>

      <div className="box">
        <span className="stamp">證物 No.{String(cur + 1).padStart(2, '0')}</span>
        <span className="tag">謎題</span>
        {r ? <PuzzleView r={r} /> : <div className="pz empty">請在答案欄輸入至少一個英文字母。</div>}
      </div>
      <div className="box note">
        <span className="tag">解碼提示（發給學生）</span>
        {r && <HintView blocks={r.hint} />}
      </div>
      <div className="box nb">
        <span className="tag">出題者備註</span>
        {r && <p className="mut">答案：{s}{r.note ? '　｜　' + r.note : ''}</p>}
      </div>
    </>
  );
}
