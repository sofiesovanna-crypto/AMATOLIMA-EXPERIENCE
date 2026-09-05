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

  // Estado inicial: só respiro. A base está abaixo do centro e completamente dissolvida.
  gsapApi.set(stage, { scale: .88, yPercent: 24 });
  gsapApi.set(layers, { xPercent: -50, yPercent: -50, opacity: 0 });
  gsapApi.set(layers[0], { scale: .72 });
  gsapApi.set(layers[1], { scale: .25 });
  gsapApi.set(layers[2], { scale: .20 });
  gsapApi.set(layers[3], { scale: .16 });
  gsapApi.set(images, { scale: 1.018 });

  const tl = gsapApi.timeline({
    defaults: { ease: "sine.inOut" },
    scrollTrigger: {
      trigger: section,
      // Começa antes da seção ocupar a tela: a imagem nasce enquanto a seção anterior termina de subir.
      start: "top 88%",
      end: "bottom bottom",
      scrub: 3.6,
      invalidateOnRefresh: true,
    },
  });

  // Respiro curto, seguido de uma entrada longa e quase imperceptível da base.
  tl.to({}, { duration: .42 })
    .to(layers[0], { opacity: .12, scale: .735, duration: .75, ease: "sine.out" }, .32)
    .to(stage, { yPercent: 18, scale: .895, duration: .9 }, .32)
    .to(layers[0], { opacity: .28, scale: .765, duration: .95 }, .88)
    .to(stage, { yPercent: 11, scale: .91, duration: 1.05 }, .82)
    .to(layers[0], { opacity: .46, scale: .80, duration: 1.05 }, 1.55)
    .to(stage, { yPercent: 5, scale: .93, duration: 1.10 }, 1.52)
    .to(layers[0], { opacity: .60, scale: .835, duration: 1.10 }, 2.18)
    .to(stage, { yPercent: 0, scale: .95, duration: 1.15 }, 2.12);

  // A segunda começa pequena e translúcida; base e segunda continuam crescendo juntas.
  tl.to(layers[1], { opacity: .08, scale: .27, duration: .72 }, 2.55)
    .to(layers[1], { opacity: .23, scale: .34, duration: 1.05 }, 2.92)
    .to(layers[0], { opacity: .72, scale: .87, duration: 1.30 }, 2.70)
    .to(layers[1], { opacity: .43, scale: .43, duration: 1.18 }, 3.62)
    .to(layers[0], { opacity: .82, scale: .90, duration: 1.28 }, 3.52)
    .to(stage, { scale: .97, duration: 1.55 }, 3.30);

  // A terceira começa antes da segunda terminar: não existe corte entre estados.
  tl.to(layers[1], { opacity: .61, scale: .54, duration: 1.42 }, 4.42)
    .to(layers[0], { opacity: .90, scale: .93, duration: 1.42 }, 4.35)
    .to(layers[2], { opacity: .06, scale: .22, duration: .78 }, 4.82)
    .to(layers[2], { opacity: .21, scale: .30, duration: 1.05 }, 5.18)
    .to(layers[1], { opacity: .75, scale: .64, duration: 1.38 }, 5.12)
    .to(layers[0], { opacity: .96, scale: .96, duration: 1.35 }, 5.08);

  // Terceira amadurece; quarta surge dentro dela ainda quase como um véu.
  tl.to(layers[2], { opacity: .43, scale: .41, duration: 1.28 }, 5.88)
    .to(layers[1], { opacity: .86, scale: .72, duration: 1.35 }, 5.92)
    .to(layers[3], { opacity: .05, scale: .18, duration: .75 }, 6.38)
    .to(layers[2], { opacity: .63, scale: .53, duration: 1.32 }, 6.42)
    .to(layers[3], { opacity: .20, scale: .27, duration: 1.05 }, 6.72)
    .to(stage, { scale: 1.00, duration: 1.60 }, 6.02);

  // Fechamento: nenhuma nova imagem. Todas convergem lentamente para as molduras finais.
  tl.to(layers[0], { opacity: 1, scale: .985, duration: 1.65 }, 6.95)
    .to(layers[1], { opacity: .95, scale: .84, duration: 1.80 }, 6.88)
    .to(layers[2], { opacity: .88, scale: .70, duration: 1.82 }, 7.02)
    .to(layers[3], { opacity: .78, scale: .56, duration: 1.82 }, 7.10)
    .to(images, { scale: 1, duration: 1.85 }, 6.92)
    .to(stage, { scale: 1.035, duration: 1.90 }, 6.90)
    .to(layers[0], { scale: 1, duration: 1.35 }, 8.42)
    .to(layers[1], { opacity: 1, scale: .90, duration: 1.45 }, 8.38)
    .to(layers[2], { opacity: 1, scale: .80, duration: 1.45 }, 8.42)
    .to(layers[3], { opacity: 1, scale: .70, duration: 1.45 }, 8.46)
    .to(stage, { scale: 1.065, duration: 1.50 }, 8.38)
    .to({}, { duration: .65 });

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
