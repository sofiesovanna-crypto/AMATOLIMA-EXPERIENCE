"use strict";

(function initClosingCollage() {
  const main = document.querySelector("#conteudo");
  if (!main || document.querySelector("[data-closing-collage]")) return;

  const section = document.createElement("section");
  section.className = "closing-collage";
  section.setAttribute("data-closing-collage", "");
  section.innerHTML = `
    <div class="closing-collage__pin">
      <div class="closing-collage__stage" data-closing-stage>
        <figure class="closing-collage__layer closing-collage__layer--1" data-closing-layer><img src="assets/images/transformation/final-sala.jpg" alt="Projeto Amato Lima — arquitetura e matéria" loading="lazy" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--2" data-closing-layer><img src="assets/images/hero-mask.png" alt="Projeto Amato Lima — detalhe material" loading="lazy" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--3" data-closing-layer><img src="assets/images/hero-mask-3.png" alt="Projeto Amato Lima — composição arquitetônica" loading="lazy" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--4" data-closing-layer><img src="assets/images/transformation/render-sala.jpg" alt="Projeto Amato Lima — interior em detalhe" loading="lazy" /></figure>
      </div>
    </div>`;

  const quote = main.querySelector(".quote-band");
  if (quote) main.insertBefore(section, quote); else main.appendChild(section);

  const stage = section.querySelector("[data-closing-stage]");
  const layers = Array.from(section.querySelectorAll("[data-closing-layer]"));
  const images = layers.map((layer) => layer.querySelector("img"));
  const gsapApi = window.gsap;
  const ScrollTriggerApi = window.ScrollTrigger;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !gsapApi || !ScrollTriggerApi) return;

  gsapApi.registerPlugin(ScrollTriggerApi);

  gsapApi.set(stage, { scale: .875, yPercent: 34 });
  gsapApi.set(layers, { xPercent: -50, yPercent: -50, opacity: 0 });
  gsapApi.set(layers[0], { scale: .68 });
  gsapApi.set(layers[1], { scale: .22 });
  gsapApi.set(layers[2], { scale: .18 });
  gsapApi.set(layers[3], { scale: .15 });
  gsapApi.set(images, { scale: 1.012 });

  const tl = gsapApi.timeline({
    defaults: { ease: "sine.inOut" },
    scrollTrigger: {
      trigger: section,
      // A base começa a existir quando só a borda inferior da nova seção entrou na viewport.
      start: "top 99%",
      end: "bottom bottom",
      scrub: 5.2,
      invalidateOnRefresh: true,
    },
  });

  // Entrada deliberadamente longa: a seção anterior ainda domina a tela enquanto a base
  // aparece por baixo, sobe alguns pixels por vez e ganha corpo quase imperceptivelmente.
  tl.to(layers[0], { opacity: .055, scale: .688, duration: 1.10, ease: "sine.out" }, 0)
    .to(stage, { yPercent: 29, scale: .882, duration: 1.25 }, 0)
    .to(layers[0], { opacity: .13, scale: .705, duration: 1.25 }, .72)
    .to(stage, { yPercent: 23, scale: .89, duration: 1.35 }, .68)
    .to(layers[0], { opacity: .23, scale: .728, duration: 1.35 }, 1.48)
    .to(stage, { yPercent: 16, scale: .902, duration: 1.45 }, 1.42)
    .to(layers[0], { opacity: .35, scale: .755, duration: 1.45 }, 2.28)
    .to(stage, { yPercent: 9, scale: .916, duration: 1.50 }, 2.20)
    .to(layers[0], { opacity: .48, scale: .785, duration: 1.50 }, 3.08)
    .to(stage, { yPercent: 3, scale: .932, duration: 1.55 }, 3.00)
    .to(layers[0], { opacity: .58, scale: .815, duration: 1.55 }, 3.88)
    .to(stage, { yPercent: 0, scale: .946, duration: 1.60 }, 3.80);

  // Cada nova imagem começa como presença quase fantasma. As janelas de transição são
  // largas e sobrepostas para nunca haver um instante identificável de “entrada”.
  tl.to(layers[1], { opacity: .035, scale: .225, duration: 1.10 }, 4.00)
    .to(layers[1], { opacity: .12, scale: .265, duration: 1.40 }, 4.58)
    .to(layers[0], { opacity: .68, scale: .845, duration: 1.75 }, 4.18)
    .to(layers[1], { opacity: .27, scale: .335, duration: 1.55 }, 5.38)
    .to(layers[0], { opacity: .77, scale: .875, duration: 1.75 }, 5.18)
    .to(layers[1], { opacity: .44, scale: .425, duration: 1.70 }, 6.25)
    .to(stage, { scale: .965, duration: 2.15 }, 5.30);

  tl.to(layers[2], { opacity: .025, scale: .185, duration: 1.10 }, 6.55)
    .to(layers[1], { opacity: .59, scale: .515, duration: 1.80 }, 6.72)
    .to(layers[0], { opacity: .86, scale: .905, duration: 1.85 }, 6.62)
    .to(layers[2], { opacity: .10, scale: .225, duration: 1.35 }, 7.18)
    .to(layers[2], { opacity: .23, scale: .295, duration: 1.55 }, 7.92)
    .to(layers[1], { opacity: .72, scale: .605, duration: 1.85 }, 7.72)
    .to(layers[0], { opacity: .93, scale: .935, duration: 1.90 }, 7.65);

  tl.to(layers[3], { opacity: .02, scale: .155, duration: 1.05 }, 8.62)
    .to(layers[2], { opacity: .40, scale: .395, duration: 1.75 }, 8.72)
    .to(layers[1], { opacity: .82, scale: .685, duration: 1.85 }, 8.65)
    .to(layers[3], { opacity: .08, scale: .195, duration: 1.35 }, 9.18)
    .to(layers[3], { opacity: .20, scale: .265, duration: 1.55 }, 9.92)
    .to(layers[2], { opacity: .58, scale: .505, duration: 1.80 }, 9.68)
    .to(stage, { scale: .992, duration: 2.25 }, 8.72);

  // Depois da quarta, o movimento continua respirando por vários scrolls. Nenhuma camada
  // “encaixa”: todas se aproximam simultaneamente das proporções finais.
  tl.to(layers[0], { opacity: 1, scale: 1, duration: 2.65 }, 10.55)
    .to(layers[1], { opacity: .96, scale: .84, duration: 2.75 }, 10.45)
    .to(layers[2], { opacity: .89, scale: .70, duration: 2.80 }, 10.58)
    .to(layers[3], { opacity: .80, scale: .56, duration: 2.85 }, 10.68)
    .to(images, { scale: 1, duration: 2.70 }, 10.50)
    .to(stage, { scale: 1.025, duration: 2.85 }, 10.45)
    .to(layers[1], { opacity: 1, scale: .90, duration: 2.10 }, 12.78)
    .to(layers[2], { opacity: 1, scale: .80, duration: 2.10 }, 12.82)
    .to(layers[3], { opacity: 1, scale: .70, duration: 2.10 }, 12.86)
    .to(stage, { scale: 1.055, duration: 2.20 }, 12.76)
    .to({}, { duration: 1.10 });

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
