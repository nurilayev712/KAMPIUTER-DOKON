import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ChatWidget } from "@/components/ChatWidget";
import { PWARegister } from "@/components/PWARegister";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UPG RADE — Geymerlar uchun kompyuter do'koni",
  description: "O'zbekistondagi eng kuchli gaming kompyuterlar, noutbuklar va aksessuarlar do'koni.",
  manifest: "/manifest.json",
  keywords: ["gaming pc", "kompyuter", "noutbuk", "UPG", "upgrade", "NVIDIA", "RTX"],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "UPG RADE",
    title: "UPG RADE — O'zbekiston №1 Gaming Do'koni",
    description: "Eng zo'r gaming kompyuterlar. O'zingizning kompyuteringizni yig'ing!",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "UPG RADE" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <head>
        <meta name="theme-color" content="#ef4444" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-900 text-white transition-colors duration-300">
        <ThemeProvider>
          <ToastProvider>
            <StoreProvider>
              <PWARegister />
              {children}
              <ChatWidget />
            </StoreProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
