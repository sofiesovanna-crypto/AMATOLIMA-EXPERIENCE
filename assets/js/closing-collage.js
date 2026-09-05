"use strict";

(function initClosingCollage() {
  const main = document.querySelector("#conteudo");
  if (!main || document.querySelector("[data-closing-collage]")) return;

  const section = document.createElement("section");
  section.className = "closing-collage";
  section.setAttribute("data-closing-collage", "");
  section.setAttribute("aria-label", "Composição final de projetos Amato Lima");
  section.innerHTML = `
    <div class="closing-collage__pin">
      <div class="closing-collage__stage" data-closing-stage>
        <figure class="closing-collage__layer closing-collage__layer--1" data-closing-layer>
          <img src="assets/images/transformation/final-sala.jpg" alt="Projeto Amato Lima — arquitetura e matéria" loading="lazy" />
        </figure>
        <figure class="closing-collage__layer closing-collage__layer--2" data-closing-layer>
          <img src="assets/images/hero-mask.png" alt="Projeto Amato Lima — detalhe material" loading="lazy" />
        </figure>
        <figure class="closing-collage__layer closing-collage__layer--3" data-closing-layer>
          <img src="assets/images/hero-mask-3.png" alt="Projeto Amato Lima — composição arquitetônica" loading="lazy" />
        </figure>
        <figure class="closing-collage__layer closing-collage__layer--4" data-closing-layer>
          <img src="assets/images/transformation/render-sala.jpg" alt="Projeto Amato Lima — interior em detalhe" loading="lazy" />
        </figure>
      </div>
    </div>`;

  /* Mantém a colagem como última experiência visual, imediatamente antes da faixa/rodapé. */
  const quote = main.querySelector(".quote-band");
  if (quote) main.insertBefore(section, quote);
  else main.appendChild(section);

  const layers = Array.from(section.querySelectorAll("[data-closing-layer]"));
  const images = layers.map((layer) => layer.querySelector("img"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const gsapApi = window.gsap;
  const ScrollTriggerApi = window.ScrollTrigger;

  if (gsapApi && ScrollTriggerApi) {
    gsapApi.registerPlugin(ScrollTriggerApi);

    const starts = [
      { x: 0, y: 18, scale: 1.13, rotate: -.35 },
      { x: -5, y: 30, scale: 1.18, rotate: .28 },
      { x: 6, y: 42, scale: 1.22, rotate: -.22 },
      { x: 0, y: 58, scale: 1.28, rotate: .18 },
    ];

    layers.forEach((layer, index) => {
      const from = starts[index];
      gsapApi.set(layer, {
        xPercent: -50,
        yPercent: -50,
        x: `${from.x}vw`,
        y: `${from.y}vh`,
        scale: from.scale,
        rotation: from.rotate,
        clipPath: "inset(48% 0 48% 0)",
        opacity: index === 0 ? .96 : .78,
      });
      gsapApi.set(images[index], { scale: 1.12 + index * .025, yPercent: 4 + index * 1.5 });
    });

    const timeline = gsapApi.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.35,
        invalidateOnRefresh: true,
      },
    });

    layers.forEach((layer, index) => {
      timeline.to(layer, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        clipPath: "inset(0% 0 0% 0)",
        opacity: 1,
        duration: 1.15,
        ease: "power2.out",
      }, index * .34);
      timeline.to(images[index], {
        scale: 1,
        yPercent: 0,
        duration: 1.25,
        ease: "power1.out",
      }, index * .34);
    });

    /* Pequena sustentação no final para a composição completa permanecer em cena. */
    timeline.to({}, { duration: .75 });
    requestAnimationFrame(() => ScrollTriggerApi.refresh());
    return;
  }

  /* Fallback sem GSAP: a composição final permanece íntegra. */
  layers.forEach((layer) => {
    layer.style.transform = "translate(-50%, -50%)";
    layer.style.opacity = "1";
    layer.style.clipPath = "inset(0)";
  });
})();
