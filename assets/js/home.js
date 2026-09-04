"use strict";

const navigationItems = [
  { label: "Início", href: "index.html", current: true },
  { label: "Sobre", href: "sobre.html" },
  { label: "Ativos", href: "ativos.html" },
  { label: "Reformas", href: "reformas.html" },
  { label: "Projetos", href: "projetos.html" },
  { label: "Contato", href: "contato.html" },
];

const flowingMenuItems = [
  { label: "Sobre", href: "sobre.html", image: "assets/images/hero-mask-3.png" },
  { label: "Ativos", href: "ativos.html", image: "assets/images/hero-mask-2.png" },
  { label: "Reformas", href: "reformas.html", image: "assets/images/hero-mask-mobile.png" },
  { label: "Projetos", href: "projetos.html", image: "assets/images/hero-mask.png" },
  { label: "Contato", href: "contato.html", image: "assets/images/hero-mask.png" },
];

const principles = [
  { number: "01", title: "Valor percebido", description: "Decisões arquitetônicas que qualificam o imóvel e ampliam sua permanência no mercado." },
  { number: "02", title: "Luxo silencioso", description: "Proporção, luz, funcionalidade e acabamento comunicam alto padrão sem ostentação." },
  { number: "03", title: "Matéria natural", description: "Pedra, madeira, vegetação e tons aquecidos aproximam arquitetura e experiência." },
];

const selectedProjects = [
  { title: "Residência Horizonte", category: "Fachada e interiores", image: "assets/images/hero-mask-3.png", alt: "Fachada contemporânea com pedra e madeira" },
  { title: "Casa Matéria", category: "Organic luxury", image: "assets/images/hero-mask-2.png", alt: "Banheira em pedra integrada ao jardim" },
  { title: "Apartamento Luz", category: "Reforma integral", image: "assets/images/hero-mask-mobile.png", alt: "Lavabo com pedra, madeira e luz incorporada" },
  { title: "Casa Jardim", category: "Paisagismo e convivência", image: "assets/images/hero-mask.png", alt: "Piscina com paisagismo integrado" },
];

const materialSpiralImages = [
  { image: "assets/images/hero-mask-3.png", alt: "Madeira natural em composição escultórica" },
  { image: "assets/images/hero-mask-2.png", alt: "Textura orgânica de madeira" },
  { image: "assets/images/hero-mask-mobile.png", alt: "Detalhe vertical de matéria natural" },
  { image: "assets/images/hero-mask.png", alt: "Curvas e veios da madeira" },
  { image: "assets/images/hero-mask-2.png", alt: "Encontro entre luz e madeira" },
  { image: "assets/images/hero-mask-3.png", alt: "Forma natural esculpida" },
  { image: "assets/images/hero-mask.png", alt: "Matéria em movimento" },
  { image: "assets/images/hero-mask-mobile.png", alt: "Textura de madeira aquecida" },
  { image: "assets/images/hero-mask-3.png", alt: "Superfície orgânica" },
  { image: "assets/images/hero-mask-2.png", alt: "Veios naturais em detalhe" },
  { image: "assets/images/hero-mask-mobile.png", alt: "Matéria e profundidade" },
  { image: "assets/images/hero-mask.png", alt: "Madeira em composição editorial" },
];

