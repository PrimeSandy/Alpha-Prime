import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  reactCompiler: true,
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy .htm and .html page redirects
      { source: '/privacy.htm', destination: '/privacy', permanent: true },
      { source: '/privacy.html', destination: '/privacy', permanent: true },
      { source: '/terms.htm', destination: '/terms', permanent: true },
      { source: '/terms.html', destination: '/terms', permanent: true },
      { source: '/contact.htm', destination: '/contact', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/about.htm', destination: '/about', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      // Legacy tool redirects (old .htm and .html tool pages)
      { source: '/word-counter.htm', destination: '/tools/word-counter', permanent: true },
      { source: '/word-counter.html', destination: '/tools/word-counter', permanent: true },
      { source: '/password-generator.htm', destination: '/tools/password-generator', permanent: true },
      { source: '/password-generator.html', destination: '/tools/password-generator', permanent: true },
      { source: '/image-resizer.htm', destination: '/tools/image-resizer', permanent: true },
      { source: '/image-resizer.html', destination: '/tools/image-resizer', permanent: true },
      { source: '/base64.htm', destination: '/tools/base64', permanent: true },
      { source: '/base64.html', destination: '/tools/base64', permanent: true },
      { source: '/base64-converter.htm', destination: '/tools/base64', permanent: true },
      { source: '/base64-converter.html', destination: '/tools/base64', permanent: true },
      { source: '/case-converter.htm', destination: '/tools/case-converter', permanent: true },
      { source: '/case-converter.html', destination: '/tools/case-converter', permanent: true },
      { source: '/compiler.htm', destination: '/tools/online-compiler', permanent: true },
      { source: '/compiler.html', destination: '/tools/online-compiler', permanent: true },
      { source: '/color-tools.htm', destination: '/tools/color-tools', permanent: true },
      { source: '/color-tools.html', destination: '/tools/color-tools', permanent: true },
      { source: '/diff-checker.htm', destination: '/tools/diff-checker', permanent: true },
      { source: '/diff-checker.html', destination: '/tools/diff-checker', permanent: true },
      // Old missing paths indexed by Google (like online-compiler-tool folder)
      { source: '/online-compiler-tool/:path*', destination: '/tools/online-compiler', permanent: true },
      { source: '/online-compiler-tool/tools/diff-checker', destination: '/tools/diff-checker', permanent: true },
      // Variations like "image-tools" instead of "image-resizer"
      { source: '/image-tools', destination: '/tools/image-resizer', permanent: true },
      { source: '/image-tools.htm', destination: '/tools/image-resizer', permanent: true },
      { source: '/image-tools.html', destination: '/tools/image-resizer', permanent: true },
      { source: '/color-picker', destination: '/tools/color-tools', permanent: true },
      { source: '/word-counter-tool', destination: '/tools/word-counter', permanent: true },
      { source: '/password-gen', destination: '/tools/password-generator', permanent: true },
      // Old path aliases (without /tools/ prefix)
      // General Catch-All for Tools without /tools/ prefix (just in case they were indexed differently)
      { source: '/word-counter', destination: '/tools/word-counter', permanent: true },
      { source: '/password-generator', destination: '/tools/password-generator', permanent: true },
      { source: '/image-resizer', destination: '/tools/image-resizer', permanent: true },
      { source: '/base64', destination: '/tools/base64', permanent: true },
      { source: '/base64-converter', destination: '/tools/base64', permanent: true },
      { source: '/text-case-converter', destination: '/tools/case-converter', permanent: true },
      { source: '/case-converter', destination: '/tools/case-converter', permanent: true },
      { source: '/compiler', destination: '/tools/online-compiler', permanent: true },
      { source: '/online-compiler', destination: '/tools/online-compiler', permanent: true },
      { source: '/color-picker', destination: '/tools/color-tools', permanent: true },
      { source: '/color-tools', destination: '/tools/color-tools', permanent: true },
      { source: '/diff-checker', destination: '/tools/diff-checker', permanent: true },
      { source: '/link-vault', destination: '/tools/link-vault', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/ads.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
