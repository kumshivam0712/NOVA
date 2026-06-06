import React, { useState, useRef, useEffect } from 'react';

const BACKEND = process.env.REACT_APP_BACKEND_URL || '/api';

const s = {
  wrap: {
    minHeight: '100vh',
    background: 'var(--bg)',
    maxWidth: '480px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
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
    flex: 1,
    padding: '24px 20px',
    overflowY: 'auto',
  },
  inputBox: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    marginBottom: '16px',
    position: 'relative',
  },
  inputLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--muted)',
    marginBottom: '10px',
    fontWeight: '600',
  },
  textarea: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    fontSize: '16px',
    resize: 'none',
    minHeight: '80px',
    lineHeight: '1.6',
  },
  inputActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border)',
  },
  micBtn: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '100px',
    background: active ? 'rgba(255,61,113,0.15)' : 'var(--bg)',
    border: `1px solid ${active ? 'var(--accent2)' : 'var(--border)'}`,
    color: active ? 'var(--accent2)' : 'var(--muted)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  charCount: {
    fontSize: '12px',
    color: 'var(--muted)',
  },
  optionsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '16px',
  },
  optionCard: (selected) => ({
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
    background: selected ? 'rgba(255,107,53,0.08)' : 'var(--surface)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  optTitle: {
    fontWeight: '600',
    fontSize: '13px',
    marginBottom: '2px',
  },
  optSub: {
    fontSize: '11px',
    color: 'var(--muted)',
  },
  sectionLabel: {
    fontSize: '13px',
    color: 'var(--muted)',
    marginBottom: '10px',
    fontWeight: '500',
  },
  generateBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: 'var(--radius)',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    color: '#fff',
    fontFamily: 'var(--font-head)',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 32px rgba(255,107,53,0.3)',
    transition: 'opacity 0.2s',
    marginBottom: '24px',
    border: 'none',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  loadingText: {
    color: 'var(--muted)',
    fontSize: '14px',
    marginTop: '16px',
  },
  loadingSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
    textAlign: 'left',
  },
  loadStep: (done) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: done ? 'var(--green)' : 'var(--muted)',
    transition: 'color 0.5s',
  }),
  errorBox: {
    background: 'rgba(255,61,113,0.08)',
    border: '1px solid rgba(255,61,113,0.25)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 16px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#FF6B9D',
    lineHeight: '1.6',
  },
  resultCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    marginBottom: '16px',
    overflow: 'hidden',
    animation: 'fadeUp 0.4s ease forwards',
  },
  resultHeader: (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: `${color}10`,
    borderBottom: `1px solid ${color}20`,
  }),
  resultTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-head)',
    fontWeight: '700',
    fontSize: '15px',
  },
  copyBtn: (color) => ({
    padding: '6px 14px',
    borderRadius: '100px',
    background: `${color}18`,
    border: `1px solid ${color}40`,
    color: color,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  resultBody: {
    padding: '16px',
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--text)',
    whiteSpace: 'pre-wrap',
  },
  doneActions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '32px',
  },
  actionBtn: (primary) => ({
    flex: 1,
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    background: primary ? 'var(--accent)' : 'var(--surface)',
    border: primary ? 'none' : '1px solid var(--border)',
    color: primary ? '#fff' : 'var(--text)',
    fontFamily: 'var(--font-head)',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  }),
  savedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '100px',
    background: 'rgba(0,212,168,0.12)',
    border: '1px solid rgba(0,212,168,0.25)',
    color: 'var(--green)',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
  },
};

const FORMATS = [
  { id: 'reels',     icon: '🎬', title: 'Reels Script',  sub: 'Hook + Script + CTA',   color: '#FF6B35' },
  { id: 'carousel',  icon: '📸', title: 'Carousel',       sub: '5-slide story',          color: '#9B6BFF' },
  { id: 'thread',    icon: '🐦', title: 'X Thread',       sub: 'Viral tweet thread',     color: '#00D4A8' },
  { id: 'whatsapp',  icon: '💬', title: 'WhatsApp',       sub: 'Broadcast copy',         color: '#FFD700' },
];

const LOAD_STEPS = [
  'Reading your brand voice...',
  'Launching Reels Agent...',
  'Launching Carousel Agent...',
  'Launching Thread Agent...',
  'Assembling your content...',
];

