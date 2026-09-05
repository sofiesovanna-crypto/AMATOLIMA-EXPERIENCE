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

  // Um único fluxo contínuo por propriedade. Sem pequenos tweens consecutivos,
  // evitando a sensação de popup/encaixe entre os estados.
  gsapApi.set(stage, { scale: .88, yPercent: 31, force3D: true });
  gsapApi.set(layers, { xPercent: -50, yPercent: -50, opacity: 0, force3D: true });
  gsapApi.set(layers[0], { scale: .68 });
  gsapApi.set(layers[1], { scale: .22 });
  gsapApi.set(layers[2], { scale: .18 });
  gsapApi.set(layers[3], { scale: .15 });
  gsapApi.set(images, { scale: 1.01, force3D: true });

  const tl = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 4.8,
      invalidateOnRefresh: true,
    },
  });

  // O palco inteiro sobe e se aproxima sem qualquer parada durante todo o percurso.
  tl.to(stage, { yPercent: 0, scale: 1.045, duration: 100 }, 0)
    .to(images, { scale: 1, duration: 100 }, 0);

  // BASE — nasce imediatamente, ainda enquanto a imagem editorial anterior invade a seção.
  tl.to(layers[0], { opacity: .60, scale: .82, duration: 38 }, 0)
    .to(layers[0], { opacity: 1, scale: 1, duration: 62 }, 38);

  // SEGUNDA — o fade e o crescimento ocupam a maior parte do scroll; nada “salta”.
  tl.to(layers[1], { opacity: .44, scale: .43, duration: 34 }, 22)
    .to(layers[1], { opacity: 1, scale: .90, duration: 44 }, 56);

  // TERCEIRA — começa antes da segunda chegar ao meio do percurso.
  tl.to(layers[2], { opacity: .38, scale: .39, duration: 31 }, 39)
    .to(layers[2], { opacity: 1, scale: .80, duration: 30 }, 70);

  // QUARTA — entra como uma transparência quase imperceptível e nunca “abre” de repente.
  tl.to(layers[3], { opacity: .30, scale: .31, duration: 27 }, 55)
    .to(layers[3], { opacity: 1, scale: .70, duration: 18 }, 82);

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
