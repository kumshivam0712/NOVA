const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'history.json');

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Ensure data dir exists ────────────────────────────────────
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

// ── Helpers ───────────────────────────────────────────────────
function readHistory() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function writeHistory(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── ROUTES ────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BrandForge backend running ✅' });
});

// Generate content — proxies to Claude/OpenRouter securely
app.post('/api/generate', async (req, res) => {
  const { prompt, brandProfile, selectedFormats } = req.body;

  if (!prompt || !brandProfile || !selectedFormats?.length) {
    return res.status(400).json({ error: 'Missing required fields: prompt, brandProfile, selectedFormats' });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not set in backend .env (expected ANTHROPIC_API_KEY or OPENROUTER_API_KEY).' });
  }

  const formatList = selectedFormats.join(', ');
  const isOpenRouter = /^sk-or-v1-/i.test(API_KEY);
  const model = process.env.AI_MODEL || (isOpenRouter ? 'anthropic/claude-sonnet-4' : 'claude-sonnet-4-20250514');

  const systemPrompt = `You are BrandForge AI, a multi-agent content generation system for Indian solo creators and small business owners.

Brand Profile:
- Brand Name: ${brandProfile.brandName}
- Tagline: ${brandProfile.tagline || 'N/A'}
- Niche: ${brandProfile.niche || 'General'}
- Tone: ${brandProfile.tone || 'Friendly & Relatable'}
- Language: ${brandProfile.language || 'Hinglish'}
- Sample Content Style: ${brandProfile.sampleContent || 'Warm, relatable, and direct'}

You must generate content for these formats: ${formatList}

Rules:
1. Match the brand's tone EXACTLY — sound like a human, not AI
2. Use ${brandProfile.language || 'Hinglish'} naturally — mix Hindi/English if Hinglish
3. Keep it real, local, and relatable for Indian audiences
4. For Reels Script: include clearly labeled [HOOK], [MAIN CONTENT], [CTA], [TRENDING AUDIO CUE]
5. For Carousel: include 5 slides as [SLIDE 1] through [SLIDE 5] with captions and hashtags
6. For X Thread: start with a banger hook tweet, then 4-5 follow-ups, end with CTA + hashtags
7. For WhatsApp: short, punchy broadcast message with emoji

Respond ONLY with the content sections, clearly labeled with the format name as a header. No preamble, no explanations.`;

  try {
    let response;

    if (isOpenRouter) {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'BrandForge',
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate content for: "${prompt}"` },
          ],
        }),
      });
    } else {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: `Generate content for: "${prompt}"` }],
        }),
      });
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message = err.error?.message || err.message || 'AI API error';
      return res.status(response.status).json({ error: message });
    }

    const data = await response.json();
    const text = isOpenRouter
      ? (data.choices?.[0]?.message?.content || '')
      : (data.content?.[0]?.text || '');

    if (!text) {
      return res.status(502).json({ error: 'AI provider returned no content.' });
    }

    res.json({ text });

  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: 'Failed to reach the AI provider. Check your API key and network.' });
  }
});

// Save to history
app.post('/api/history', (req, res) => {
  try {
    const item = req.body;
    if (!item?.prompt) return res.status(400).json({ error: 'Missing prompt' });
    item.id = Date.now().toString();
    item.savedAt = new Date().toISOString();
    const history = readHistory();
    history.unshift(item);
    // Keep last 100 entries
    writeHistory(history.slice(0, 100));
    res.json({ success: true, id: item.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// Get history
app.get('/api/history', (req, res) => {
  try {
    res.json(readHistory());
  } catch (err) {
    res.status(500).json({ error: 'Failed to read history' });
  }
});

// Delete history item
app.delete('/api/history/:id', (req, res) => {
  try {
    const history = readHistory().filter(h => h.id !== req.params.id);
    writeHistory(history);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Save / update brand profile
app.post('/api/profile', (req, res) => {
  try {
    const profileFile = path.join(__dirname, 'data', 'profile.json');
    fs.writeFileSync(profileFile, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get brand profile
app.get('/api/profile', (req, res) => {
  try {
    const profileFile = path.join(__dirname, 'data', 'profile.json');
    if (!fs.existsSync(profileFile)) return res.json(null);
    res.json(JSON.parse(fs.readFileSync(profileFile, 'utf8')));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read profile' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ BrandForge backend running on http://localhost:${PORT}`);
  console.log(`   API Key: ${process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ NOT SET — add to .env'}\n`);
});
