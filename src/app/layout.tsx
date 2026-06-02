import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "قدر | Qidr - Digital Menu",
  description: "Explore our menu and discover delicious dishes at Qidr restaurant.",
  keywords: ["Qidr", "قدر", "restaurant", "menu", "digital menu", "food"],
  authors: [{ name: "Qidr" }],
  icons: {
    icon: "/Qidr_Favicon.avif",
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
        {/* Preload critical images for faster LCP */}
        <link rel="preload" href="/images/hero-bg.png" as="image" />
        <link rel="preload" href="/Qidr.avif" as="image" type="image/avif" />
      </head>
      <body
        className="antialiased text-[#D4956A]"
        style={{
          fontFamily: 'var(--font-primary)',
        }}
      >
        <style>{`
          :root {
            --font-primary: 'Noto Kufi Arabic', 'Inter', system-ui, -apple-system, sans-serif;
            --color-espresso: #1A1410;
            --color-espresso-dark: #120D08;
            --color-caramel: #D4956A;
            --color-beige: #D4C8BB;
            --color-cream: #F2EAE0;
          }
          html {
            scroll-behavior: smooth;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: #1A1410;
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
            background: rgba(212,149,106,0.3);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(212,149,106,0.5);
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
