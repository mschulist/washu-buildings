import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WashU Buildings Information',
  description:
    'Information about buildings at Washington University in St. Louis',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
