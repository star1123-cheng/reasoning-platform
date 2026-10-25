import { LOCKS } from './locks';
import { PUZZLES, puzzleOf } from './puzzles';
import { MAX_STAGES, newStage, stageError } from './room';
import type { FieldDef, PuzzleKind, Room, Stage } from './types';

function FieldInput({ f, value, onChange, id }: { f: FieldDef; value: string; onChange: (v: string) => void; id: string }) {
  return (
    <div>
      <label htmlFor={id}>{f.l}</label>
      {f.t === 'select' ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {f.o!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      ) : f.t === 'area' ? (
        <textarea id={id} rows={4} value={value} maxLength={2000} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} value={value} maxLength={200} onChange={(e) => onChange(e.target.value)} />
      )}
      {f.help && <p className="mut" style={{ margin: '2px 0 0' }}>{f.help}</p>}
    </div>
  );
}

/** 收合時的一行摘要：第幾關、謎題、鎖、答案與是否正確 */
function StageSummary({ s, i, err, open, onToggle }: { s: Stage; i: number; err: string | null; open: boolean; onToggle: () => void }) {
  const def = puzzleOf(s.kind);
  return (
    <button type="button" className="stage-row" aria-expanded={open} aria-controls={`st${i}-body`} onClick={onToggle}>
      <span className="stage-no">{i + 1}</span>
      <span className="stage-sum">
        <b>{def.name}</b>
        <span className="mut">{LOCKS[s.lock].name}・答案 {s.answer || '（未填）'}</span>
      </span>
      <span className={err ? 'stage-st bad' : 'stage-st ok'}>{err ? '要修正' : '✓'}</span>
      <span className="stage-caret" aria-hidden="true">{open ? '收合 ▲' : '編輯 ▼'}</span>
    </button>
  );
}

