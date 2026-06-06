import React, { useState } from 'react';
import { getCopy } from '../l10n';

const LANGS = ['Hindi', 'Hinglish', 'English', 'Tamil', 'Telugu', 'Marathi'];

const s = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background: 'radial-gradient(circle at top, #1d1322 0%, #0A0A0F 45%, #06070b 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    inset: '-20% auto auto 55%',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,53,0.14), transparent 65%)',
    filter: 'blur(8px)',
  },
  glow2: {
    position: 'absolute',
    inset: 'auto auto -10% -12%',
    width: '260px',
    height: '260px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(155,107,255,0.12), transparent 65%)',
    filter: 'blur(8px)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'linear-gradient(180deg, rgba(19,19,26,0.98), rgba(12,12,18,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '999px',
    background: 'rgba(255,107,53,0.10)',
    border: '1px solid rgba(255,107,53,0.20)',
    color: 'var(--accent)',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '10px',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '26px',
    fontWeight: '800',
    marginBottom: '8px',
    lineHeight: 1.15,
  },
  sub: { color: 'var(--muted)', fontSize: '13px', marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' },
  input: {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg)',
    color: 'var(--text)',
    padding: '12px 14px',
    marginBottom: '12px',
  },
  btn: {
    width: '100%',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 14px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '6px',
  },
  link: { marginTop: '14px', fontSize: '13px', color: 'var(--muted)', textAlign: 'center' },
  error: {
    marginBottom: '10px',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(255,61,113,0.08)',
    border: '1px solid rgba(255,61,113,0.25)',
    color: '#FF6B9D',
    fontSize: '13px',
  },
};

export default function Login({ onLogin, onSwitchToRegister, preferredLanguage = 'Hinglish' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [languagePreference, setLanguagePreference] = useState(preferredLanguage);
  const [error, setError] = useState('');
  const copy = getCopy(languagePreference);

  const submit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('brandforge_users') || '[]');
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) {
      setError('Invalid email or password.');
      return;
    }
    const updatedUser = { ...found, languagePreference };
    localStorage.setItem('brandforge_session', JSON.stringify(updatedUser));
    onLogin(updatedUser);
  };

  return (
    <div style={s.wrap}>
      <div style={s.glow} />
      <div style={s.glow2} />
      <div style={s.card}>
        <div style={s.badge}>✨ BrandForge Access</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>{copy.preferredLanguage}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {LANGS.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguagePreference(lang)}
              style={{
                padding: '8px 10px',
                borderRadius: '999px',
                border: `1px solid ${languagePreference === lang ? 'var(--accent)' : 'var(--border)'}`,
                background: languagePreference === lang ? 'rgba(255,107,53,0.15)' : 'transparent',
                color: languagePreference === lang ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {lang}
            </button>
          ))}
        </div>
        <div style={s.title}>{copy.welcomeBack}</div>
        <div style={s.sub}>{copy.signInText}</div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={submit}>
          <label style={s.label}>{copy.email}</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <label style={s.label}>{copy.password}</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          <button style={s.btn} type="submit">{copy.login}</button>
        </form>
        <div style={s.link}>{copy.newHere} <span onClick={onSwitchToRegister} style={{ color: 'var(--accent)', cursor: 'pointer' }}>{copy.createAccount}</span></div>
      </div>
    </div>
  );
}
