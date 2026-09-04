"use strict";

(() => {
  const root = document.querySelector("[data-staggered-flow-menu]");
  if (!root) return;

  const panel = root.querySelector("[data-flowing-menu-panel]");
  const toggle = root.querySelector("[data-flowing-menu-toggle]");
  const backdrop = root.querySelector("[data-flowing-menu-backdrop]");
  const prelayers = [...root.querySelectorAll("[data-flowing-menu-prelayer]")];
  const itemEls = [...root.querySelectorAll("[data-flowing-menu-item]")];
  const labels = [...root.querySelectorAll(".flowing-menu__label")];
  const socialTitle = root.querySelector(".flowing-menu-socials__title");
  const socialLinks = [...root.querySelectorAll(".flowing-menu-socials a")];
  const icon = root.querySelector(".flowing-menu-toggle__icon");
  const textInner = root.querySelector(".flowing-menu-toggle__text-inner");
  const gsapApi = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const marqueeTweens = [];
  let isOpen = false;
  let busy = false;

  if (!panel || !toggle || !backdrop) return;

  const closedX = () => panel.getBoundingClientRect().width || window.innerWidth;

  const repeatMarqueeParts = item => {
    const inner = item.querySelector("[data-flowing-menu-inner]");
    const original = inner?.querySelector("[data-flowing-menu-part]");
    if (!inner || !original) return;

    inner.querySelectorAll("[data-flowing-menu-part]:not(:first-child)").forEach(part => part.remove());
    const width = Math.max(original.getBoundingClientRect().width, 1);
    const repetitions = Math.max(4, Math.ceil(panel.getBoundingClientRect().width / width) + 2);
    for (let index = 1; index < repetitions; index += 1) inner.appendChild(original.cloneNode(true));
  };

  const startMarquees = () => {
    marqueeTweens.splice(0).forEach(tween => tween.kill());
    itemEls.forEach(item => {
      repeatMarqueeParts(item);
      const inner = item.querySelector("[data-flowing-menu-inner]");
      const firstPart = inner?.querySelector("[data-flowing-menu-part]");
      if (!gsapApi || reducedMotion || !inner || !firstPart) return;
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
    return event.clientY - rect.top < rect.height / 2 ? "top" : "bottom";
  };

  itemEls.forEach(item => {
    const link = item.querySelector(".flowing-menu__link");
    const marquee = item.querySelector(".flowing-menu__marquee");
    const inner = item.querySelector("[data-flowing-menu-inner]");
    if (!link || !marquee || !inner) return;

    link.addEventListener("mouseenter", event => {
      if (!gsapApi || reducedMotion) return;
      const edge = closestEdge(event, item);
      gsapApi.timeline({ defaults: { duration: .65, ease: "expo.out" } })
        .set(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to([marquee, inner], { y: "0%" }, 0);
    });

    link.addEventListener("mouseleave", event => {
      if (!gsapApi || reducedMotion) return;
      const edge = closestEdge(event, item);
      gsapApi.timeline({ defaults: { duration: .58, ease: "expo.inOut" } })
        .to(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .to(inner, { y: edge === "top" ? "101%" : "-101%" }, 0);
    });
  });

  const setAccessibleState = open => {
    root.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("flowing-menu-open", open);
  };

  const openMenu = () => {
    if (busy || isOpen) return;
    busy = true;
    isOpen = true;
    setAccessibleState(true);
    startMarquees();

    if (!gsapApi || reducedMotion) {
      [prelayers, panel].flat().forEach(el => { el.style.transform = "translateX(0)"; });
      backdrop.style.opacity = "1";
      labels.forEach(label => { label.style.transform = "none"; });
      busy = false;
      return;
    }

    gsapApi.killTweensOf([panel, backdrop, icon, textInner, ...prelayers, ...labels, socialTitle, ...socialLinks]);
    gsapApi.set(labels, { yPercent: 140, rotate: 9 });
    if (socialTitle) gsapApi.set(socialTitle, { opacity: 0 });
    gsapApi.set(socialLinks, { y: 18, opacity: 0 });

    const tl = gsapApi.timeline({ onComplete: () => { busy = false; } });
    tl.to(backdrop, { opacity: 1, duration: .35, ease: "power2.out" }, 0);
    prelayers.forEach((layer, index) => {
      tl.fromTo(layer, { x: closedX(), xPercent: 0 }, { x: 0, xPercent: 0, duration: .5, ease: "power4.out" }, index * .07);
    });
    tl.fromTo(panel, { x: closedX(), xPercent: 0 }, { x: 0, xPercent: 0, duration: .65, ease: "power4.out" }, .15);
    tl.to(labels, { yPercent: 0, rotate: 0, duration: .9, ease: "power4.out", stagger: .08 }, .27);
    if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: .45 }, .48);
    tl.to(socialLinks, { y: 0, opacity: 1, duration: .5, stagger: .07, ease: "power3.out" }, .5);
    tl.to(icon, { rotate: 225, duration: .8, ease: "power4.out" }, 0);
    tl.to(textInner, { yPercent: -50, duration: .65, ease: "power4.out" }, 0);
  };

  const closeMenu = () => {
    if (busy || !isOpen) return;
    busy = true;
    isOpen = false;
    setAccessibleState(false);

    if (!gsapApi || reducedMotion) {
      [prelayers, panel].flat().forEach(el => { el.style.transform = "translateX(100%)"; });
      backdrop.style.opacity = "0";
      busy = false;
      return;
    }

    gsapApi.killTweensOf([panel, backdrop, icon, textInner, ...prelayers]);
    gsapApi.timeline({ onComplete: () => { busy = false; } })
      .to([panel, ...prelayers], { x: closedX(), xPercent: 0, duration: .34, ease: "power3.in" }, 0)
      .to(backdrop, { opacity: 0, duration: .28, ease: "power2.in" }, 0)
      .to(icon, { rotate: 0, duration: .35, ease: "power3.inOut" }, 0)
      .to(textInner, { yPercent: 0, duration: .35, ease: "power3.inOut" }, 0);
  };

  toggle.addEventListener("click", () => isOpen ? closeMenu() : openMenu());
  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen) closeMenu();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (isOpen) startMarquees(); }, 160);
  }, { passive: true });

  if (gsapApi) {
    gsapApi.set([panel, ...prelayers], { x: closedX(), xPercent: 0 });
    gsapApi.set(backdrop, { opacity: 0 });
  }
})();
