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
    .to(item(".hero-art__brand"), { yPercent: -45, opacity: .35, ease: "none" }, 0)
    .to(item(".hero-art__arte"), { xPercent: -3, yPercent: -14, ease: "none" }, 0)
    .to(item(".hero-art__de"), { xPercent: 5, yPercent: -22, ease: "none" }, 0)
    .to(item(".hero-art__habitar"), { xPercent: 8, yPercent: -17, ease: "none" }, 0)
    .to(item(".hero-art__wood"), { yPercent: -5, ease: "none" }, 0);

  /* ScrollTrigger controla a passagem para a segunda screen como scrub real. */
  if (story) {
    const viewport = story.querySelector(".material-spiral__viewport");
    const spiralStage = story.querySelector(".material-spiral__stage");
    const spiralTitle = story.querySelector(".material-spiral__title");
    const progress = story.querySelector(".material-spiral__progress");
    const enteringElements = [spiralStage, spiralTitle, progress].filter(Boolean);

    if (viewport && enteringElements.length) {
      gsap.set(enteringElements, { autoAlpha: 0 });

      const storyEntrance = gsap.timeline({ paused: true })
        .fromTo(
          enteringElements,
          { autoAlpha: 0, yPercent: 18 },
          { autoAlpha: 1, yPercent: 0, stagger: .035, ease: "none", duration: 1 },
          0
        );

      ScrollTrigger.create({
        trigger: story,
        start: "top bottom",
        end: "top top",
        animation: storyEntrance,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
    }
  }

  ScrollTrigger.refresh();
})();