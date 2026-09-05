"use strict";

(function initSmoothMotion() {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  if (window.Lenis) {
    const lenis = new Lenis({
      lerp: .075,
      smoothWheel: true,
      wheelMultiplier: .88,
      touchMultiplier: 1.05,
      anchors: true
    });

    document.documentElement.classList.add("lenis");
    lenis.on("scroll", () => window.ScrollTrigger && ScrollTrigger.update());

    if (window.gsap) {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.querySelector(".hero--art");
  if (!hero) return;

  const item = (selector) => hero.querySelector(selector);

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1.35,
      invalidateOnRefresh: true
    }
  })
    .to(item(".hero-art__brand"), {
      yPercent: -45,
      opacity: .35,
      ease: "none"
    }, 0)
    .to(item(".hero-art__arte"), {
      xPercent: -3,
      yPercent: -14,
      ease: "none"
    }, 0)
    .to(item(".hero-art__de"), {
      xPercent: 5,
      yPercent: -22,
      ease: "none"
    }, 0)
    .to(item(".hero-art__habitar"), {
      xPercent: 8,
      yPercent: -17,
      ease: "none"
    }, 0)
    .to(item(".hero-art__wood"), {
      yPercent: -5,
      ease: "none"
    }, 0);

  ScrollTrigger.refresh();
})();
