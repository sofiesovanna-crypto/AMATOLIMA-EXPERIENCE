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
      <span class="hero-art__base-reflection" aria-hidden="true"></span>
    </section>`;
}

function perspectiveTemplate() {
  const scrollPhrases = [
    "A MATÉRIA PRECEDE O ATIVO",
    "MADEIRA CLARA",
    "PISO TRAVERTINO",
    "VIDROS REFLECTA BRONZE",
    "PEDRAS EM QUARTZO BRANCO",
  ];

  const cards = scrollPhrases.map((phrase, index) => {
    const item = materialSpiralImages[index % materialSpiralImages.length];
    return `
      <figure class="material-spiral__card" data-spiral-card data-spiral-label="${phrase}">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" draggable="false" />
      </figure>`;
  }).join("");

  return `
    <section class="material-spiral" id="perspectiva" aria-labelledby="material-title" data-material-scroll>
      <div class="material-spiral__viewport">
        <div class="material-spiral__copy">
          <h2 class="material-spiral__title" id="material-title" data-spiral-text aria-live="polite"></h2>
        </div>

        <div class="material-spiral__gallery" data-material-spiral aria-label="Carrossel de materiais controlado pelo scroll">
          <div class="material-spiral__stage">${cards}</div>
        </div>

        <div class="material-card-experience" data-material-card aria-label="Cartão Amato Lima com projetos selecionados">
          <div class="material-card-experience__fluid" data-ferrofluid aria-hidden="true"></div>
          <div class="material-card-experience__stage">
            <div class="material-card-experience__card" data-project-card>
              <div class="material-card-experience__face material-card-experience__face--project">
                <div class="material-card-experience__projects">
                  <img class="is-active" data-card-project src="assets/images/hero-mask-2.png" alt="Projeto Amato Lima — composição de madeira" />
                  <img data-card-project src="assets/images/hero-mask-3.png" alt="Projeto Amato Lima — matéria natural" />
                  <img data-card-project src="assets/images/hero-mask-mobile.png" alt="Projeto Amato Lima — detalhe arquitetônico" />
                </div>
                <span class="material-card-experience__reflection" data-card-reflection aria-hidden="true"></span>
              </div>
              <div class="material-card-experience__face material-card-experience__face--identity">
                <img class="material-card-experience__mark" src="assets/images/monograma.png" alt="" />
                <div class="material-card-experience__wordmark"><strong>Amato Lima</strong><span>Ativos Imobiliários</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

function principlesTemplate() {
  const text = "A matéria orienta cada decisão. Luz, textura e proporção trabalham juntas para criar espaços precisos, acolhedores e construídos para permanecer.";
  let characterIndex = 0;

  const words = text.split(" ").map((word) => {
    const characters = Array.from(word).map((character) => {
      const index = characterIndex++;
      return `<span class="editorial-foundations__character" style="--shine-index:${index}">${character}</span>`;
    }).join("");

    characterIndex++;
    return `<span class="editorial-foundations__word">${characters}</span>`;
  }).join(" ");

  return `
    <section class="editorial-foundations" id="fundamentos">
      <div class="editorial-foundations__layout">
        <figure class="editorial-foundations__image-wrap">
          <img src="assets/images/hero-mask-mobile.png" alt="Detalhe de matéria natural em composição vertical" loading="lazy" />
        </figure>

        <div class="editorial-foundations__copy">
          <p class="editorial-foundations__text" data-editorial-scroll-reveal>${words}</p>
        </div>
      </div>
    </section>`;
}

function projectsTemplate() {
  const projects = [
    { name: "Residência Horizonte", location: "Jardim Europa — São Paulo, SP" },
    { name: "Casa Matéria", location: "Alto de Pinheiros — São Paulo, SP" },
    { name: "Apartamento Luz", location: "Itaim Bibi — São Paulo, SP" },
    { name: "Casa Jardim", location: "Cidade Jardim — São Paulo, SP" },
  ];

  const projectRows = projects.map(({ name, location }) => `
    <li class="project-index__item">
      <span class="project-index__name">${name}</span>
      <span class="project-index__location">${location}</span>
    </li>`).join("");

  return `
    <section class="project-index" id="projetos-selecionados" aria-labelledby="project-index-title">
      <div class="project-index__heading-wrap">
        <h2 class="project-index__heading" id="project-index-title">
          <span class="project-index__line project-index__line--one">Arquitetura</span>
          <span class="project-index__line project-index__line--two">antes da</span>
          <span class="project-index__line project-index__line--three">decoração.</span>
        </h2>
      </div>

      <div class="project-index__list-wrap">
        <ul class="project-index__list" aria-label="Projetos selecionados">
          ${projectRows}
        </ul>
      </div>
    </section>`;
}

