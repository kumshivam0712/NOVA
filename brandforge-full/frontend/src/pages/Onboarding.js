import React, { useEffect, useState } from 'react';
import { getCopy } from '../l10n';
import { generateLogo } from '../utils/logo';

const styles = {
  wrap: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(155,107,255,0.1) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
    pointerEvents: 'none',
  },
  logo: {
    fontFamily: 'var(--font-head)',
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--text)',
    marginBottom: '8px',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  logoAccent: {
    color: 'var(--accent)',
  },
  tagline: {
    color: 'var(--muted)',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '40px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px',
    width: '100%',
    maxWidth: '480px',
    position: 'relative',
    zIndex: 1,
  },
  stepLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'var(--accent)',
    fontWeight: '600',
    marginBottom: '8px',
  },
  stepTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '24px',
    lineHeight: '1.3',
  },
  label: {
    fontSize: '13px',
    color: 'var(--muted)',
    marginBottom: '8px',
    display: 'block',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '15px',
    marginBottom: '20px',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '15px',
    marginBottom: '20px',
    resize: 'vertical',
    minHeight: '90px',
    transition: 'border-color 0.2s',
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  chip: (selected) => ({
    padding: '8px 16px',
    borderRadius: '100px',
    border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
    background: selected ? 'rgba(255,107,53,0.15)' : 'transparent',
    color: selected ? 'var(--accent)' : 'var(--muted)',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
  }),
  btn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent)',
    color: '#fff',
    fontFamily: 'var(--font-head)',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    letterSpacing: '0.3px',
  },
  progress: {
    display: 'flex',
    gap: '6px',
    marginBottom: '28px',
  },
  dot: (active, done) => ({
    height: '3px',
    flex: 1,
    borderRadius: '2px',
    background: done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--border)',
    opacity: done ? 1 : active ? 0.8 : 0.4,
    transition: 'all 0.3s',
  }),
};

const TONES = ['Playful & Fun', 'Professional', 'Desi & Relatable', 'Inspirational', 'Informative', 'Bold & Edgy'];
const NICHES = ['Food & Recipes', 'Fashion', 'Handicraft', 'Home Business', 'Fitness', 'Education', 'Tech', 'Lifestyle'];
const LANGS = ['Hindi', 'Hinglish', 'English', 'Tamil', 'Telugu', 'Marathi'];

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const preferredLanguage = user?.languagePreference || 'Hinglish';
  const copy = getCopy(preferredLanguage);
  const [form, setForm] = useState({
    brandName: '',
    tagline: '',
    niche: '',
    tone: '',
    language: preferredLanguage,
    sampleContent: '',
    photoUrl: '',
    logoUrl: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    set('language', preferredLanguage);
  }, [preferredLanguage]);

  const steps = [
    {
      label: copy.step1Label,
      title: copy.step1Title,
      content: (
        <>
          <label style={styles.label}>{copy.brandName}</label>
          <input
            style={styles.input}
            placeholder="e.g. Riya's Pickles, Kavita Creations"
            value={form.brandName}
            onChange={e => set('brandName', e.target.value)}
          />
          <label style={styles.label}>{copy.tagline}</label>
          <input
            style={styles.input}
            placeholder="e.g. Ghar ka swad, har din"
            value={form.tagline}
            onChange={e => set('tagline', e.target.value)}
          />
          <label style={styles.label}>{copy.niche}</label>
          <div style={styles.chipRow}>
            {NICHES.map(n => (
              <button key={n} style={styles.chip(form.niche === n)} onClick={() => set('niche', n)}>{n}</button>
            ))}
          </div>
        </>
      ),
      valid: form.brandName.trim().length > 0,
    },
    {
      label: copy.step2Label,
      title: copy.step2Title,
      content: (
        <>
          <label style={styles.label}>{copy.tone}</label>
          <div style={styles.chipRow}>
            {TONES.map(t => (
              <button key={t} style={styles.chip(form.tone === t)} onClick={() => set('tone', t)}>{t}</button>
            ))}
          </div>
          <label style={styles.label}>{copy.primaryLanguage}</label>
          <div style={styles.chipRow}>
            {LANGS.map(l => (
              <button key={l} style={styles.chip(form.language === l)} onClick={() => set('language', l)}>{l}</button>
            ))}
          </div>
        </>
      ),
      valid: form.tone.length > 0,
    },
    {
      label: copy.step3Label,
      title: copy.step3Title,
      content: (
        <>
          <label style={styles.label}>{copy.upload}</label>
          <input
            type="file"
            accept="image/*"
            style={{ marginBottom: '12px', color: 'var(--text)' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => set('photoUrl', reader.result);
              reader.readAsDataURL(file);
            }}
          />
          {form.photoUrl && <img src={form.photoUrl} alt="Brand preview" style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', maxHeight: '160px', objectFit: 'cover', border: '1px solid var(--border)' }} />}
          <button
            type="button"
            onClick={() => set('logoUrl', generateLogo(form.brandName, form.niche))}
            style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'rgba(155,107,255,0.10)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
          >
            ✨ Generate brand logo
          </button>
          {form.logoUrl && <img src={form.logoUrl} alt="Generated logo" style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', border: '1px solid var(--border)' }} />}
          <label style={styles.label}>{copy.sampleCaption}</label>
          <textarea
            style={styles.textarea}
            placeholder="Paste any past caption, WhatsApp message, or post that sounds like you. BrandForge will learn your style..."
            value={form.sampleContent}
            onChange={e => set('sampleContent', e.target.value)}
          />
          <div style={{
            background: 'rgba(255,107,53,0.08)',
            border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '13px',
            color: 'var(--muted)',
          }}>
            💡 {copy.tip}
          </div>
        </>
      ),
      valid: true,
    },
  ];

  const currentStep = steps[step];

  return (
    <div style={styles.wrap}>
      <div style={styles.glow} />
      <div style={styles.glow2} />
      <div style={styles.logo}>
        Brand<span style={styles.logoAccent}>Forge</span>
      </div>
      <div style={styles.tagline}>AI Content Team for Indian Creators</div>

      <div style={styles.card}>
        <div style={styles.progress}>
          {steps.map((_, i) => (
            <div key={i} style={styles.dot(i === step, i < step)} />
          ))}
        </div>
        <div style={styles.stepLabel}>{currentStep.label}</div>
        <div style={styles.stepTitle}>{currentStep.title}</div>
        {currentStep.content}
        <button
          style={{ ...styles.btn, opacity: currentStep.valid ? 1 : 0.5 }}
          disabled={!currentStep.valid}
          onClick={() => {
            if (step < steps.length - 1) setStep(s => s + 1);
            else onComplete(form);
          }}
        >
          {step < steps.length - 1 ? copy.continue : copy.launch}
        </button>
      </div>
    </div>
  );
}
