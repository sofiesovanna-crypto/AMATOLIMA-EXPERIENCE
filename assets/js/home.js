"use strict";

const navigationItems = [
  { label: "Início", href: "index.html", current: true },
  { label: "Sobre", href: "sobre.html" },
  { label: "Ativos", href: "ativos.html" },
  { label: "Reformas", href: "reformas.html" },
  { label: "Projetos", href: "projetos.html" },
  { label: "Contato", href: "contato.html" },
];

const principles = [
  {
    number: "01",
    title: "Valor percebido",
    description: "Decisões arquitetônicas que qualificam o imóvel e ampliam sua permanência no mercado.",
  },
  {
    number: "02",
    title: "Luxo silencioso",
    description: "Proporção, luz, funcionalidade e acabamento comunicam alto padrão sem ostentação.",
  },
  {
    number: "03",
    title: "Matéria natural",
    description: "Pedra, madeira, vegetação e tons aquecidos aproximam arquitetura e experiência.",
  },
];

const selectedProjects = [
  {
    title: "Residência Horizonte",
    category: "Fachada e interiores",
    image: "assets/images/projeto-fachada.jpg",
    alt: "Fachada contemporânea com pedra e madeira",
  },
  {
    title: "Casa Matéria",
    category: "Organic luxury",
    image: "assets/images/projeto-pedra.jpg",
    alt: "Banheira em pedra integrada ao jardim",
  },
  {
    title: "Apartamento Luz",
    category: "Reforma integral",
    image: "assets/images/projeto-lavabo.jpg",
    alt: "Lavabo com pedra, madeira e luz incorporada",
  },
  {
    title: "Casa Jardim",
    category: "Paisagismo e convivência",
    image: "assets/images/projeto-piscina.jpg",
    alt: "Piscina com paisagismo integrado",
  },
];

function navigationTemplate() {
  return navigationItems
    .map(
      ({ label, href, current }) => `
        <li>
          <a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>
        </li>`,
    )
    .join("");
}

function headerTemplate() {
  return `
    <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <header class="site-header site-header--overlay" data-overlay-header>
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Amato Lima — página inicial">
          <img class="brand__mark" src="assets/images/monograma.png" alt="" />
          <span class="brand__text">
            <span class="brand__name">Amato Lima</span>
            <span class="brand__descriptor">Ativos Imobiliários</span>
          </span>
        </a>

        <nav class="site-nav" data-navigation aria-label="Navegação principal">
          <ul class="site-nav__list">${navigationTemplate()}</ul>
        </nav>

        <a class="button header-cta" href="contato.html">Fale conosco</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Abrir menu" aria-expanded="false">
          <span></span>
        </button>
      </div>
    </header>`;
}

function heroTemplate() {
  return `
    <section class="hero hero--art" aria-labelledby="home-title">
      <h1 id="home-title" class="hero-art__headline">
        <span class="hero-art__arte"><span class="hero-art__a" style="position: relative; top: 0.10em; display: inline-block; transform: scale(1.05); transform-origin: left center;">A</span><span class="hero-art__rte">rte</span></span>
        <span class="hero-art__de">de</span>
        <span class="hero-art__habitar">habitar</span>
      </h1>

      <picture>
        <source media="(max-width: 760px)" srcset="assets/images/hero-mask-2.png" />
        <img
          class="hero-art__wood"
          src="assets/images/hero-mask-3.png"
          alt=""
          aria-hidden="true"
        />
      </picture>
    </section>`;
}

function perspectiveTemplate() {
  return `
    <section class="section" id="perspectiva">
      <div class="container intro-grid">
        <div class="reveal">
          <p class="eyebrow">Nossa perspectiva</p>
          <h2>A matéria precede o ativo.</h2>
        </div>
        <div class="intro-grid__aside body-copy reveal">
          <p>A Amato Lima identifica propriedades com potencial, conduz reformas de alto padrão e devolve ao mercado imóveis preparados para uma nova etapa.</p>
          <p>Arquitetura, engenharia e curadoria trabalham juntas para criar espaços sofisticados sem excesso — atuais, acolhedores e construídos para permanecer.</p>
          <a class="button button--ghost" href="sobre.html">Conheça a Amato Lima</a>
        </div>
      </div>
    </section>`;
}

function principlesTemplate() {
  const cards = principles
    .map(
      ({ number, title, description }) => `
        <article class="principle">
          <span class="principle__number">${number}</span>
          <h3>${title}</h3>
          <p>${description}</p>
        </article>`,
    )
    .join("");

  return `
    <section class="section section--linen">
      <div class="container">
        <p class="eyebrow">Três fundamentos</p>
        <div class="principles reveal">${cards}</div>
      </div>
    </section>`;
}

function projectsTemplate() {
  const cards = selectedProjects
    .map(
      ({ title, category, image, alt }) => `
        <a class="project-card" href="projetos.html">
          <img src="${image}" alt="${alt}" />
          <span class="project-card__caption">
            <h3>${title}</h3>
            <span>${category}</span>
          </span>
        </a>`,
    )
    .join("");

  return `
    <section class="section">
      <div class="container">
        <div class="intro-grid">
          <div>
            <p class="eyebrow">Projetos selecionados</p>
            <h2>Arquitetura antes da decoração.</h2>
          </div>
          <div class="intro-grid__aside body-copy">
            <p>Cada projeto parte das características do imóvel e encontra uma linguagem própria. O resultado está nos encontros precisos, na iluminação incorporada e nos materiais usados com intenção.</p>
          </div>
        </div>
        <div class="project-grid reveal">${cards}</div>
      </div>
    </section>`;
}

function quoteTemplate() {
  return `
    <section class="section section--cocoa quote-band">
      <div class="container reveal">
        <p class="eyebrow">Amato Lima</p>
        <blockquote>“Sofisticada e, acima de tudo, atemporal.”</blockquote>
        <div class="button-row">
          <a class="button button--light" href="contato.html">Inicie uma conversa</a>
        </div>
      </div>
    </section>`;
}

function mainTemplate() {
  return `
    <main id="conteudo">
      ${heroTemplate()}
      ${perspectiveTemplate()}
      ${principlesTemplate()}
      ${projectsTemplate()}
      ${quoteTemplate()}
    </main>`;
}

function footerTemplate() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <span class="brand__text">
              <span class="brand__name">Amato Lima</span>
              <span class="brand__descriptor">Ativos Imobiliários</span>
            </span>
            <p>Venda e reforma de imóveis de alto padrão em bairros selecionados de São Paulo.</p>
          </div>

          <div class="footer-column">
            <h3>Navegação</h3>
            <ul>
              <li><a href="sobre.html">Sobre</a></li>
              <li><a href="ativos.html">Ativos</a></li>
              <li><a href="reformas.html">Reformas</a></li>
              <li><a href="projetos.html">Projetos</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h3>Contato</h3>
            <ul>
              <li><a href="mailto:contato@amatolima.com.br">contato@amatolima.com.br</a></li>
              <li><a href="contato.html">Agendar conversa</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© <span data-current-year></span> Amato Lima</span>
          <span>São Paulo — SP</span>
        </div>
      </div>
    </footer>`;
}

function renderHome() {
  const app = document.querySelector("[data-app]");

  if (!app) {
    throw new Error("O elemento principal da aplicação não foi encontrado.");
  }

  document.body.classList.add("home-page");
  app.innerHTML = `${mainTemplate()}${footerTemplate()}`;
}

renderHome();
