import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@/components/Analytics'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Bas 5 Minute | India\'s Most Optimistic Unit of Time',
  description: 'Everything is 5 minutes away. Right? Visualize how far you can actually travel in 5 minutes from any location in India.',
  keywords: ['5 minute', 'bas 5 minute', 'india', 'traffic', 'map', 'isochrone', 'travel time', 'bangalore', 'mumbai'],
  authors: [{ name: 'Pranay Suyash' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://bas5minute.com'),
  openGraph: {
    title: 'Bas 5 Minute | India\'s Most Optimistic Unit of Time',
    description: 'Everything is 5 minutes away. Right? Create beautiful maps showing how far you can actually travel in 5 minutes. Perfect for social media with 50+ witty captions and 4 stunning themes.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Bas 5 Minute',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bas 5 Minute - India\'s Most Optimistic Unit of Time',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bas5minute',
    creator: '@pranaysuyash',
    title: 'Bas 5 Minute | India\'s Most Optimistic Unit of Time',
    description: 'Everything is 5 minutes away. Right? Create beautiful maps with witty captions about Indian traffic.',
    images: ['/twitter-card.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet" />

        {/* Google Analytics */}
        {gaId && gaId !== 'G-XXXXXXXXXX' && (
          <>
            <Script
              async
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              onLoad={() => {
                (window as any).dataLayer = (window as any).dataLayer || [];
                function gtag(...args: any[]) {
                  (window as any).dataLayer.push(args);
                }
                (window as any).gtag = gtag;
                gtag('js', new Date());
                gtag('config', gaId);
              }}
            />
          </>
        )}
      </head>
      <body className="font-sans">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