function normalizeFormatLabel(label = '') {
  return label
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/copy|script|post/g, '')
    .replace(/[^a-z]/g, '')
    .replace('xthread', 'thread')
    .replace('whatsapp', 'whatsapp');
}

// Parse raw AI text into per-format result objects
function parseResults(text, selectedFormats) {
  const formatMeta = {
    reels:    { icon: '🎬', title: 'Reels Script', color: '#FF6B35' },
    carousel: { icon: '📸', title: 'Carousel Post', color: '#9B6BFF' },
    thread:   { icon: '🐦', title: 'X Thread', color: '#00D4A8' },
    whatsapp: { icon: '💬', title: 'WhatsApp Copy', color: '#FFD700' },
  };

  const lines = text.split(/\n/);
  const sections = {};
  let currentKey = null;
  let currentLines = [];

  const flush = () => {
    if (!currentKey) return;
    const value = currentLines.join('\n').trim();
    if (value) sections[normalizeFormatLabel(currentKey)] = value;
    currentLines = [];
  };

  lines.forEach((line) => {
    const heading = line.match(/^(?:#{1,6}\s+|\*\*\s*)(.+?)(?:\*\*)?\s*:?$/i)?.[1] || '';
    const match = heading.match(/(REELS|CAROUSEL|THREAD|WHATSAPP|X THREAD)/i);

    if (match) {
      flush();
      currentKey = match[1];
      return;
    }

    if (currentKey) {
      currentLines.push(line);
    }
  });
  flush();

  return selectedFormats.map((fmt) => {
    const meta = formatMeta[fmt];
    const content = sections[fmt] || sections[normalizeFormatLabel(fmt)] || text.trim();
    return { id: fmt, icon: meta.icon, title: meta.title, color: meta.color, content };
  });
}

export default function Generator({ brandProfile, onBack, onComplete, initialFormats }) {
  const [prompt, setPrompt]               = useState('');
  const [listening, setListening]         = useState(false);
  const [selectedFormats, setSelectedFormats] = useState(
    initialFormats?.length ? initialFormats : ['reels', 'carousel', 'thread', 'whatsapp']
  );
  const [loading, setLoading]             = useState(false);
  const [loadStep, setLoadStep]           = useState(0);
  const [results, setResults]             = useState(null);
  const [copied, setCopied]               = useState({});
  const [error, setError]                 = useState('');
  const [saved, setSaved]                 = useState(false);
  const recognitionRef                    = useRef(null);
  const intervalRef                       = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(intervalRef.current);
    recognitionRef.current?.stop();
  }, []);

  // ── Voice input ──────────────────────────────────────────────
  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input not supported in this browser. Please use Chrome.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setPrompt(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror  = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const toggleFormat = (id) => {
    setSelectedFormats(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // ── Generate ─────────────────────────────────────────────────
  const generate = async () => {
    if (!prompt.trim() || !selectedFormats.length) return;
    setLoading(true);
    setLoadStep(0);
    setResults(null);
    setError('');
    setSaved(false);

    intervalRef.current = setInterval(() => {
      setLoadStep(s => {
        if (s >= LOAD_STEPS.length - 1) { clearInterval(intervalRef.current); return s; }
        return s + 1;
      });
    }, 900);

    try {
      const res = await fetch(`${BACKEND}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, brandProfile, selectedFormats }),
      });

      clearInterval(intervalRef.current);
      setLoadStep(LOAD_STEPS.length - 1);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      const parsed = parseResults(data.text, selectedFormats);
      setTimeout(() => { setLoading(false); setResults(parsed); }, 400);

    } catch (err) {
      clearInterval(intervalRef.current);
      setLoading(false);
      setError(
        err.message.includes('fetch')
          ? '❌ Cannot reach backend. Make sure the backend server is running on port 3001.\n\n→ Run: cd backend && node server.js'
          : `❌ ${err.message}`
      );
    }
  };

  // ── Copy ─────────────────────────────────────────────────────
  const copyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [id]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [id]: false })), 2000);
  };

  // ── Save to backend ──────────────────────────────────────────
  const handleSave = async () => {
    const item = {
      prompt,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      formats: selectedFormats,
      results,
    };

    try {
      await fetch(`${BACKEND}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      setSaved(true);
      setTimeout(() => onComplete(item), 800);
    } catch {
      // Still pass to parent even if save fails
      onComplete(item);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={onBack}>←</button>
        <div style={s.topTitle}>Generate Content ⚡</div>
      </div>

      <div style={s.body}>
        {!results && (
          <>
            {/* Error */}
            {error && <div style={s.errorBox}>{error}</div>}

            {/* Prompt input */}
            <div style={s.inputBox}>
              <div style={s.inputLabel}>Your idea</div>
              <textarea
                style={s.textarea}
                placeholder={`Describe your content idea...\ne.g. "Mango pickle launch, festive season, playful tone"`}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
              />
              <div style={s.inputActions}>
                <button style={s.micBtn(listening)} onClick={toggleVoice}>
                  {listening ? '🔴' : '🎙️'}
                  {listening ? 'Listening... tap to stop' : 'Voice input (Hindi)'}
                </button>
                <div style={s.charCount}>{prompt.length}/500</div>
              </div>
            </div>

            {/* Format selector */}
            <div style={s.sectionLabel}>Select formats to generate</div>
            <div style={s.optionsRow}>
              {FORMATS.map(f => (
                <div
                  key={f.id}
                  style={s.optionCard(selectedFormats.includes(f.id))}
                  onClick={() => toggleFormat(f.id)}
                >
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{f.icon}</div>
                  <div style={s.optTitle}>{f.title}</div>
                  <div style={s.optSub}>{f.sub}</div>
                </div>
              ))}
            </div>

            {/* Brand context pill */}
            <div style={{
              background: 'rgba(155,107,255,0.06)',
              border: '1px solid rgba(155,107,255,0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: 'var(--muted)',
            }}>
              🧠 Using <strong style={{ color: 'var(--text)' }}>{brandProfile?.tone || 'your'}</strong> tone in{' '}
              <strong style={{ color: 'var(--text)' }}>{brandProfile?.language || 'Hinglish'}</strong> for{' '}
              <strong style={{ color: 'var(--text)' }}>{brandProfile?.brandName}</strong>
            </div>

            {/* Generate button */}
            {!loading && (
              <button
                style={{ ...s.generateBtn, opacity: (prompt.trim() && selectedFormats.length > 0) ? 1 : 0.5 }}
                onClick={generate}
                disabled={!prompt.trim() || !selectedFormats.length}
              >
                <span>⚡</span>
                <span>Generate {selectedFormats.length} Format{selectedFormats.length > 1 ? 's' : ''} in ~10s</span>
              </button>
            )}
          </>
        )}

        {/* Loading state */}
        {loading && (
          <div style={s.loadingCard}>
            <div style={s.spinner} />
            <div style={s.loadingText}>BrandForge AI is generating your content...</div>
            <div style={s.loadingSteps}>
              {LOAD_STEPS.map((step, i) => (
                <div key={i} style={s.loadStep(i <= loadStep)}>
                  <span>{i <= loadStep ? '✅' : '⏳'}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            <div style={{
              fontFamily: 'var(--font-head)',
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: '8px',
            }}>
              🎉 Content Ready!
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
              Generated in ~10 seconds for <strong style={{ color: 'var(--text)' }}>{brandProfile?.brandName}</strong>
            </div>

            {saved && (
              <div style={s.savedBadge}>
                <span>✅</span> Saved to history
              </div>
            )}

            {results.map((r, i) => (
              <div key={r.id} style={{ ...s.resultCard, animationDelay: `${i * 0.1}s` }}>
                <div style={s.resultHeader(r.color)}>
                  <div style={s.resultTitle}>
                    <span>{r.icon}</span>
                    <span style={{ color: r.color }}>{r.title}</span>
                  </div>
                  <button
                    style={s.copyBtn(r.color)}
                    onClick={() => copyText(r.id, r.content)}
                  >
                    {copied[r.id] ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <div style={s.resultBody}>{r.content}</div>
              </div>
            ))}

            <div style={s.doneActions}>
              <button
                style={s.actionBtn(false)}
                onClick={() => { setResults(null); setPrompt(''); setError(''); setSaved(false); }}
              >
                🔄 New Idea
              </button>
              <button style={s.actionBtn(true)} onClick={handleSave} disabled={saved}>
                {saved ? '✅ Saved!' : '💾 Save & Done'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
