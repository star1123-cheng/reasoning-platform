import { useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../storage';
import { LOCKS } from './locks';
import { PlayMode } from './PlayMode';
import { PrintDocs } from './PrintDocs';
import { PROPS, PUZZLES } from './puzzles';
import { buildRoom, SAMPLE_ROOM, sanitizeRoom } from './room';
import { RoomEditor } from './RoomEditor';
import type { Room } from './types';

type View = 'edit' | 'print' | 'play' | 'kinds';
const VIEWS: [View, string][] = [['edit', '編輯房間'], ['print', '列印教材'], ['play', '線上試玩'], ['kinds', '謎題圖鑑']];
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

  return (
    <>
      <p className="desc">把多個謎題串成閉環關卡：每關的答案打開下一關的鎖，收齊碎片拼出最終密語。可以列印成實體教材，也能直接線上試玩。</p>
      <div className="seg np" role="group" aria-label="密室逃脫功能">
        {VIEWS.map(([v, l]) => (
          <button key={v} type="button" className="chip" aria-pressed={view === v} onClick={() => setView(v)}>{l}</button>
        ))}
      </div>

      {view === 'edit' && (
        <>
          <div className="box np">
            <div className="row" style={{ marginTop: 0 }}>
              <button type="button" className="b g sm" onClick={exportJson}>匯出 JSON 檔</button>
              <button type="button" className="b g sm" onClick={() => fileRef.current?.click()}>匯入 JSON 檔</button>
              <button type="button" className="b g sm" onClick={() => window.confirm('恢復範例會取代目前的房間，確定嗎？') && setRoom(SAMPLE_ROOM)}>恢復範例</button>
              <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
            </div>
            <p className="mut" style={{ margin: '6px 0 0' }}>編輯內容會自動暫存在這台電腦的瀏覽器裡；換電腦請用匯出／匯入。</p>
            {msg && <p role="status">{msg}</p>}
          </div>
          <RoomEditor room={room} onChange={setRoom} />
        </>
      )}

      {(view === 'print' || view === 'play') && !built.ok && (
        <div className="box" role="alert">
          <p className="err">還有 {errCount} 關的答案不符合規則，請先回「編輯房間」修正：</p>
          <ul>{built.stages.filter((s) => s.error).map((s) => <li key={s.no}>第 {s.no} 關：{s.error}</li>)}</ul>
        </div>
      )}
      {view === 'print' && built.ok && <PrintDocs room={room} built={built} onReseed={() => setRoom({ ...room, seed: (room.seed * 31 + 17) % 2147483647 })} />}
      {view === 'play' && built.ok && <PlayMode key={JSON.stringify(room)} room={room} built={built} />}

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
