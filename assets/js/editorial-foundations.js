"use strict";

(function initEditorialFoundationsReveal() {
  const blocks = document.querySelectorAll("[data-editorial-scroll-reveal]");
  if (!blocks.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapApi = window.gsap;
  const scrollTriggerApi = window.ScrollTrigger;

  if (reduceMotion || !gsapApi || !scrollTriggerApi) {
    blocks.forEach((block) => {
      block.querySelectorAll(".editorial-foundations__word").forEach((word) => {
        word.style.opacity = "1";
      });
    });
    return;
  }

  gsapApi.registerPlugin(scrollTriggerApi);

  blocks.forEach((block) => {
    const words = block.querySelectorAll(".editorial-foundations__word");
    if (!words.length) return;

    gsapApi.fromTo(
      words,
      { opacity: 0, willChange: "opacity" },
      {
        opacity: 1,
        ease: "none",
        stagger: .055,
        scrollTrigger: {
          trigger: block,
          start: "top 84%",
          end: "bottom 56%",
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      }
    );

    const section = block.closest(".editorial-foundations");
    const imageWrap = section?.querySelector(".editorial-foundations__image-wrap");
    const image = imageWrap?.querySelector("img");

    if (imageWrap && image) {
      gsapApi.fromTo(
        imageWrap,
        {
          opacity: .76,
          clipPath: "inset(0 0 16% 0)",
          willChange: "opacity, clip-path",
        },
        {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: {
            trigger: imageWrap,
            start: "top 92%",
            end: "top 24%",
            scrub: 1.3,
            invalidateOnRefresh: true,
          },
        }
      );

      gsapApi.fromTo(
        image,
        { scale: 1.025, transformOrigin: "50% 50%" },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrap,
            start: "top 92%",
            end: "top 24%",
            scrub: 1.3,
            invalidateOnRefresh: true,
          },
        }
      );
    }
  });
})();
