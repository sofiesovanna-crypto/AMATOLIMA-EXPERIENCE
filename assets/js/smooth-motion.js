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

  if (story) {
    const spiralStage = story.querySelector(".material-spiral__stage");
    const spiralTitle = story.querySelector(".material-spiral__title");
    const enteringElements = [spiralStage, spiralTitle].filter(Boolean);

    if (enteringElements.length) {
      gsap.fromTo(
        enteringElements,
        { y: "-46vh" },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: story,
            start: () => innerWidth <= 760 ? "top 22%" : "top 31%",
            end: "top top",
            scrub: 1.25,
            invalidateOnRefresh: true
          }
        }
      );
    }
  }

  ScrollTrigger.refresh();
})();
