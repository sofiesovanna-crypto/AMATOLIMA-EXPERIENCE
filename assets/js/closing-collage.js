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
        <figure class="closing-collage__layer closing-collage__layer--1" data-closing-layer><img src="assets/images/transformation/final-sala.jpg" alt="Projeto Amato Lima — arquitetura e matéria" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--2" data-closing-layer><img src="assets/images/hero-mask.png" alt="Projeto Amato Lima — detalhe material" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--3" data-closing-layer><img src="assets/images/hero-mask-3.png" alt="Projeto Amato Lima — composição arquitetônica" loading="eager" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--4" data-closing-layer><img src="assets/images/transformation/render-sala.jpg" alt="Projeto Amato Lima — interior em detalhe" loading="eager" /></figure>
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

  // Tudo parte de uma escala já legível. O crescimento acontece desde o primeiro pixel de scroll.
  gsapApi.set(stage, { scale: .93, yPercent: 18, force3D: true });
  gsapApi.set(layers, { xPercent: -50, yPercent: -50, opacity: 0, force3D: true });
  gsapApi.set(layers[0], { scale: .74, opacity: .06 });
  gsapApi.set(layers[1], { scale: .46 });
  gsapApi.set(layers[2], { scale: .45 });
  gsapApi.set(layers[3], { scale: .44 });
  gsapApi.set(images, { scale: 1.006, force3D: true });

  const tl = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top 112%",
      end: "bottom bottom",
      // Quase 1:1 com o gesto. Sem a cauda que fazia o scroll parecer pesado.
      scrub: .42,
      invalidateOnRefresh: true,
      fastScrollEnd: false,
    },
  });

  // Crescimento uniforme do palco: nada fica represado para explodir no final.
  tl.to(stage, { yPercent: 0, scale: 1, duration: 30 }, 0)
    .to(stage, { scale: 1.025, duration: 70 }, 30)
    .to(images, { scale: 1, duration: 100 }, 0);

  // BASE — cresce continuamente e cedo, em vez de apenas clarear no início.
  tl.to(layers[0], { opacity: .78, scale: .91, duration: 25 }, 0)
    .to(layers[0], { opacity: .92, scale: .965, duration: 30 }, 25)
    .to(layers[0], { opacity: 1, scale: 1, duration: 45 }, 55);

  // Cada imagem interna tem uma curva quase uniforme: nasce, permanece legível e cresce
  // ao longo de uma janela ampla. Os últimos 20% fazem só refinamento, nunca um salto.
  tl.to(layers[1], { opacity: .18, scale: .52, duration: 12 }, 25)
    .to(layers[1], { opacity: .58, scale: .66, duration: 25 }, 37)
    .to(layers[1], { opacity: .82, scale: .78, duration: 25 }, 62)
    .to(layers[1], { opacity: 1, scale: .90, duration: 13 }, 87);

  tl.to(layers[2], { opacity: .14, scale: .50, duration: 12 }, 45)
    .to(layers[2], { opacity: .52, scale: .61, duration: 22 }, 57)
    .to(layers[2], { opacity: .78, scale: .71, duration: 21 }, 79)
    .to(layers[2], { opacity: 1, scale: .80, duration: 10 }, 90);

  tl.to(layers[3], { opacity: .12, scale: .49, duration: 11 }, 63)
    .to(layers[3], { opacity: .48, scale: .57, duration: 17 }, 74)
    .to(layers[3], { opacity: .76, scale: .64, duration: 15 }, 86)
    .to(layers[3], { opacity: 1, scale: .70, duration: 7 }, 93);

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
