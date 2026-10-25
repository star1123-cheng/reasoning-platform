import { useState } from 'react';
import { CardBlockView, ClueCard, lockSize } from './CardView';
import { LOCKS } from './locks';
import { puzzleOf } from './puzzles';
import type { BuiltRoom } from './room';
import type { Room } from './types';

const DOCS = [
  { id: 'master', name: '關主總表' },
  { id: 'cards', name: '線索卡' },
  { id: 'sheet', name: '答案紙' },
  { id: 'hints', name: '提示表' },
] as const;
type DocId = (typeof DOCS)[number]['id'];

const Blanks = ({ n }: { n: number }) => <div className="blanks">{Array.from({ length: n }, (_, i) => <span key={i} />)}</div>;

export function PrintDocs({ room, built, onReseed }: { room: Room; built: BuiltRoom; onReseed: () => void }) {
  const [on, setOn] = useState<Record<DocId, boolean>>({ master: true, cards: true, sheet: true, hints: true });
  const st = built.stages;
  return (
    <>
      <div className="box np">
        <p className="desc">勾選要印的文件，每一份都會從新的一頁開始。關主總表與提示表只給老師。</p>
        <div className="row">
          {DOCS.map((d) => (
            <label key={d.id} className="inline" style={{ marginTop: 0 }}>
              <input type="checkbox" checked={on[d.id]} onChange={(e) => setOn({ ...on, [d.id]: e.target.checked })} />{d.name}
            </label>
          ))}
        </div>
        <div className="row">
          <button type="button" className="b" onClick={() => window.print()}>列印勾選的文件</button>
          <button type="button" className="b g" onClick={onReseed}>重新排版謎題</button>
        </div>
      </div>

      <section className={`doc${on.master ? '' : ' off'}`} aria-label="關主總表">
        <div className="box">
          <span className="tag">只給老師</span>
          <h2 className="doc-title">{room.title}・關主總表</h2>
          <p className="mut">{room.intro}</p>
          <div className="sc">
            <table className="sheet">
              <thead><tr><th>關</th><th>謎題</th><th>鎖</th><th>答案</th><th>碎片</th><th>擺放方式</th></tr></thead>
              <tbody>
                {st.map((s, i) => (
                  <tr key={i}>
                    <td>{s.no}</td>
                    <td>{puzzleOf(s.stage.kind).name}{s.built?.note ? <div className="mut">{s.built.note}</div> : null}</td>
                    <td>{LOCKS[s.stage.lock].name}</td>
                    <td><b>{s.answer}</b></td>
                    <td>{s.fragment || '—'}</td>
                    <td>
                      {i === 0 ? '開場時直接發給各組' : `鎖在第 ${i} 關的${LOCKS[st[i - 1].stage.lock].name}後面（或交給關主）`}
                      {s.back ? `；卡片背面印「${s.back.title}」` : ''}
                      {i === 0 && built.sheetExtra ? `；${built.sheetExtra.title}印在答案紙上` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {built.final && <p>最終密語：<b>{built.final}</b>（碎片依關卡順序拼起來）</p>}
        </div>
      </section>

      <section className={`doc${on.cards ? '' : ' off'}`} aria-label="線索卡">
        {st.map((s) => <ClueCard key={s.no} s={s} hard={room.hard} />)}
      </section>

      <section className={`doc${on.sheet ? '' : ' off'}`} aria-label="答案紙">
        <div className="box">
          <span className="tag">答案紙</span>
          <h2 className="doc-title">{room.title}</h2>
          <p>班級代號＋座號：＿＿＿＿＿＿＿（例如 50101）</p>
          {room.intro && <p className="mut">{room.intro}</p>}
          <div className="sc">
            <table className="sheet">
              <thead><tr><th>關</th><th>答案</th>{built.final && <th>碎片</th>}</tr></thead>
              <tbody>
                {st.map((s) => (
                  <tr key={s.no}>
                    <td>{s.no}</td>
                    <td>{s.stage.lock === 'free' ? '＿＿＿＿＿＿＿＿' : <Blanks n={[...s.answer].length} />}<div className="mut">{lockSize(s.stage.lock, s.answer)}</div></td>
                    {built.final && <td>{s.fragment ? <Blanks n={[...s.fragment].length} /> : '—'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {built.final && <><p>最終密語：</p><Blanks n={[...built.final].length} /></>}
          {built.sheetExtra && (
            <div className="box note" style={{ marginTop: 12 }}>
              <span className="tag">{built.sheetExtra.title}</span>
              {built.sheetExtra.blocks.map((b, i) => <CardBlockView key={i} b={b} />)}
            </div>
          )}
        </div>
      </section>

      <section className={`doc${on.hints ? '' : ' off'}`} aria-label="提示表">
        <div className="box">
          <span className="tag">只給老師</span>
          <h2 className="doc-title">{room.title}・提示表</h2>
          <p className="mut">學生卡關時依序給：方向提示 → 關鍵提示 → 答案。</p>
          <div className="sc">
            <table className="sheet">
              <thead><tr><th>關</th><th>1. 方向提示</th><th>2. 關鍵提示</th><th>3. 答案</th></tr></thead>
              <tbody>
                {st.map((s) => s.built && (
                  <tr key={s.no}>
                    <td>{s.no}</td>
                    <td>{room.hard ? s.built.rules : s.built.hints[0]}</td>
                    <td>{s.built.hints[1]}</td>
                    <td><b>{s.answer}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
