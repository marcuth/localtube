import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import AppHeader from "../components/layout/application/app-header"
import AppFooter from "../components/layout/application/app-footer"
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
    title: "LocalTube - Baixe vídeos do YouTube facilmente",
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
                <AppHeader />
                <Providers>{children}</Providers>
                <AppFooter />
            </body>
        </html>
    )
}
