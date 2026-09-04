"use strict";

(() => {
  const panel = document.querySelector("[data-flowing-menu-panel]");
  const openButton = document.querySelector("[data-flowing-menu-open]");
  const closeButton = document.querySelector("[data-flowing-menu-close]");
  if (!panel || !openButton || !closeButton) return;

  const gsapApi = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuItems = [...panel.querySelectorAll("[data-flowing-menu-item]")];
  const marqueeTweens = [];
  let lastFocusedElement = null;

  const repeatMarqueeParts = item => {
    const inner = item.querySelector("[data-flowing-menu-inner]");
    const original = inner?.querySelector("[data-flowing-menu-part]");
    if (!inner || !original) return;

    inner.querySelectorAll("[data-flowing-menu-part]:not(:first-child)").forEach(part => part.remove());
    const width = Math.max(original.getBoundingClientRect().width, 1);
    const repetitions = Math.max(4, Math.ceil(window.innerWidth / width) + 2);

    for (let index = 1; index < repetitions; index += 1) {
      inner.appendChild(original.cloneNode(true));
    }
  };

  const startMarquees = () => {
    marqueeTweens.splice(0).forEach(tween => tween.kill());
    menuItems.forEach(item => {
      repeatMarqueeParts(item);
      const inner = item.querySelector("[data-flowing-menu-inner]");
      const firstPart = inner?.querySelector("[data-flowing-menu-part]");
      if (!gsapApi || !inner || !firstPart || reducedMotion) return;

      marqueeTweens.push(gsapApi.to(inner, {
        x: -firstPart.getBoundingClientRect().width,
        duration: Number(item.dataset.speed || 15),
        ease: "none",
        repeat: -1
      }));
    });
  };

  const closestEdge = (event, item) => {
    const rect = item.getBoundingClientRect();
    const y = event.clientY - rect.top;
    return y < rect.height / 2 ? "top" : "bottom";
  };

  menuItems.forEach(item => {
    const link = item.querySelector(".flowing-menu__link");
    const marquee = item.querySelector(".flowing-menu__marquee");
    const inner = item.querySelector("[data-flowing-menu-inner]");
    if (!link || !marquee || !inner) return;

    link.addEventListener("mouseenter", event => {
      if (!gsapApi || reducedMotion) return;
      const edge = closestEdge(event, item);
      gsapApi.timeline({ defaults: { duration: .7, ease: "expo.out" } })
        .set(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to([marquee, inner], { y: "0%" }, 0);
    });

    link.addEventListener("mouseleave", event => {
      if (!gsapApi || reducedMotion) return;
      const edge = closestEdge(event, item);
      gsapApi.timeline({ defaults: { duration: .62, ease: "expo.inOut" } })
        .to(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .to(inner, { y: edge === "top" ? "101%" : "-101%" }, 0);
    });
  });

  const openMenu = () => {
    lastFocusedElement = document.activeElement;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("flowing-menu-open");
    startMarquees();

    if (gsapApi && !reducedMotion) {
      gsapApi.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: .65, ease: "power3.out" });
    } else {
      panel.style.opacity = "1";
      panel.style.visibility = "visible";
    }
    closeButton.focus();
  };

  const closeMenu = () => {
    const finish = () => {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      openButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("flowing-menu-open");
      lastFocusedElement?.focus();
    };

    if (gsapApi && !reducedMotion) {
      gsapApi.to(panel, { autoAlpha: 0, duration: .45, ease: "power2.inOut", onComplete: finish });
    } else {
      panel.style.opacity = "0";
      panel.style.visibility = "hidden";
      finish();
    }
  };

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);

  panel.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
    if (event.key !== "Tab") return;

    const focusable = [...panel.querySelectorAll('a[href],button:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (panel.classList.contains("is-open")) startMarquees();
    }, 160);
  }, { passive: true });
})();
