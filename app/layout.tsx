import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/providers/AuthProvider';

// adjustFontFallback: true → Next.js generates a metric-matched fallback font
// so font-swap causes ZERO layout shift (CLS fix)
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  adjustFontFallback: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space',
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://alphaprime.co.in'),
  title: {
    default: 'AlphaPrime - Free Privacy-First Web Tools',
    template: '%s – AlphaPrime',
  },
  description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser. No tracking, no data collection.',
  keywords: ['free web tools', 'privacy tools', 'online compiler', 'password generator', 'image resizer', 'AlphaPrime'],
  authors: [{ name: 'AlphaPrime', url: 'https://alphaprime.co.in' }],
  alternates: { canonical: 'https://alphaprime.co.in' },
  openGraph: {
    type: 'website',
    siteName: 'AlphaPrime',
    title: 'AlphaPrime - Free Privacy-First Web Tools',
    description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser.',
    url: 'https://alphaprime.co.in',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'AlphaPrime Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@alphaprimecoin',
    title: 'AlphaPrime - Free Privacy-First Web Tools',
    description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser.',
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
  other: {
    'google-adsense-account': 'ca-pub-6584682991448565',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />


        {/* SVG favicon — tiny, loads in <5ms */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* Google AdSense – must be in <head> for approval */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6584682991448565"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-6584682991448565" />

      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen bg-white text-black antialiased flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-16 w-full">
            {children}
          </main>
          <Footer />

          {/* SW Kill — deferred to idle time to avoid long tasks */}
          <Script id="sw-kill" strategy="afterInteractive">
            {`
            if ('serviceWorker' in navigator) {
              var run = function() {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  regs.forEach(function(r) { r.unregister(); });
                });
              };
              if ('requestIdleCallback' in window) {
                requestIdleCallback(run);
              } else {
                setTimeout(run, 2000);
              }
            }
          `}
          </Script>

          {/* AdSense — Secondary load (prevents duplicate) */}
          <Script
            id="adsense-script"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6584682991448565"
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
