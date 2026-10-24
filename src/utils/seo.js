import { pages } from '../data/routes';
export function setMetadata(pathname = '/') {
  pathname = pathname.replace(/\/$/, '') || '/';
  const page = pages[pathname];
  const title = `247TECHPRO | ${page?.title || 'Page Not Found'}`;
  document.title = title;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[name="description"]').content = page?.description || 'The requested page could not be found.';
  document.querySelector('meta[property="og:description"]').content = page?.description || 'The requested page could not be found.';
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  let base;
  try { base = new URL(configured || window.location.origin); if (!['https:', 'http:'].includes(base.protocol)) return; } catch { return; }
  const canonical = `${base.origin}${pathname}`;
  const link = document.querySelector('link[rel="canonical"]') || document.head.appendChild(document.createElement('link'));
  link.rel = 'canonical'; link.href = canonical;
  document.querySelector('meta[property="og:url"]').content = canonical;
  const script = document.getElementById('organization-schema');
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: '247TECHPRO', url: `${base.origin}/`, logo: `${base.origin}/logo-white.png`, description: 'Software, IT infrastructure, energy, security and smart technology solutions for businesses and individuals in Nigeria.', telephone: '+2348132393485', email: '247techpro@gmail.com', slogan: 'Your Success, Our Code', identifier: 'RC 7256802', areaServed: { '@type': 'Country', name: 'Nigeria' } });
}
