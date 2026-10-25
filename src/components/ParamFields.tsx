import type { ParamDef, Params } from '../ciphers';

/** 依參數定義動態產生欄位（數字、文字、下拉、核取方塊、多行文字） */
export function ParamFields({ defs, values, onChange, prefix }: { defs: ParamDef[]; values: Params; onChange: (p: Params) => void; prefix: string }) {
  const set = (k: string, v: string | boolean) => onChange({ ...values, [k]: v });
  return (
    <>
      {defs.map((d) => {
        const id = `${prefix}_${d.k}`, v = values[d.k];
        if (d.t === 'check') {
          return (
            <label key={d.k} className="inline" htmlFor={id}>
              <input id={id} type="checkbox" checked={!!v} onChange={(e) => set(d.k, e.target.checked)} />
              {d.l}
            </label>
          );
        }
        return (
          <div key={d.k}>
            <label htmlFor={id}>{d.l}</label>
            {d.t === 'select' ? (
              <select id={id} value={String(v)} onChange={(e) => set(d.k, e.target.value)}>
                {d.o!.map(([ov, ol]) => <option key={String(ov)} value={String(ov)}>{ol}</option>)}
              </select>
            ) : d.t === 'area' ? (
              <textarea id={id} rows={3} value={String(v)} onChange={(e) => set(d.k, e.target.value)} />
            ) : (
              <input id={id} type={d.t} value={String(v)} onChange={(e) => set(d.k, e.target.value)} />
            )}
          </div>
        );
      })}
    </>
  );
}
