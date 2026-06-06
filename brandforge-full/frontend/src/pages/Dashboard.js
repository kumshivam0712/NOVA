import React, { useMemo } from 'react';
import { getCopy } from '../l10n';

const FORMAT_META = {
  reels:    { icon: '🎬', label: 'Reels',    color: '#FF6B35' },
  carousel: { icon: '📸', label: 'Carousel', color: '#9B6BFF' },
  thread:   { icon: '🐦', label: 'Thread',   color: '#00D4A8' },
  whatsapp: { icon: '💬', label: 'WhatsApp', color: '#FFD700' },
};

const QUICK = [
  { id: 'reels',    icon: '🎬', title: 'Reels Script',  sub: 'Hook + CTA ready', color: '#FF6B35' },
  { id: 'carousel', icon: '📸', title: 'Carousel Post', sub: '5-slide story',    color: '#9B6BFF' },
  { id: 'thread',   icon: '🐦', title: 'X Thread',      sub: 'Viral hooks',      color: '#00D4A8' },
  { id: 'whatsapp', icon: '📝', title: 'WhatsApp Copy', sub: 'Broadcast ready',  color: '#FFD700' },
];

const NICHE_EMOJI = {
  'Food & Recipes': '🍳',
  'Fashion': '👗',
  'Fitness': '💪',
  'Tech': '💻',
  'Education': '📚',
  'Beauty': '💄',
  'Travel': '✈️',
  'Finance': '💰',
  'Entertainment': '🎭',
  'Other': '✨',
};

function computeStats(history) {
  const formatCounts = { reels: 0, carousel: 0, thread: 0, whatsapp: 0 };
  let totalFormats = 0;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let thisWeek = 0;
  let lastGenerated = null;

  history.forEach((item) => {
    const formats = item.formats || [];
    totalFormats += formats.length;
    formats.forEach((f) => {
      if (formatCounts[f] !== undefined) formatCounts[f]++;
    });
    const saved = item.savedAt ? new Date(item.savedAt).getTime() : 0;
    if (saved >= weekAgo) thisWeek++;
    if (saved && (!lastGenerated || saved > lastGenerated)) lastGenerated = saved;
  });

  const maxCount = Math.max(...Object.values(formatCounts), 1);
  return { formatCounts, totalFormats, thisWeek, lastGenerated, maxCount };
}

function brandHealthScore(profile) {
  let score = 0;
  if (profile?.brandName) score += 25;
  if (profile?.tagline) score += 15;
  if (profile?.niche) score += 15;
  if (profile?.tone) score += 15;
  if (profile?.language) score += 10;
  if (profile?.sampleContent) score += 10;
  if (profile?.logoUrl || profile?.photoUrl) score += 10;
  return score;
}

