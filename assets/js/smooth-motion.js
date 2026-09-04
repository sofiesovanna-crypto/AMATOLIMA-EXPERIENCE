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
  const story = document.querySelector(".material-spiral");
  const viewport = story && story.querySelector(".material-spiral__viewport");
  if (!hero || !story || !viewport) return;

  const heroItem = (selector) => hero.querySelector(selector);

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    endTrigger: story,
    end: "top top",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      endTrigger: story,
      end: "top top",
      scrub: 1.45,
      invalidateOnRefresh: true
    }
  })
    .to(heroItem(".hero-art__brand"), { yPercent: -34, opacity: .48, ease: "none" }, 0)
    .to(heroItem(".hero-art__arte"), { xPercent: -2.5, yPercent: -10, ease: "none" }, 0)
    .to(heroItem(".hero-art__de"), { xPercent: 3.5, yPercent: -14, ease: "none" }, 0)
    .to(heroItem(".hero-art__habitar"), { xPercent: 5, yPercent: -11, ease: "none" }, 0)
    .to(heroItem(".hero-art__wood"), { yPercent: -2.5, scale: 1.012, transformOrigin: "center bottom", ease: "none" }, 0);

  gsap.fromTo(
    viewport,
    { yPercent: 7 },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: story,
        start: "top bottom",
        end: "top top",
        scrub: 1.25,
        invalidateOnRefresh: true
      }
    }
  );

  ScrollTrigger.refresh();
})();