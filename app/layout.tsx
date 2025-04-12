import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
  variable: '--font-montserrat',
})

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
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}