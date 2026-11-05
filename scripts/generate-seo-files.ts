import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { FoodCart } from '../shared/schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://capitalcityfoodcarts.com';

function loadCarts(): FoodCart[] {
  const cartsPath = path.resolve(__dirname, '../client/public/carts.json');
  return JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
}

function generateSitemap(carts: FoodCart[]) {
  const staticUrls = [{ loc: `${SITE_URL}/`, priority: '1.0' }];
  const cartUrls = carts.map((cart) => ({
    loc: `${SITE_URL}/cart/${cart.slug}`,
    priority: '0.8',
  }));

  const urls = [...staticUrls, ...cartUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const outputPath = path.resolve(__dirname, '../client/public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✓ Generated sitemap.xml with ${urls.length} URLs`);
}

function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  const outputPath = path.resolve(__dirname, '../client/public/robots.txt');
  fs.writeFileSync(outputPath, robots);
  console.log('✓ Generated robots.txt');
}

function injectItemListSchema(carts: FoodCart[]) {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Madison, WI Food Carts',
    itemListElement: carts.map((cart, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/cart/${cart.slug}`,
      name: cart.name,
    })),
  };

  const scriptTag = `    <script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>\n  </head>`;

  // Injected into the BUILT output only (dist/public/index.html), not the
  // source client/index.html, so repeated builds never dirty tracked source.
  const distIndexPath = path.resolve(__dirname, '../dist/public/index.html');
  if (!fs.existsSync(distIndexPath)) {
    console.warn('⚠ dist/public/index.html not found — run this after `vite build`. Skipping ItemList injection.');
    return;
  }

  const html = fs.readFileSync(distIndexPath, 'utf-8').replace('  </head>', scriptTag);
  fs.writeFileSync(distIndexPath, html);
  console.log(`✓ Injected ItemList structured data for ${carts.length} carts into dist/public/index.html`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// No SSR in production, so per-route meta tags are baked into a static file per cart instead.
function generateCartPages(carts: FoodCart[]) {
  const distIndexPath = path.resolve(__dirname, '../dist/public/index.html');
  if (!fs.existsSync(distIndexPath)) {
    console.warn('⚠ dist/public/index.html not found — run this after `vite build`. Skipping per-cart pages.');
    return;
  }

  const baseHtml = fs.readFileSync(distIndexPath, 'utf-8');

  for (const cart of carts) {
    const title = `${cart.name} | Capital City Food Carts, Madison WI`;
    const description = `${cart.name} at ${cart.locationDisplayName} in Madison, WI. ${cart.description}. See menu, hours, and location.`;
    const canonical = `${SITE_URL}/cart/${cart.slug}`;
    // cart.image may already be absolute (some carts use hotlinked source photos).
    const absoluteImage = /^https?:\/\//.test(cart.image) ? cart.image : `${SITE_URL}${cart.image}`;
    const escTitle = escapeHtml(title);
    const escDescription = escapeHtml(description);
    const escImage = escapeHtml(absoluteImage);

    const cartSchema = {
      '@context': 'https://schema.org',
      '@type': 'FoodEstablishment',
      name: cart.name,
      description: cart.description,
      image: absoluteImage,
      url: canonical,
    };

    let html = baseHtml
      .replace(/<title>.*?<\/title>/s, `<title>${escTitle}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escDescription}$2`)
      .replace(/(<meta name="keywords" content=")[^"]*(")/, `$1${escDescription}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escTitle}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escDescription}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${escImage}$2`)
      .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${escTitle}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escTitle}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escDescription}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${escImage}$2`)
      .replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/, `$1${escTitle}$2`);

    // Swap the home hero preload for this cart's own hero image (its LCP element).
    const homeHeroPreloadRegex = /<link rel="preload" as="image"[^>]*data-home-hero[^>]*>/s;
    const cartHeroPreload = /^https?:\/\//.test(cart.image)
      ? ''
      : `<link rel="preload" as="image" fetchpriority="high" href="${escapeHtml(cart.image.replace(/\.jpg$/, '.webp'))}" />`;
    html = html.replace(homeHeroPreloadRegex, cartHeroPreload);

    // Strips the base page's WebSite + ItemList schemas, neither valid for a single cart.
    const schemaScriptRegex = /<script type="application\/ld\+json">.*?<\/script>\s*/gs;
    const newSchemaScript = `<script type="application/ld+json">${JSON.stringify(cartSchema)}</script>\n  `;
    html = schemaScriptRegex.test(html)
      ? html.replace(schemaScriptRegex, '').replace('</head>', `  ${newSchemaScript}</head>`)
      : html.replace('</head>', `  ${newSchemaScript}</head>`);

    const outDir = path.resolve(__dirname, `../dist/public/cart/${cart.slug}`);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
  }

  console.log(`✓ Generated ${carts.length} pre-rendered cart pages under dist/public/cart/`);
}

function main() {
  const mode = process.argv[2];
  const carts = loadCarts();

  if (mode === 'post-build') {
    // Runs after `vite build`, once dist/public/index.html exists.
    injectItemListSchema(carts);
    generateCartPages(carts);
  } else {
    // Runs before `vite build` so sitemap.xml/robots.txt live in
    // client/public and get copied into dist/public by Vite.
    generateSitemap(carts);
    generateRobotsTxt();
  }
}

main();
