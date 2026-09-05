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
    scale: (index) => [0.80, 0.245, 0.24, 0.235][index],
    opacity: 1,
    force3D: true,
    backfaceVisibility: "hidden"
  });
  gsapApi.set(images, { scale: 1.055, force3D: true });

  const tl = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.75,
      invalidateOnRefresh: true
    }
  });

  tl.to(layers[0], { scale: 1, duration: 24 }, 0)
    .to(images[0], { scale: 1, duration: 24 }, 0)
    .to(layers[1], { scale: 1, duration: 36 }, 14)
    .to(images[1], { scale: 1, duration: 36 }, 14)
    .to(layers[2], { scale: 1, duration: 36 }, 38)
    .to(images[2], { scale: 1, duration: 36 }, 38)
    .to(layers[3], { scale: 1, duration: 38 }, 62)
    .to(images[3], { scale: 1, duration: 38 }, 62);

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