function StageEditor({ s, i, n, onChange, onMove, onRemove }: {
  s: Stage; i: number; n: number;
  onChange: (s: Stage) => void; onMove: (d: -1 | 1) => void; onRemove: () => void;
}) {
  const def = puzzleOf(s.kind), err = stageError(s), id = `st${i}`;
  const setKind = (k: PuzzleKind) => onChange({ ...newStage(k, s.scene) });
  const setLock = (lock: Stage['lock']) => onChange({ ...s, lock, answer: def.sample[lock] ?? '' });
  return (
    <div className="stage-body" id={`${id}-body`}>
      <div className="grid2">
        <div>
          <label htmlFor={`${id}-kind`}>① 謎題類型</label>
          <select id={`${id}-kind`} value={s.kind} onChange={(e) => setKind(e.target.value as PuzzleKind)}>
            {PUZZLES.map((p) => <option key={p.kind} value={p.kind}>{'★'.repeat(p.stars)} {p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-lock`}>② 鎖</label>
          {def.locks.length > 1 ? (
            <select id={`${id}-lock`} value={s.lock} onChange={(e) => setLock(e.target.value as Stage['lock'])}>
              {def.locks.map((l) => <option key={l} value={l}>{LOCKS[l].name}</option>)}
            </select>
          ) : (
            <p className="fixed" id={`${id}-lock`}>{LOCKS[s.lock].name}<span className="mut">（這種謎題只能用這種鎖）</span></p>
          )}
        </div>
      </div>
      <p className="mut" style={{ margin: '4px 0 0' }}>{def.desc}</p>
      <label htmlFor={`${id}-ans`}>③ 答案（{LOCKS[s.lock].rule}）</label>
      <input id={`${id}-ans`} value={s.answer} maxLength={40} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} onChange={(e) => onChange({ ...s, answer: e.target.value })} />
      {s.lock === 'dir' && (
        <div className="row" style={{ marginTop: 6 }}>
          {['↑', '↓', '←', '→'].map((d) => (
            <button key={d} type="button" className="b g sm" onClick={() => onChange({ ...s, answer: s.answer + d })} aria-label={`加上 ${d}`}>{d}</button>
          ))}
          <button type="button" className="b g sm" onClick={() => onChange({ ...s, answer: [...s.answer].slice(0, -1).join('') })}>退格</button>
        </div>
      )}
      {err && <p className="err" id={`${id}-err`} role="alert">{err}</p>}
      {def.fields.map((f) => (
        <FieldInput key={f.k} f={f} id={`${id}-${f.k}`} value={s.fields[f.k] ?? f.v} onChange={(v) => onChange({ ...s, fields: { ...s.fields, [f.k]: v } })} />
      ))}
      <label htmlFor={`${id}-scene`}>④ 場景敘述（印在線索卡最上方，可留空）</label>
      <textarea id={`${id}-scene`} rows={2} maxLength={300} value={s.scene} onChange={(e) => onChange({ ...s, scene: e.target.value })} />
      <div className="row stage-tools">
        <button type="button" className="b g sm" onClick={() => onMove(-1)} disabled={i === 0} aria-label={`第 ${i + 1} 關往前移`}>往前移</button>
        <button type="button" className="b g sm" onClick={() => onMove(1)} disabled={i === n - 1} aria-label={`第 ${i + 1} 關往後移`}>往後移</button>
        <button type="button" className="b g sm danger" onClick={onRemove} disabled={n === 1} aria-label={`刪除第 ${i + 1} 關`}>刪除這關</button>
      </div>
    </div>
  );
}

export function RoomEditor({ room, onChange, open, setOpen }: {
  room: Room; onChange: (r: Room) => void; open: number; setOpen: (i: number) => void;
}) {
  const set = (p: Partial<Room>) => onChange({ ...room, ...p });
  const setStage = (i: number, s: Stage) => set({ stages: room.stages.map((x, j) => (j === i ? s : x)) });
  const move = (i: number, d: -1 | 1) => {
    const st = [...room.stages];
    [st[i], st[i + d]] = [st[i + d], st[i]];
    set({ stages: st });
    setOpen(i + d);
  };
  const remove = (i: number) => {
    if (!window.confirm(`確定要刪除第 ${i + 1} 關嗎？`)) return;
    set({ stages: room.stages.filter((_, j) => j !== i) });
    setOpen(-1);
  };
  const add = () => {
    set({ stages: [...room.stages, newStage('quiz')] });
    setOpen(room.stages.length);
  };
  return (
    <>
      <div className="box">
        <span className="tag">房間設定</span>
        <label htmlFor="rm-title">房間名稱</label>
        <input id="rm-title" value={room.title} maxLength={40} onChange={(e) => set({ title: e.target.value })} />
        <label htmlFor="rm-intro">開場故事</label>
        <textarea id="rm-intro" rows={3} value={room.intro} maxLength={500} onChange={(e) => set({ intro: e.target.value })} />
        <div className="grid2">
          <div>
            <label htmlFor="rm-final">最終密語（收齊碎片後拼出，可留空）</label>
            <input id="rm-final" value={room.final} maxLength={20} onChange={(e) => set({ final: e.target.value })} />
          </div>
          <div>
            <label htmlFor="rm-mode">難度</label>
            <select id="rm-mode" value={room.hard ? 'hard' : 'easy'} onChange={(e) => set({ hard: e.target.value === 'hard' })}>
              <option value="easy">新手：卡片上寫出解題規則</option>
              <option value="hard">高手：規則改放在提示表</option>
            </select>
          </div>
        </div>
      </div>

      <div className="box">
        <span className="tag">關卡（{room.stages.length}/{MAX_STAGES}）</span>
        <p className="mut" style={{ margin: '0 0 8px' }}>學生依序過關：每關的答案打開下一關的鎖。點一關展開編輯。</p>
        <ol className="stage-list">
          {room.stages.map((s, i) => (
            <li key={i} className={open === i ? 'open' : ''}>
              <StageSummary s={s} i={i} err={stageError(s)} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              {open === i && (
                <StageEditor s={s} i={i} n={room.stages.length}
                  onChange={(x) => setStage(i, x)} onMove={(d) => move(i, d)} onRemove={() => remove(i)} />
              )}
            </li>
          ))}
        </ol>
        <button type="button" className="b g" disabled={room.stages.length >= MAX_STAGES} onClick={add}>
          ＋ 新增一關
        </button>
      </div>
    </>
  );
}
