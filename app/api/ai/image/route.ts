import { NextRequest, NextResponse } from 'next/server';

type GeminiPart =
  | { text: string }
  | {
      inline_data: { mime_type: string; data: string };
    }
  | {
      inlineData: { mimeType: string; data: string };
    };

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<any>;
    };
  }>;
};

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '';

let dailyCounter: { day: string; count: number } = { day: '', count: 0 };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function consumeQuota(maxPerDay: number) {
  const day = todayKey();
  if (dailyCounter.day !== day) dailyCounter = { day, count: 0 };
  if (dailyCounter.count >= maxPerDay) return false;
  dailyCounter.count += 1;
  return true;
}

function extractDataUrlFromParts(parts: any[]): { dataUrl?: string; text?: string } {
  let text = '';
  let dataUrl: string | undefined;

  for (const part of parts || []) {
    if (typeof part?.text === 'string') text += (text ? '\n' : '') + part.text;

    const inline = part?.inline_data ?? part?.inlineData ?? part?.inline_data;
    const mimeType = inline?.mime_type ?? inline?.mimeType;
    const data = inline?.data;
    if (!dataUrl && typeof mimeType === 'string' && typeof data === 'string') {
      dataUrl = `data:${mimeType};base64,${data}`;
    }
  }

  return { dataUrl, text: text || undefined };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      count?: number;
      imageDataUrl?: string;
      provider?: 'gemini' | 'fal' | 'replicate' | 'huggingface';
    };

    const provider = body?.provider || 'gemini';
    
    // Handle HuggingFace FLUX
    if (provider === 'huggingface') {
      return await handleHuggingFaceImage(body);
    }
    
    if (provider !== 'gemini') {
      return NextResponse.json(
        { error: `Provider not implemented: ${provider}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const modelId = process.env.GEMINI_IMAGE_MODEL_ID || 'gemini-3-pro-image-preview';
    const maxPerDay = Number.parseInt(process.env.MAX_DAILY_GEMINI_IMAGE_REQUESTS || '2', 10) || 2;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 400 }
      );
    }

    if (!consumeQuota(maxPerDay)) {
      return NextResponse.json(
        { error: `Daily AI image limit reached (${maxPerDay}/day).` },
        { status: 429 }
      );
    }

    const prompt = (body?.prompt || '').trim();
    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const count = Math.max(1, Math.min(4, Math.round(body?.count ?? 1)));

    const parts: GeminiPart[] = [{ text: prompt }];

    if (body?.imageDataUrl && typeof body.imageDataUrl === 'string' && body.imageDataUrl.startsWith('data:')) {
      const match = body.imageDataUrl.match(/^data:(.+?);base64,(.+)$/);
      if (match) {
        parts.push({
          inline_data: { mime_type: match[1], data: match[2] },
        });
      }
    }

    const payload = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        candidateCount: count,
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: { image_size: '1K' },
      },
    };

    const resp = await fetch(`${GEMINI_BASE_URL}/models/${modelId}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: `Gemini error: ${resp.status} ${errText}` },
        { status: resp.status }
      );
    }

    const data = (await resp.json()) as GeminiResponse;
    const candidates = data?.candidates || [];

    const results = candidates
      .map((c) => extractDataUrlFromParts(c?.content?.parts || []))
      .filter((r) => r.dataUrl || r.text);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('AI image route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

async function handleHuggingFaceImage(body: { prompt?: string; count?: number }) {
  if (!HF_TOKEN) {
    return NextResponse.json(
      { error: 'HF_TOKEN or HUGGINGFACE_API_KEY not configured' },
      { status: 400 }
    );
  }

  const prompt = (body?.prompt || '').trim();
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  const count = Math.max(1, Math.min(4, Math.round(body?.count ?? 1)));
  const model = process.env.HF_IMAGE_MODEL_ID || 'black-forest-labs/FLUX.1-schnell';
  
  const results: Array<{ dataUrl?: string; text?: string }> = [];

  // FLUX on HF Inference - use the dedicated endpoint
  for (let i = 0; i < count; i++) {
    try {
      const resp = await fetch('https://router.huggingface.co/hf-inference/models/' + model, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error(`HF image error ${i + 1}:`, resp.status, errText);
        results.push({ text: `Error: ${resp.status}` });
        continue;
      }

      // Response is image blob
      const blob = await resp.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const base64 = buffer.toString('base64');
      const mimeType = blob.type || 'image/png';
      
      results.push({
        dataUrl: `data:${mimeType};base64,${base64}`,
      });
    } catch (err) {
      console.error(`HF image error ${i + 1}:`, err);
      results.push({ text: 'Failed to generate' });
    }
  }

  return NextResponse.json({ results });
}