function transformationTemplate() {
  return `
    <section class="project-evolution" id="transformacao" aria-labelledby="project-evolution-title" data-project-evolution>
      <div class="project-evolution__pin">
        <div class="project-evolution__background" aria-hidden="true"></div>

        <header class="project-evolution__copy">
          <p class="project-evolution__eyebrow">Do existente ao essencial</p>
          <h2 id="project-evolution-title">A arquitetura revela<br />o que o imóvel pode ser.</h2>
          <p class="project-evolution__stage-label" data-evolution-label aria-live="polite">Antes</p>
        </header>

        <div class="project-evolution__frame" data-evolution-frame>
          <figure class="project-evolution__layer project-evolution__layer--before" data-evolution-layer="before">
            <img src="assets/images/transformation/antes-sala.jpg" alt="Apartamento antes da transformação" />
          </figure>

          <figure class="project-evolution__layer project-evolution__layer--render" data-evolution-layer="render">
            <img src="assets/images/transformation/render-sala.jpg" alt="Render tridimensional do projeto da área social" />
          </figure>

          <figure class="project-evolution__layer project-evolution__layer--final" data-evolution-layer="final">
            <img src="assets/images/transformation/final-sala.jpg" alt="Área social depois da transformação" />
          </figure>

          <svg class="project-evolution__plan" viewBox="0 0 1200 760" role="img" aria-label="Planta arquitetônica detalhada sendo desenhada" data-evolution-plan>
            <g class="project-evolution__plan-sheet">
              <g class="project-evolution__plan-dimensions">
                <path class="project-evolution__vector-line" d="M82 58H1118M82 46V70M1118 46V70M310 50V66M724 50V66" />
                <path class="project-evolution__vector-line" d="M48 90V674M36 90H60M36 674H60M40 338H56" />
                <path class="project-evolution__vector-line" d="M82 704H1118M82 692V716M1118 692V716" />
                <path class="project-evolution__vector-line" d="M1148 90V674M1136 90H1160M1136 674H1160" />
              </g>

              <g class="project-evolution__plan-walls">
                <path class="project-evolution__vector-line project-evolution__vector-line--heavy" d="M82 90H1118V674H82Z" />
                <path class="project-evolution__vector-line project-evolution__vector-line--heavy" d="M94 102H1106V662H94Z" />
                <path class="project-evolution__vector-line project-evolution__vector-line--heavy" d="M310 102V282M310 390V662M724 102V338M724 446V662" />
                <path class="project-evolution__vector-line project-evolution__vector-line--heavy" d="M94 338H310M310 338H724M724 338H1106" />
                <path class="project-evolution__vector-line" d="M94 325H298M322 325H712M736 325H1106" />
              </g>

              <g class="project-evolution__plan-openings">
                <path class="project-evolution__vector-line" d="M122 90V102M150 90V102M178 90V102M206 90V102M234 90V102M262 90V102" />
                <path class="project-evolution__vector-line" d="M758 90V102M794 90V102M830 90V102M866 90V102M902 90V102M938 90V102M974 90V102M1010 90V102M1046 90V102" />
                <path class="project-evolution__vector-line" d="M310 282H418M310 282A108 108 0 0 1 418 390" />
                <path class="project-evolution__vector-line" d="M724 446H832M724 446A108 108 0 0 0 832 338" />
                <path class="project-evolution__vector-line" d="M522 338V432M522 338A94 94 0 0 0 428 432" />
              </g>

              <g class="project-evolution__plan-kitchen">
                <path class="project-evolution__vector-line" d="M108 122H286V306H108ZM120 134V294M166 134V294M212 134V294M258 134V294" />
                <path class="project-evolution__vector-line" d="M126 162H278M126 234H278" />
                <path class="project-evolution__vector-line" d="M359 158H650V252H359Z" />
                <path class="project-evolution__vector-line" d="M380 178H629V232H380ZM401 205H608" />
                <circle class="project-evolution__vector-line" cx="405" cy="285" r="18" />
                <circle class="project-evolution__vector-line" cx="478" cy="285" r="18" />
                <circle class="project-evolution__vector-line" cx="551" cy="285" r="18" />
                <circle class="project-evolution__vector-line" cx="624" cy="285" r="18" />
              </g>

              <g class="project-evolution__plan-living">
                <path class="project-evolution__vector-line" d="M356 466H650V604H356Q334 604 334 582V488Q334 466 356 466Z" />
                <path class="project-evolution__vector-line" d="M376 486H630V526H376ZM376 542H630V584H376Z" />
                <path class="project-evolution__vector-line" d="M786 486C786 455 811 430 842 430H1016C1047 430 1072 455 1072 486V590H786Z" />
                <path class="project-evolution__vector-line" d="M808 490H1050M868 442V590M990 442V590" />
                <ellipse class="project-evolution__vector-line" cx="716" cy="552" rx="78" ry="52" />
                <ellipse class="project-evolution__vector-line" cx="716" cy="552" rx="58" ry="36" />
                <path class="project-evolution__vector-line" d="M680 616H754M692 628H742" />
              </g>

              <g class="project-evolution__plan-dining">
                <rect class="project-evolution__vector-line" x="792" y="164" width="214" height="108" rx="54" />
                <ellipse class="project-evolution__vector-line" cx="830" cy="140" rx="25" ry="18" />
                <ellipse class="project-evolution__vector-line" cx="900" cy="140" rx="25" ry="18" />
                <ellipse class="project-evolution__vector-line" cx="970" cy="140" rx="25" ry="18" />
                <ellipse class="project-evolution__vector-line" cx="830" cy="296" rx="25" ry="18" />
                <ellipse class="project-evolution__vector-line" cx="900" cy="296" rx="25" ry="18" />
                <ellipse class="project-evolution__vector-line" cx="970" cy="296" rx="25" ry="18" />
              </g>

              <g class="project-evolution__plan-lighting">
                <circle class="project-evolution__vector-line" cx="510" cy="397" r="22" />
                <path class="project-evolution__vector-line" d="M494 381L526 413M526 381L494 413" />
                <circle class="project-evolution__vector-line" cx="900" cy="218" r="34" />
                <path class="project-evolution__vector-line" d="M876 194L924 242M924 194L876 242" />
                <circle class="project-evolution__vector-line" cx="714" cy="552" r="18" />
              </g>

              <g class="project-evolution__plan-notes">
                <path class="project-evolution__vector-line" d="M183 430L148 394H106M640 132L678 106H740M995 600L1060 628" />
                <text x="102" y="382">MARCENARIA EXISTENTE</text>
                <text x="746" y="108">EIXO DE ILUMINAÇÃO</text>
                <text x="935" y="646">ESTAR</text>
                <text x="458" y="650">SALA DE JANTAR</text>
                <text x="124" y="642">COZINHA</text>
                <text x="78" y="742">PLANTA DE INTERVENÇÃO · ESCALA 1:50</text>
                <text x="510" y="54">10,36 m</text>
                <text x="18" y="410" transform="rotate(-90 18 410)">5,84 m</text>
              </g>
            </g>
          </svg>

          <span class="project-evolution__wash" aria-hidden="true"></span>
          <span class="project-evolution__reflection" aria-hidden="true" data-evolution-reflection></span>
        </div>

        <div class="project-evolution__progress" aria-hidden="true"><span data-evolution-progress></span></div>
        <p class="project-evolution__hint">Role para acompanhar a transformação</p>
      </div>
    </section>`;
}

function quoteTemplate() {
  return `<section class="section section--cocoa quote-band"><div class="container reveal"><p class="eyebrow">Amato Lima</p><blockquote>“Sofisticada e, acima de tudo, atemporal.”</blockquote><div class="button-row"><a class="button button--light" href="contato.html">Inicie uma conversa</a></div></div></section>`;
}

function mainTemplate() {
  return `<main id="conteudo">${heroTemplate()}${perspectiveTemplate()}${principlesTemplate()}${projectsTemplate()}${transformationTemplate()}${quoteTemplate()}</main>`;
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
