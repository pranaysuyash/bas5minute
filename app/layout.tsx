import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
