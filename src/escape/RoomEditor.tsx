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

function StageEditor({ s, i, n, onChange, onMove, onRemove }: {
  s: Stage; i: number; n: number;
  onChange: (s: Stage) => void; onMove: (d: -1 | 1) => void; onRemove: () => void;
}) {
  const def = puzzleOf(s.kind), err = stageError(s), id = `st${i}`;
  const setKind = (k: PuzzleKind) => onChange({ ...newStage(k, s.scene) });
  const setLock = (lock: Stage['lock']) => onChange({ ...s, lock, answer: def.sample[lock] ?? '' });
  return (
    <div className="box stage">
      <div className="stage-h">
        <h3>第 {i + 1} 關</h3>
        <div className="row" style={{ marginTop: 0 }}>
          <button type="button" className="b g sm" onClick={() => onMove(-1)} disabled={i === 0} aria-label={`第 ${i + 1} 關上移`}>上移</button>
          <button type="button" className="b g sm" onClick={() => onMove(1)} disabled={i === n - 1} aria-label={`第 ${i + 1} 關下移`}>下移</button>
          <button type="button" className="b g sm" onClick={onRemove} disabled={n === 1} aria-label={`刪除第 ${i + 1} 關`}>刪除</button>
        </div>
      </div>
      <label htmlFor={`${id}-scene`}>場景敘述（印在線索卡最上方）</label>
      <textarea id={`${id}-scene`} rows={2} maxLength={300} value={s.scene} onChange={(e) => onChange({ ...s, scene: e.target.value })} />
      <div className="grid2">
        <div>
          <label htmlFor={`${id}-kind`}>謎題類型</label>
          <select id={`${id}-kind`} value={s.kind} onChange={(e) => setKind(e.target.value as PuzzleKind)}>
            {PUZZLES.map((p) => <option key={p.kind} value={p.kind}>{'★'.repeat(p.stars)} {p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-lock`}>鎖</label>
          <select id={`${id}-lock`} value={s.lock} onChange={(e) => setLock(e.target.value as Stage['lock'])}>
            {def.locks.map((l) => <option key={l} value={l}>{LOCKS[l].name}</option>)}
          </select>
        </div>
      </div>
      <p className="mut" style={{ margin: '4px 0 0' }}>{def.desc}</p>
      <label htmlFor={`${id}-ans`}>答案（{LOCKS[s.lock].rule}）</label>
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
    </div>
  );
}

export function RoomEditor({ room, onChange }: { room: Room; onChange: (r: Room) => void }) {
  const set = (p: Partial<Room>) => onChange({ ...room, ...p });
  const setStage = (i: number, s: Stage) => set({ stages: room.stages.map((x, j) => (j === i ? s : x)) });
  const move = (i: number, d: -1 | 1) => {
    const st = [...room.stages];
    [st[i], st[i + d]] = [st[i + d], st[i]];
    set({ stages: st });
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
      {room.stages.map((s, i) => (
        <StageEditor key={i} s={s} i={i} n={room.stages.length}
          onChange={(x) => setStage(i, x)} onMove={(d) => move(i, d)}
          onRemove={() => set({ stages: room.stages.filter((_, j) => j !== i) })} />
      ))}
      <button type="button" className="b" disabled={room.stages.length >= MAX_STAGES} onClick={() => set({ stages: [...room.stages, newStage('quiz')] })}>
        新增關卡（{room.stages.length}/{MAX_STAGES}）
      </button>
    </>
  );
}
