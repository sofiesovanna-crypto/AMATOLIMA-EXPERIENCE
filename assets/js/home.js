"use strict";

const navigationItems = [
  { label: "Home", href: "index.html", current: true },
  { label: "Institucional", href: "sobre.html" },
  { label: "Viver Amato Lima", href: "reformas.html" },
  { label: "Ativos", href: "ativos.html" },
  { label: "Contato", href: "contato.html" },
];

const flowingMenuItems = [
  { label: "Home", href: "index.html", image: "assets/images/hero-mask.png" },
  { label: "Institucional", href: "sobre.html", image: "assets/images/hero-mask-3.png" },
  { label: "Viver Amato Lima", href: "reformas.html", image: "assets/images/hero-mask-mobile.png" },
  { label: "Ativos", href: "ativos.html", image: "assets/images/hero-mask-2.png" },
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
  const items = flowingMenuItems.map(({ label, href, image }) => `
    <div class="flowing-menu__item" data-flowing-menu-item data-speed="15">
      <a class="flowing-menu__link" href="${href}"><span class="flowing-menu__label">${label}</span></a>
      <div class="flowing-menu__marquee" aria-hidden="true"><div class="flowing-menu__marquee-wrap"><div class="flowing-menu__marquee-inner" data-flowing-menu-inner><div class="flowing-menu__part" data-flowing-menu-part><span>${label}</span><img class="flowing-menu__img" src="${image}" alt="" /></div></div></div></div>
    </div>`).join("");
  return `<div class="staggered-flow-menu" data-staggered-flow-menu><div class="flowing-menu-backdrop" data-flowing-menu-backdrop aria-hidden="true"></div><div class="flowing-menu-prelayers" aria-hidden="true"><span class="flowing-menu-prelayer" data-flowing-menu-prelayer></span><span class="flowing-menu-prelayer" data-flowing-menu-prelayer></span></div><aside class="flowing-menu-panel" id="flowing-menu-panel" data-flowing-menu-panel aria-hidden="true"><div class="flowing-menu-wrap"><nav class="flowing-menu" aria-label="Navegação principal">${items}</nav></div></aside><button class="flowing-menu-toggle" type="button" data-flowing-menu-toggle aria-label="Abrir menu" aria-controls="flowing-menu-panel" aria-expanded="false"><span class="flowing-menu-toggle__text-wrap" aria-hidden="true"><span class="flowing-menu-toggle__text-inner"><span class="flowing-menu-toggle__line">Menu</span><span class="flowing-menu-toggle__line">Fechar</span></span></span><span class="flowing-menu-toggle__icon" aria-hidden="true"><span class="flowing-menu-toggle__icon-line"></span><span class="flowing-menu-toggle__icon-line flowing-menu-toggle__icon-line--vertical"></span></span></button></div>`;
}

function heroTemplate() {
  return `<section class="hero hero--art" aria-labelledby="home-title"><div class="hero-art__brand" aria-label="Amato Lima — Ativos Imobiliários"><div class="hero-art__brand-line"><span class="hero-art__brand-name">Amato Lima</span><img class="hero-art__brand-mark" src="assets/images/logo/9175.png" alt="" aria-hidden="true" /></div><span class="hero-art__brand-descriptor">Ativos Imobiliários</span></div><h1 id="home-title" class="hero-art__headline"><span class="hero-art__arte">Arte</span><span class="hero-art__de">de</span><span class="hero-art__habitar">habitar</span></h1><picture><source media="(max-width: 760px)" srcset="assets/images/hero-mask-2.png" /><img class="hero-art__wood" src="assets/images/hero-mask.png" alt="" aria-hidden="true" /></picture><span class="hero-art__base-reflection" aria-hidden="true"></span></section>`;
}

function perspectiveTemplate() {
  const scrollPhrases = ["A MATÉRIA PRECEDE O ATIVO","MADEIRA CLARA","PISO TRAVERTINO","VIDROS REFLECTA BRONZE","PEDRAS EM QUARTZO BRANCO"];
  const cards = scrollPhrases.map((phrase,index)=>{const item=materialSpiralImages[index%materialSpiralImages.length];return `<figure class="material-spiral__card" data-spiral-card data-spiral-label="${phrase}"><img src="${item.image}" alt="${item.alt}" loading="lazy" draggable="false" /></figure>`;}).join("");
  return `<section class="material-spiral" id="perspectiva" aria-labelledby="material-title" data-material-scroll><div class="material-spiral__viewport"><div class="material-spiral__copy"><h2 class="material-spiral__title" id="material-title" data-spiral-text aria-live="polite"></h2></div><div class="material-spiral__gallery" data-material-spiral aria-label="Carrossel de materiais controlado pelo scroll"><div class="material-spiral__stage">${cards}</div></div><div class="material-card-experience" data-material-card aria-label="Cartão Amato Lima com projetos selecionados"><div class="material-card-experience__fluid" data-ferrofluid aria-hidden="true"></div><div class="material-card-experience__stage"><div class="material-card-experience__card" data-project-card><div class="material-card-experience__face material-card-experience__face--project"><div class="material-card-experience__projects"><img class="is-active" data-card-project src="assets/images/card/11805.png" alt="Projeto Amato Lima — matéria natural" /><img data-card-project src="assets/images/card/6124.jpg" alt="Projeto Amato Lima — composição arquitetônica" /><img data-card-project src="assets/images/hero-mask-mobile.png" alt="Projeto Amato Lima — detalhe arquitetônico" /></div><span class="material-card-experience__reflection" data-card-reflection aria-hidden="true"></span></div><div class="material-card-experience__face material-card-experience__face--identity" style="background-image:url('assets/images/card/10494.png');background-size:cover;background-position:center;background-repeat:no-repeat;"><img class="material-card-experience__mark" src="assets/images/monograma.png" alt="" /><div class="material-card-experience__wordmark"><strong>Amato Lima</strong><span>Ativos Imobiliários</span></div></div></div></div></div></div></section>`;
}

