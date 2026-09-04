"use strict";

(function initMaterialSpiral() {
  const roots = document.querySelectorAll("[data-material-spiral]");
  if (!roots.length) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

  roots.forEach((root) => {
    const cards = Array.from(root.querySelectorAll("[data-spiral-card]"));
    if (!cards.length) return;

    let progress = 0;
    let targetProgress = 0;
    let autoVelocity = 0;
    let previousTime = performance.now();
    let frameId = 0;
    let visible = true;
    let hovered = false;
    let dragging = false;
    let lastPointerY = 0;
    let lastScrollY = window.scrollY;
    let bounds = root.getBoundingClientRect();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: .04 });
    intersectionObserver.observe(root);

    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScrollY;
      lastScrollY = next;
      if (visible && delta) targetProgress += clamp(delta / 260, -1.1, 1.1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
    };

    root.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      dragging = true;
      lastPointerY = event.clientY;
      targetProgress = progress;
      root.classList.add("is-dragging");
      root.setPointerCapture(event.pointerId);
    });

    root.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientY - lastPointerY;
      lastPointerY = event.clientY;
      targetProgress -= delta / 78;
    });

    root.addEventListener("pointerup", stopDrag);
    root.addEventListener("pointercancel", stopDrag);
    root.addEventListener("mouseenter", () => { hovered = true; });
    root.addEventListener("mouseleave", () => { hovered = false; });

    const render = (time) => {
      const delta = Math.min((time - previousTime) / 1000, .05);
      previousTime = time;

      const desiredSpeed = visible && !reduceMotion.matches && !dragging && !hovered ? .32 : 0;
      autoVelocity += (desiredSpeed - autoVelocity) * (1 - Math.exp(-delta * 5));
      targetProgress += autoVelocity * delta;
      progress += (targetProgress - progress) * (1 - Math.exp(-delta * (dragging ? 20 : 9)));

      const count = cards.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const mobile = width <= 760;
      const radius = 125;
      const spacing = mobile ? Math.min(92, height * .12) : Math.min(118, height * .13);
      const cardsPerTurn = mobile ? 6 : 7;

      cards.forEach((card, index) => {
        let offset = index - progress;
        offset = modulo(offset + half, count) - half;

        const angle = offset * (360 / cardsPerTurn) - 24;
        const radians = angle * Math.PI / 180;
        const x = Math.sin(radians) * radius;
        const z = Math.cos(radians) * radius;
        const y = offset * spacing;
        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const depth = (z / Math.max(radius, 1) + 1) / 2;
        const depthScale = .72 + depth * .48;
        const focusScale = 1 + Math.max(0, 1 - Math.abs(offset) / 3.6) * .12;
        const opacity = clamp(1 - Math.max(0, edge - .62) / .38, 0, 1);
        const blur = Math.max(0, edge - .56) * 10;
        const layer = Math.round(depth * 1000);

        card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateZ(${Math.sin(radians) * 3}deg) scale(${depthScale * focusScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : "none";
        card.style.zIndex = String(layer);
        card.style.pointerEvents = opacity > .3 ? "auto" : "none";
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    window.addEventListener("pagehide", () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    }, { once: true });
  });
})();
