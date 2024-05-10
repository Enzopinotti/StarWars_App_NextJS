/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async () => [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
          ],
        },
    ],
    i18n: {
        locales: ['en', 'es'],  
        defaultLocale: 'en',  
        localeDetection: false, 
    },
    swcMinify: true,
};

export default nextConfig;
