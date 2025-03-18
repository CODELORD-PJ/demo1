import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Face Cloning App',
  description: 'A web application for face cloning using AI/ML',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}