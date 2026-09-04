"use strict";

(function initMaskedProjectHeading() {
  const headings = document.querySelectorAll("[data-masked-heading]");
  if (!headings.length) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  headings.forEach((heading) => {
    heading.style.clipPath = "none";
    if (reduced) return;

    const source = heading.dataset.maskedVideo;
    if (!source) return;

    const canvas = document.createElement("canvas");
    canvas.className = "masked-heading__canvas";
    canvas.setAttribute("aria-hidden", "true");
    heading.appendChild(canvas);

    const context = canvas.getContext("2d");
    const video = document.createElement("video");
    video.src = source;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    let frame = 0;
    let ready = false;

    const fitCanvas = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(heading.clientWidth * dpr));
      const height = Math.max(1, Math.round(heading.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      return dpr;
    };

    const drawTextMask = (dpr) => {
      const styles = getComputedStyle(heading);
      const size = parseFloat(styles.fontSize) * dpr;
      const lineHeight = parseFloat(styles.lineHeight) * dpr || size;
      const maxWidth = canvas.width * .96;
      const words = heading.childNodes[0]?.textContent.trim().split(/\s+/) || [];
      const lines = [];
      let line = "";

      context.font = `${styles.fontWeight} ${size}px ${styles.fontFamily}`;
      words.forEach((word) => {
        const test = line ? line + " " + word : word;
        if (line && context.measureText(test).width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#000";
      const total = Math.max(lineHeight, lines.length * lineHeight);
      const firstY = canvas.height / 2 - total / 2 + lineHeight / 2;
      lines.forEach((value, index) => context.fillText(value, canvas.width / 2, firstY + index * lineHeight));
    };

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!ready || video.readyState < 2) return;

      const dpr = fitCanvas();
      const vw = video.videoWidth || 16;
      const vh = video.videoHeight || 9;
      const scale = Math.max(canvas.width / vw, canvas.height / vh) * 1.08;
      const width = vw * scale;
      const height = vh * scale;
      const drift = Math.sin(performance.now() * .00012) * canvas.width * .018;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.filter = "grayscale(1) contrast(1.08) brightness(.88)";
      context.drawImage(video, (canvas.width - width) / 2 + drift, (canvas.height - height) / 2, width, height);
      context.filter = "none";
      context.globalCompositeOperation = "destination-in";
      drawTextMask(dpr);
      context.restore();

      if (!heading.classList.contains("has-video-mask")) {
        heading.classList.add("has-video-mask");
      }
    };

    video.addEventListener("canplay", () => {
      ready = true;
      video.play().catch(() => {});
    }, { once:true });

    video.addEventListener("error", () => {
      ready = false;
      heading.classList.remove("has-video-mask");
      canvas.remove();
      cancelAnimationFrame(frame);
    }, { once:true });

    frame = requestAnimationFrame(render);
    addEventListener("pagehide", () => {
      cancelAnimationFrame(frame);
      video.pause();
      video.removeAttribute("src");
    }, { once:true });
  });
})();