import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia' as any, // Latest Stripe API version
});

interface PaymentRequest {
  licenseType: 'personal' | 'commercial' | 'enterprise';
  email: string;
  metadata?: Record<string, string>;
}

const PRICES = {
  personal: parseInt(process.env.PERSONAL_LICENSE_PRICE || '499'),
  commercial: parseInt(process.env.COMMERCIAL_LICENSE_PRICE || '2999'),
  enterprise: parseInt(process.env.ENTERPRISE_LICENSE_PRICE || '9999'),
};

const LICENSE_DESCRIPTIONS = {
  personal: 'Personal Use License - Unlimited personal exports without watermark',
  commercial: 'Commercial Use License - Use for business, marketing, and merchandise',
  enterprise: 'Enterprise License - API access, white-label, and unlimited team use',
};

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    const { licenseType, email, metadata = {} } = body;

    if (!['personal', 'commercial', 'enterprise'].includes(licenseType)) {
      return NextResponse.json(
        { error: 'Invalid license type' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const amount = PRICES[licenseType];
    const description = LICENSE_DESCRIPTIONS[licenseType];

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Bas 5 Minute - ${licenseType.charAt(0).toUpperCase() + licenseType.slice(1)} License`,
              description,
              images: ['https://via.placeholder.com/300x300?text=Bas+5+Minute'],
            },
            unit_amount: amount * 100, // Stripe uses smallest currency unit
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
      customer_email: email,
      metadata: {
        licenseType,
        ...metadata,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
