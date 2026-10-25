// 線條風格的 inline SVG 圖示（currentColor），先定義 symbol，再用 <Icon name> 引用

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="i-lens" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" /><path d="M15 15L21.5 21.5M7 8.5a4 4 0 0 1 3-2" /></symbol>
        <symbol id="i-foot" viewBox="0 0 16 26"><ellipse cx="8" cy="8" rx="5" ry="7.5" /><ellipse cx="8" cy="21.5" rx="3.6" ry="4" /></symbol>
        <symbol id="i-glass" viewBox="0 0 32 16"><circle cx="8" cy="9" r="5.5" /><circle cx="24" cy="9" r="5.5" /><path d="M13.5 8.5Q16 6 18.5 8.5M2.5 8L1 4M29.5 8L31 4" /></symbol>
        <symbol id="i-cigar" viewBox="0 0 32 24"><rect x="3" y="14" width="22" height="5" rx="2.5" /><path d="M25 16.5h3M9 14v5M7 10c-2-2 2-3 0-6M12 10c-2-2 2-3 0-6" /></symbol>
        <symbol id="i-key" viewBox="0 0 24 24"><circle cx="7" cy="12" r="4" /><path d="M11 12h10M17 12v4M21 12v3" /></symbol>
        <symbol id="i-door" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="1" /><circle cx="15" cy="12" r=".8" /></symbol>
        <symbol id="i-file" viewBox="0 0 24 24"><path d="M5 8h5l2 2h7v9H5zM5 8V5h5l2 2" /></symbol>
        <symbol id="i-theme" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" /></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" /></symbol>
      </defs>
    </svg>
  );
}

export function Icon({ name, className = 'ic' }: { name: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
