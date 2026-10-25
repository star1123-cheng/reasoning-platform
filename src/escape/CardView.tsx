import { HintBlockView, HintView, PuzzleView } from '../components/HintView';
import { Icon } from '../components/Icons';
import { LOCKS } from './locks';
import { COLORS, colorName } from './puzzles/color';
import { SHAPE_NAME } from './puzzles/count';
import { E, N, S, W } from './puzzles/maze';
import type { BuiltStage } from './room';
import type { CardBlock, ColorId, LockKind, ShapeName } from './types';

const hex = (id: ColorId) => COLORS.find((c) => c.id === id)!.hex;

export function ShapeIcon({ s, size = 22 }: { s: ShapeName; size?: number }) {
  const d: Record<ShapeName, JSX.Element> = {
    star: <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" />,
    circle: <circle cx="12" cy="12" r="8.5" />,
    triangle: <path d="M12 3l9.5 17h-19z" />,
    square: <rect x="4" y="4" width="16" height="16" />,
    heart: <path d="M12 20s-8-5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15 12 20 12 20z" />,
    diamond: <path d="M12 2.5l8 9.5-8 9.5-8-9.5z" />,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden="true">{d[s]}</svg>;
}

function MazeSvg({ b }: { b: Extract<CardBlock, { k: 'maze' }> }) {
  const z = 30, pad = 4, lines: string[] = [];
  for (let p = 0; p < b.w * b.h; p++) {
    const x = (p % b.w) * z + pad, y = ((p / b.w) | 0) * z + pad, o = b.open[p];
    if (!(o & N)) lines.push(`M${x} ${y}h${z}`);
    if (!(o & W)) lines.push(`M${x} ${y}v${z}`);
    if (!(o & E) && p % b.w === b.w - 1) lines.push(`M${x + z} ${y}v${z}`);
    if (!(o & S) && ((p / b.w) | 0) === b.h - 1) lines.push(`M${x} ${y + z}h${z}`);
  }
  const label = (p: number, t: string) => (
    <text x={(p % b.w) * z + pad + z / 2} y={((p / b.w) | 0) * z + pad + z / 2 + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">{t}</text>
  );
  const W2 = b.w * z + pad * 2, H2 = b.h * z + pad * 2;
  return (
    <svg viewBox={`0 0 ${W2} ${H2}`} width={W2} role="img" aria-label="迷宮">
      <path d={lines.join('')} stroke="currentColor" strokeWidth={2.5} strokeLinecap="square" fill="none" />
      {label(b.start, '起')}
      {label(b.end, '終')}
    </svg>
  );
}

function ClockSvg({ h, m }: { h: number; m: number }) {
  const hand = (deg: number, len: number) => {
    const r = ((deg - 90) * Math.PI) / 180;
    return `M100 100L${100 + len * Math.cos(r)} ${100 + len * Math.sin(r)}`;
  };
  return (
    <svg viewBox="0 0 200 200" width={200} role="img" aria-label="時鐘">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="3" />
      {Array.from({ length: 60 }, (_, i) => {
        const r = (i * 6 * Math.PI) / 180, long = i % 5 === 0;
        return <path key={i} d={`M${100 + 86 * Math.sin(r)} ${100 - 86 * Math.cos(r)}L${100 + (long ? 76 : 81) * Math.sin(r)} ${100 - (long ? 76 : 81) * Math.cos(r)}`} stroke="currentColor" strokeWidth={long ? 2.5 : 1} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const r = ((i + 1) * 30 * Math.PI) / 180;
        return <text key={i} x={100 + 64 * Math.sin(r)} y={100 - 64 * Math.cos(r) + 6} textAnchor="middle" fontSize="16" fill="currentColor">{i + 1}</text>;
      })}
      <path d={hand(((h % 12) + m / 60) * 30, 44)} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d={hand(m * 6, 72)} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}

export function CardBlockView({ b }: { b: CardBlock }) {
  switch (b.k) {
    case 'big':
      return <div className="big">{b.mirror ? <span className="mirror">{b.text}</span> : <span style={{ whiteSpace: 'pre-line' }}>{b.text}</span>}</div>;
    case 'list':
      return <ul>{b.items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
    case 'quiz':
      return (
        <ol className="quiz">
          {b.items.map((it, i) => (
            <li key={i}>
              {it.q}
              <div className="opts">{it.opts.map((o) => <span key={o.label + o.text}>（{o.label}）{o.text}</span>)}</div>
            </li>
          ))}
        </ol>
      );
    case 'maze':
      return <div className="sc"><MazeSvg b={b} /></div>;
    case 'clock':
      return <ClockSvg h={b.h} m={b.m} />;
    case 'shape-order':
      return <p className="row" style={{ gap: 14 }}>依序數：{b.items.map((s, i) => <span key={s} className="lockbadge">{i + 1}. <ShapeIcon s={s} size={18} />{SHAPE_NAME[s]}</span>)}</p>;
    case 'shapes': {
      const rows = Math.ceil(b.cells.length / b.cols), z = 34;
      return (
        <div className="sc">
          <svg viewBox={`0 0 ${b.cols * z} ${rows * z}`} width={b.cols * z} role="img" aria-label="圖形方格">
            {b.cells.map((s, i) => s && (
              <g key={i} transform={`translate(${(i % b.cols) * z + 6} ${((i / b.cols) | 0) * z + 6})`}>
                <ShapeIcon s={s} />
              </g>
            ))}
          </svg>
        </div>
      );
    }
    case 'dots':
      return <div className="dots">{b.colors.map((c, i) => <span key={i}><i style={{ background: hex(c) }} />{colorName(c)}</span>)}</div>;
    case 'colors':
      return <div className="dots">{b.items.map((x) => <span key={x.c}><i style={{ background: hex(x.c) }} />{colorName(x.c)} = {x.d}</span>)}</div>;
    case 'cipher':
      return <><PuzzleView r={b.result} /><HintView blocks={b.result.hint} /></>;
    default:
      return <HintBlockView b={b} />;
  }
}

export const lockSize = (lock: LockKind, a: string) =>
  lock === 'digit' ? `${a.length} 位數字` : lock === 'letter' ? `${a.length} 個字母` : lock === 'dir' ? `${[...a].length} 個方向` : '答案交給關主核對';

export function LockBadge({ lock, answer }: { lock: LockKind; answer: string }) {
  return <span className="lockbadge"><Icon name="lock" />{LOCKS[lock].name}・{lockSize(lock, answer)}</span>;
}

/** 一張線索卡（列印與線上試玩共用） */
export function ClueCard({ s, hard, showBack = true }: { s: BuiltStage; hard: boolean; showBack?: boolean }) {
  if (!s.built) return null;
  return (
    <article className="box clue-card">
      <span className="stamp">第 {s.no} 關</span>
      <span className="tag">線索卡</span>
      {s.stage.scene && <p className="scene">{s.stage.scene}</p>}
      {!hard && <p className="hp"><b>{s.built.rules}</b></p>}
      <div className="card-blocks">{s.built.card.map((b, i) => <CardBlockView key={i} b={b} />)}</div>
      <p><LockBadge lock={s.stage.lock} answer={s.answer} /></p>
      {showBack && s.back && (
        <div className="box note">
          <span className="tag">卡片背面：{s.back.title}</span>
          {s.back.blocks.map((b, i) => <CardBlockView key={i} b={b} />)}
        </div>
      )}
    </article>
  );
}
