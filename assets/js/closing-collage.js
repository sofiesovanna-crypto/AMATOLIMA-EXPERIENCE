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

  const quote = main.querySelector(".quote-band");
  if (quote) main.insertBefore(section, quote);
  else main.appendChild(section);

  const layers = Array.from(section.querySelectorAll("[data-closing-layer]"));
  const images = layers.map((layer) => layer.querySelector("img"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapApi = window.gsap;
  const ScrollTriggerApi = window.ScrollTrigger;

  if (reduceMotion || !gsapApi || !ScrollTriggerApi) {
    layers.forEach((layer) => {
      layer.style.transform = "translate(-50%, -50%)";
      layer.style.opacity = "1";
    });
    return;
  }

  gsapApi.registerPlugin(ScrollTriggerApi);

  /* Poeza-like logic: a base já existe. Cada nova fotografia começa como um
     pequeno núcleo translúcido no centro e emerge, em sequência, de dentro da anterior. */
  gsapApi.set(layers[0], { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
  gsapApi.set(images[0], { scale: 1.035, opacity: 1 });

  for (let i = 1; i < layers.length; i += 1) {
    gsapApi.set(layers[i], {
      xPercent: -50,
      yPercent: -50,
      scale: .055,
      opacity: 0,
    });
    gsapApi.set(images[i], { scale: 1.16, opacity: .34 });
  }

  const timeline = gsapApi.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.75,
      invalidateOnRefresh: true,
    },
  });

  /* Base respira muito pouco enquanto recebe as demais imagens. */
  timeline.to(layers[0], { scale: .985, duration: 1.05 }, 0)
    .to(images[0], { scale: 1, duration: 1.05 }, 0);

  const arrivals = [0.72, 1.72, 2.72];
  for (let i = 1; i < layers.length; i += 1) {
    const at = arrivals[i - 1];
    const previous = layers[i - 1];

    /* Primeiro aparece quase como uma transparência dentro da imagem anterior. */
    timeline.to(layers[i], {
      opacity: .28,
      scale: .18,
      duration: .22,
    }, at);

    /* Depois ganha presença e dimensão, sem salto de escala. */
    timeline.to(layers[i], {
      opacity: .72,
      scale: .68,
      duration: .42,
    }, at + .22);
    timeline.to(images[i], {
      opacity: .78,
      scale: 1.07,
      duration: .42,
    }, at + .22);

    /* Assenta no tamanho final enquanto a camada anterior perde só um pouco de força. */
    timeline.to(layers[i], {
      opacity: 1,
      scale: 1,
      duration: .42,
    }, at + .64);
    timeline.to(images[i], {
      opacity: 1,
      scale: 1,
      duration: .42,
    }, at + .64);
    timeline.to(previous, {
      opacity: i === 1 ? .88 : .9,
      duration: .32,
    }, at + .34);
    timeline.to(previous, {
      opacity: 1,
      duration: .32,
    }, at + .74);
  }

  /* Sustenta a composição final para o olho conseguir lê-la antes do rodapé. */
  timeline.to({}, { duration: 1.05 });
  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
