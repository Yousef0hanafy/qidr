import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "قدر | Qidr - Digital Menu",
  description: "Explore our menu and discover delicious dishes at Qidr restaurant.",
  keywords: ["Qidr", "قدر", "restaurant", "menu", "digital menu", "food"],
  authors: [{ name: "Qidr" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "قدر | Qidr - Digital Menu",
    description: "Explore our menu and discover delicious dishes at Qidr restaurant.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-white text-gray-900"
        style={{
          fontFamily: 'var(--font-primary)',
        }}
      >
        <style>{`
          :root {
            --font-primary: 'Noto Kufi Arabic', 'Inter', system-ui, -apple-system, sans-serif;
            --color-gold: #D4A843;
            --color-gold-light: #F0D88A;
            --color-navy: #1A1A2E;
            --color-navy-light: #16213E;
          }
          html {
            scroll-behavior: smooth;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #D4D4D8;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #A1A1AA;
          }
          /* RTL support */
          [dir="rtl"] {
            text-align: right;
          }
          [dir="ltr"] {
            text-align: left;
          }
        `}</style>
        {children}
        <Toaster position={typeof window !== 'undefined' && document.documentElement.dir === 'rtl' ? 'top-left' : 'top-right'} richColors />
      </body>
    </html>
  );
}
