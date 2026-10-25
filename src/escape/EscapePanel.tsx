import { useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../storage';
import { LOCKS } from './locks';
import { PlayMode } from './PlayMode';
import { PrintDocs } from './PrintDocs';
import { PROPS, PUZZLES } from './puzzles';
import { buildRoom, SAMPLE_ROOM, sanitizeRoom } from './room';
import { RoomEditor } from './RoomEditor';
import type { Room } from './types';

type View = 'edit' | 'play' | 'print' | 'kinds';
/** 老師的三個步驟：設計 → 試玩 → 列印；謎題圖鑑是參考資料，另外放 */
const STEPS: { v: View; name: string; sub: string }[] = [
  { v: 'edit', name: '設計關卡', sub: '故事、謎題與答案' },
  { v: 'play', name: '試玩檢查', sub: '像學生一樣玩一遍' },
  { v: 'print', name: '列印教材', sub: '總表、線索卡、答案紙' },
];
const KEY = 'rp-escape-room';

const initialRoom = (): Room => {
  try {
    return sanitizeRoom(load<unknown>(KEY, SAMPLE_ROOM));
  } catch {
    return SAMPLE_ROOM;
  }
};

export function EscapePanel() {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [view, setView] = useState<View>('edit');
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(-1);
  const fileRef = useRef<HTMLInputElement>(null);
  const built = useMemo(() => buildRoom(room), [room]);

  useEffect(() => save(KEY, room), [room]);

  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(room, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${room.title.replace(/[\\/:*?"<>|]/g, '') || 'escape-room'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (f: File | undefined) => {
    if (!f) return;
    try {
      if (f.size > 200_000) throw new Error('檔案太大（上限 200 KB）');
      const r = sanitizeRoom(JSON.parse(await f.text()));
      if (window.confirm(`匯入「${r.title}」會取代目前的房間，確定嗎？`)) {
        setRoom(r);
        setMsg(`已匯入「${r.title}」。`);
      }
    } catch (e) {
      setMsg('匯入失敗：' + (e instanceof SyntaxError ? '不是有效的 JSON 檔' : (e as Error).message) + '（目前的房間沒有變動）');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const errCount = built.stages.filter((s) => s.error).length;
  const fixStage = (i: number) => {
    setView('edit');
    setOpen(i);
    // 等畫面切回編輯後，捲到那一關並把游標放進答案欄
    setTimeout(() => {
      document.getElementById(`st${i}-body`)?.scrollIntoView({ block: 'center' });
      document.getElementById(`st${i}-ans`)?.focus({ preventScroll: true });
    }, 0);
  };
  const stepAt = STEPS.findIndex((x) => x.v === view);
  const next = STEPS[stepAt + 1];

  return (
    <>
      <p className="desc">把多個謎題串成閉環關卡：每關的答案打開下一關的鎖，收齊碎片拼出最終密語。可以列印成實體教材，也能直接線上試玩。</p>
      <nav className="steps np" aria-label="製作步驟">
        <ol>
          {STEPS.map((x, i) => (
            <li key={x.v}>
              <button type="button" aria-current={view === x.v ? 'step' : undefined} onClick={() => setView(x.v)}>
                <span className="step-no">{i + 1}</span>
                <span><b>{x.name}</b><small>{x.sub}</small></span>
              </button>
            </li>
          ))}
        </ol>
        <div className="steps-aside">
          {errCount > 0 ? <span className="err" style={{ margin: 0 }}>有 {errCount} 關需要修正</span> : <span className="mut">共 {room.stages.length} 關，都可以使用</span>}
          <button type="button" className="b g sm" aria-pressed={view === 'kinds'} onClick={() => setView(view === 'kinds' ? 'edit' : 'kinds')}>
            {view === 'kinds' ? '← 回到設計關卡' : '看謎題圖鑑'}
          </button>
        </div>
      </nav>

      {view === 'edit' && (
        <>
          <RoomEditor room={room} onChange={setRoom} open={open} setOpen={setOpen} />
          <details className="box np backup">
            <summary>備份、分享與還原</summary>
            <p className="mut" style={{ margin: '6px 0 0' }}>編輯內容會自動暫存在這台電腦的瀏覽器裡；換電腦或分享給其他老師，請用「匯出」存成檔案，再「匯入」。</p>
            <div className="row">
              <button type="button" className="b g sm" onClick={exportJson}>匯出成檔案</button>
              <button type="button" className="b g sm" onClick={() => fileRef.current?.click()}>匯入檔案</button>
              <button type="button" className="b g sm" onClick={() => window.confirm('恢復範例會取代目前的房間，確定嗎？') && setRoom(SAMPLE_ROOM)}>恢復成範例房間</button>
              <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
            </div>
          </details>
          {msg && <p role="status">{msg}</p>}
        </>
      )}

      {(view === 'print' || view === 'play') && !built.ok && (
        <div className="box" role="alert">
          <p className="err">還有 {errCount} 關的答案不符合規則，修正後才能{view === 'play' ? '試玩' : '列印'}：</p>
          <ul className="fix-list">
            {built.stages.filter((s) => s.error).map((s) => (
              <li key={s.no}>
                第 {s.no} 關：{s.error}
                <button type="button" className="b g sm" onClick={() => fixStage(s.no - 1)}>去修正</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {view === 'print' && built.ok && <PrintDocs room={room} built={built} onReseed={() => setRoom({ ...room, seed: (room.seed * 31 + 17) % 2147483647 })} />}
      {view === 'play' && built.ok && <PlayMode key={JSON.stringify(room)} room={room} built={built} />}

      {next && view !== 'kinds' && (
        <div className="row np next-step">
          <button type="button" className="b" onClick={() => { setView(next.v); window.scrollTo({ top: 0 }); }}>下一步：{next.name} →</button>
        </div>
      )}

      {view === 'kinds' && (
        <>
          <h2 className="case-t">可自動產生的謎題（{PUZZLES.length} 種）</h2>
          <div className="kind-list">
            {PUZZLES.map((p) => (
              <div className="box" key={p.kind}>
                <b>{p.name}</b> <span className="mut">{'★'.repeat(p.stars)}</span>
                <p className="hp">{p.desc}</p>
                <p className="mut">適用：{p.locks.map((l) => LOCKS[l].name).join('、')}</p>
              </div>
            ))}
          </div>
          <h2 className="case-t" style={{ marginTop: 16 }}>實體道具建議（不自動產生）</h2>
          <div className="kind-list">
            {PROPS.map((p) => (
              <div className="box note" key={p.name}>
                <b>{p.name}</b> <span className="mut">{p.time}</span>
                <p className="hp">{p.how}</p>
                <p className="mut">可搭配：{p.pair}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