function principlesTemplate() {
  const text="A matéria orienta cada decisão. Luz, textura e proporção trabalham juntas para criar espaços precisos, acolhedores e construídos para permanecer."; let characterIndex=0;
  const words=text.split(" ").map(word=>{const characters=Array.from(word).map(character=>`<span class="editorial-foundations__character" style="--shine-index:${characterIndex++}">${character}</span>`).join("");characterIndex++;return `<span class="editorial-foundations__word">${characters}</span>`;}).join(" ");
  return `<section class="editorial-foundations" id="fundamentos"><div class="editorial-foundations__layout"><figure class="editorial-foundations__image-wrap"><img src="assets/images/hero-mask-mobile.png" alt="Detalhe de matéria natural em composição vertical" loading="lazy" /></figure><div class="editorial-foundations__copy"><p class="editorial-foundations__text" data-editorial-scroll-reveal>${words}</p></div></div></section>`;
}

function projectsTemplate() {
  const projects=[{name:"Residência Horizonte",location:"Jardim Europa — São Paulo, SP"},{name:"Casa Matéria",location:"Alto de Pinheiros — São Paulo, SP"},{name:"Apartamento Luz",location:"Itaim Bibi — São Paulo, SP"},{name:"Casa Jardim",location:"Cidade Jardim — São Paulo, SP"}];
  const projectRows=projects.map(({name,location})=>`<li class="project-index__item"><span class="project-index__name">${name}</span><span class="project-index__location">${location}</span></li>`).join("");
  return `<section class="project-index" id="projetos-selecionados" aria-labelledby="project-index-title"><div class="project-index__heading-wrap"><h2 class="project-index__heading" id="project-index-title"><span class="project-index__line project-index__line--one">Arquitetura</span><span class="project-index__line project-index__line--two">antes da</span><span class="project-index__line project-index__line--three">decoração.</span></h2></div><div class="project-index__list-wrap"><ul class="project-index__list" aria-label="Projetos selecionados">${projectRows}</ul></div></section>`;
}

function interactiveApartmentTemplate() {
  return `<section class="apartment-build" id="transformacao-3d" aria-labelledby="apartment-build-title" data-apartment-build><div class="apartment-build__pin"><div class="apartment-build__backdrop" data-apartment-backdrop aria-hidden="true"></div><header class="apartment-build__copy"><p class="apartment-build__eyebrow">Arquitetura em construção</p><h2 id="apartment-build-title">Do traço<br />ao espaço.</h2><p class="apartment-build__label" data-apartment-label aria-live="polite">O primeiro traço</p></header><div class="apartment-build__scene" data-apartment-scene><canvas data-apartment-canvas aria-label="Apartamento tridimensional sendo construído durante a rolagem"></canvas><p class="apartment-build__fallback" data-apartment-fallback hidden>Uma residência é desenhada, estruturada e materializada.</p></div><div class="apartment-build__counter" aria-hidden="true"><span data-apartment-step>01</span><i></i><span>04</span></div><div class="apartment-build__progress" aria-hidden="true"><span data-apartment-progress></span></div></div></section>`;
}

function mainTemplate() {
  return `<main id="conteudo"><div class="hero-material-stack">${heroTemplate()}${perspectiveTemplate()}</div>${principlesTemplate()}${projectsTemplate()}${interactiveApartmentTemplate()}</main>`;
}

function footerTemplate() {
  return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><span class="brand__text"><span class="brand__name">Amato Lima</span><span class="brand__descriptor">Ativos Imobiliários</span></span><p>Venda e reforma de imóveis de alto padrão em bairros selecionados de São Paulo.</p></div><div class="footer-column"><h3>Navegação</h3><ul><li><a href="sobre.html">Sobre</a></li><li><a href="ativos.html">Ativos</a></li><li><a href="reformas.html">Reformas</a></li><li><a href="projetos.html">Projetos</a></li></ul></div><div class="footer-column"><h3>Contato</h3><ul><li><a href="mailto:contato@amatolima.com.br">contato@amatolima.com.br</a></li><li><a href="contato.html">Agendar conversa</a></li><li><a href="#">Instagram</a></li></ul></div></div><div class="footer-bottom"><span>© <span data-current-year></span> Amato Lima</span><span>São Paulo — SP</span></div></div></footer>`;
}

function renderHome() {
  const app=document.querySelector("[data-app]"); if(!app)throw new Error("O elemento principal da aplicação não foi encontrado."); document.body.classList.add("home-page"); app.innerHTML=`${flowingMenuTemplate()}${mainTemplate()}${footerTemplate()}`;
}
renderHome();