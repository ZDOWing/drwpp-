import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@components/theme-provider"
import Header from "@components/header"

export const metadata: Metadata = {
  title: "DRWPP STUDIO - Personnalisation de Wall Art",
  description: "Plateforme web de personnalisation et visualisation de produits Wall Art",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}