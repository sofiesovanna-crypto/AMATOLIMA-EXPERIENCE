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
  const gsapApi = window.gsap;
  const ScrollTriggerApi = window.ScrollTrigger;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !gsapApi || !ScrollTriggerApi) return;

  gsapApi.registerPlugin(ScrollTriggerApi);

  gsapApi.set(stage, { scale: .94, yPercent: 17, force3D: true });
  gsapApi.set(layers, {
    xPercent: -50,
    yPercent: -50,
    opacity: 0,
    force3D: true,
    backfaceVisibility: "hidden"
  });
  gsapApi.set(layers[0], { scale: .76, opacity: .07 });
  gsapApi.set(layers[1], { scale: .50 });
  gsapApi.set(layers[2], { scale: .49 });
  gsapApi.set(layers[3], { scale: .48 });

  const tl = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top 112%",
      end: "bottom bottom",
      // Resposta praticamente direta ao gesto; só um véu mínimo para não tremer.
      scrub: .12,
      invalidateOnRefresh: true,
      fastScrollEnd: false
    }
  });

  // O palco se acomoda cedo. Depois disso não existe aceleração global no fim.
  tl.to(stage, { yPercent: 0, scale: 1, duration: 24 }, 0)
    .to(stage, { scale: 1.012, duration: 76 }, 24);

  // Base: ganha tamanho e leitura logo na entrada, depois só amadurece suavemente.
  tl.to(layers[0], { opacity: .70, scale: .90, duration: 20 }, 0)
    .to(layers[0], { opacity: .88, scale: .955, duration: 26 }, 20)
    .to(layers[0], { opacity: 1, scale: 1, duration: 54 }, 46);

  // Segunda: aparece cedo e já fica identificável antes da terceira nascer.
  tl.to(layers[1], { opacity: .25, scale: .55, duration: 10 }, 22)
    .to(layers[1], { opacity: .55, scale: .65, duration: 18 }, 32)
    .to(layers[1], { opacity: .75, scale: .75, duration: 24 }, 50)
    .to(layers[1], { opacity: .90, scale: .84, duration: 24 }, 74)
    .to(layers[1], { opacity: 1, scale: .90, duration: 2 }, 98);

  // Terceira: visibilidade antecipada; crescimento distribuído quase até o fim.
  tl.to(layers[2], { opacity: .22, scale: .54, duration: 9 }, 42)
    .to(layers[2], { opacity: .50, scale: .62, duration: 17 }, 51)
    .to(layers[2], { opacity: .72, scale: .69, duration: 21 }, 68)
    .to(layers[2], { opacity: .90, scale: .77, duration: 20 }, 79)
    .to(layers[2], { opacity: 1, scale: .80, duration: 1 }, 99);

  // Quarta: começa antes e sem degrau. Ao chegar, o restante continua movendo junto.
  tl.to(layers[3], { opacity: .18, scale: .53, duration: 8 }, 60)
    .to(layers[3], { opacity: .43, scale: .58, duration: 14 }, 68)
    .to(layers[3], { opacity: .66, scale: .63, duration: 17 }, 82)
    .to(layers[3], { opacity: .88, scale: .685, duration: 16 }, 83)
    .to(layers[3], { opacity: 1, scale: .70, duration: 1 }, 99);

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
