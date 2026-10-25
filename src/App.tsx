import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChallengePanel } from './components/ChallengePanel';
import { CipherPanel } from './components/CipherPanel';
import { Icon, IconSprite } from './components/Icons';
import { EscapePanel } from './escape/EscapePanel';
import { load, save } from './storage';

type Tab = 'cipher' | 'case' | 'escape';
type Theme = 'system' | 'light' | 'dark';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'cipher', label: '密碼', icon: 'key' },
  { id: 'case', label: '精選挑戰', icon: 'file' },
  { id: 'escape', label: '密室逃脫', icon: 'door' },
];
const THEME_NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const THEME_NAME: Record<Theme, string> = { system: '跟隨系統', light: '淺色', dark: '深色' };

export function App() {
  const [tab, setTab] = useState<Tab>('cipher');
  const [theme, setTheme] = useState<Theme>(() => load<Theme>('rp-theme', 'system'));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = document.documentElement;
    if (theme === 'system') delete el.dataset.theme;
    else el.dataset.theme = theme;
    save('rp-theme', theme);
  }, [theme]);

  // 分頁用左右鍵切換（WAI-ARIA tabs 慣例）
  const onTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = TABS.findIndex((t) => t.id === tab);
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[n].id);
    tabRefs.current[n]?.focus();
  };

  return (
    <div className="w">
      <IconSprite />
      <header className="hd np">
        <Icon name="lens" />
        <div>
          <h1>推理工坊</h1>
          <p className="sub">輸入答案，產生可以直接出題的謎題。</p>
        </div>
        <div className="deco" aria-hidden="true">
          <Icon name="glass" />
          <Icon name="cigar" />
        </div>
        <button type="button" className="theme-btn" onClick={() => setTheme(THEME_NEXT[theme])} aria-label={`配色：${THEME_NAME[theme]}（按一下切換）`} title={`配色：${THEME_NAME[theme]}`}>
          <Icon name="theme" />
        </button>
      </header>
      <div className="trail np" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => <Icon key={i} name="foot" />)}
      </div>
      <div className="tabs np" role="tablist" aria-label="功能分類" onKeyDown={onTabKey}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            aria-selected={tab === t.id}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} />{t.label}
          </button>
        ))}
      </div>
      {TABS.map((t) => (
        <section key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={tab !== t.id}>
          {t.id === 'cipher' && <CipherPanel />}
          {t.id === 'case' && <ChallengePanel />}
          {t.id === 'escape' && <EscapePanel />}
        </section>
      ))}
    </div>
  );
}
