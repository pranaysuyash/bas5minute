import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface CaptionRequest {
  location: string;
  city?: string;
  mode: string;
  duration: number;
  theme: string;
  style: 'sarcastic' | 'humorous' | 'poetic' | 'minimal' | 'reality-check';
  provider?: 'anthropic' | 'openai';
}

export async function POST(request: NextRequest) {
  try {
    const body: CaptionRequest = await request.json();
    const { location, city, mode, duration, theme, style, provider = 'anthropic' } = body;

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

      const content = message.content[0];
      caption = content.type === 'text' ? content.text.trim() : '';
    } else if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      caption = completion.choices[0]?.message?.content?.trim() || '';
    } else {
      return NextResponse.json(
        { error: 'No AI API key configured' },
        { status: 500 }
      );
    }

    // Remove quotes if the AI wrapped the caption
    caption = caption.replace(/^["']|["']$/g, '');

    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error('AI caption generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate caption' },
      { status: 500 }
    );
  }
}
