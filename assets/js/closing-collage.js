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

  gsapApi.set(stage, { scale: .90, yPercent: 22, force3D: true });
  gsapApi.set(layers, { xPercent: -50, yPercent: -50, opacity: 0, force3D: true });
  gsapApi.set(layers[0], { scale: .72, opacity: .055 });
  gsapApi.set(layers[1], { scale: .27 });
  gsapApi.set(layers[2], { scale: .23 });
  gsapApi.set(layers[3], { scale: .20 });
  gsapApi.set(images, { scale: 1.008, force3D: true });

  const tl = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      // Começa antes: a base já nasce enquanto a seção anterior ainda ocupa a viewport.
      start: "top 112%",
      end: "bottom bottom",
      // Inércia suficiente para limpar o movimento, sem fazer o scroll parecer pesado.
      scrub: 1.65,
      invalidateOnRefresh: true,
      fastScrollEnd: false,
    },
  });

  // O palco chega ao centro cedo; depois cresce apenas de forma quase imperceptível.
  tl.to(stage, { yPercent: 0, scale: .97, duration: 24 }, 0)
    .to(stage, { scale: 1.035, duration: 76 }, 24)
    .to(images, { scale: 1, duration: 100 }, 0);

  // BASE: rápida apenas no sentido de entrar cedo na composição. Ela não é substituída cedo.
  // Nos primeiros 20% do percurso já passa de presença parcial para protagonista.
  tl.to(layers[0], { opacity: .72, scale: .91, duration: 22 }, 0)
    .to(layers[0], { opacity: 1, scale: 1, duration: 78 }, 22);

  // As demais têm um período de leitura: aparecem, ficam reconhecíveis e só então avançam.
  // Assim uma imagem não toma imediatamente o lugar da anterior.
  tl.to(layers[1], { opacity: .18, scale: .34, duration: 14 }, 25)
    .to(layers[1], { opacity: .52, scale: .49, duration: 22 }, 39)
    .to(layers[1], { opacity: .76, scale: .62, duration: 20 }, 61)
    .to(layers[1], { opacity: 1, scale: .90, duration: 19 }, 81);

  tl.to(layers[2], { opacity: .12, scale: .29, duration: 13 }, 47)
    .to(layers[2], { opacity: .43, scale: .42, duration: 20 }, 60)
    .to(layers[2], { opacity: .70, scale: .56, duration: 18 }, 80)
    .to(layers[2], { opacity: 1, scale: .80, duration: 12 }, 88);

  tl.to(layers[3], { opacity: .09, scale: .25, duration: 12 }, 66)
    .to(layers[3], { opacity: .35, scale: .37, duration: 15 }, 78)
    .to(layers[3], { opacity: .64, scale: .49, duration: 13 }, 87)
    .to(layers[3], { opacity: 1, scale: .70, duration: 8 }, 92);

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
