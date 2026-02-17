const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

const app = express();
app.use(cors({
  origin: 'http://localhost:5111'  // Frontend port
}));
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

app.post('/api/ai/caption', async (req, res) => {
  try {
    const { location, city, mode, duration, theme, style, provider = 'anthropic' } = req.body;

    const prompt = `You are a witty Indian content creator making humorous captions for travel-time maps. The context:
- Location: ${location}${city ? ` in ${city}` : ''}
- Travel mode: ${mode}
- Claimed time: ${duration} minutes (but we both know it's longer in India!)
- Theme: ${theme}
- Style: ${style}

Generate a SHORT (max 60 characters), punchy caption in Hinglish (mix of Hindi and English) that captures the irony of "Bas 5 Minute" culture in India. The caption should be:
- Witty and relatable to Indians
- Reference traffic, optimism, or reality
- Use Hinglish naturally (like "Bhai bolta 5 min, map bolta 27")
- Be ${style} in tone

Return ONLY the caption text, nothing else.`;

    let caption;

    if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
      caption = message.content[0].text;
    } else if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
      });
      caption = response.choices[0].message.content;
    } else {
      // Mock caption for development
      caption = "Bhai bolta 5 min, map bolta 27! 🚗😅";
    }

    res.json({ caption });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// Proxy for OpenRouteService isochrones (to bypass CORS)
app.post('/api/isochrone', async (req, res) => {
  try {
    const { profile, locations, range, interval } = req.body;
    const orsKey = process.env.NEXT_PUBLIC_ORS_API_KEY || '';

    if (!orsKey) {
      return res.status(400).json({ error: 'OpenRouteService API key not configured' });
    }

    const response = await fetch(`https://api.openrouteservice.org/v2/isochrones/${profile}`, {
      method: 'POST',
      headers: {
        'Authorization': orsKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locations, range, interval }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `OpenRouteService error: ${error}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch isochrone' });
  }
});

// Proxy for Nominatim geocoding (to bypass CORS)
app.get('/api/geocode', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
      headers: {
        'User-Agent': 'Bas5Minute (https://bas5minute.com)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Nominatim error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

// Proxy for reverse geocoding (to bypass CORS)
app.get('/api/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng required' });
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      headers: {
        'User-Agent': 'Bas5Minute (https://bas5minute.com)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Nominatim error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reverse geocode' });
  }
});

app.listen(3010, () => {
  console.log('Backend server running on port 3010');
});