function formatRelativeTime(ts, lang) {
  if (!ts) return lang === 'Hinglish' ? 'Abhi tak nahi' : 'Not yet';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return lang === 'Hinglish' ? `${mins} min pehle` : `${mins}m ago`;
  if (hours < 24) return lang === 'Hinglish' ? `${hours} ghante pehle` : `${hours}h ago`;
  if (days < 7) return lang === 'Hinglish' ? `${days} din pehle` : `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const s = {
  wrap: {
    minHeight: '100vh',
    background: 'var(--bg)',
    maxWidth: '480px',
    margin: '0 auto',
    paddingBottom: '100px',
  },
  header: {
    padding: '20px 20px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'var(--font-head)',
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },
  logoAccent: { color: 'var(--accent)' },
  headerRight: { display: 'flex', gap: '8px', alignItems: 'center' },
  logoutBtn: {
    border: '1px solid var(--border)',
    borderRadius: '999px',
    background: 'var(--surface)',
    color: 'var(--text)',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '11px',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'var(--font-head)',
    overflow: 'hidden',
    border: '2px solid rgba(255,107,53,0.3)',
  },
  brandHero: {
    margin: '20px 20px 0',
    background: 'linear-gradient(135deg, #1a0f0a 0%, #1C1C26 55%, #0d0d18 100%)',
    border: '1px solid rgba(255,107,53,0.22)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
  },
  heroGlow: {
    position: 'absolute',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)',
    top: '-50px',
    right: '-50px',
    pointerEvents: 'none',
  },
  brandRow: { display: 'flex', gap: '14px', alignItems: 'flex-start' },
  brandLogo: {
    width: '64px',
    height: '64px',
    borderRadius: '14px',
    objectFit: 'cover',
    border: '1px solid var(--border)',
    flexShrink: 0,
    background: 'var(--surface2)',
  },
  brandLogoFallback: {
    width: '64px',
    height: '64px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-head)',
    fontSize: '22px',
    fontWeight: '800',
    color: '#fff',
    flexShrink: 0,
  },
  brandGreeting: {
    fontSize: '11px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '1.4px',
    marginBottom: '4px',
  },
  brandName: {
    fontFamily: 'var(--font-head)',
    fontSize: '22px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '4px',
  },
  brandTagline: { fontSize: '13px', color: 'var(--muted)', lineHeight: '1.4' },
  healthBar: {
    marginTop: '16px',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 'var(--radius-sm)',
  },
  healthLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--muted)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  healthTrack: {
    height: '6px',
    background: 'var(--border)',
    borderRadius: '100px',
    overflow: 'hidden',
  },
  healthFill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    borderRadius: '100px',
    background: pct >= 80
      ? 'linear-gradient(90deg, var(--green), #00b894)'
      : pct >= 50
        ? 'linear-gradient(90deg, var(--accent), var(--accent2))'
        : 'linear-gradient(90deg, #FFD700, var(--accent))',
    transition: 'width 0.6s ease',
  }),
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    margin: '16px 20px 0',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px',
  },
  statNum: {
    fontFamily: 'var(--font-head)',
    fontSize: '26px',
    fontWeight: '800',
    lineHeight: 1,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statSub: { fontSize: '11px', color: 'var(--muted)', marginTop: '4px' },
  sectionTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: '15px',
    fontWeight: '700',
    padding: '0 20px',
    marginBottom: '12px',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: { fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '500' },
  card: {
    margin: '0 20px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
  },
  kitGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  kitItem: {
    background: 'var(--surface2)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
  },
  kitLabel: {
    fontSize: '10px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '4px',
  },
  kitValue: { fontSize: '13px', fontWeight: '600', lineHeight: '1.3' },
  formatBar: { display: 'flex', flexDirection: 'column', gap: '10px' },
  formatRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  formatIcon: { fontSize: '16px', width: '24px', textAlign: 'center' },
  formatName: { fontSize: '12px', width: '68px', color: 'var(--muted)', flexShrink: 0 },
  formatTrack: {
    flex: 1,
    height: '8px',
    background: 'var(--surface2)',
    borderRadius: '100px',
    overflow: 'hidden',
  },
  formatFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    background: color,
    borderRadius: '100px',
    transition: 'width 0.5s ease',
    minWidth: pct > 0 ? '4px' : 0,
  }),
  formatCount: { fontSize: '12px', fontWeight: '700', width: '24px', textAlign: 'right', flexShrink: 0 },
  voicePreview: {
    fontSize: '13px',
    color: 'var(--muted)',
    lineHeight: '1.6',
    fontStyle: 'italic',
    borderLeft: '3px solid var(--accent)',
    paddingLeft: '12px',
  },
  generateBtn: {
    margin: '0 20px',
    padding: '18px 24px',
    borderRadius: 'var(--radius)',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    color: '#fff',
    fontFamily: 'var(--font-head)',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    width: 'calc(100% - 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 32px rgba(255,107,53,0.3)',
  },
  quickCards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    padding: '0 20px',
  },
  quickCard: (color) => ({
    background: 'linear-gradient(180deg, rgba(19,19,26,0.98), rgba(12,12,18,0.98))',
    border: `1px solid ${color}22`,
    borderRadius: 'var(--radius)',
    padding: '14px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  }),
  quickCardIcon: (color) => ({
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '17px',
    marginBottom: '8px',
  }),
  quickCardTitle: { fontFamily: 'var(--font-head)', fontSize: '13px', fontWeight: '700', marginBottom: '3px' },
  quickCardSub: { fontSize: '11px', color: 'var(--muted)' },
  whatsappCard: {
    margin: '0 20px',
    background: 'linear-gradient(135deg, rgba(0,212,168,0.08), rgba(255,215,0,0.08))',
    border: '1px solid rgba(0,212,168,0.20)',
    borderRadius: 'var(--radius)',
    padding: '14px',
  },
  waBtn: {
    width: '100%',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 14px',
    background: 'linear-gradient(135deg, #25D366, #128C7E)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
    marginTop: '10px',
  },
  historyItem: {
    margin: '0 20px 10px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px',
    cursor: 'pointer',
  },
  historyTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' },
  historyPrompt: {
    fontSize: '13px',
    fontWeight: '500',
    flex: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  historyDate: { fontSize: '11px', color: 'var(--muted)', flexShrink: 0 },
  historyFormats: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  formatBadge: (color) => ({
    fontSize: '10px',
    padding: '3px 8px',
    borderRadius: '100px',
    background: `${color}18`,
    color,
    fontWeight: '600',
  }),
  emptyState: { textAlign: 'center', padding: '28px 20px', color: 'var(--muted)', fontSize: '13px' },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(13,13,18,0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    padding: '12px 0 20px',
  },
  navItem: (active) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    color: active ? 'var(--accent)' : 'var(--muted)',
    fontSize: '11px',
    fontWeight: active ? '600' : '400',
  }),
  photoStrip: {
    margin: '12px 20px 0',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    maxHeight: '120px',
  },
};

export default function Dashboard({
  brandProfile,
  history,
  onGenerate,
  onGenerateFormat,
  onHistory,
  onEditProfile,
  onLogout,
  user,
}) {
  const lang = user?.languagePreference || brandProfile?.language || 'Hinglish';
  const copy = getCopy(lang);
  const initials = brandProfile?.brandName?.slice(0, 2).toUpperCase() || 'BF';
  const nicheEmoji = NICHE_EMOJI[brandProfile?.niche] || '✨';

  const stats = useMemo(() => computeStats(history), [history]);
  const health = useMemo(() => brandHealthScore(brandProfile), [brandProfile]);

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm promoting ${brandProfile?.brandName || 'my brand'}${brandProfile?.tagline ? ` — ${brandProfile.tagline}` : ''}.\n\nCheck out our brand vibe, content, and offers. Let's connect!`
  );

  const dashCopy = {
    dashboard: lang === 'Hinglish' ? 'Brand Dashboard' : 'Brand Dashboard',
    health: lang === 'Hinglish' ? 'Profile completeness' : 'Profile completeness',
    thisWeek: lang === 'Hinglish' ? 'This week' : 'This week',
    totalPieces: lang === 'Hinglish' ? 'Content pieces' : 'Content pieces',
    lastGen: lang === 'Hinglish' ? 'Last generated' : 'Last generated',
    brandKit: lang === 'Hinglish' ? 'Brand Kit' : 'Brand Kit',
    niche: lang === 'Hinglish' ? 'Niche' : 'Niche',
    tone: lang === 'Hinglish' ? 'Tone' : 'Tone',
    language: lang === 'Hinglish' ? 'Language' : 'Language',
    voice: lang === 'Hinglish' ? 'Voice' : 'Voice',
    formatBreakdown: lang === 'Hinglish' ? 'Format breakdown' : 'Format breakdown',
    brandVoice: lang === 'Hinglish' ? 'Your brand voice' : 'Your brand voice',
    noVoice: lang === 'Hinglish'
      ? 'Add a sample caption in your profile to teach BrandForge your style.'
      : 'Add a sample caption in your profile to teach BrandForge your style.',
    editProfile: lang === 'Hinglish' ? 'Edit profile →' : 'Edit profile →',
    waPromo: lang === 'Hinglish' ? 'WhatsApp promotion' : 'WhatsApp promotion',
    waSub: lang === 'Hinglish'
      ? 'Open WhatsApp with a ready-made promo message for your brand.'
      : 'Open WhatsApp with a ready-made promo message for your brand.',
    waBtn: lang === 'Hinglish' ? '📲 Open WhatsApp promo' : '📲 Open WhatsApp promo',
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.logo}>Brand<span style={s.logoAccent}>Forge</span></div>
        <div style={s.headerRight}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{user?.name || 'Creator'}</span>
          <button type="button" onClick={onLogout} style={s.logoutBtn}>Logout</button>
          <div style={s.avatar} onClick={onEditProfile} title="Edit Brand Profile">
            {brandProfile?.photoUrl
              ? <img src={brandProfile.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
        </div>
      </div>

      {/* Brand Hero */}
      <div style={s.brandHero}>
        <div style={s.heroGlow} />
        <div style={s.brandRow}>
          {brandProfile?.logoUrl
            ? <img src={brandProfile.logoUrl} alt="Logo" style={s.brandLogo} />
            : <div style={s.brandLogoFallback}>{initials}</div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.brandGreeting}>{copy.yourBrand} · {dashCopy.dashboard}</div>
            <div style={s.brandName}>{brandProfile?.brandName || 'My Brand'} {nicheEmoji}</div>
            <div style={s.brandTagline}>
              {brandProfile?.tagline || brandProfile?.niche || 'Content Creator'}
            </div>
          </div>
        </div>

        <div style={s.healthBar}>
          <div style={s.healthLabel}>
            <span>{dashCopy.health}</span>
            <span style={{ color: health >= 80 ? 'var(--green)' : 'var(--accent)', fontWeight: 700 }}>{health}%</span>
          </div>
          <div style={s.healthTrack}>
            <div style={s.healthFill(health)} />
          </div>
        </div>
      </div>

      {brandProfile?.photoUrl && (
        <div style={s.photoStrip}>
          <img
            src={brandProfile.photoUrl}
            alt="Brand"
            style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Stats */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={{ ...s.statNum, color: 'var(--accent)' }}>{history.length}</div>
          <div style={s.statLabel}>{copy.generated}</div>
          <div style={s.statSub}>{dashCopy.thisWeek}: {stats.thisWeek}</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNum, color: 'var(--purple)' }}>{stats.totalFormats}</div>
          <div style={s.statLabel}>{dashCopy.totalPieces}</div>
          <div style={s.statSub}>{copy.formats} across all runs</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNum, color: 'var(--green)' }}>
            {brandProfile?.tone ? '✓' : '—'}
          </div>
          <div style={s.statLabel}>{copy.voiceSet}</div>
          <div style={s.statSub}>{brandProfile?.tone || 'Not set'}</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNum, color: 'var(--gold)', fontSize: '18px', paddingTop: '4px' }}>
            {formatRelativeTime(stats.lastGenerated, lang)}
          </div>
          <div style={s.statLabel}>{dashCopy.lastGen}</div>
        </div>
      </div>

      {/* Brand Kit */}
      <div style={s.sectionTitle}>
        <span>{dashCopy.brandKit}</span>
        <span style={s.seeAll} onClick={onEditProfile}>{dashCopy.editProfile}</span>
      </div>
      <div style={s.card}>
        <div style={s.kitGrid}>
          <div style={s.kitItem}>
            <div style={s.kitLabel}>{dashCopy.niche}</div>
            <div style={s.kitValue}>{nicheEmoji} {brandProfile?.niche || '—'}</div>
          </div>
          <div style={s.kitItem}>
            <div style={s.kitLabel}>{dashCopy.tone}</div>
            <div style={s.kitValue}>{brandProfile?.tone || '—'}</div>
          </div>
          <div style={s.kitItem}>
            <div style={s.kitLabel}>{dashCopy.language}</div>
            <div style={s.kitValue}>{user?.languagePreference || brandProfile?.language || 'Hinglish'}</div>
          </div>
          <div style={s.kitItem}>
            <div style={s.kitLabel}>{dashCopy.voice}</div>
            <div style={s.kitValue}>{brandProfile?.sampleContent ? '✓ Trained' : '○ Default'}</div>
          </div>
        </div>
      </div>

      {/* Format Breakdown */}
      {stats.totalFormats > 0 && (
        <>
          <div style={s.sectionTitle}><span>{dashCopy.formatBreakdown}</span></div>
          <div style={s.card}>
            <div style={s.formatBar}>
              {Object.entries(FORMAT_META).map(([id, meta]) => {
                const count = stats.formatCounts[id] || 0;
                const pct = (count / stats.maxCount) * 100;
                return (
                  <div key={id} style={s.formatRow}>
                    <span style={s.formatIcon}>{meta.icon}</span>
                    <span style={s.formatName}>{meta.label}</span>
                    <div style={s.formatTrack}>
                      <div style={s.formatFill(pct, meta.color)} />
                    </div>
                    <span style={{ ...s.formatCount, color: meta.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Brand Voice Preview */}
      <div style={s.sectionTitle}><span>{dashCopy.brandVoice}</span></div>
      <div style={s.card}>
        {brandProfile?.sampleContent ? (
          <div style={s.voicePreview}>
            "{brandProfile.sampleContent.slice(0, 160)}{brandProfile.sampleContent.length > 160 ? '…' : ''}"
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
            {dashCopy.noVoice}{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={onEditProfile}>
              {dashCopy.editProfile}
            </span>
          </div>
        )}
      </div>

      {/* Generate CTA */}
      <div style={{ ...s.sectionTitle, marginTop: '28px' }}>
        <span>{copy.launchCampaign}</span>
      </div>
      <button type="button" style={s.generateBtn} onClick={onGenerate}>
        <span>⚡</span>
        <span>{copy.generateNow}</span>
      </button>

      {/* Quick Generate — now opens generator with format pre-selected */}
      <div style={s.sectionTitle}><span>{copy.quickGenerate}</span></div>
      <div style={s.quickCards}>
        {QUICK.map((q) => (
          <div
            key={q.id}
            style={s.quickCard(q.color)}
            onClick={() => onGenerateFormat(q.id)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={s.quickCardIcon(q.color)}>{q.icon}</div>
            <div style={s.quickCardTitle}>{q.title}</div>
            <div style={s.quickCardSub}>{q.sub}</div>
          </div>
        ))}
      </div>

      {/* WhatsApp */}
      <div style={{ ...s.sectionTitle, marginTop: '24px' }}><span>{dashCopy.waPromo}</span></div>
      <div style={s.whatsappCard}>
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{dashCopy.waSub}</div>
        <button
          type="button"
          style={s.waBtn}
          onClick={() => window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank', 'noopener,noreferrer')}
        >
          {dashCopy.waBtn}
        </button>
      </div>

      {/* Recent Content */}
      <div style={s.sectionTitle}>
        <span>{copy.recentContent}</span>
        {history.length > 0 && <span style={s.seeAll} onClick={onHistory}>See all</span>}
      </div>

      {history.length === 0 ? (
        <div style={s.emptyState}>{copy.noContent}</div>
      ) : (
        history.slice(0, 4).map((item, i) => (
          <div key={item.id || i} style={s.historyItem} onClick={onHistory}>
            <div style={s.historyTop}>
              <div style={s.historyPrompt}>{item.prompt}</div>
              <div style={s.historyDate}>{item.time}</div>
            </div>
            <div style={s.historyFormats}>
              {(item.formats || []).map((fmt) => {
                const meta = FORMAT_META[fmt];
                if (!meta) return null;
                return (
                  <span key={fmt} style={s.formatBadge(meta.color)}>
                    {meta.icon} {meta.label}
                  </span>
                );
              })}
            </div>
          </div>
        ))
      )}

      <div style={s.bottomNav}>
        <div style={s.navItem(true)}>
          <span style={{ fontSize: '20px' }}>🏠</span>
          <span>{copy.home}</span>
        </div>
        <div style={s.navItem(false)} onClick={onGenerate}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <span>{copy.generate}</span>
        </div>
        <div style={s.navItem(false)} onClick={onHistory}>
          <span style={{ fontSize: '20px' }}>📂</span>
          <span>{copy.history}</span>
        </div>
        <div style={s.navItem(false)} onClick={onEditProfile}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <span>{copy.profile}</span>
        </div>
      </div>
    </div>
  );
}
