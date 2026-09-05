"use strict";

(function insertMirroredEditorialFoundations() {
  const apartment = document.querySelector("[data-apartment-build]");
  if (!apartment || document.querySelector("[data-editorial-mirror]")) return;

  const text = "A matéria orienta cada decisão. Luz, textura e proporção trabalham juntas para criar espaços precisos, acolhedores e construídos para permanecer.";
  let characterIndex = 0;
  const words = text.split(" ").map((word) => {
    const characters = Array.from(word).map((character) => {
      const index = characterIndex++;
      return `<span class="editorial-foundations__character" style="--shine-index:${index}">${character}</span>`;
    }).join("");
    characterIndex++;
    return `<span class="editorial-foundations__word">${characters}</span>`;
  }).join(" ");

  const section = document.createElement("section");
  section.className = "editorial-foundations editorial-foundations--mirror";
  section.setAttribute("data-editorial-mirror", "");
  section.innerHTML = `
    <div class="editorial-foundations__layout">
      <figure class="editorial-foundations__image-wrap">
        <img src="assets/images/hero-mask-mobile.png" alt="Detalhe de matéria natural em composição vertical" loading="lazy" />
      </figure>
      <div class="editorial-foundations__copy">
        <p class="editorial-foundations__text" data-editorial-scroll-reveal>${words}</p>
      </div>
    </div>`;

  apartment.insertAdjacentElement("afterend", section);
})();
