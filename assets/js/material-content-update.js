"use strict";

(function updateMaterialContent(){
  const section=document.querySelector("[data-material-scroll]");
  if(!section)return;

  const stage=section.querySelector(".material-spiral__stage");
  const cards=[...section.querySelectorAll("[data-spiral-card]")];
  if(!stage||!cards.length)return;

  const firstImage=cards[0].querySelector("img");
  if(firstImage){
    firstImage.src="assets/images/sections-home/28152.jpg";
    firstImage.alt="Composição que representa a matéria antes do ativo imobiliário";
  }

  const hijau=document.createElement("figure");
  hijau.className="material-spiral__card";
  hijau.setAttribute("data-spiral-card","");
  hijau.setAttribute("data-spiral-label","PEDRA NATURAL HIJAU");
  hijau.innerHTML='<img src="assets/images/sections-home/31868.jpg" alt="Detalhe de pedra natural Hijau" loading="lazy" draggable="false" />';
  stage.appendChild(hijau);

  const projectImages=[...section.querySelectorAll("[data-card-project]")];
  if(projectImages[2]){
    projectImages[2].src="assets/images/sections-home/12548.webp";
    projectImages[2].alt="Projeto Amato Lima — detalhe arquitetônico";
  }
})();
