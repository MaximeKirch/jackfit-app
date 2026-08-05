import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = dirname(__dirname)
const SRC_MD    = join(ROOT, 'docs', 'privacy.md')
const DIST      = join(__dirname, 'dist')
const OUT_DIR   = join(DIST, 'privacy')

const md = await readFile(SRC_MD, 'utf8')
const bodyHtml = marked.parse(md, { gfm: true, breaks: false })

const shell = ({ title, body }) => `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="Politique de confidentialité de JackFit — quelles données sont collectées, à quoi elles servent, comment les supprimer." />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#F5F0E8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --linen:    #F5F0E8;
    --sand:     #E8DDD0;
    --charcoal: #2C2824;
    --stone:    #B8A898;
    --moss:     #6B8F71;
    --moss-dk:  #5B8A5F;
    --white:    #FFFFFF;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: var(--linen);
    color: var(--charcoal);
    font-family: 'Fraunces', Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-size: 17px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  .wrap {
    max-width: 720px;
    margin: 0 auto;
    padding: 64px 24px 96px;
  }
  header.mark {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 56px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--sand);
  }
  header.mark .name {
    font-family: 'Fraunces', Georgia, serif;
    font-variation-settings: 'opsz' 144;
    font-weight: 600;
    font-size: 22px;
    letter-spacing: -0.02em;
    color: var(--charcoal);
    text-decoration: none;
  }
  header.mark .tag {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--stone);
    text-transform: uppercase;
  }
  main h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-variation-settings: 'opsz' 144;
    font-weight: 500;
    font-size: 44px;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 12px;
    color: var(--charcoal);
  }
  main h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-variation-settings: 'opsz' 72;
    font-weight: 600;
    font-size: 26px;
    letter-spacing: -0.01em;
    margin: 56px 0 16px;
    padding-top: 32px;
    border-top: 1px solid var(--sand);
    color: var(--charcoal);
  }
  main h2:first-of-type { border-top: none; padding-top: 0; }
  main h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 600;
    font-size: 19px;
    letter-spacing: -0.005em;
    margin: 36px 0 12px;
    color: var(--charcoal);
  }
  main p {
    margin: 0 0 18px;
  }
  main strong { font-weight: 600; }
  main a {
    color: var(--moss-dk);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
    text-decoration-color: rgba(107, 143, 113, 0.4);
    transition: text-decoration-color 0.15s ease;
  }
  main a:hover { text-decoration-color: var(--moss); }
  main ul, main ol {
    padding-left: 24px;
    margin: 0 0 18px;
  }
  main li { margin-bottom: 6px; }
  main hr {
    border: none;
    border-top: 1px solid var(--sand);
    margin: 40px 0;
  }
  main blockquote {
    border-left: 3px solid var(--moss);
    padding: 4px 20px;
    margin: 24px 0;
    color: var(--stone);
    font-style: italic;
  }
  main code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.88em;
    background: var(--sand);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--charcoal);
  }
  main table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 15px;
    background: var(--white);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 0 var(--sand);
  }
  main th, main td {
    padding: 12px 14px;
    text-align: left;
    border-bottom: 1px solid var(--sand);
    vertical-align: top;
  }
  main th {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--stone);
    background: var(--linen);
  }
  main tr:last-child td { border-bottom: none; }
  main em {
    color: var(--stone);
    font-style: italic;
  }
  footer {
    margin-top: 80px;
    padding-top: 24px;
    border-top: 1px solid var(--sand);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    color: var(--stone);
    letter-spacing: 0.02em;
  }
  footer a { color: var(--stone); text-decoration: none; }
  footer a:hover { color: var(--charcoal); }
  @media (max-width: 640px) {
    .wrap { padding: 40px 20px 64px; }
    main h1 { font-size: 34px; }
    main h2 { font-size: 22px; }
    main table { font-size: 13px; }
    main th, main td { padding: 10px 8px; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <header class="mark">
      <a class="name" href="/">JackFit</a>
      <span class="tag">Politique de confidentialité</span>
    </header>
    <main>
${body}
    </main>
    <footer>
      &copy; 2026 JackFit · <a href="mailto:maxime.kirch@gmail.com">maxime.kirch@gmail.com</a>
    </footer>
  </div>
</body>
</html>
`

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })

await writeFile(
  join(OUT_DIR, 'index.html'),
  shell({ title: 'Politique de confidentialité — JackFit', body: bodyHtml }),
)

for (const f of ['_headers', '_redirects']) {
  const src = join(__dirname, f)
  if (existsSync(src)) await copyFile(src, join(DIST, f))
}

console.log(`Built ${OUT_DIR}/index.html`)
