import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const site = 'https://prancheta.cloud';

const apps = {
  tabela: {
    name: 'Tabela de Futebol',
    icon: 'tabela-de-futebol.png',
    id: 'com.prancheta.tabeladefutebol',
    pitch: 'Cadastre os times, o app monta os jogos e a classificação sai sozinha a cada placar. Mata-mata, grupos, artilharia e PDF para o grupo.',
  },
  quadro: {
    name: 'Quadro Tático',
    icon: 'quadro-tatico.png',
    id: 'com.prancheta.quadrotaticodeesportes',
    pitch: 'Monte a jogada no celular em passos, dê play para ver os jogadores se mexendo e mande a imagem ou o vídeo para o time.',
  },
  peteleco: {
    name: 'Futebol de Botão: Peteleco',
    icon: 'peteleco-cards.png',
    id: 'com.prancheta.peteleco',
    pitch: 'Futebol de botão com cartas de poder: jogue contra o computador, com um amigo no mesmo celular ou online, e faça a Rota do Brasil.',
  },
  caixa: {
    name: 'Caixa da Pelada',
    icon: 'caixa-da-pelada.png',
    id: 'com.prancheta.financafacil',
    pitch: 'Marque quem pagou, veja quem está devendo e mande a cobrança pronta no grupo. Semanal, quinzenal ou mensal, fixo ou avulso.',
  },
};

