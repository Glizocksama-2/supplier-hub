import type { Metadata, Viewport } from 'next'
import { Inconsolata } from 'next/font/google'
import './globals.css'

const inconsolata = Inconsolata({
  subsets: ['latin'],
  variable: '--font-inconsolata',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SUPPLIER HUB // Nairobi B2B Supply & Boda Logistics Terminal',
  description: 'Industrial-grade PWA dispatch network connecting retailers, wholesalers, farmers, and boda riders across East Africa.',
  keywords: ['supplier hub', 'nairobi supply chain', 'retailer kiosk', 'wholesaler', 'farmer', 'boda delivery', 'PWA'],
  authors: [{ name: 'Supplier Hub Logistics' }],
  openGraph: {
    title: 'SUPPLIER HUB // B2B Terminal',
    description: 'Direct commodity supply & boda dispatch system for East Africa',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SupplierHub" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inconsolata.variable} font-mono min-h-screen bg-[#0a0a0c] text-[#e2e4e9] antialiased selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  )
}