"use strict";

(function initProjectIndexReveal(){
  const section=document.querySelector(".project-index");
  if(!section)return;

  const items=[...section.querySelectorAll(".project-index__item")];
  if(!items.length)return;

  const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduceMotion||!window.gsap||!window.ScrollTrigger)return;

  gsap.registerPlugin(ScrollTrigger);
  section.classList.add("has-scroll-reveal");

  items.forEach((item,index)=>{
    gsap.fromTo(item,
      {opacity:0,scale:.7},
      {
        opacity:1,
        scale:1,
        ease:"power2.out",
        scrollTrigger:{
          trigger:item,
          start:`top ${88-index*3}%`,
          end:`top ${66-index*2}%`,
          scrub:.65,
          invalidateOnRefresh:true
        }
      }
    );
  });

  ScrollTrigger.refresh();
})();
