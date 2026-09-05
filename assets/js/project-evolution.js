"use strict";

window.addEventListener("load", async () => {
  const section = document.querySelector("[data-project-evolution]");
  if (!section || !window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pin = section.querySelector(".project-evolution__pin");
  const background = section.querySelector(".project-evolution__background");
  const copy = section.querySelector(".project-evolution__copy");
  const frame = section.querySelector("[data-evolution-frame]");
  const before = section.querySelector('[data-evolution-layer="before"]');
  const render = section.querySelector('[data-evolution-layer="render"]');
  const finalImage = section.querySelector('[data-evolution-layer="final"]');
  const plan = section.querySelector("[data-evolution-plan]");
  const vectorLines = plan.querySelectorAll(".project-evolution__vector-line");
  const label = section.querySelector("[data-evolution-label]");
  const progress = section.querySelector("[data-evolution-progress]");
  const reflection = section.querySelector("[data-evolution-reflection]");

  window.gsap.registerPlugin(window.ScrollTrigger);

  let drawingAnimation = null;

  try {
    const { animate, svg, stagger } = await import("https://cdn.jsdelivr.net/npm/animejs@4.1.3/+esm");
    const drawables = svg.createDrawable(vectorLines);
    drawingAnimation = animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "linear",
      duration: 1600,
      delay: stagger(34),
      autoplay: false,
    });
  } catch (error) {
    vectorLines.forEach((line) => {
      const length = typeof line.getTotalLength === "function" ? line.getTotalLength() : 1000;
      window.gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    });
  }

  const setLabel = (text) => () => { label.textContent = text; };
  const timeline = window.gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.35,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        window.gsap.set(progress, { scaleX: self.progress });
        const drawingProgress = Math.max(0, Math.min(1, (self.progress - .17) / .25));

        if (drawingAnimation) {
          drawingAnimation.seek(drawingAnimation.duration * drawingProgress);
        } else {
          window.gsap.set(vectorLines, { strokeDashoffset: (index, target) => {
            const length = typeof target.getTotalLength === "function" ? target.getTotalLength() : 1000;
            return length * (1 - drawingProgress);
          }});
        }
      },
    },
  });

  timeline
    .fromTo(frame, { scale: .88, yPercent: 8 }, { scale: 1, yPercent: 0, duration: .65 }, 0)
    .fromTo(copy, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .45 }, 0)
    .to(before.querySelector("img"), { scale: 1.045, duration: 1.15 }, 0)
    .add(setLabel("Leitura do existente"), .62)
    .to(plan, { opacity: 1, duration: .35 }, .7)
    .to(before, { opacity: .14, duration: .4 }, .7)
    .add(setLabel("Desenho arquitetônico"), .92)
    .to(background, { backgroundColor: "#f4f4f4", duration: .9 }, .72)
    .to(plan, { opacity: 0, duration: .38 }, 1.78)
    .to(before, { opacity: 0, duration: .3 }, 1.78)
    .to(render, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: .78 }, 1.76)
    .add(setLabel("Projeto em três dimensões"), 1.9)
    .to(background, { backgroundColor: "#716359", duration: .85 }, 1.8)
    .to(pin, { color: "#f0e6db", duration: .65 }, 1.84)
    .to(frame, { scale: 1.025, duration: .75 }, 2.15)
    .to(finalImage, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: .92 }, 2.72)
    .to(render, { opacity: 0, duration: .62 }, 2.86)
    .add(setLabel("Arquitetura realizada"), 2.85)
    .to(background, { backgroundColor: "#261c12", duration: .95 }, 2.7)
    .fromTo(reflection, { xPercent: 0, opacity: 0 }, { xPercent: 1080, opacity: .56, duration: .72 }, 3.05)
    .to(reflection, { opacity: 0, duration: .18 }, 3.68)
    .to(finalImage.querySelector("img"), { scale: 1.045, duration: 1.05 }, 2.78)
    .to(copy, { y: -24, opacity: .78, duration: .6 }, 3.45);

  window.ScrollTrigger.refresh();
});
