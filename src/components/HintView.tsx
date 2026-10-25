import { Fragment } from 'react';
import type { CipherResult, Glyph, HintBlock } from '../ciphers';
import { manShape, pigShape } from '../ciphers/glyphs';

export function GlyphSvg({ g, scale = 1.3 }: { g: Glyph; scale?: number }) {
  const s = g.k === 'pig' ? pigShape(g.i) : manShape(g.i, g.flag);
  return (
    <svg viewBox={`0 0 ${s.w} ${s.h}`} width={s.w * scale} height={s.h * scale} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={s.d} />
      {s.head && <circle cx={s.head[0]} cy={s.head[1]} r={3} fill="currentColor" />}
      {s.dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} fill="currentColor" />)}
    </svg>
  );
}

export function TableView({ rows }: { rows: (string | number)[][] }) {
  return (
    <div className="sc">
      <table className="t">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HintBlockView({ b }: { b: HintBlock }) {
  switch (b.k) {
    case 'p':
      return <p className="hp">{b.text}</p>;
    case 'table':
      return <TableView rows={b.rows} />;
    case 'legend':
      return (
        <div className="lg">
          {b.items.map((it) => (
            <span key={it.label}>
              {it.glyph ? <GlyphSvg g={it.glyph} scale={1} /> : null}
              {it.glyph ? it.label : <><b>{it.label}</b>{it.sub}</>}
            </span>
          ))}
        </div>
      );
    case 'book':
      return (
        <p className="book">
          {b.words.map((w, i) => <Fragment key={i}><b>{i + 1}</b> {w}{'　'}</Fragment>)}
        </p>
      );
  }
}

export function HintView({ blocks }: { blocks: HintBlock[] }) {
  return <>{blocks.map((b, i) => <HintBlockView key={i} b={b} />)}</>;
}

/** 謎題本體：文字（可複製）或圖形 */
export function PuzzleView({ r }: { r: CipherResult }) {
  if (r.glyphs) {
    return (
      <div className="pz" role="img" aria-label="圖形謎題">
        {r.glyphs.map((w, i) => (
          <span className="wd" key={i}>{w.map((g, j) => <GlyphSvg key={j} g={g} />)}</span>
        ))}
      </div>
    );
  }
  return <div className="pz">{r.text}</div>;
}
