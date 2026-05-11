import { NextRequest, NextResponse } from 'next/server';
import { licenseActivateSchema, safeValidateBody } from '@/lib/validations';
import { withRateLimit } from '@/lib/rateLimit';

const LICENSE_KEYS: Record<string, { type: string; features: string[]; expiresDays: number | null }> = {
  'B5M-TEST-PERS-ONAL': { type: 'personal', features: ['no_watermark'], expiresDays: 365 },
  'B5M-TEST-COMME-RCIAL': { type: 'commercial', features: ['no_watermark', 'high_res', 'batch_export'], expiresDays: 365 },
  'B5M-TEST-ENTE-RPRISE': { type: 'enterprise', features: ['no_watermark', 'high_res', 'batch_export', 'api_access', 'priority'], expiresDays: null },
};

async function handler(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = safeValidateBody(licenseActivateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { key, email } = validation.data;
    const licenseData = LICENSE_KEYS[key];
    
    if (!licenseData) {
      return NextResponse.json(
        { error: 'License key not found' },
        { status: 404 }
      );
    }

    const expiresAt = licenseData.expiresDays
      ? new Date(Date.now() + licenseData.expiresDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const license = {
      key,
      type: licenseData.type,
      email,
      expiresAt,
      features: licenseData.features,
      createdAt: new Date().toISOString(),
    };

    console.log('[LICENSE] Activated:', { key, email, type: licenseData.type });

    return NextResponse.json({
      success: true,
      license,
      message: `License activated successfully. Type: ${licenseData.type}`,
    });
  } catch (error) {
    console.error('License activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate license' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handler);
