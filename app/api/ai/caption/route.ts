import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { getRandomCaptionByCategory } from '@/lib/captions';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '';

interface CaptionRequest {
  location: string;
  city?: string;
  mode: string;
  duration: number;
  theme: string;
  style: 'sarcastic' | 'humorous' | 'poetic' | 'minimal' | 'reality-check';
  provider?: 'auto' | 'anthropic' | 'openai' | 'gemini' | 'huggingface' | 'local';
}

export async function POST(request: NextRequest) {
  try {
    const body: CaptionRequest = await request.json();
    const { location, city, mode, duration, theme, style, provider = 'auto' } = body;

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

    let caption: string;

    const wants = provider;
    const hasHF = !!HF_TOKEN;
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    // Choose cheapest-first when in auto mode: HuggingFace (free credits) -> Gemini -> OpenAI (mini) -> Anthropic (haiku) -> Local library
    const resolvedProvider =
      wants !== 'auto'
        ? wants
        : hasHF
        ? 'huggingface'
        : hasGemini
        ? 'gemini'
        : hasOpenAI
        ? 'openai'
        : hasAnthropic
        ? 'anthropic'
        : 'local';

    if (resolvedProvider === 'anthropic' && hasAnthropic) {
      const message = await anthropic.messages.create({
        model: process.env.ANTHROPIC_CAPTION_MODEL_ID || 'claude-3-haiku-20240307',
        max_tokens: 60,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      caption = content.type === 'text' ? content.text.trim() : '';
    } else if (resolvedProvider === 'openai' && hasOpenAI) {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_CAPTION_MODEL_ID || 'gpt-4o-mini',
        max_tokens: 60,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      caption = completion.choices[0]?.message?.content?.trim() || '';
    } else if (resolvedProvider === 'gemini' && hasGemini) {
      const modelId = process.env.GEMINI_TEXT_MODEL_ID || 'gemini-2.0-flash';
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 80,
              temperature: 0.9,
            },
          }),
        }
      );

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Gemini error: ${resp.status} ${errText}`);
      }

      const data = (await resp.json()) as any;
      const text =
        data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('\n') ||
        '';
      caption = String(text).trim();
    } else if (resolvedProvider === 'huggingface' && hasHF) {
      // Use OpenAI-compatible endpoint for chat completions
      const hfResp = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.HF_CAPTION_MODEL_ID || 'Qwen/Qwen2.5-72B-Instruct',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 60,
          temperature: 0.9,
        }),
      });

      if (!hfResp.ok) {
        const errText = await hfResp.text();
        throw new Error(`HuggingFace error: ${hfResp.status} ${errText}`);
      }

      const hfData = await hfResp.json() as any;
      caption = hfData?.choices?.[0]?.message?.content || '';
      caption = caption.trim();
    } else {
      const category =
        style === 'sarcastic'
          ? 'sarcasm'
          : style === 'humorous'
          ? 'humor'
          : style === 'poetic'
          ? 'poetic'
          : style === 'minimal'
          ? 'minimal'
          : 'reality-check';
      caption = getRandomCaptionByCategory(category as any).text;
    }

    // Remove quotes if the AI wrapped the caption
    caption = caption.replace(/^["']|["']$/g, '');
    caption = caption.replace(/\s+/g, ' ').trim();
    if (caption.length > 80) caption = caption.slice(0, 80);

    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error('AI caption generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate caption' },
      { status: 500 }
    );
  }
}
