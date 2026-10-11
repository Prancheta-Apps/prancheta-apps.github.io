# Prancheta Apps — landing

Site estático da Prancheta Apps (HTML e CSS puros, sem build). Abra `index.html` no navegador para ver.

- `index.html` (PT), `en/index.html` e `es/index.html`: o mesmo conteúdo nos três idiomas. Mudou um, mude os três.
- `termos/`: termos de uso e política de privacidade de cada app (`termos/<app>/`, com PT, EN e ES na mesma página) e o índice. O texto veio dos documentos do Savio; mudou o documento, mude a página.
- `styles.css`: estilo de todas as páginas.
- `assets/`: logo, ícones dos apps e a fonte Oswald (OFL), servida daqui.
- `app-ads.txt`: exigido pelo AdMob. Precisa ficar na raiz do domínio cadastrado como site do desenvolvedor na Play Store (`https://prancheta.cloud/app-ads.txt`).

App novo ou retirado da loja: atualize o cartão nas três páginas e o ícone em `assets/`.

Publicado em https://prancheta.cloud pelo GitHub Pages. O deploy é manual: workflow "Deploy" na aba Actions. O domínio está cadastrado em Settings → Pages; o DNS fica na Hostinger (quatro registros A do GitHub Pages e `www` como CNAME de `prancheta-apps.github.io`).
