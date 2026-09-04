"use strict";

(function initMaskedProjectHeading() {
  const headings = document.querySelectorAll("[data-masked-heading]");
  if (!headings.length) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  headings.forEach((heading) => {
    if (reduced) {
      heading.style.clipPath = "none";
      return;
    }

    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let frame = 0;
    let time = 0;

    const render = () => {
      time += .008;
      const idleX = Math.sin(time) * 1.2;
      const idleY = Math.cos(time * .78) * .7;
      currentX += (targetX + idleX - currentX) * .055;
      currentY += (targetY + idleY - currentY) * .055;
      heading.style.setProperty("--mask-x", currentX.toFixed(2) + "%");
      heading.style.setProperty("--mask-y", currentY.toFixed(2) + "%");
      frame = requestAnimationFrame(render);
    };

    heading.addEventListener("pointermove", (event) => {
      const bounds = heading.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
      const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1);
      targetX = 50 + (x - .5) * 5;
      targetY = 50 + (y - .5) * 3;
    });

    heading.addEventListener("pointerleave", () => {
      targetX = 50;
      targetY = 50;
    });

    heading.style.clipPath = "none";

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        heading,
        { opacity: .38, backgroundSize: "150% auto" },
        {
          opacity: 1,
          backgroundSize: "132% auto",
          duration: 1.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            once: true
          }
        }
      );
    }

    frame = requestAnimationFrame(render);
    addEventListener("pagehide", () => cancelAnimationFrame(frame), { once:true });
  });
})();