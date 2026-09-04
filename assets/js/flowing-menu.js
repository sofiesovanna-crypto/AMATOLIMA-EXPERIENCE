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
  const icon = root.querySelector(".flowing-menu-toggle__icon");
  const textInner = root.querySelector(".flowing-menu-toggle__text-inner");
  const gsapApi = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const marqueeTweens = new WeakMap();
  let isOpen = false;
  let busy = false;

  if (!panel || !toggle || !backdrop) return;

  const closedY = () => -(panel.getBoundingClientRect().height || window.innerHeight);

  const repeatMarqueeParts = item => {
    const inner = item.querySelector("[data-flowing-menu-inner]");
    const original = inner?.querySelector("[data-flowing-menu-part]");
    if (!inner || !original) return;

    inner.querySelectorAll("[data-flowing-menu-part]:not(:first-child)").forEach(part => part.remove());
    const width = Math.max(original.getBoundingClientRect().width, 1);
    const repetitions = Math.max(4, Math.ceil(panel.getBoundingClientRect().width / width) + 2);
    for (let index = 1; index < repetitions; index += 1) inner.appendChild(original.cloneNode(true));
  };

  const startItemMarquee = item => {
    repeatMarqueeParts(item);
    const inner = item.querySelector("[data-flowing-menu-inner]");
    const firstPart = inner?.querySelector("[data-flowing-menu-part]");
    marqueeTweens.get(item)?.kill();
    if (!gsapApi || reducedMotion || !inner || !firstPart) return;

    gsapApi.set(inner, { x: 0 });
    marqueeTweens.set(item, gsapApi.to(inner, {
      x: -firstPart.getBoundingClientRect().width,
      duration: Number(item.dataset.speed || 15),
      ease: "none",
      repeat: -1
    }));
  };

  const stopItemMarquee = item => {
    const tween = marqueeTweens.get(item);
    if (tween) {
      tween.kill();
      marqueeTweens.delete(item);
    }
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

    const activate = event => {
      if (!root.classList.contains("is-open")) return;
      startItemMarquee(item);
      if (!gsapApi || reducedMotion) {
        marquee.style.transform = "translateY(0)";
        inner.style.transform = "translateY(0)";
        return;
      }
      const edge = closestEdge(event, item);
      gsapApi.killTweensOf([marquee, inner]);
      gsapApi.timeline({ defaults: { duration: .62, ease: "expo.out" } })
        .set(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to([marquee, inner], { y: "0%" }, 0);
    };

    const deactivate = event => {
      stopItemMarquee(item);
      if (!gsapApi || reducedMotion) {
        marquee.style.transform = "translateY(101%)";
        inner.style.transform = "";
        return;
      }
      const edge = closestEdge(event, item);
      gsapApi.killTweensOf([marquee, inner]);
      gsapApi.timeline({
        defaults: { duration: .5, ease: "expo.inOut" },
        onComplete: () => gsapApi.set(inner, { x: 0 })
      })
        .to(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .to(inner, { y: edge === "top" ? "101%" : "-101%" }, 0);
    };

    item.addEventListener("pointerenter", activate);
    item.addEventListener("pointerleave", deactivate);
    link.addEventListener("pointerdown", activate);
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
    itemEls.forEach(repeatMarqueeParts);

    if (!gsapApi || reducedMotion) {
      [...prelayers, panel].forEach(el => { el.style.transform = "translateY(0)"; });
      labels.forEach(label => { label.style.transform = "none"; });
      busy = false;
      return;
    }

    gsapApi.killTweensOf([panel, icon, textInner, ...prelayers, ...labels]);
    gsapApi.set(labels, { yPercent: 125, rotate: 7 });

    const tl = gsapApi.timeline({ onComplete: () => { busy = false; } });
    prelayers.forEach((layer, index) => {
      tl.fromTo(layer, { y: closedY(), xPercent: 0 }, { y: 0, duration: .48, ease: "power4.out" }, index * .07);
    });
    tl.fromTo(panel, { y: closedY(), xPercent: 0 }, { y: 0, duration: .62, ease: "power4.out" }, .14);
    tl.to(labels, { yPercent: 0, rotate: 0, duration: .78, ease: "power4.out", stagger: .065 }, .24);
    tl.to(icon, { rotate: 225, duration: .75, ease: "power4.out" }, 0);
    tl.to(textInner, { yPercent: -50, duration: .62, ease: "power4.out" }, 0);
  };

  const closeMenu = () => {
    if (busy || !isOpen) return;
    busy = true;
    isOpen = false;
    itemEls.forEach(item => {
      stopItemMarquee(item);
      const marquee = item.querySelector(".flowing-menu__marquee");
      const inner = item.querySelector("[data-flowing-menu-inner]");
      if (gsapApi && marquee && inner) gsapApi.set([marquee, inner], { y: "101%" });
    });
    setAccessibleState(false);

    if (!gsapApi || reducedMotion) {
      [...prelayers, panel].forEach(el => { el.style.transform = "translateY(-100%)"; });
      busy = false;
      return;
    }

    gsapApi.killTweensOf([panel, icon, textInner, ...prelayers]);
    gsapApi.timeline({ onComplete: () => { busy = false; } })
      .to([panel, ...prelayers], { y: closedY(), duration: .34, ease: "power3.in" }, 0)
      .to(icon, { rotate: 0, duration: .34, ease: "power3.inOut" }, 0)
      .to(textInner, { yPercent: 0, duration: .34, ease: "power3.inOut" }, 0);
  };

  toggle.addEventListener("click", () => isOpen ? closeMenu() : openMenu());
  backdrop.addEventListener("click", closeMenu);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen) closeMenu();
  });

  if (gsapApi) gsapApi.set([panel, ...prelayers], { y: closedY(), xPercent: 0 });
})();
