import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  let site;
  if (env.VITE_SITE_URL) {
    const url = new URL(env.VITE_SITE_URL);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('VITE_SITE_URL must be an HTTP(S) URL.');
    site = url.origin;
  }
  return { plugins: [react(), {
    name: '247techpro-seo',
    transformIndexHtml(html) {
      if (!site) return html;
      return html.replace('<meta property="og:url" content="/" />', `<meta property="og:url" content="${site}/" />\n    <link rel="canonical" href="${site}/" />`).replace('content="/technology-cover.jpg"', `content="${site}/technology-cover.jpg"`);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : '# Set VITE_SITE_URL at build time to add the sitemap URL.\n'}` });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? `\n  <url><loc>${site}/</loc></url>\n` : '\n  <!-- Set VITE_SITE_URL and rebuild to populate the official domain. -->\n'}</urlset>\n` });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt') { res.setHeader('Content-Type', 'text/plain'); res.end('User-agent: *\nDisallow: /\n'); }
        else if (req.url === '/sitemap.xml') { res.setHeader('Content-Type', 'application/xml'); res.end('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>'); }
        else next();
      });
    },
  }] };
});
