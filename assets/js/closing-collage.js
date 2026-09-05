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

  // Uma única origem: nenhuma camada viaja pela tela. Todas nascem exatamente
  // no centro da fotografia anterior, como uma nova janela que se abre dentro dela.
  gsapApi.set(layers[0], { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
  gsapApi.set(images[0], { scale: 1.025, opacity: 1 });
  for (let i = 1; i < layers.length; i += 1) {
    gsapApi.set(layers[i], { xPercent: -50, yPercent: -50, scale: .72, opacity: 0 });
    gsapApi.set(images[i], { scale: 1.055, opacity: .58 });
  }

  const timeline = gsapApi.timeline({
    defaults: { ease: "power1.inOut" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.35,
      invalidateOnRefresh: true,
    },
  });

  // A base já está completa. Ela apenas assenta; não foge nem muda de direção.
  timeline.to(images[0], { scale: 1, duration: .8, ease: "none" }, 0);

  // Intervalos largos e regulares: uma imagem termina de nascer antes da próxima.
  const arrivals = [.72, 1.82, 2.92];
  for (let i = 1; i < layers.length; i += 1) {
    const at = arrivals[i - 1];

    // Primeiro a nova fotografia é percebida como uma presença translúcida.
    timeline.to(layers[i], {
      opacity: .38,
      scale: .82,
      duration: .24,
    }, at);
    timeline.to(images[i], {
      opacity: .68,
      scale: 1.035,
      duration: .24,
    }, at);

    // Em seguida ela emerge da mesma origem central e ocupa sua moldura definitiva.
    timeline.to(layers[i], {
      opacity: 1,
      scale: 1,
      duration: .58,
    }, at + .24);
    timeline.to(images[i], {
      opacity: 1,
      scale: 1,
      duration: .58,
    }, at + .24);

    // A imagem anterior permanece integralmente visível como moldura da seguinte.
    timeline.to(layers[i - 1], { opacity: .96, duration: .18 }, at + .12)
      .to(layers[i - 1], { opacity: 1, duration: .34 }, at + .48);
  }

  // Pausa visual: a composição final permanece montada antes do rodapé.
  timeline.to({}, { duration: 1.15 });
  requestAnimationFrame(() => ScrollTriggerApi.refresh());
})();
