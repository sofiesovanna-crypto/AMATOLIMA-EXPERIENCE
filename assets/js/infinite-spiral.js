"use strict";

(function initMaterialScrollStory() {
  const roots = document.querySelectorAll("[data-material-spiral]");
  if (!roots.length) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

  roots.forEach((root) => {
    const section = root.closest("[data-material-scroll]");
    const cards = Array.from(root.querySelectorAll("[data-spiral-card]"));
    const textElement = section?.querySelector("[data-spiral-text]");
    const stepElement = section?.querySelector("[data-spiral-step]");
    if (!section || !cards.length || !textElement) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let progress = 0;
    let targetProgress = 0;
    let previousTime = performance.now();
    let frameId = 0;
    let activeTextIndex = -1;
    let textChangeTimer = 0;
    let dragging = false;
    let lastPointerY = 0;
    let bounds = root.getBoundingClientRect();

    const renderText = (text) => {
      const fragment = document.createDocumentFragment();

      Array.from(text).forEach((character, index) => {
        const span = document.createElement("span");
        span.className = character === " " ? "material-spiral__space" : "material-spiral__character";
        span.style.setProperty("--character-index", String(index));
        span.textContent = character === " " ? "\u00a0" : character;
        span.setAttribute("aria-hidden", "true");
        fragment.appendChild(span);
      });

      textElement.replaceChildren(fragment);
      textElement.setAttribute("aria-label", text);
    };

    const setActiveText = (index, immediate = false) => {
      if (index === activeTextIndex) return;
      activeTextIndex = index;
      const nextText = cards[index]?.dataset.spiralLabel || "";

      if (stepElement) {
        stepElement.textContent = String(index + 1).padStart(2, "0");
      }

      window.clearTimeout(textChangeTimer);
      if (immediate || reduceMotion.matches) {
        textElement.classList.remove("is-entering", "is-exiting");
        renderText(nextText);
        return;
      }

      textElement.classList.remove("is-entering");
      textElement.classList.add("is-exiting");

      textChangeTimer = window.setTimeout(() => {
        renderText(nextText);
        textElement.classList.remove("is-exiting");
        textElement.classList.add("is-entering");

        requestAnimationFrame(() => requestAnimationFrame(() => {
          textElement.classList.remove("is-entering");
        }));
      }, 350);
    };

    const syncProgressToPage = () => {
      if (dragging) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const localProgress = clamp((window.scrollY - sectionTop) / travel, 0, 1);
      targetProgress = localProgress * (cards.length - 1);
    };

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
      syncProgressToPage();
    });
    resizeObserver.observe(root);
    resizeObserver.observe(section);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      section.classList.toggle("is-in-view", entry.isIntersecting);
      if (entry.isIntersecting) syncProgressToPage();
    }, { threshold: .01 });
    intersectionObserver.observe(section);

    window.addEventListener("scroll", syncProgressToPage, { passive: true });
    window.addEventListener("resize", syncProgressToPage, { passive: true });

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
      const pointerDelta = event.clientY - lastPointerY;
      lastPointerY = event.clientY;
      targetProgress = clamp(targetProgress + pointerDelta / 92, 0, cards.length - 1);
    });

    root.addEventListener("pointerup", stopDrag);
    root.addEventListener("pointercancel", stopDrag);

    setActiveText(0, true);
    syncProgressToPage();

    const render = (time) => {
      const delta = Math.min((time - previousTime) / 1000, .05);
      previousTime = time;
      const follow = 1 - Math.exp(-delta * (dragging ? 20 : 9));
      progress += (targetProgress - progress) * follow;

      const count = cards.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const mobile = window.innerWidth <= 760;
      const radius = mobile ? 52 : 125;
      const spacing = mobile ? Math.min(86, height * .115) : Math.min(118, height * .13);
      const cardsPerTurn = mobile ? 5 : 6;
      const activeIndex = clamp(Math.round(progress), 0, count - 1);

      setActiveText(activeIndex);

      cards.forEach((card, index) => {
        let offset = index - progress;
        offset = modulo(offset + half, count) - half;

        const angle = offset * (360 / cardsPerTurn) - 24;
        const radians = angle * Math.PI / 180;
        const x = Math.sin(radians) * radius;
        const z = Math.cos(radians) * radius;
        const y = -offset * spacing;
        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const depth = (z / Math.max(radius, 1) + 1) / 2;
        const depthScale = .72 + depth * .48;
        const focusScale = 1 + Math.max(0, 1 - Math.abs(offset) / 2.8) * .12;
        const opacity = clamp(1 - Math.max(0, edge - .68) / .32, 0, 1);
        const blur = Math.max(0, edge - .58) * 8;

        card.classList.toggle("is-active", index === activeIndex);
        card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateZ(${Math.sin(radians) * 2.5}deg) scale(${depthScale * focusScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : "none";
        card.style.zIndex = String(Math.round(depth * 1000));
        card.style.pointerEvents = opacity > .3 ? "auto" : "none";
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    window.addEventListener("pagehide", () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", syncProgressToPage);
      window.removeEventListener("resize", syncProgressToPage);
      window.clearTimeout(textChangeTimer);
    }, { once: true });
  });
})();
