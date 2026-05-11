import { NextRequest, NextResponse } from 'next/server';
import { orderSchema, safeValidateBody } from '@/lib/validations';
import { withRateLimit } from '@/lib/rateLimit';

async function handler(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = safeValidateBody(orderSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const orderRecord = {
      ...validation.data,
      id: `ORD-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('[ORDER] New order received:', orderRecord);

    return NextResponse.json({
      success: true,
      orderId: orderRecord.id,
      message: 'Order submitted successfully. We will contact you shortly.',
    });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handler);
