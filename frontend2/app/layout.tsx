import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] })

export const metadata: Metadata = {
  title: "Medical Transcription System",
  description: "Professional consultation recording and transcription",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

