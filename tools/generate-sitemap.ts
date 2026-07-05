import { writeFileSync } from 'fs';

const BASE_URL = 'https://prompthub.com';

const staticPages = ['/', '/busca', '/preco', '/admin'];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
    )
    .join('')}
</urlset>`;

writeFileSync('apps/web/public/sitemap.xml', sitemap.trim());
console.log('✓ Sitemap generated');
