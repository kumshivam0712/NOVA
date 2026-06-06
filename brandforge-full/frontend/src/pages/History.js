import React, { useState } from 'react';

const s = {
  wrap: {
    minHeight: '100vh',
    background: 'var(--bg)',
    maxWidth: '480px',
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    gap: '12px',
  },
  backBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
  },
  topTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: '17px',
    fontWeight: '700',
  },
  body: {
    padding: '20px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--muted)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    marginBottom: '8px',
    color: 'var(--text)',
    fontFamily: 'var(--font-head)',
    fontWeight: '700',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    marginBottom: '14px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  cardHeader: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
  },
  cardPrompt: {
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '1.4',
    flex: 1,
  },
  cardTime: {
    fontSize: '12px',
    color: 'var(--muted)',
    flexShrink: 0,
  },
  badges: {
    display: 'flex',
    gap: '6px',
    padding: '0 16px 14px',
    flexWrap: 'wrap',
  },
  badge: (color) => ({
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '100px',
    background: `${color}15`,
    color: color,
    fontWeight: '600',
    border: `1px solid ${color}25`,
  }),
  expanded: {
    borderTop: '1px solid var(--border)',
    padding: '16px',
  },
  resultSection: {
    marginBottom: '16px',
  },
  resultLabel: (color) => ({
    fontSize: '12px',
    fontWeight: '700',
    color: color,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }),
  resultText: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--text)',
    whiteSpace: 'pre-wrap',
    background: 'var(--bg)',
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
  },
  copyBtn: (color) => ({
    marginTop: '8px',
    padding: '6px 14px',
    borderRadius: '100px',
    background: `${color}15`,
    border: `1px solid ${color}30`,
    color: color,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  }),
};

const FORMAT_META = {
  reels: { icon: '🎬', color: '#FF6B35', label: 'Reels Script' },
  carousel: { icon: '📸', color: '#9B6BFF', label: 'Carousel' },
  thread: { icon: '🐦', color: '#00D4A8', label: 'X Thread' },
  whatsapp: { icon: '💬', color: '#FFD700', label: 'WhatsApp' },
};

export default function History({ history, onBack }) {
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState({});

  const copy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  return (
    <div style={s.wrap}>
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={onBack}>←</button>
        <div style={s.topTitle}>Content History 📂</div>
      </div>

      <div style={s.body}>
        {history.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>📂</div>
            <div style={s.emptyText}>No history yet</div>
            <div>Generate some content to see it here!</div>
          </div>
        ) : (
          history.map((item, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={i}
                style={{ ...s.card, borderColor: isOpen ? 'var(--accent)' : 'var(--border)' }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div style={s.cardHeader}>
                  <div style={s.cardPrompt}>"{item.prompt}"</div>
                  <div style={s.cardTime}>{item.time}</div>
                </div>
                <div style={s.badges}>
                  {(item.formats || []).map(fmt => {
                    const m = FORMAT_META[fmt];
                    return m ? (
                      <span key={fmt} style={s.badge(m.color)}>{m.icon} {m.label}</span>
                    ) : null;
                  })}
                </div>

                {isOpen && item.results && (
                  <div style={s.expanded} onClick={e => e.stopPropagation()}>
                    {item.results.map((r, j) => (
                      <div key={j} style={s.resultSection}>
                        <div style={s.resultLabel(r.color)}>{r.icon} {r.title}</div>
                        <div style={s.resultText}>{r.content}</div>
                        <button
                          style={s.copyBtn(r.color)}
                          onClick={() => copy(`${i}-${j}`, r.content)}
                        >
                          {copied[`${i}-${j}`] ? '✓ Copied!' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
