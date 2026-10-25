import { Fragment, useState } from 'react';
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

/** 空白共濟會格子：井字格、有點井字格、X 字格、有點 X 字格 */
function PigGrid() {
  const z = 66, c = [11, 33, 55];
  const xDots = [[33, 14], [14, 33], [52, 33], [33, 52]];
  return (
    <div className="pgrid" role="img" aria-label="兩個井字格與兩個 X 字格，第二個井字格與第二個 X 字格的每一格都有一個點">
      {[false, true].map((dot) => (
        <svg key={'h' + dot} viewBox={`-4 -4 ${z + 8} ${z + 8}`} width={z + 8} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d={`M22 0V${z}M44 0V${z}M0 22H${z}M0 44H${z}`} />
          {dot && c.flatMap((y) => c.map((x) => <circle key={`${x},${y}`} cx={x} cy={y} r={2} fill="currentColor" stroke="none" />))}
        </svg>
      ))}
      {[false, true].map((dot) => (
        <svg key={'x' + dot} viewBox={`-4 -4 ${z + 8} ${z + 8}`} width={z + 8} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d={`M0 0L${z} ${z}M${z} 0L0 ${z}`} />
          {dot && xDots.map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r={2} fill="currentColor" stroke="none" />)}
        </svg>
      ))}
    </div>
  );
}

/** 分層提示卡：畫面上逐張翻開，列印時全部印出（虛線框方便剪開） */
function HintLevels({ cards }: { cards: HintBlock[][] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="hl">
      {cards.map((blocks, i) => (
        <div key={i} className={`hl-card${i < open ? '' : ' shut'}`}>
          <b className="hl-no">提示卡 {i + 1}{i === cards.length - 1 ? '（最後一張）' : ''}</b>
          <HintView blocks={blocks} />
        </div>
      ))}
      <div className="row np">
        {open < cards.length
          ? <button type="button" className="b g" onClick={() => setOpen(open + 1)}>翻開提示卡 {open + 1}</button>
          : null}
        {open > 0 && <button type="button" className="b g" onClick={() => setOpen(0)}>全部蓋回去</button>}
        <span className="mut">已翻開 {open} / {cards.length} 張</span>
      </div>
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
    case 'pigGrid':
      return <PigGrid />;
    case 'levels':
      // 謎題換了就重新蓋回所有提示卡
      return <HintLevels key={JSON.stringify(b.cards)} cards={b.cards} />;
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
