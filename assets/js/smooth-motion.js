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

  /* Hero keeps exactly its existing scroll motion. */
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

  /*
   * The supplied sticky-panel effect is intentionally scoped to section 2.
   * Before the material section reaches the top edge it remains ordinary page
   * content. At top top, its own sticky viewport takes over. We do NOT pin or
   * translate the hero and do NOT move the whole material section over it.
   */
  if (story) {
    const viewport = story.querySelector(".material-spiral__viewport");

    ScrollTrigger.create({
      trigger: story,
      start: "top top",
      end: "bottom bottom",
      onEnter: () => story.classList.add("is-sticky-scroll-active"),
      onEnterBack: () => story.classList.add("is-sticky-scroll-active"),
      onLeave: () => story.classList.remove("is-sticky-scroll-active"),
      onLeaveBack: () => story.classList.remove("is-sticky-scroll-active"),
      invalidateOnRefresh: true
    });

    if (viewport) {
      gsap.set(viewport, { clearProps: "transform" });
    }
  }

  ScrollTrigger.refresh();
})();