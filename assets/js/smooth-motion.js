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

  const heroMotion = gsap.timeline({ paused: true })
    .to(item(".hero-art__brand"), { yPercent: -45, opacity: .35, ease: "none" }, 0)
    .to(item(".hero-art__arte"), { xPercent: -3, yPercent: -14, ease: "none" }, 0)
    .to(item(".hero-art__de"), { xPercent: 5, yPercent: -22, ease: "none" }, 0)
    .to(item(".hero-art__habitar"), { xPercent: 8, yPercent: -17, ease: "none" }, 0)
    .to(item(".hero-art__wood"), { yPercent: -5, ease: "none" }, 0);

  /*
   * Hero pinned + próxima seção sobreposta: a tela branca sobe fisicamente
   * sobre a hero, em vez de as duas simplesmente seguirem o fluxo da página.
   */
  if (story) {
    gsap.set(story, { yPercent: 100 });

    const transition = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: hero,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    transition
      .add(heroMotion, 0)
      .to(story, { yPercent: 0, ease: "none", duration: 1 }, 0);
  } else {
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1.35,
      animation: heroMotion,
      invalidateOnRefresh: true
    });
  }

  ScrollTrigger.refresh();
})();