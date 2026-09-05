"use strict";

window.addEventListener("load", async () => {
  const section = document.querySelector("[data-apartment-build]");
  if (!section || !window.gsap || !window.ScrollTrigger) return;

  const canvas = section.querySelector("[data-apartment-canvas]");
  const sceneWrap = section.querySelector("[data-apartment-scene]");
  const fallback = section.querySelector("[data-apartment-fallback]");
  const backdrop = section.querySelector("[data-apartment-backdrop]");
  const pin = section.querySelector(".apartment-build__pin");
  const copy = section.querySelector(".apartment-build__copy");
  const label = section.querySelector("[data-apartment-label]");
  const step = section.querySelector("[data-apartment-step]");
  const progressBar = section.querySelector("[data-apartment-progress]");

  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js");
  } catch (error) {
    canvas.hidden = true;
    fallback.hidden = false;
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (error) {
    canvas.hidden = true;
    fallback.hidden = false;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, .1, 100);
  camera.position.set(13, 11, 15);
  camera.lookAt(0, 0, 0);

  const apartment = new THREE.Group();
  apartment.rotation.y = -.12;
  apartment.position.set(.7, -.55, 0);
  scene.add(apartment);

  const ambient = new THREE.HemisphereLight(0xfff8ed, 0x5a4435, 1.3);
  const sun = new THREE.DirectionalLight(0xffeed0, 3.2);
  sun.position.set(-8, 13, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(ambient, sun);

  const glow = new THREE.PointLight(0xe7bc79, 0, 18, 1.7);
  glow.position.set(-5, 4, 5);
  scene.add(glow);

  const palette = {
    plaster: 0xeee9df,
    plasterWarm: 0xd9cfc0,
    wood: 0x8a5c3a,
    woodLight: 0xb78b62,
    stone: 0xc9b899,
    fabric: 0xb9ad9d,
    fabricLight: 0xded6ca,
    metal: 0x5b493c,
    glass: 0x96a5a4,
    green: 0x65715c,
  };

  const objects = [];
  const makeMaterial = (color, roughness = .72, metalness = 0, extras = {}) => new THREE.MeshStandardMaterial({
    color, roughness, metalness, transparent: true, opacity: 0, ...extras,
  });

  const addObject = (geometry, options = {}) => {
    const {
      position = [0, 0, 0], rotation = [0, 0, 0], color = palette.plaster,
      order = 0, roughness = .72, metalness = 0, edges = true,
      map = null, emissive = 0x000000, emissiveIntensity = 0,
    } = options;
    const material = makeMaterial(color, roughness, metalness, { map, emissive, emissiveIntensity });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    apartment.add(mesh);

    let line = null;
    if (edges) {
      line = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 18),
        new THREE.LineBasicMaterial({ color: 0x4a3a2d, transparent: true, opacity: 0 }),
      );
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      apartment.add(line);
    }
    objects.push({ mesh, line, order, baseScale: mesh.scale.clone() });
    return mesh;
  };

  const box = (size, position, color, order, extra = {}) => addObject(new THREE.BoxGeometry(...size), { position, color, order, ...extra });
  const cylinder = (radius, height, position, color, order, extra = {}) => addObject(new THREE.CylinderGeometry(radius, radius, height, 32), { position, color, order, ...extra });

  // Base arquitetônica e paredes abertas, como uma maquete habitável.
  box([13.6, .22, 9.2], [0, -.16, 0], palette.woodLight, .02);
  for (let x = -6.2; x <= 6.2; x += .52) box([.018, .016, 8.7], [x, -.035, 0], palette.wood, .06, { edges: false });
  box([13.8, 3.9, .2], [0, 1.82, -4.5], palette.plaster, .1);
  box([.2, 3.9, 9.1], [-6.8, 1.82, 0], palette.plasterWarm, .12);

  // Esquadria ampla que define a sala.
  box([8.6, .16, .18], [1.55, 3.35, -4.34], palette.metal, .18);
  box([8.6, .16, .18], [1.55, .55, -4.34], palette.metal, .18);
  for (let x = -2.75; x <= 5.85; x += 1.72) box([.12, 2.95, .16], [x, 1.94, -4.34], palette.metal, .2);
  for (let x = -1.89; x <= 4.99; x += 1.72) box([1.58, 2.65, .035], [x, 1.94, -4.37], palette.glass, .23, { roughness: .18, metalness: .05, edges: false });

  // Cozinha e marcenaria contínua.
  box([.68, 2.7, 3.55], [-6.36, 1.23, -2.35], palette.wood, .28);
  for (let z = -3.75; z <= -.95; z += .7) box([.72, .025, .035], [-5.99, 1.3, z], palette.metal, .3, { edges: false });
  box([4.9, .82, .9], [-3.55, .34, -3.92], palette.plasterWarm, .32);
  box([5.05, .09, 1.04], [-3.55, .81, -3.92], palette.stone, .34);
  for (let x = -5.55; x <= -1.55; x += 1) box([.025, .72, .84], [x, .38, -3.92], palette.metal, .35, { edges: false });
  box([4.25, .84, 1.22], [-2.4, .4, -1.95], palette.woodLight, .38);
  box([4.42, .1, 1.38], [-2.4, .87, -1.95], palette.stone, .4);

  // Banquetas da ilha.
  [-3.5, -2.35, -1.2].forEach((x, index) => {
    cylinder(.28, .12, [x, .7, -.95], palette.fabricLight, .43 + index * .006);
    cylinder(.055, .65, [x, .34, -.95], palette.metal, .43 + index * .006, { metalness: .35 });
  });

  // Sala de jantar.
  box([3.45, .12, 1.35], [2.55, .78, -1.85], palette.stone, .48);
  box([.22, .76, .22], [1.2, .37, -1.85], palette.metal, .49, { metalness: .28 });
  box([.22, .76, .22], [3.9, .37, -1.85], palette.metal, .49, { metalness: .28 });
  [[1.3,-2.75],[2.55,-2.75],[3.8,-2.75],[1.3,-.95],[2.55,-.95],[3.8,-.95]].forEach((p, index) => {
    box([.58, .12, .58], [p[0], .73, p[1]], palette.fabric, .51 + index * .006);
    box([.58, .76, .12], [p[0], 1.08, p[1] + (p[1] < -1.5 ? -.24 : .24)], palette.fabric, .51 + index * .006);
  });

  // Estar orgânico.
  box([4.25, .12, 2.75], [2.7, .01, 2.4], palette.fabricLight, .57);
  box([4.55, .68, 1.18], [3.05, .38, 3.18], palette.fabric, .6);
  box([1.22, .62, 2.75], [5.0, .35, 1.98], palette.fabric, .61);
  box([3.9, .62, .35], [2.95, .76, 3.58], palette.fabricLight, .62);
  box([.38, .68, 2.5], [5.48, .72, 1.98], palette.fabricLight, .63);
  cylinder(.74, .2, [1.34, .2, 1.95], palette.stone, .66);
  cylinder(.48, .28, [.25, .24, 2.5], palette.wood, .67);

  // Painel, luminárias e vegetação.
  box([.32, 2.55, 4.9], [-6.55, 1.12, 2.15], palette.wood, .7);
  box([.12, 1.65, 2.45], [-6.33, 1.35, 2.15], palette.metal, .72);
  [[-.4,2.2,-1.9],[2.55,2.2,-1.9],[4.75,2.45,2.2]].forEach((p, index) => {
    cylinder(.16, .12, p, 0xd2b37e, .75 + index * .01, { metalness: .45 });
    cylinder(.018, 1.15, [p[0], p[1]+.62, p[2]], palette.metal, .75 + index * .01, { metalness: .55 });
  });
  cylinder(.42, .62, [-5.55, .3, 3.78], palette.stone, .8);
  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    const leaf = addObject(new THREE.SphereGeometry(.22, 12, 8), {
      position: [-5.55 + Math.cos(angle) * .42, .95 + (i % 3) * .18, 3.78 + Math.sin(angle) * .42],
      color: palette.green, order: .82 + i * .004, roughness: .9,
    });
    leaf.scale.set(1, 1.9, .65);
    objects[objects.length - 1].baseScale.copy(leaf.scale);
  }

  // Detalhes autorais que aparecem somente quando a maquete ganha materialidade.
  const artworkCanvas = document.createElement("canvas");
  artworkCanvas.width = 512;
  artworkCanvas.height = 700;
  const artworkContext = artworkCanvas.getContext("2d");
  const artworkGradient = artworkContext.createLinearGradient(0, 0, 512, 700);
  artworkGradient.addColorStop(0, "#d8c6ad");
  artworkGradient.addColorStop(.48, "#9b7058");
  artworkGradient.addColorStop(1, "#3b2922");
  artworkContext.fillStyle = artworkGradient;
  artworkContext.fillRect(0, 0, 512, 700);
  artworkContext.strokeStyle = "rgba(246,232,207,.78)";
  artworkContext.lineWidth = 9;
  artworkContext.beginPath();
  artworkContext.moveTo(88, 610);
  artworkContext.bezierCurveTo(158, 498, 92, 322, 254, 128);
  artworkContext.bezierCurveTo(392, 286, 326, 482, 430, 612);
  artworkContext.stroke();
  artworkContext.strokeStyle = "rgba(67,42,31,.72)";
  artworkContext.lineWidth = 5;
  artworkContext.beginPath();
  artworkContext.ellipse(272, 300, 92, 132, -.18, 0, Math.PI * 2);
  artworkContext.moveTo(212, 294);
  artworkContext.quadraticCurveTo(254, 270, 292, 296);
  artworkContext.moveTo(254, 360);
  artworkContext.quadraticCurveTo(292, 386, 330, 350);
  artworkContext.stroke();
  const artworkTexture = new THREE.CanvasTexture(artworkCanvas);
  artworkTexture.colorSpace = THREE.SRGBColorSpace;

  box([.08, 2.72, 2.08], [-6.56, 1.82, .82], 0x4a3326, .86, { roughness: .48 });
  addObject(new THREE.PlaneGeometry(1.84, 2.46), {
    position: [-6.505, 1.82, .82], rotation: [0, Math.PI / 2, 0], color: 0xffffff,
    map: artworkTexture, order: .875, roughness: .62, edges: false,
  });

  // Lustre escultórico: haste em latão e globos leitosos em alturas diferentes.
  box([.055, 1.42, .055], [2.5, 3.45, -1.86], 0x8f7045, .88, { metalness: .72, roughness: .28 });
  const chandelierArms = [[-.86,.03,-.22],[.86,-.12,.2],[-.4,-.3,.54],[.42,-.45,-.52]];
  chandelierArms.forEach((arm, index) => {
    box([Math.abs(arm[0]) * 2 + .12, .045, .045], [2.5 + arm[0] / 2, 2.84 + arm[1], -1.86 + arm[2] / 2], 0x8f7045, .89 + index * .004, { metalness: .72, roughness: .28 });
    addObject(new THREE.SphereGeometry(.2 + (index % 2) * .055, 24, 16), {
      position: [2.5 + arm[0], 2.76 + arm[1], -1.86 + arm[2]], color: 0xffefd0,
      order: .91 + index * .006, roughness: .22, emissive: 0xffc66d, emissiveIntensity: .8,
    });
  });

  // Luz indireta integrada à marcenaria, ao painel e à ilha.
  const ledOptions = { color: 0xffdfaa, order: .9, roughness: .2, emissive: 0xffb85c, emissiveIntensity: 2.4, edges: false };
  box([4.72, .035, .045], [-3.55, 1.12, -3.43], ledOptions.color, ledOptions.order, ledOptions);
  box([4.05, .028, .04], [-2.4, .86, -1.24], ledOptions.color, .915, ledOptions);
  box([.04, 2.22, 4.5], [-6.3, 1.18, 2.15], ledOptions.color, .925, ledOptions);
  const indirectLight = new THREE.PointLight(0xffbd70, 0, 9, 2);
  indirectLight.position.set(-3.8, 1.5, -2.3);
  scene.add(indirectLight);

  // Almofadas, manta e pequenas peças de curadoria.
  const cushionGeometry = new THREE.SphereGeometry(.46, 20, 14);
  [[2.0,.82,3.18,0xc6a47b],[3.05,.84,3.2,0xe6ddd0],[4.05,.82,3.18,0x7c6654]].forEach((item, index) => {
    const cushion = addObject(cushionGeometry, { position: item.slice(0,3), color: item[3], order: .9 + index * .008, roughness: .96 });
    cushion.scale.set(1.2, .78, .34);
    objects[objects.length - 1].baseScale.copy(cushion.scale);
  });
  box([1.28, .045, 1.14], [4.5, .72, 2.78], 0xb5886e, .93, { rotation: [0, .18, -.08], roughness: 1, edges: false });
  cylinder(.18, .42, [1.34, .51, 1.95], 0x716359, .935);
  addObject(new THREE.SphereGeometry(.24, 20, 14), { position: [1.34, .78, 1.95], color: 0xefe7db, order: .94, roughness: .3 });
  cylinder(.13, .34, [.25, .55, 2.5], 0x9a9c88, .945);

  // Trama delicada do tapete e reflexos das esquadrias.
  for (let z = 1.22; z <= 3.55; z += .26) box([3.9, .009, .012], [2.7, .078, z], 0x9e8f7e, .95, { edges: false });
  const windowGlow = addObject(new THREE.PlaneGeometry(8.4, 2.7), {
    position: [1.55, 1.94, -4.25], color: 0xcbd8d5, order: .965, roughness: .08,
    metalness: .05, emissive: 0x6d8791, emissiveIntensity: .2, edges: false,
  });
  windowGlow.material.side = THREE.DoubleSide;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (value) => {
    const x = clamp(value);
    return x * x * (3 - 2 * x);
  };
  const stages = [
    { at: 0, label: "O primeiro traço", step: "01" },
    { at: .25, label: "O apartamento se desenha", step: "02" },
    { at: .52, label: "A forma ganha matéria", step: "03" },
    { at: .78, label: "O espaço toma vida", step: "04" },
  ];

  const resize = () => {
    const width = sceneWrap.clientWidth;
    const height = sceneWrap.clientHeight;
    const aspect = width / Math.max(height, 1);
    const halfWidth = window.innerWidth <= 760 ? 8.3 : 9.1;
    const halfHeight = halfWidth / Math.max(aspect, .1);
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  const renderProgress = (progress) => {
    const linePhase = clamp(progress / .5);
    const materialPhase = smooth((progress - .43) / .38);

    objects.forEach(({ mesh, line, order, baseScale }) => {
      const reveal = smooth((linePhase - order * .7) / .2);
      const solidReveal = smooth((materialPhase - order * .28) / .24);
      const scale = .02 + reveal * .98;
      mesh.scale.copy(baseScale).multiplyScalar(scale);
      mesh.material.opacity = solidReveal;
      mesh.visible = reveal > .002;
      if (line) {
        line.scale.copy(mesh.scale);
        line.material.opacity = reveal * (1 - materialPhase * .92);
        line.visible = reveal > .002;
      }
    });

    apartment.rotation.y = -.28 + progress * .3;
    apartment.rotation.x = -.025 + progress * .035;
    camera.position.x = 13 - progress * 1.6;
    camera.position.z = 15 + progress * 1.1;
    camera.lookAt(.4, .25, 0);
    glow.intensity = smooth((progress - .67) / .2) * 5;
    indirectLight.intensity = smooth((progress - .72) / .18) * 4.2;
    glow.position.x = -6 + progress * 13;
    sun.intensity = 1.1 + materialPhase * 2.6;
    renderer.render(scene, camera);
  };

  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.set(copy, { opacity: 0, y: 24 });
  window.gsap.to(copy, { opacity: 1, y: 0, duration: .8, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 82%" } });

  window.ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: 1.45,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;
      renderProgress(p);
      window.gsap.set(progressBar, { scaleX: p });
      const dark = smooth((p - .43) / .37);
      const r = Math.round(241 + (28 - 241) * dark);
      const g = Math.round(241 + (23 - 241) * dark);
      const b = Math.round(241 + (23 - 241) * dark);
      backdrop.style.backgroundColor = `rgb(${r},${g},${b})`;
      pin.style.color = dark > .54 ? "#efe7db" : "#30251d";
      const current = [...stages].reverse().find((item) => p >= item.at) || stages[0];
      if (label.textContent !== current.label) {
        label.textContent = current.label;
        step.textContent = current.step;
      }
    },
  });

  window.addEventListener("resize", resize, { passive: true });
  resize();
  renderProgress(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0);
  window.ScrollTrigger.refresh();
});
