import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Supplier Hub - Connect Retailers, Suppliers & Delivery',
  description: 'PWA for retailers, wholesalers, farmers & boda riders. Real-time stock alerts, supplier discovery, voice orders & delivery tracking.',
  keywords: ['supplier hub', 'retailer', 'wholesaler', 'farmer', 'boda delivery', 'stock management', 'PWA'],
  authors: [{ name: 'Supplier Hub Team' }],
  openGraph: {
    title: 'Supplier Hub',
    description: 'Connect retailers with suppliers & delivery riders',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#22c55e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Supplier Hub" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  )
}