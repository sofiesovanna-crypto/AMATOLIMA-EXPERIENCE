"use strict";

(function initClosingCollage() {
  const main = document.querySelector("#conteudo");
  if (!main || document.querySelector("[data-closing-collage]")) return;

  const section = document.createElement("section");
  section.className = "closing-collage";
  section.setAttribute("data-closing-collage", "");
  section.setAttribute("aria-label", "Projetos Amato Lima em movimento");
  section.innerHTML = `
    <div class="closing-collage__pin">
      <div class="closing-collage__signature" aria-hidden="true">AMATO LIMA</div>
      <div class="closing-collage__stage">
        <figure class="closing-collage__layer closing-collage__layer--1" data-closing-layer><img src="assets/images/transformation/final-sala.jpg" alt="Projeto Amato Lima — arquitetura e matéria" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--2" data-closing-layer><img src="assets/images/hero-mask.png" alt="Projeto Amato Lima — detalhe material" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--3" data-closing-layer><img src="assets/images/hero-mask-3.png" alt="Projeto Amato Lima — composição arquitetônica" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--4" data-closing-layer><img src="assets/images/transformation/render-sala.jpg" alt="Projeto Amato Lima — interior em detalhe" loading="eager" /></figure>
      </div>
    </div>`;

  const quote = main.querySelector(".quote-band");
  if (quote) main.insertBefore(section, quote); else main.appendChild(section);

  const layers = Array.from(section.querySelectorAll("[data-closing-layer]"));
  const images = layers.map((layer) => layer.querySelector("img"));
  const gsapApi = window.gsap;
  const ScrollTriggerApi = window.ScrollTrigger;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !gsapApi || !ScrollTriggerApi) return;

  gsapApi.registerPlugin(ScrollTriggerApi);
  gsapApi.set(layers, {
    scale: (index) => [0.78, 0.22, 0.205, 0.19][index],
    opacity: (index) => index === 0 ? 0.055 : 0,
    force3D: true,
    backfaceVisibility: "hidden"
  });
  gsapApi.set(images, { scale: 1.035, force3D: true });

  const tl = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      invalidateOnRefresh: true
    }
  });

  // Mantém exatamente a escala, o timing e o movimento definidos pela composição.
  // Apenas a opacidade amadurece em estágios: fantasma -> leitura -> presença.
  tl.to(layers[0], { opacity: 0.34, duration: 7 }, 0)
    .to(layers[0], { opacity: 0.66, duration: 7 }, 7)
    .to(layers[0], { opacity: 0.86, duration: 7 }, 14)
    .to(layers[0], { opacity: 1, duration: 79 }, 21)
    .to(layers[0], { scale: 1, duration: 28 }, 0)
    .to(images[0], { scale: 1, duration: 28 }, 0)

    .to(layers[1], { opacity: 0.18, duration: 5 }, 22)
    .to(layers[1], { opacity: 0.42, duration: 6 }, 27)
    .to(layers[1], { opacity: 0.64, duration: 6 }, 33)
    .to(layers[1], { opacity: 0.78, duration: 22 }, 39)
    .to(layers[1], { opacity: 0.90, duration: 24 }, 61)
    .to(layers[1], { opacity: 1, duration: 15 }, 85)
    .to(layers[1], { scale: 1, duration: 37 }, 22)
    .to(images[1], { scale: 1, duration: 37 }, 22)

    .to(layers[2], { opacity: 0.14, duration: 5 }, 47)
    .to(layers[2], { opacity: 0.34, duration: 6 }, 52)
    .to(layers[2], { opacity: 0.56, duration: 7 }, 58)
    .to(layers[2], { opacity: 0.73, duration: 17 }, 65)
    .to(layers[2], { opacity: 0.88, duration: 13 }, 82)
    .to(layers[2], { opacity: 1, duration: 5 }, 95)
    .to(layers[2], { scale: 1, duration: 35 }, 47)
    .to(images[2], { scale: 1, duration: 35 }, 47)

    .to(layers[3], { opacity: 0.11, duration: 4 }, 69)
    .to(layers[3], { opacity: 0.28, duration: 5 }, 73)
    .to(layers[3], { opacity: 0.48, duration: 6 }, 78)
    .to(layers[3], { opacity: 0.66, duration: 6 }, 84)
    .to(layers[3], { opacity: 0.82, duration: 6 }, 90)
    .to(layers[3], { opacity: 1, duration: 4 }, 96)
    .to(layers[3], { scale: 1, duration: 31 }, 69)
    .to(images[3], { scale: 1, duration: 31 }, 69);

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
