
import type { Metadata } from "next"
import {
  Geist,
  Geist_Mono,
} from "next/font/google"

import "./globals.css"

import { SiteHeader } from "@/components/header"
import { SiteFooter } from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { AppShell } from "@/components/app-shell"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Carisma KIDS",
  description:
    "Дитячий одяг Carisma KIDS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html
        lang="uk"
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
      <body className="bg-background font-sans antialiased">
        <CartProvider>
        <AppShell>
          {children}
        </AppShell>
        </CartProvider>
      </body>
    </html>
  )
}