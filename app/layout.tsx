import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hetty - Visual Model Cleanup Tool',
  description: 'The visual companion to henry. Clean up your old models with an intuitive interface that makes model management effortless.',
  generator: 'Hetty',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
