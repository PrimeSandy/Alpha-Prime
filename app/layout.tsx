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
  description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser. No tracking, no data collection. Online compiler, password generator, image resizer, and more.',
  keywords: [
    'free web tools',
    'privacy tools',
    'online compiler',
    'password generator',
    'image resizer',
    'AlphaPrime',
    'web developer tools',
    'secure chat',
    'link vault',
    'browser tools'
  ],
  authors: [{ name: 'AlphaPrime', url: 'https://alphaprime.co.in' }],
  creator: 'AlphaPrime',
  publisher: 'AlphaPrime',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://alphaprime.co.in/',
  },
  openGraph: {
    type: 'website',
    siteName: 'AlphaPrime',
    title: 'AlphaPrime - Free Privacy-First Web Tools',
    description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser.',
    url: 'https://alphaprime.co.in',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'AlphaPrime - Professional Web Tools'
    }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@alphaprimecoin',
    title: 'AlphaPrime - Free Privacy-First Web Tools',
    description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser.',
    images: ['/logo.png'],
    creator: '@alphaprimecoin',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-6584682991448565',
    'apple-mobile-web-app-title': 'AlphaPrime',
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

        {/* Google AdSense — primary script moved to Script component for optimization */}
      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen bg-white text-black antialiased flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-16 w-full">
            {children}
          </main>
          <Footer />

          {/* Google AdSense script — optimized with afterInteractive strategy */}
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6584682991448565"
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />

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
        </AuthProvider>
      </body>
    </html>
  );
}
