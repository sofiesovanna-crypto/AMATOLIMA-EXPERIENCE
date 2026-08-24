# Amato Lima Experience

Site estático com seis páginas independentes, pronto para Visual Studio Code, GitHub Pages ou Vercel. Não há etapa de build nem dependências para instalar.

## Páginas

- `index.html` — estrutura mínima que inicializa a Home em JavaScript
- `sobre.html` — Sobre a Amato Lima
- `ativos.html` — Ativos imobiliários
- `reformas.html` — Reformas
- `projetos.html` — Projetos
- `contato.html` — Contato

## Como visualizar

1. Abra esta pasta no VS Code.
2. Use a extensão **Live Server** e clique em `Open with Live Server` no arquivo `index.html`.
3. Também é possível abrir o `index.html` diretamente no navegador.

## Publicar no GitHub Pages

1. Envie o conteúdo desta pasta para a raiz do repositório `amato-lima-experience`.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main`, a pasta `/ (root)` e salve.

O arquivo `.nojekyll` já está incluído para que os arquivos estáticos sejam publicados sem processamento adicional.

## Estrutura

- `assets/css/styles.css` — identidade visual, layout e responsividade.
- `assets/js/home.js` — conteúdo e estrutura visual da Home, incluindo a hero.
- `assets/js/main.js` — menu mobile, animações e demonstração do formulário.
- `assets/images/hero-mask.png` — máscara transparente da hero (mantida no repositório).
- `assets/images/` — monograma e imagens dos projetos.

## Antes de publicar

- Substitua o e-mail e o telefone de exemplo pelos contatos oficiais.
- Adicione o link real do Instagram.
- Revise nomes, bairros e descrições dos projetos.
- Conecte o formulário a um serviço de envio, CRM ou backend.
- Se desejar funcionamento totalmente offline, baixe as fontes do Google Fonts e hospede-as na pasta `assets/fonts`.

O projeto não utiliza framework nem depende de instalação. A Home é renderizada por JavaScript puro; as demais páginas continuam em HTML e podem ser migradas gradualmente.
