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
        className="antialiased text-[#F1CDAB]"
        style={{
          fontFamily: 'var(--font-primary)',
        }}
      >
        <style>{`
          :root {
            --font-primary: 'Noto Kufi Arabic', 'Inter', system-ui, -apple-system, sans-serif;
            --color-green-dark: #003327;
            --color-green-darker: #002419;
            --color-gold: #F1CDAB;
            --color-cream: #F3E5D8;
            --color-white-on-dark: #F2F0E5;
          }
          html {
            scroll-behavior: smooth;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: #003327;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(241,205,171,0.3);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(241,205,171,0.5);
          }
          /* RTL support */
          [dir="rtl"] {
            text-align: right;
          }
          [dir="ltr"] {
            text-align: left;
          }
          /* Hide horizontal scrollbar in category nav */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {children}
        <Toaster position={typeof window !== 'undefined' && document.documentElement.dir === 'rtl' ? 'top-left' : 'top-right'} richColors />
      </body>
    </html>
  );
}
