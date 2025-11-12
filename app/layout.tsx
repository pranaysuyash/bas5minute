import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bas 5 Minute | India\'s Most Optimistic Unit of Time',
  description: 'Everything is 5 minutes away. Right? Visualize how far you can actually travel in 5 minutes from any location in India.',
  keywords: ['5 minute', 'bas 5 minute', 'india', 'traffic', 'map', 'isochrone', 'travel time', 'bangalore', 'mumbai'],
  authors: [{ name: 'Pranay Suyash' }],
  openGraph: {
    title: 'Bas 5 Minute | Map Your 5-Minute World',
    description: 'Everything is 5 minutes away. Right?',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bas 5 Minute',
    description: 'India\'s most optimistic unit of time - visualized',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
