import React, { useState, useEffect } from 'react';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import { generateLogo } from './utils/logo';

const BACKEND = process.env.REACT_APP_BACKEND_URL || '/api';

export default function App() {
  const [screen, setScreen]             = useState('loading');
  const [brandProfile, setBrandProfile] = useState(null);
  const [history, setHistory]           = useState([]);
  const [backendOk, setBackendOk]       = useState(null);
  const [user, setUser]                 = useState(null);
  const [generatorPreset, setGeneratorPreset] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('brandforge_session') || 'null');
        if (!savedUser) {
          setScreen('login');
          return;
        }
        setUser(savedUser);
        const health = await fetch(`${BACKEND}/health`);
        setBackendOk(health.ok);
        const profileRes = await fetch(`${BACKEND}/profile`);
        const profile = await profileRes.json();
        const historyRes = await fetch(`${BACKEND}/history`);
        const hist = await historyRes.json();
        setHistory(Array.isArray(hist) ? hist : []);
        if (profile && profile.brandName) {
          const normalizedProfile = {
            ...profile,
            language: profile.language || savedUser?.languagePreference || 'Hinglish',
            logoUrl: profile.logoUrl || generateLogo(profile.brandName, profile.niche),
          };
          setBrandProfile(normalizedProfile);
          try {
            await fetch(`${BACKEND}/profile`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(normalizedProfile),
            });
          } catch {}
          setScreen('dashboard');
        } else {
          setScreen('onboarding');
        }
      } catch {
        setBackendOk(false);
        const savedUser = JSON.parse(localStorage.getItem('brandforge_session') || 'null');
        if (savedUser) setUser(savedUser);
        setScreen(savedUser ? 'dashboard' : 'login');
      }
    };
    init();
  }, []);

  const handleOnboardingComplete = async (profile) => {
    const preferredLanguage = profile.language || user?.languagePreference || 'Hinglish';
    const updatedProfile = {
      ...profile,
      language: preferredLanguage,
      logoUrl: profile.logoUrl || generateLogo(profile.brandName, profile.niche),
    };
    const updatedUser = user ? { ...user, languagePreference: preferredLanguage } : user;

    setBrandProfile(updatedProfile);
    if (updatedUser) {
      localStorage.setItem('brandforge_session', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    try {
      await fetch(`${BACKEND}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
    } catch {}
    setScreen('dashboard');
  };

  const handleGenerated = async (result) => {
    try {
      const res = await fetch(`${BACKEND}/history`);
      const hist = await res.json();
      setHistory(Array.isArray(hist) ? hist : [result, ...history]);
    } catch {
      setHistory(prev => [result, ...prev]);
    }
    setScreen('dashboard');
  };

  if (screen === 'loading') {
    return (
      <div style={{
        minHeight:'100vh', background:'var(--bg)',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:'16px',
      }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'32px', fontWeight:'800', color:'var(--text)' }}>
          Brand<span style={{ color:'var(--accent)' }}>Forge</span>
        </div>
        <div style={{
          width:'32px', height:'32px',
          border:'3px solid var(--border)',
          borderTopColor:'var(--accent)',
          borderRadius:'50%',
          animation:'spin 0.8s linear infinite',
        }} />
        <div style={{ fontSize:'13px', color:'var(--muted)' }}>Starting up...</div>
      </div>
    );
  }

  const savedUser = JSON.parse(localStorage.getItem('brandforge_session') || 'null');

  return (
    <>
      {backendOk === false && (
        <div style={{
          background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.25)',
          borderRadius:'8px', padding:'10px 16px', margin:'12px auto',
          fontSize:'12px', color:'var(--muted)', textAlign:'center', maxWidth:'480px',
        }}>
          ⚠️ Backend offline — content won't save. Run: <code>cd backend && node server.js</code>
        </div>
      )}
      {screen === 'login' && (
        <Login
          preferredLanguage={savedUser?.languagePreference || 'Hinglish'}
          onLogin={(u) => { setUser(u); setScreen('onboarding'); }}
          onSwitchToRegister={() => setScreen('register')}
        />
      )}
      {screen === 'register' && (
        <Register
          preferredLanguage={savedUser?.languagePreference || 'Hinglish'}
          onRegister={(u) => { setUser(u); setScreen('onboarding'); }}
          onSwitchToLogin={() => setScreen('login')}
        />
      )}
      {screen === 'onboarding' && <Onboarding user={user} onComplete={handleOnboardingComplete} />}
      {screen === 'dashboard' && (
        <Dashboard
          brandProfile={brandProfile}
          history={history}
          user={user}
          onGenerate={() => { setGeneratorPreset(null); setScreen('generator'); }}
          onGenerateFormat={(formatId) => { setGeneratorPreset([formatId]); setScreen('generator'); }}
          onHistory={() => setScreen('history')}
          onEditProfile={() => setScreen('onboarding')}
          onLogout={() => { localStorage.removeItem('brandforge_session'); setUser(null); setScreen('login'); }}
        />
      )}
      {screen === 'generator' && (
        <Generator
          brandProfile={brandProfile}
          initialFormats={generatorPreset}
          onBack={() => { setGeneratorPreset(null); setScreen('dashboard'); }}
          onComplete={handleGenerated}
        />
      )}
      {screen === 'history' && (
        <History history={history} onBack={() => setScreen('dashboard')} />
      )}
    </>
  );
}
