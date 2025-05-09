import './globals.css'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nuch Summarizer',
  description: 'AI-powered article summarization tool',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} transition-colors duration-200`}>
        <ThemeProvider>
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
} 