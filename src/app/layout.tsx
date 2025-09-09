import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import AppHeader from "@/components/layout/application/app-header"
import AppFooter from "@/components/layout/application/app-footer"
import { Toaster } from "@/components/ui/sonner"
import Providers from "./providers"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "LocalTube - Download YouTube Videos Locally",
    description: "Created by Marcuth",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-br">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    <AppHeader />
                    <main className="w-full py-6 px-4 min-h-screen">
                        {children}
                    </main>
                    <AppFooter />
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}
