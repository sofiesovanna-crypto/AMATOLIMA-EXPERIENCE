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

  // FRAME 1 — respiro. A seção existe, mas nenhuma fotografia é visível.
  gsapApi.set(stage, { scale: .86, yPercent: 13 });
  gsapApi.set(layers, { xPercent: -50, yPercent: -50, opacity: 0 });
  gsapApi.set(layers[0], { scale: .79 });
  gsapApi.set(layers[1], { scale: .32 });
  gsapApi.set(layers[2], { scale: .25 });
  gsapApi.set(layers[3], { scale: .20 });
  gsapApi.set(images, { scale: 1.025 });

  const tl = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 2.15,
      invalidateOnRefresh: true,
    },
  });

  // 0–1.15 — branco de respiro. Depois a base sobe da continuação natural da página,
  // cresce e ganha densidade muito lentamente, como nos três primeiros frames.
  tl.to({}, { duration: 1.15 })
    .to(layers[0], { opacity: .22, scale: .80, duration: .45 }, 1.15)
    .to(stage, { yPercent: 8, scale: .88, duration: .75 }, 1.15)
    .to(layers[0], { opacity: .42, scale: .84, duration: .8 }, 1.55)
    .to(stage, { yPercent: 2, scale: .92, duration: .8 }, 1.55)
    .to(layers[0], { opacity: .58, scale: .88, duration: .85 }, 2.15)
    .to(stage, { yPercent: 0, scale: .95, duration: .85 }, 2.15);

  // FRAME 4–6 — a segunda nasce ainda lavada enquanto a base continua amadurecendo.
  tl.to(layers[1], { opacity: .10, scale: .30, duration: .42 }, 2.48)
    .to(layers[1], { opacity: .26, scale: .36, duration: .72 }, 2.82)
    .to(layers[0], { opacity: .68, scale: .91, duration: .95 }, 2.65)
    .to(layers[1], { opacity: .47, scale: .43, duration: .92 }, 3.35)
    .to(layers[0], { opacity: .78, scale: .94, duration: 1.05 }, 3.35)
    .to(stage, { scale: .98, duration: 1.25 }, 3.25);

  // FRAME 7–9 — segunda cresce por vários scrolls; terceira começa antes dela terminar.
  tl.to(layers[1], { opacity: .66, scale: .55, duration: 1.15 }, 4.10)
    .to(layers[0], { opacity: .88, scale: .97, duration: 1.30 }, 4.05)
    .to(layers[2], { opacity: .08, scale: .27, duration: .45 }, 4.55)
    .to(layers[2], { opacity: .25, scale: .34, duration: .82 }, 4.88)
    .to(layers[1], { opacity: .78, scale: .64, duration: 1.18 }, 4.92)
    .to(layers[0], { opacity: .96, scale: .99, duration: 1.10 }, 5.05);

  // FRAME 9–11 — terceira toma o centro, segunda segue expandindo e a quarta já aparece.
  tl.to(layers[2], { opacity: .48, scale: .44, duration: 1.05 }, 5.55)
    .to(layers[1], { opacity: .88, scale: .72, duration: 1.22 }, 5.70)
    .to(layers[3], { opacity: .07, scale: .22, duration: .42 }, 6.18)
    .to(layers[2], { opacity: .66, scale: .55, duration: 1.12 }, 6.18)
    .to(layers[3], { opacity: .24, scale: .31, duration: .86 }, 6.52)
    .to(stage, { scale: 1.025, duration: 1.55 }, 5.85);

  // FRAME 11–13 — nenhuma nova entrada. Todas ganham presença e crescem juntas.
  // As diferenças de escala convergem para bordas progressivamente estreitas.
  tl.to(layers[0], { opacity: 1, scale: 1, duration: 1.55 }, 6.65)
    .to(layers[1], { opacity: .96, scale: .91, duration: 1.72 }, 6.55)
    .to(layers[2], { opacity: .92, scale: .82, duration: 1.72 }, 6.72)
    .to(layers[3], { opacity: .88, scale: .72, duration: 1.72 }, 6.85)
    .to(images, { scale: 1, duration: 1.65 }, 6.65)
    .to(stage, { scale: 1.09, duration: 1.75 }, 6.65)
    .to(layers[1], { opacity: 1, scale: .94, duration: 1.25 }, 8.15)
    .to(layers[2], { opacity: 1, scale: .86, duration: 1.25 }, 8.15)
    .to(layers[3], { opacity: 1, scale: .78, duration: 1.25 }, 8.15)
    .to(stage, { scale: 1.14, duration: 1.35 }, 8.10)
    .to({}, { duration: .85 });

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
