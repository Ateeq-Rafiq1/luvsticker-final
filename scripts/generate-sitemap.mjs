
import fs from 'fs';
import path from 'path';

// Define all the routes in your React Router application
const routes = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/faq',
  '/returns',
  '/blog',
  '/order-tracking',
  // Note: Dynamic routes like /product/:id and /blog/:slug would need to be
  // generated dynamically by fetching data from your database
];

const baseUrl = 'https://luvstickers.com'; // Replace with your actual domain

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