function navigationTemplate() {
  return navigationItems.map(({ label, href, current }) => `
    <li><a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
}

function flowingMenuTemplate() {
  const items = flowingMenuItems.map(({ label, href, image }, index) => `
    <div class="flowing-menu__item" data-flowing-menu-item data-speed="15">
      <a class="flowing-menu__link" href="${href}">
        <span class="flowing-menu__label">${label}</span>
      </a>
      <div class="flowing-menu__marquee" aria-hidden="true">
        <div class="flowing-menu__marquee-wrap">
          <div class="flowing-menu__marquee-inner" data-flowing-menu-inner>
            <div class="flowing-menu__part" data-flowing-menu-part>
              <span>${label}</span>
              <img class="flowing-menu__img" src="${image}" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>`).join("");

  return `
    <div class="staggered-flow-menu" data-staggered-flow-menu>
      <div class="flowing-menu-backdrop" data-flowing-menu-backdrop aria-hidden="true"></div>
      <div class="flowing-menu-prelayers" aria-hidden="true">
        <span class="flowing-menu-prelayer" data-flowing-menu-prelayer></span>
        <span class="flowing-menu-prelayer" data-flowing-menu-prelayer></span>
      </div>

      <aside class="flowing-menu-panel" id="flowing-menu-panel" data-flowing-menu-panel aria-hidden="true">
        <div class="flowing-menu-wrap">
          <nav class="flowing-menu" aria-label="Navegação principal">${items}</nav>
        </div>

      </aside>

      <button class="flowing-menu-toggle" type="button" data-flowing-menu-toggle aria-label="Abrir menu" aria-controls="flowing-menu-panel" aria-expanded="false">
        <span class="flowing-menu-toggle__text-wrap" aria-hidden="true">
          <span class="flowing-menu-toggle__text-inner">
            <span class="flowing-menu-toggle__line">Menu</span>
            <span class="flowing-menu-toggle__line">Fechar</span>
          </span>
        </span>
        <span class="flowing-menu-toggle__icon" aria-hidden="true">
          <span class="flowing-menu-toggle__icon-line"></span>
          <span class="flowing-menu-toggle__icon-line flowing-menu-toggle__icon-line--vertical"></span>
        </span>
      </button>
    </div>`;
}

function headerTemplate() {
  return `
    <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <header class="site-header site-header--overlay" data-overlay-header>
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Amato Lima — página inicial">
          <img class="brand__mark" src="assets/images/monograma.png" alt="" />
          <span class="brand__text"><span class="brand__name">Amato Lima</span><span class="brand__descriptor">Ativos Imobiliários</span></span>
        </a>
        <nav class="site-nav" data-navigation aria-label="Navegação principal"><ul class="site-nav__list">${navigationTemplate()}</ul></nav>
        <a class="button header-cta" href="contato.html">Fale conosco</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Abrir menu" aria-expanded="false"><span></span></button>
      </div>
    </header>`;
}

function heroTemplate() {
  return `
    <section class="hero hero--art" aria-labelledby="home-title">
      <div class="hero-art__brand" aria-label="Amato Lima — Ativos Imobiliários">
        <span class="hero-art__brand-name">Amato Lima</span>
        <span class="hero-art__brand-descriptor">Ativos Imobiliários</span>
      </div>

      <h1 id="home-title" class="hero-art__headline">
        <span class="hero-art__arte">Arte</span>
        <span class="hero-art__de">de</span>
        <span class="hero-art__habitar">habitar</span>
      </h1>
      <picture>
        <source media="(max-width: 760px)" srcset="assets/images/hero-mask-2.png" />
        <img class="hero-art__wood" src="assets/images/hero-mask.png" alt="" aria-hidden="true" />
      </picture>
    </section>`;
}

function perspectiveTemplate() {
  const cards = materialSpiralImages.map(({ image, alt }) => `
    <figure class="material-spiral__card" data-spiral-card>
      <img src="${image}" alt="${alt}" loading="lazy" draggable="false" />
    </figure>`).join("");

  return `
    <section class="material-spiral" id="perspectiva" aria-labelledby="material-title">
      <div class="material-spiral__gallery" data-material-spiral aria-label="Galeria de matéria natural em movimento">
        <div class="material-spiral__stage">
          ${cards}
          <div class="material-spiral__center">
            <h2 class="material-spiral__title" id="material-title">A MATÉRIA PRECEDE O ATIVO</h2>
          </div>
        </div>
      </div>
      <span class="material-spiral__hint" aria-hidden="true">Role ou arraste para explorar</span>
    </section>`;
}

function principlesTemplate() {
  const cards = principles.map(({ number, title, description }) => `
    <article class="principle"><span class="principle__number">${number}</span><h3>${title}</h3><p>${description}</p></article>`).join("");
  return `<section class="section section--linen"><div class="container"><p class="eyebrow">Três fundamentos</p><div class="principles reveal">${cards}</div></div></section>`;
}

function projectsTemplate() {
  const cards = selectedProjects.map(({ title, category, image, alt }) => `
    <a class="project-card" href="projetos.html"><img src="${image}" alt="${alt}" /><span class="project-card__caption"><h3>${title}</h3><span>${category}</span></span></a>`).join("");
  return `<section class="section"><div class="container"><div class="intro-grid"><div><p class="eyebrow">Projetos selecionados</p><h2>Arquitetura antes da decoração.</h2></div><div class="intro-grid__aside body-copy"><p>Cada projeto parte das características do imóvel e encontra uma linguagem própria. O resultado está nos encontros precisos, na iluminação incorporada e nos materiais usados com intenção.</p></div></div><div class="project-grid reveal">${cards}</div></div></section>`;
}

function quoteTemplate() {
  return `<section class="section section--cocoa quote-band"><div class="container reveal"><p class="eyebrow">Amato Lima</p><blockquote>“Sofisticada e, acima de tudo, atemporal.”</blockquote><div class="button-row"><a class="button button--light" href="contato.html">Inicie uma conversa</a></div></div></section>`;
}

function mainTemplate() {
  return `<main id="conteudo">${heroTemplate()}${perspectiveTemplate()}${principlesTemplate()}${projectsTemplate()}${quoteTemplate()}</main>`;
}

function footerTemplate() {
  return `
    <footer class="site-footer"><div class="container"><div class="footer-grid">
      <div class="footer-brand"><span class="brand__text"><span class="brand__name">Amato Lima</span><span class="brand__descriptor">Ativos Imobiliários</span></span><p>Venda e reforma de imóveis de alto padrão em bairros selecionados de São Paulo.</p></div>
      <div class="footer-column"><h3>Navegação</h3><ul><li><a href="sobre.html">Sobre</a></li><li><a href="ativos.html">Ativos</a></li><li><a href="reformas.html">Reformas</a></li><li><a href="projetos.html">Projetos</a></li></ul></div>
      <div class="footer-column"><h3>Contato</h3><ul><li><a href="mailto:contato@amatolima.com.br">contato@amatolima.com.br</a></li><li><a href="contato.html">Agendar conversa</a></li><li><a href="#">Instagram</a></li></ul></div>
    </div><div class="footer-bottom"><span>© <span data-current-year></span> Amato Lima</span><span>São Paulo — SP</span></div></div></footer>`;
}

function renderHome() {
  const app = document.querySelector("[data-app]");
  if (!app) throw new Error("O elemento principal da aplicação não foi encontrado.");
  document.body.classList.add("home-page");
  app.innerHTML = `${flowingMenuTemplate()}${mainTemplate()}${footerTemplate()}`;
}

renderHome();
