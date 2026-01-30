const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'top-salary-pages.csv');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

const baseUrl = 'https://salary-calculator-railway.app';

try {
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split('\n');
    const urls = [];

    // Add static pages
    urls.push(`${baseUrl}/`);
    urls.push(`${baseUrl}/about/`);
    urls.push(`${baseUrl}/privacy-policy/`);
    urls.push(`${baseUrl}/cookie-policy/`);

    // Extract dynamic pages from CSV
    // Starting from 1 to skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // URL is the first column, matching original domain to extract slugs
        const match = line.match(/^"?(https:\/\/[^/]+\/salary-calculator\/[^/?,"]+\/)"?/);
        if (match) {
            const originalUrl = match[1];
            const slugMatch = originalUrl.match(/\/salary-calculator\/([^/]+)\/$/);
            if (slugMatch) {
                const slug = slugMatch[1];
                urls.push(`${baseUrl}/salary-calculator/${slug}/`);
            }
        }
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(urls)];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === baseUrl + '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${url === baseUrl + '/' ? '1.0' : (url.includes('/salary-calculator/') ? '0.9' : '0.7')}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`Successfully generated sitemap with ${uniqueUrls.length} URLs.`);

} catch (err) {
    console.error('Error generating sitemap:', err);
}
