import path from "path";
import fs from "fs";

const BASE_URL = 'https://weirdanimals.life';

const getJsonFiles = (dir) => {
  try {
    return fs.readdirSync(dir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
};

const getSitemapContent = () => {
  const categories = getJsonFiles(path.resolve('src/data/categories'));
  const animals = getJsonFiles(path.resolve('src/data/animals'));
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/categories</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  categories.forEach(category => {
    xml += `
  <url>
    <loc>${BASE_URL}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  animals.forEach(animal => {
    xml += `
  <url>
    <loc>${BASE_URL}/animal/${animal}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
};

const generateSitemap = (outDir) => {
  const xml = getSitemapContent();
  
  // Ensure outDir exists before writing
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sitemapPath = path.resolve(outDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`✓ Sitemap generated at ${sitemapPath}`);
};

export const sitemapPlugin = () => {
  return {
    name: 'generate-sitemap',
    // Hook for production build
    closeBundle() {
      generateSitemap('dist');
    },
    // Hook for development server
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/sitemap.xml') {
          const xml = getSitemapContent();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml');
          res.end(xml);
        } else {
          next();
        }
      });
    }
  };
};
