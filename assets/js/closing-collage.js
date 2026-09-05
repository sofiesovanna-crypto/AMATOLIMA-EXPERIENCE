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
        <figure class="closing-collage__layer closing-collage__layer--1" data-closing-layer><img src="assets/images/sections-home/11649.png" alt="Projeto Amato Lima — arquitetura e matéria" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--2" data-closing-layer><img src="assets/images/sections-home/11693.png" alt="Projeto Amato Lima — detalhe material" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--3" data-closing-layer><img src="assets/images/sections-home/27941.jpg" alt="Projeto Amato Lima — composição arquitetônica" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--4" data-closing-layer><img src="assets/images/sections-home/28149.jpg" alt="Projeto Amato Lima — interior em detalhe" loading="eager" /></figure>
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
    opacity: (index) => index === 0 ? 0.10 : 0,
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

  tl.to(layers[0], { opacity: 1, duration: 21 }, 0)
    .to(layers[0], { scale: 1, duration: 28 }, 0)
    .to(images[0], { scale: 1, duration: 28 }, 0)
    .to(layers[1], { opacity: 1, duration: 17 }, 22)
    .to(layers[1], { scale: 1, duration: 37 }, 22)
    .to(images[1], { scale: 1, duration: 37 }, 22)
    .to(layers[2], { opacity: 1, duration: 17 }, 47)
    .to(layers[2], { scale: 1, duration: 35 }, 47)
    .to(images[2], { scale: 1, duration: 35 }, 47)
    .to(layers[3], { opacity: 1, duration: 17 }, 69)
    .to(layers[3], { scale: 1, duration: 31 }, 69)
    .to(images[3], { scale: 1, duration: 31 }, 69);

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
