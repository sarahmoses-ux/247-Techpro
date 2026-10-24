import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { loadEnv } from 'vite';
import { pages } from '../src/data/routes.js';
const env = loadEnv('production', process.cwd(), 'VITE_');
const origin = env.VITE_SITE_URL ? new URL(env.VITE_SITE_URL).origin : '';
const template = readFileSync('dist/index.html', 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
for (const [path, page] of Object.entries(pages)) {
  let html = template.replace(/<title>.*?<\/title>/, `<title>${escape(`247TECHPRO | ${page.title}`)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(page.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(`247TECHPRO | ${page.title}`)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(page.description)}`);
  if (origin) html = html.replace(/(<link rel="canonical" href=")[^"]*/, `$1${origin}${path}`).replace(/(<meta property="og:url" content=")[^"]*/, `$1${origin}${path}`);
  const directory = path === '/' ? 'dist' : `dist${path}`;
  mkdirSync(directory, { recursive: true });
  writeFileSync(`${directory}/index.html`, html);
}
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${origin ? Object.keys(pages).map(path => `  <url><loc>${origin}${path}</loc></url>`).join('\n') : '  <!-- Set VITE_SITE_URL before building to list the official page URLs. -->'}\n</urlset>\n`);
console.log(`Generated ${Object.keys(pages).length} page entry points and page-specific metadata.`);
