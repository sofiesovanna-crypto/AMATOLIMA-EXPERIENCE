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
        <figure class="closing-collage__layer closing-collage__layer--1" data-closing-layer><img src="assets/images/transformation/final-sala.jpg" alt="Projeto Amato Lima — arquitetura e matéria" loading="lazy" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--2" data-closing-layer><img src="assets/images/hero-mask.png" alt="Projeto Amato Lima — detalhe material" loading="lazy" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--3" data-closing-layer><img src="assets/images/hero-mask-3.png" alt="Projeto Amato Lima — composição arquitetônica" loading="lazy" /></figure>
        <figure class="closing-collage__layer closing-collage__layer--4" data-closing-layer><img src="assets/images/transformation/render-sala.jpg" alt="Projeto Amato Lima — interior em detalhe" loading="lazy" /></figure>
      </div>
    </div>`;

  const quote = main.querySelector(".quote-band");
  if (quote) main.insertBefore(section, quote); else main.appendChild(section);

  const layers = Array.from(section.querySelectorAll("[data-closing-layer]"));
  const images = layers.map((layer) => layer.querySelector("img"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapApi = window.gsap;
  const ScrollTriggerApi = window.ScrollTrigger;

  if (reduceMotion || !gsapApi || !ScrollTriggerApi) {
    layers.forEach((layer) => { layer.style.transform = "translate(-50%, -50%)"; layer.style.opacity = "1"; });
    return;
  }

  gsapApi.registerPlugin(ScrollTriggerApi);
  gsapApi.set(layers[0], { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
  gsapApi.set(images[0], { scale: 1.018, opacity: 1 });

  for (let i = 1; i < layers.length; i += 1) {
    gsapApi.set(layers[i], { xPercent: -50, yPercent: -50, scale: .76, opacity: 0 });
    gsapApi.set(images[i], { scale: 1.045, opacity: .72 });
  }

  const timeline = gsapApi.timeline({
    defaults: { ease: "sine.inOut" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 2.6,
      invalidateOnRefresh: true,
    },
  });

  // A composição nunca para de respirar: movimentos mínimos mantêm tudo vivo sem deslocar o eixo.
  timeline.to(images[0], { scale: 1.006, duration: 1.5, ease: "sine.out" }, 0)
    .to(images[0], { scale: 1, duration: 2.8, ease: "sine.inOut" }, 1.5);

  // As entradas se sobrepõem levemente. Não há mais etapas perceptíveis de fade -> scale -> stop.
  const arrivals = [.58, 1.78, 2.98];
  for (let i = 1; i < layers.length; i += 1) {
    const at = arrivals[i - 1];
    const previous = layers[i - 1];

    timeline.to(layers[i], {
      opacity: 1,
      scale: 1,
      duration: 1.34,
      ease: "sine.inOut",
    }, at);

    timeline.to(images[i], {
      opacity: 1,
      scale: 1,
      duration: 1.52,
      ease: "sine.inOut",
    }, at - .04);

    // A moldura anterior cede quase imperceptivelmente e volta, criando profundidade sem piscar.
    timeline.to(previous, {
      scale: .996,
      opacity: .985,
      duration: .72,
      ease: "sine.inOut",
    }, at + .18);
    timeline.to(previous, {
      scale: 1,
      opacity: 1,
      duration: .9,
      ease: "sine.inOut",
    }, at + .68);
  }

  // Longa sustentação final para a última imagem não parecer um corte antes do rodapé.
  timeline.to(images[3], { scale: .997, duration: 1.25, ease: "sine.inOut" })
    .to(images[3], { scale: 1, duration: 1.25, ease: "sine.inOut" })
    .to({}, { duration: 1.15 });

  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