const quadra = (spec, title, kind = 'quadra') => {
  const [who, moves = ''] = spec.split(';');
  const players = who.trim().split('|').map((t) => {
    const [label, x, y] = t.trim().split(/\s+/);
    return { label, x: Number(x), y: Number(y) };
  });
  const arrows = moves.trim() ? moves.trim().split('|').map((m) => m.trim().split('>').map((pt) => pt.trim().split(/\s+/).map(Number))) : [];
  const line = 'stroke="#ffffff" stroke-opacity="0.85" stroke-width="2" fill="none"';
  return `<svg viewBox="0 0 400 240" role="img" aria-label="${title}">
            <defs><marker id="seta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#ffc400" /></marker></defs>
            <rect width="400" height="240" fill="#2f8f4e" />
            <rect x="10" y="10" width="380" height="220" ${line} />
            <line x1="200" y1="10" x2="200" y2="230" ${line} />
            <circle cx="200" cy="120" r="30" ${line} />
${kind === 'campo'
    ? `            <rect x="10" y="62" width="58" height="116" ${line} />
            <rect x="10" y="94" width="22" height="52" ${line} />
            <rect x="332" y="62" width="58" height="116" ${line} />
            <rect x="368" y="94" width="22" height="52" ${line} />`
    : `            <path d="M10 60 A60 60 0 0 1 70 120 A60 60 0 0 1 10 180" ${line} />
            <path d="M390 60 A60 60 0 0 0 330 120 A60 60 0 0 0 390 180" ${line} />`}
            <rect x="2" y="100" width="8" height="40" ${line} />
            <rect x="390" y="100" width="8" height="40" ${line} />
${arrows.map(([[x1, y1], [x2, y2]]) => `            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffc400" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#seta)" />`).join('\n')}
${players.map(({ label, x, y }) => `            <circle cx="${x}" cy="${y}" r="${kind === 'campo' ? 14 : 17}" fill="${label === 'GL' ? '#ff8a3d' : '#ffffff'}" stroke="#0d2a14" stroke-width="2" /><text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${kind === 'campo' ? 11 : 13}" font-weight="700" fill="${label === 'XX' ? '#ffffff' : '#0d2a14'}">${label === 'XX' ? '' : label}</text>`).join('\n')}
          </svg>`;
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const playLink = (app, campaign) =>
  `https://play.google.com/store/apps/details?id=${apps[app].id}&amp;hl=pt-BR&amp;referrer=utm_source%3Dblog%26utm_medium%3Dpost%26utm_campaign%3D${campaign}`;

const dateBr = (iso) => {
  const [y, m, d] = iso.split('-');
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${Number(d)} de ${months[Number(m) - 1]} de ${y}`;
};

const head = ({ title, description, url, type, jsonLd, depth }) => `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#23803a" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${site}/assets/og.jpg" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Prancheta Apps" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="alternate" type="application/rss+xml" title="Blog da Prancheta" href="${site}/blog/feed.xml" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <link rel="icon" href="${depth}assets/icone-192.png" type="image/png" />
    <link rel="apple-touch-icon" href="${depth}assets/icone-192.png" />
    <link rel="preload" href="${depth}assets/oswald-600.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${depth}styles.css" />
  </head>
  <body>
    <header class="doc-header">
      <a class="doc-brand" href="${depth}"><img src="${depth}assets/logo.png" alt="" width="40" height="40" />Prancheta <span>Apps</span></a>
      <nav class="top-nav" aria-label="Principal">
        <a href="${depth}">Apps</a>
        <a href="${depth}blog/" aria-current="page">Blog</a>
      </nav>
    </header>
`;

const foot = (depth) => `    <footer class="footer">
      <a href="${depth}blog/">Blog</a>
      <a href="${depth}termos/">Termos e privacidade</a>
      <a href="mailto:contato@prancheta.cloud">Contato</a>
      <span>© 2026 Prancheta Apps. Todos os direitos reservados.</span>
    </footer>
  </body>
</html>
`;

const org = { '@type': 'Organization', '@id': `${site}/#org`, name: 'Prancheta Apps', url: `${site}/`, logo: `${site}/assets/logo.png` };

const posts = readdirSync(join(here, 'posts'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => {
    const raw = readFileSync(join(here, 'posts', f), 'utf8');
    const match = raw.match(/^<!--\s*([\s\S]*?)\s*-->\n([\s\S]*)$/);
    if (!match) throw new Error(`${f}: falta o cabeçalho JSON`);
    return { ...JSON.parse(match[1]), slug: f.replace(/\.html$/, ''), body: match[2] };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order);

const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

for (const p of posts) {
  const url = `${site}/blog/${p.slug}/`;
  const graph = [
    {
      '@type': 'BlogPosting',
      headline: p.h1,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated || p.date,
      inLanguage: 'pt-BR',
      mainEntityOfPage: url,
      image: `${site}/assets/og.jpg`,
      author: org,
      publisher: org,
      keywords: p.keywords.join(', '),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Prancheta Apps', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}/blog/` },
        { '@type': 'ListItem', position: 3, name: p.h1, item: url },
      ],
    },
  ];
  if (p.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: p.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  const app = apps[p.app];
  const cta = `<aside class="cta">
          <img src="../../assets/${app.icon}" alt="" width="72" height="72" loading="lazy" />
          <div>
            <strong>${app.name}</strong>
            <p>${app.pitch}</p>
          </div>
          <a class="button" href="${playLink(p.app, p.slug)}" target="_blank" rel="noopener">Baixar grátis</a>
        </aside>`;
  const faq = p.faq?.length
    ? `<section class="faq">
          <h2>Perguntas frequentes</h2>
${p.faq.map(({ q, a }) => `          <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
        </section>`
    : '';
  const related = (p.related || []).filter((s) => bySlug[s]);
  const relatedHtml = related.length
    ? `<section class="related">
          <h2>Leia também</h2>
          <ul>
${related.map((s) => `            <li><a href="../${s}/">${esc(bySlug[s].h1)}</a></li>`).join('\n')}
          </ul>
        </section>`
    : '';
  const body = p.body
    .replace(/\{\{cta\}\}/g, cta)
    .replace(/\{\{(quadra|campo) ([^}]+?) :: ([^}]+)\}\}/g, (_, kind, spec, title) => quadra(spec, title, kind))
    .trim();
  const html =
    head({ title: p.title, description: p.description, url, type: 'article', jsonLd: { '@context': 'https://schema.org', '@graph': graph }, depth: '../../' }) +
    `    <main>
      <article class="post">
        <nav class="crumbs" aria-label="Trilha"><a href="../../">Início</a> › <a href="../">Blog</a> › ${esc(p.tag)}</nav>
        <h1>${esc(p.h1)}</h1>
        <p class="lead">${p.lead}</p>
        <p class="meta">Por Prancheta Apps · <time datetime="${p.date}">${dateBr(p.date)}</time> · ${p.minutes} min de leitura</p>
        ${body}
        ${cta}
        ${faq}
        ${relatedHtml}
      </article>
    </main>
` +
    foot('../../');
  mkdirSync(join(root, 'blog', p.slug), { recursive: true });
  writeFileSync(join(root, 'blog', p.slug, 'index.html'), html);
}

const listUrl = `${site}/blog/`;
const listLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Blog', '@id': `${listUrl}#blog`, name: 'Blog da Prancheta', url: listUrl, inLanguage: 'pt-BR', publisher: org, blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.h1, url: `${listUrl}${p.slug}/`, datePublished: p.date })) },
  ],
};
const listHtml =
  head({
    title: 'Blog da Prancheta: campeonato, pelada e tática',
    description: 'Guias práticos para quem organiza campeonato, pelada e time amador: tabela de jogos, desempate, mensalidade e esquemas táticos.',
    url: listUrl,
    type: 'website',
    jsonLd: listLd,
    depth: '../',
  }) +
  `    <main>
      <section class="blog-hero">
        <h1>Blog da Prancheta</h1>
        <p>Guias práticos para quem organiza campeonato, cuida do caixa da pelada ou treina time amador. Com calculadoras e tabelas prontas.</p>
      </section>
      <ul class="post-list">
${posts
  .map(
    (p) => `        <li class="post-card">
          <span class="post-cover"></span>
          <a href="${p.slug}/">
            <span class="tag">${esc(p.tag)}</span>
            <h2>${esc(p.h1)}</h2>
            <p>${esc(p.description)}</p>
            <span class="read">Ler →</span>
          </a>
        </li>`,
  )
  .join('\n')}
      </ul>
    </main>
` +
  foot('../');
writeFileSync(join(root, 'blog', 'index.html'), listHtml);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog da Prancheta</title>
    <link>${listUrl}</link>
    <description>Guias para quem organiza campeonato, pelada e time amador.</description>
    <language>pt-BR</language>
${posts
  .map(
    (p) => `    <item>
      <title>${esc(p.h1)}</title>
      <link>${listUrl}${p.slug}/</link>
      <guid>${listUrl}${p.slug}/</guid>
      <pubDate>${new Date(`${p.date}T12:00:00-03:00`).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;
writeFileSync(join(root, 'blog', 'feed.xml'), rss);

const home = posts.slice(0, 6);
const homeHtml = `      <!-- blog-home -->
      <section id="blog" class="section home-blog">
        <h2>Do blog</h2>
        <p class="home-blog-sub">Calculadoras, geradores e guias para quem organiza campeonato, pelada e time.</p>
        <ul class="post-list">
${home
  .map(
    (p) => `          <li class="post-card">
            <span class="post-cover"></span>
            <a href="blog/${p.slug}/">
              <span class="tag">${esc(p.tag)}</span>
              <h3>${esc(p.h1)}</h3>
              <p>${esc(p.description)}</p>
              <span class="read">Ler →</span>
            </a>
          </li>`,
  )
  .join('\n')}
        </ul>
        <p class="more"><a href="blog/">Ver todos os ${posts.length} posts →</a></p>
      </section>
      <!-- /blog-home -->`;
const indexPath = join(root, 'index.html');
writeFileSync(indexPath, readFileSync(indexPath, 'utf8').replace(/      <!-- blog-home -->[\s\S]*?<!-- \/blog-home -->/, homeHtml));

const sitemapPath = join(root, 'sitemap.xml');
const sitemap = readFileSync(sitemapPath, 'utf8');
const block = [`  <!-- blog -->`, `  <url><loc>${listUrl}</loc></url>`, ...posts.map((p) => `  <url><loc>${listUrl}${p.slug}/</loc><lastmod>${p.updated || p.date}</lastmod></url>`), `  <!-- /blog -->`].join('\n');
const cleaned = sitemap.replace(/\n  <!-- blog -->[\s\S]*?<!-- \/blog -->/, '');
writeFileSync(sitemapPath, cleaned.replace('</urlset>', `${block}\n</urlset>`));

console.log(`${posts.length} posts`);
