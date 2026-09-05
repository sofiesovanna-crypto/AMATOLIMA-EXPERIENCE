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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  // Um ambiente luminoso de estúdio dá aos materiais reflexos amplos e naturais
  // sem acrescentar uma imagem visível ao fundo editorial da seção.
  const environmentCanvas = document.createElement("canvas");
  environmentCanvas.width = 1024;
  environmentCanvas.height = 512;
  const environmentContext = environmentCanvas.getContext("2d");
  const environmentGradient = environmentContext.createLinearGradient(0, 0, 0, 512);
  environmentGradient.addColorStop(0, "#d7e0df");
  environmentGradient.addColorStop(.42, "#f4eee4");
  environmentGradient.addColorStop(1, "#6e5542");
  environmentContext.fillStyle = environmentGradient;
  environmentContext.fillRect(0, 0, 1024, 512);
  environmentContext.fillStyle = "rgba(255,248,226,.92)";
  environmentContext.fillRect(55, 74, 280, 210);
  environmentContext.fillStyle = "rgba(255,255,255,.72)";
  environmentContext.fillRect(690, 92, 235, 175);
  const environmentTexture = new THREE.CanvasTexture(environmentCanvas);
  environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
  environmentTexture.colorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.environment = environmentTexture;
  const camera = new THREE.PerspectiveCamera(31, 1, .1, 100);
  camera.position.set(14.8, 10.8, 18.5);
  camera.lookAt(0, 0, 0);

  const apartment = new THREE.Group();
  apartment.rotation.y = -.12;
  apartment.position.set(.1, -.72, 0);
  apartment.scale.set(.84, .92, 1.26);
  scene.add(apartment);

  // O eixo longitudinal segue o recorte cozinha - jantar - estar da planta Sergipe 686.
  const kitchenGroup = new THREE.Group();
  const diningGroup = new THREE.Group();
  const livingGroup = new THREE.Group();
  kitchenGroup.rotation.y = Math.PI;
  kitchenGroup.position.set(0, 0, 1.05);
  // Jantar compacto junto à porta; o núcleo central fica reservado exclusivamente ao estar.
  diningGroup.position.set(-6.04, 0, 4.8);
  diningGroup.scale.set(.84, .9, .84);
  // O estar permanece totalmente dentro do perímetro, mesmo visto durante a volta de 360°.
  livingGroup.position.set(0, 0, -4.75);
  apartment.add(kitchenGroup, diningGroup, livingGroup);
  let activeParent = apartment;

  const ambient = new THREE.HemisphereLight(0xfff8ed, 0x44362f, .6);
  const sun = new THREE.DirectionalLight(0xffeed0, 2.8);
  sun.position.set(-8, 13, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12;
  sun.shadow.camera.bottom = -12;
  sun.shadow.bias = -.00035;
  sun.shadow.normalBias = .018;
  sun.shadow.radius = 5;
  scene.add(ambient, sun);

  const windowLight = new THREE.RectAreaLight(0xdde9eb, 7.5, 8.5, 3.2);
  windowLight.position.set(1.3, 2.1, -4.08);
  windowLight.lookAt(1.3, .4, 3.5);
  scene.add(windowLight);

  const warmFill = new THREE.RectAreaLight(0xffd7a0, 2.4, 4, 2.5);
  warmFill.position.set(-4.9, 2.4, 1.8);
  warmFill.lookAt(1, .4, 0);
  scene.add(warmFill);

  const glow = new THREE.PointLight(0xe7bc79, 0, 18, 1.7);
  glow.position.set(-5, 4, 5);
  scene.add(glow);

  const palette = {
    plaster: 0xeee9df,
    plasterWarm: 0xd9cfc0,
    wood: 0x8a5c3a,
    woodLight: 0xc4a17b,
    stone: 0xeee8dc,
    travertine: 0xcbb99d,
    quartz: 0xf0ece4,
    fabric: 0xb9ad9d,
    fabricLight: 0xded6ca,
    metal: 0x5b493c,
    glass: 0x8d7968,
    green: 0x65715c,
  };

  const makeSurfaceTexture = (kind) => {
    const surface = document.createElement("canvas");
    surface.width = 512;
    surface.height = 512;
    const context = surface.getContext("2d");
    context.fillStyle = kind === "wood" ? "#dcc9ae" : kind === "stone" ? "#e9e1d3" : kind === "travertine" ? "#cfbea2" : "#d1cbc2";
    context.fillRect(0, 0, 512, 512);

    if (kind === "wood") {
      for (let i = 0; i < 150; i += 1) {
        const y = Math.random() * 512;
        const wave = Math.random() * 22 + 5;
        context.strokeStyle = `rgba(72,45,27,${Math.random() * .12 + .025})`;
        context.lineWidth = Math.random() * 2 + .35;
        context.beginPath();
        context.moveTo(-20, y);
        context.bezierCurveTo(130, y - wave, 350, y + wave, 532, y - wave * .25);
        context.stroke();
      }
    } else if (kind === "travertine") {
      for (let i = 0; i < 52; i += 1) {
        const y = Math.random() * 512;
        context.strokeStyle = `rgba(102,79,55,${Math.random() * .09 + .025})`;
        context.lineWidth = Math.random() * 4 + .6;
        context.beginPath();
        context.moveTo(-15, y);
        context.bezierCurveTo(150, y - 16, 345, y + 18, 527, y - 5);
        context.stroke();
      }
      for (let i = 0; i < 900; i += 1) {
        context.fillStyle = `rgba(81,61,42,${Math.random() * .035})`;
        context.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 3, Math.random() * 1.2);
      }
    } else {
      for (let i = 0; i < 3600; i += 1) {
        const value = kind === "stone" ? 92 : 75;
        const alpha = Math.random() * (kind === "stone" ? .06 : .035);
        context.fillStyle = `rgba(${value},${value - 8},${value - 14},${alpha})`;
        const size = kind === "stone" ? Math.random() * 2.2 : Math.random() * 1.2;
        context.fillRect(Math.random() * 512, Math.random() * 512, size, size);
      }
    }

    const texture = new THREE.CanvasTexture(surface);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(kind === "wood" ? 2.4 : 3.2, kind === "wood" ? 5.2 : 3.2);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  };

  const surfaceTextures = {
    wood: makeSurfaceTexture("wood"),
    stone: makeSurfaceTexture("stone"),
    travertine: makeSurfaceTexture("travertine"),
    fabric: makeSurfaceTexture("fabric"),
  };

  const textureForColor = (color) => {
    if (color === palette.wood || color === palette.woodLight) return surfaceTextures.wood;
    if (color === palette.travertine) return surfaceTextures.travertine;
    if (color === palette.stone || color === palette.quartz || color === palette.plasterWarm) return surfaceTextures.stone;
    if (color === palette.fabric || color === palette.fabricLight) return surfaceTextures.fabric;
    return null;
  };

  const objects = [];
  const makeMaterial = (color, roughness = .72, metalness = 0, extras = {}) => {
    if (color === palette.glass) {
      return new THREE.MeshPhysicalMaterial({
        color: 0xb59a80, roughness: .12, metalness: .08, transmission: .62,
        thickness: .11, ior: 1.48, transparent: true, opacity: 0, side: THREE.DoubleSide, ...extras,
      });
    }
    if (color === palette.quartz) {
      return new THREE.MeshPhysicalMaterial({
        color, roughness: .24, metalness: 0, clearcoat: .32, clearcoatRoughness: .3,
        transparent: true, opacity: 0, envMapIntensity: .7, ...extras,
      });
    }
    if (color === palette.fabric || color === palette.fabricLight) {
      const surfaceMap = extras.map || surfaceTextures.fabric;
      return new THREE.MeshPhysicalMaterial({
        color, roughness: .9, metalness: 0, sheen: .28, sheenRoughness: .82,
        sheenColor: new THREE.Color(0xe8ded0), transparent: true, opacity: 0,
        map: surfaceMap, bumpMap: surfaceMap, bumpScale: .018, envMapIntensity: .34, ...extras,
      });
    }
    const surfaceMap = extras.map || textureForColor(color);
    return new THREE.MeshStandardMaterial({
      color, roughness, metalness, transparent: true, opacity: 0,
      map: surfaceMap, bumpMap: surfaceMap, bumpScale: surfaceMap ? .022 : 0,
      envMapIntensity: metalness > .2 ? .82 : .42, ...extras,
    });
  };

  const addObject = (geometry, options = {}) => {
    const {
      position = [0, 0, 0], rotation = [0, 0, 0], color = palette.plaster,
      order = 0, roughness = .72, metalness = 0, edges = true,
      map = null, emissive = 0x000000, emissiveIntensity = 0,
    } = options;
    const materialExtras = { emissive, emissiveIntensity };
    if (map) materialExtras.map = map;
    const material = makeMaterial(color, roughness, metalness, materialExtras);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    activeParent.add(mesh);

    let line = null;
    if (edges) {
      line = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 18),
        new THREE.LineBasicMaterial({ color: 0x4a3a2d, transparent: true, opacity: 0 }),
      );
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      activeParent.add(line);
    }
    objects.push({ mesh, line, order, baseScale: mesh.scale.clone() });
    return mesh;
  };

  const box = (size, position, color, order, extra = {}) => addObject(new THREE.BoxGeometry(...size), { position, color, order, ...extra });
  const roundedBoxGeometry = (width, height, depth, radius = .08, segments = 4) => {
    const safeRadius = Math.min(radius, width / 2 - .001, height / 2 - .001, depth / 2 - .001);
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + safeRadius, y);
    shape.lineTo(x + width - safeRadius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    shape.lineTo(x + width, y + height - safeRadius);
    shape.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    shape.lineTo(x + safeRadius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    shape.lineTo(x, y + safeRadius);
    shape.quadraticCurveTo(x, y, x + safeRadius, y);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(.001, depth - safeRadius * 2), steps: 1, curveSegments: segments,
      bevelEnabled: true, bevelSegments: segments, bevelSize: safeRadius, bevelThickness: safeRadius,
    });
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  };
  const roundedBox = (size, position, color, order, extra = {}) => {
    const radius = extra.radius ?? Math.min(...size) * .18;
    const cleanExtra = { ...extra };
    delete cleanExtra.radius;
    return addObject(roundedBoxGeometry(...size, radius), { position, color, order, ...cleanExtra });
  };
  const cylinder = (radius, height, position, color, order, extra = {}) => addObject(new THREE.CylinderGeometry(radius, radius, height, 32), { position, color, order, ...extra });

  const contactShadow = (width, depth, position, order, opacity = .16) => {
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const context = shadowCanvas.getContext("2d");
    const gradient = context.createRadialGradient(128, 128, 18, 128, 128, 126);
    gradient.addColorStop(0, `rgba(35,22,14,${opacity})`);
    gradient.addColorStop(.58, `rgba(35,22,14,${opacity * .52})`);
    gradient.addColorStop(1, "rgba(35,22,14,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    const map = new THREE.CanvasTexture(shadowCanvas);
    const shadow = addObject(new THREE.PlaneGeometry(width, depth), {
      position, rotation: [-Math.PI / 2, 0, 0], color: 0xffffff, map,
      order, roughness: 1, edges: false,
    });
    shadow.material.depthWrite = false;
    shadow.material.bumpMap = null;
    shadow.material.opacity = 0;
    return shadow;
  };

  // Base arquitetônica e paredes abertas, como uma maquete habitável.
  box([14.8, .22, 10.4], [0, -.16, .3], palette.travertine, .02, { roughness: .82 });
  for (let z = -4.25; z <= 4.95; z += 1.15) box([14.2, .014, .018], [0, -.035, z], palette.stone, .06, { edges: false });

  // Parede de fundo muito clara, com um vão panorâmico e pouca massa aparente.
  box([1.85, 3.9, .2], [-6.48, 1.82, -4.5], palette.plaster, .1);
  box([1.85, 3.9, .2], [6.48, 1.82, -4.5], palette.plaster, .1);
  box([11.15, .38, .2], [0, 3.71, -4.5], palette.plaster, .11);
  box([11.15, .42, .2], [0, .06, -4.5], palette.plaster, .11);

  // Parede lateral predominantemente fechada, com uma porta estreita no respiro
  // entre a sala de jantar e o estar.
  box([.2, 3.9, 4.75], [-7.38, 1.82, -2.125], palette.plasterWarm, .12);
  box([.2, 3.9, 3.3], [-7.38, 1.82, 3.35], palette.plasterWarm, .12);
  box([.2, 1.02, 1.45], [-7.38, 3.37, .975], palette.plasterWarm, .14);

  // Porta em vidro Reflecta bronze, de proporção residencial e esquadria fina.
  box([.14, 2.86, .09], [-7.25, 1.43, .27], palette.metal, .17);
  box([.14, 2.86, .09], [-7.25, 1.43, 1.68], palette.metal, .17);
  box([.14, .1, 1.5], [-7.25, 2.82, .975], palette.metal, .18);
  box([.035, 2.62, 1.28], [-7.24, 1.48, .975], palette.glass, .205, {
    roughness: .14, metalness: .12, edges: false,
  });
  [.84, 1.58, 2.3].forEach((y, index) => {
    box([.025, .035, 1.28], [-7.205, y, .975], 0x554940, .212 + index * .003, { edges: false });
  });
  box([.025, 2.55, .035], [-7.205, 1.5, .975], 0x554940, .222, { edges: false });
  cylinder(.035, .28, [-7.12, 1.42, 1.44], 0x8f775d, .23, {
    rotation: [0, 0, Math.PI / 2], metalness: .7, roughness: .28, edges: false,
  });

  // Vestíbulo compacto atrás do vidro evita qualquer vazio escuro durante a rotação.
  box([2.35, .16, 1.9], [-8.35, -.1, .975], palette.travertine, .22);
  box([.16, 3.25, 1.9], [-9.48, 1.48, .975], palette.plasterWarm, .23);
  box([2.3, 3.25, .16], [-8.32, 1.48, .08], palette.plaster, .23);
  box([2.3, 3.25, .16], [-8.32, 1.48, 1.87], palette.plaster, .23);

  // Esquadria panorâmica clara: perfis finos, quatro folhas e persianas horizontais.
  const windowCenter = .18;
  const windowWidth = 10.72;
  box([windowWidth, .12, .18], [windowCenter, 3.45, -4.34], 0x5f5a54, .18);
  box([windowWidth, .12, .18], [windowCenter, .43, -4.34], 0x5f5a54, .18);
  [-5.18, -2.5, .18, 2.86, 5.54].forEach((x) => box([.075, 3.12, .16], [x, 1.94, -4.34], 0x5f5a54, .2));
  [-3.84, -1.16, 1.52, 4.2].forEach((x) => box([2.55, 2.88, .035], [x, 1.94, -4.37], palette.glass, .23, {
    roughness: .12, metalness: .03, edges: false,
  }));

  // Lâminas claras deixam a paisagem e a luz aparecerem na base, como na referência.
  for (let y = 1.62; y <= 3.34; y += .095) {
    box([10.55, .026, .052], [windowCenter, y, -4.08], 0xe9e7e1, .84 + (y - 1.62) * .006, {
      rotation: [-.09, 0, 0], roughness: .72, edges: false,
    });
  }
  [-2.5, .18, 2.86].forEach((x, index) => {
    box([.018, 1.8, .03], [x, 2.48, -4.045], 0x8a847c, .9 + index * .003, { edges: false });
  });

  // Cozinha e marcenaria contínua.
  activeParent = kitchenGroup;
  box([.68, 2.7, 3.55], [-6.36, 1.23, -2.35], palette.wood, .28);
  for (let z = -3.75; z <= -.95; z += .7) box([.72, .025, .035], [-5.99, 1.3, z], palette.metal, .3, { edges: false });
  box([4.9, .82, .9], [-3.55, .34, -3.92], palette.plasterWarm, .32);
  box([5.05, .09, 1.04], [-3.55, .81, -3.92], palette.quartz, .34, { roughness: .28 });
  for (let x = -5.55; x <= -1.55; x += 1) box([.025, .72, .84], [x, .38, -3.92], palette.metal, .35, { edges: false });
  roundedBox([4.25, .84, 1.22], [-2.4, .4, -1.95], palette.woodLight, .38, { radius: .055 });
  roundedBox([4.42, .1, 1.38], [-2.4, .87, -1.95], palette.quartz, .4, { roughness: .26, radius: .035 });

  // Leitura residencial da cozinha de referência: torre de eletros, geladeira e nichos abertos.
  roundedBox([.64, 2.58, 1.18], [-5.96, 1.25, -.58], 0x887566, .405, { radius: .035, roughness: .68 });
  roundedBox([.67, 2.42, 1.02], [-5.58, 1.22, -3.63], 0xb6aea2, .408, { radius: .028, roughness: .3, metalness: .16 });
  box([.026, 2.18, .02], [-5.225, 1.22, -3.63], palette.metal, .412, { edges: false });
  [-2.98, -2.25, -1.52, -.79].forEach((z, index) => {
    box([.34, .045, .64], [-5.96, .72 + index * .48, z], palette.woodLight, .414 + index * .004, { edges: false });
  });
  [[-2.98,.91],[-2.25,1.39],[-1.52,1.87],[-.79,2.35]].forEach(([z,y], index) => {
    cylinder(.1 + (index % 2) * .025, .2, [-5.94, y, z], index % 2 ? 0x9a9c88 : 0xe7ded1, .43 + index * .004, { roughness: .8 });
  });

  // Banquetas da ilha.
  [-3.5, -2.35, -1.2].forEach((x, index) => {
    roundedBox([.62, .12, .56], [x, .7, -.95], palette.fabricLight, .43 + index * .006, { radius: .055 });
    cylinder(.055, .65, [x, .34, -.95], palette.metal, .43 + index * .006, { metalness: .35 });
  });

  // Sala de jantar clara e tátil, substituindo a antiga mesa pequena próxima à porta.
  activeParent = diningGroup;
  cylinder(2.18, .025, [2.55, -.01, -1.85], 0xd8d0c4, .47, { roughness: 1, edges: false });
  cylinder(1.34, .13, [2.55, .8, -1.85], palette.woodLight, .48, { roughness: .48 });
  addObject(new THREE.CylinderGeometry(.38, .62, .76, 36), {
    position: [2.55, .38, -1.85], color: palette.travertine, order: .49,
    roughness: .72, metalness: .02,
  });
  for (let index = 0; index < 6; index += 1) {
    const angle = (index / 6) * Math.PI * 2;
    const chairGroup = new THREE.Group();
    chairGroup.position.set(2.55 + Math.cos(angle) * 1.72, 0, -1.85 + Math.sin(angle) * 1.72);
    chairGroup.rotation.y = -angle + Math.PI / 2;
    diningGroup.add(chairGroup);
    activeParent = chairGroup;
    roundedBox([.78, .16, .68], [0, .66, 0], 0xded5c7, .505 + index * .006, { radius: .075, roughness: .92 });
    roundedBox([.86, .78, .17], [0, 1.0, .3], 0xc8b9a6, .507 + index * .006, { radius: .085, roughness: .88 });
    roundedBox([.12, .42, .58], [-.43, .85, .08], 0xc8b9a6, .509 + index * .006, { radius: .055, roughness: .88 });
    roundedBox([.12, .42, .58], [.43, .85, .08], 0xc8b9a6, .51 + index * .006, { radius: .055, roughness: .88 });
    [[-.31,-.24],[.31,-.24],[-.31,.24],[.31,.24]].forEach(([x,z]) => {
      cylinder(.025, .58, [x, .3, z], 0x8a725d, .512 + index * .006, { roughness: .5, metalness: .08, edges: false });
    });
  }
  activeParent = diningGroup;
  // Fruteira escultórica de cerâmica, com maçãs em tons naturais e quentes.
  const fruitBowl = addObject(new THREE.SphereGeometry(.43, 28, 16), {
    position: [2.55, .96, -1.85], color: 0xe8dfd1, order: .55, roughness: .92, edges: false,
  });
  fruitBowl.scale.set(1.35, .32, 1.35);
  objects[objects.length - 1].baseScale.copy(fruitBowl.scale);
  addObject(new THREE.TorusGeometry(.5, .055, 12, 36), {
    position: [2.55, 1.08, -1.85], rotation: [Math.PI / 2, 0, 0], color: 0xd5c8b7,
    order: .552, roughness: .88, edges: false,
  });
  [[-.22,.04],[.2,.08],[-.05,-.22],[.28,-.19]].forEach(([x,z], index) => {
    addObject(new THREE.SphereGeometry(.17, 18, 12), {
      position: [2.55 + x, 1.16 + (index % 2) * .055, -1.85 + z],
      color: index % 2 ? 0xb79454 : 0xc6a56a, order: .556 + index * .003,
      roughness: .72, edges: false,
    });
    cylinder(.012, .12, [2.55 + x, 1.34 + (index % 2) * .055, -1.85 + z], 0x66513c, .558 + index * .003, { edges: false });
  });
  contactShadow(4.35, 4.35, [2.55, -.018, -1.85], .54, .11);

  // Estar orgânico.
  activeParent = livingGroup;
  roundedBox([4.25, .12, 2.75], [2.7, .01, 2.4], palette.fabricLight, .57, { radius: .045 });
  roundedBox([4.55, .68, 1.18], [3.05, .38, 3.18], palette.fabric, .6, { radius: .16 });
  roundedBox([1.22, .62, 2.75], [5.0, .35, 1.98], palette.fabric, .61, { radius: .15 });
  roundedBox([3.9, .62, .35], [2.95, .76, 3.58], palette.fabricLight, .62, { radius: .12 });
  roundedBox([.38, .68, 2.5], [5.48, .72, 1.98], palette.fabricLight, .63, { radius: .12 });
  cylinder(.74, .2, [1.34, .2, 1.95], palette.stone, .66);
  cylinder(.48, .28, [.25, .24, 2.5], palette.wood, .67);
  contactShadow(5.5, 3.65, [3.05, -.02, 2.45], .68, .18);
  contactShadow(4.55, 2.65, [2.55, -.025, -1.85], .55, .12);

  // Painel de TV e curadoria do estar.
  box([.32, 2.55, 4.9], [-6.55, 1.12, 2.15], palette.wood, .7);
  const televisionCanvas = document.createElement("canvas");
  televisionCanvas.width = 640;
  televisionCanvas.height = 360;
  const televisionContext = televisionCanvas.getContext("2d");
  const televisionGradient = televisionContext.createLinearGradient(0, 0, 640, 360);
  televisionGradient.addColorStop(0, "#0e1112");
  televisionGradient.addColorStop(.58, "#1a1b1a");
  televisionGradient.addColorStop(1, "#29251f");
  televisionContext.fillStyle = televisionGradient;
  televisionContext.fillRect(0, 0, 640, 360);
  const reflection = televisionContext.createLinearGradient(0, 0, 430, 250);
  reflection.addColorStop(0, "rgba(216,229,224,.2)");
  reflection.addColorStop(.42, "rgba(216,229,224,.035)");
  reflection.addColorStop(1, "rgba(216,229,224,0)");
  televisionContext.fillStyle = reflection;
  televisionContext.beginPath();
  televisionContext.moveTo(0, 0);
  televisionContext.lineTo(390, 0);
  televisionContext.lineTo(225, 360);
  televisionContext.lineTo(0, 360);
  televisionContext.closePath();
  televisionContext.fill();
  const televisionTexture = new THREE.CanvasTexture(televisionCanvas);
  televisionTexture.colorSpace = THREE.SRGBColorSpace;

  roundedBox([2.58, 1.56, .11], [-6.335, 1.55, 2.15], 0x181817, .72, {
    rotation: [0, Math.PI / 2, 0], radius: .055, roughness: .14, metalness: .18,
  });
  addObject(new THREE.PlaneGeometry(2.42, 1.4), {
    position: [-6.272, 1.55, 2.15], rotation: [0, Math.PI / 2, 0], color: 0xffffff,
    map: televisionTexture, order: .728, roughness: .09, metalness: .08, edges: false,
  });

  // Rack suspenso: volume baixo e leve, com frentes contínuas e sombra própria.
  roundedBox([3.72, .4, .52], [-6.24, .48, 2.15], palette.woodLight, .735, {
    rotation: [0, Math.PI / 2, 0], radius: .055, roughness: .62,
  });
  [-.02, 1.22, 2.46].forEach((z, index) => {
    box([.018, .3, .015], [-5.968, .48, z + 1.52], palette.metal, .74 + index * .002, { edges: false });
  });
  contactShadow(.95, 4.35, [-6.05, -.02, 2.15], .745, .12);

  // Livros, escultura em pedra e vaso baixo — poucos elementos, como no desenho.
  [0, .075, .15].forEach((height, index) => {
    box([.48, .055, .72], [-5.94, .72 + height, 1.02], index === 1 ? 0x716359 : 0xe8dfd2, .755 + index * .004, {
      rotation: [0, index === 1 ? .05 : -.025, 0], roughness: .86, edges: false,
    });
  });
  cylinder(.19, .34, [-5.93, .89, 2.92], palette.travertine, .77, { roughness: .82 });
  addObject(new THREE.SphereGeometry(.24, 24, 16), {
    position: [-5.91, .84, 3.62], color: 0x9a9c88, order: .78, roughness: .76,
  });
  addObject(new THREE.TorusGeometry(.27, .055, 14, 32), {
    position: [-5.86, 1.07, 3.62], rotation: [0, Math.PI / 2, 0], color: 0xc1a57f,
    order: .786, roughness: .38, metalness: .22, edges: false,
  });

  // Filete de luz atrás da TV: perceptível apenas no estágio materializado.
  box([.024, 1.78, 2.82], [-6.39, 1.55, 2.15], 0xffdfaa, .715, {
    roughness: .22, emissive: 0xffb85c, emissiveIntensity: 1.35, edges: false,
  });
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

  // Luminária de piso e mesa lateral completam o estar sem bloquear a circulação.
  cylinder(.31, .055, [5.22, .05, .64], palette.metal, .835, { metalness: .48 });
  cylinder(.035, 2.12, [5.22, 1.1, .64], palette.metal, .84, { metalness: .48 });
  addObject(new THREE.ConeGeometry(.42, .58, 24, 1, true), {
    position: [5.22, 2.22, .64], color: 0xe8d9c2, order: .845, roughness: .74,
    emissive: 0xffbd70, emissiveIntensity: .28,
  });
  cylinder(.48, .48, [4.78, .24, 3.72], palette.woodLight, .85);

  // Duas poltronas de madeira deixam a composição doméstica e equilibram o sofá amplo.
  [[.35,.85,.48],[.6,.85,3.85]].forEach((p, index) => {
    const chair = new THREE.Group();
    chair.position.set(p[0], 0, p[2]);
    chair.rotation.y = index === 0 ? -.18 : .2;
    livingGroup.add(chair);
    activeParent = chair;
    roundedBox([.9, .16, .76], [0, .58, 0], palette.fabricLight, .855 + index * .012, { radius: .055 });
    roundedBox([.9, .82, .16], [0, .98, .31], palette.fabric, .858 + index * .012, { radius: .05 });
    [-.42, .42].forEach((x) => {
      box([.07, .7, .07], [x, .4, 0], palette.wood, .86 + index * .012, { rotation: [0, 0, x < 0 ? -.08 : .08], edges: false });
      box([.08, .08, .85], [x, .79, .05], palette.wood, .862 + index * .012, { edges: false });
    });
  });
  activeParent = livingGroup;

  // Costuras discretas quebram os grandes volumes do estofado sem pesar a cena.
  [1.55, 2.65, 3.75, 4.55].forEach((x, index) => {
    box([.012, .016, 1.02], [x, .724, 3.17], 0x7f7264, .846 + index * .002, { edges: false });
  });

  // Detalhes autorais que aparecem somente quando a maquete ganha materialidade.
  activeParent = livingGroup;
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

  // Pendente de dois aros: claro, leve e iluminado de forma indireta.
  activeParent = diningGroup;
  [[2.62,-.48],[2.62,.48],[2.05,-.36],[2.05,.36]].forEach(([y,x], index) => {
    box([.018, 3.42 - y, .018], [2.55 + x, y + (3.42 - y) / 2, -1.85], 0x9a8265, .88 + index * .003, {
      metalness: .48, roughness: .34, edges: false,
    });
  });
  [
    { radius: 1.08, y: 2.62, tube: .042 },
    { radius: .78, y: 2.05, tube: .038 },
  ].forEach((ring, index) => {
    addObject(new THREE.TorusGeometry(ring.radius, ring.tube, 16, 64), {
      position: [2.55, ring.y, -1.85], rotation: [Math.PI / 2, 0, 0],
      color: 0xf0dfc1, order: .9 + index * .012, roughness: .25, metalness: .24,
      emissive: 0xffca79, emissiveIntensity: .72, edges: false,
    });
  });
  const diningGlow = new THREE.PointLight(0xffd49a, 0, 6.5, 2);
  diningGlow.position.set(2.55, 2.38, -1.85);
  diningGroup.add(diningGlow);

  // Luz indireta integrada à marcenaria, ao painel e à ilha.
  activeParent = kitchenGroup;
  const ledOptions = { color: 0xffdfaa, order: .9, roughness: .2, emissive: 0xffb85c, emissiveIntensity: 2.4, edges: false };
  box([4.72, .035, .045], [-3.55, 1.12, -3.43], ledOptions.color, ledOptions.order, ledOptions);
  box([4.05, .028, .04], [-2.4, .86, -1.24], ledOptions.color, .915, ledOptions);
  box([.04, 2.22, 4.5], [-6.3, 1.18, 2.15], ledOptions.color, .925, ledOptions);
  const indirectLight = new THREE.PointLight(0xffbd70, 0, 9, 2);
  indirectLight.position.set(-3.8, 1.5, -2.3);
  scene.add(indirectLight);

  // Almofadas, manta e pequenas peças de curadoria.
  activeParent = livingGroup;
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
  activeParent = apartment;
  // Composição de quadros no pano lateral da janela.
  box([1.42, 1.86, .08], [-5.64, 2.02, -4.35], 0x5e4536, .87);
  box([1.22, 1.66, .045], [-5.64, 2.02, -4.29], 0xc1a57f, .88, { edges: false });
  box([.28, 1.22, .025], [-5.79, 1.96, -4.25], 0x716359, .89, { rotation: [0, 0, -.18], edges: false });
  box([.42, .64, .025], [-5.43, 2.22, -4.23], 0xefe7db, .895, { rotation: [0, 0, .28], edges: false });

  const viewCanvas = document.createElement("canvas");
  viewCanvas.width = 1024;
  viewCanvas.height = 384;
  const viewContext = viewCanvas.getContext("2d");
  const sky = viewContext.createLinearGradient(0, 0, 0, 384);
  sky.addColorStop(0, "#e8f2f1");
  sky.addColorStop(.56, "#eef3e9");
  sky.addColorStop(1, "#a9c49b");
  viewContext.fillStyle = sky;
  viewContext.fillRect(0, 0, 1024, 384);
  viewContext.fillStyle = "rgba(85,112,70,.34)";
  [[30,245,88],[130,220,130],[274,260,74],[358,205,118],[498,238,102],[620,188,155],[802,230,94],[902,198,122]].forEach(([x,y,w]) => {
    viewContext.fillRect(x, y, w, 384 - y);
  });
  viewContext.fillStyle = "rgba(247,241,218,.44)";
  for (let x = 54; x < 970; x += 72) viewContext.fillRect(x, 282 + (x % 3) * 7, 14, 7);
  const viewTexture = new THREE.CanvasTexture(viewCanvas);
  viewTexture.colorSpace = THREE.SRGBColorSpace;
  const windowGlow = addObject(new THREE.PlaneGeometry(10.55, 2.88), {
    position: [windowCenter, 1.94, -4.25], color: 0xe3ece5, order: .965, roughness: .06,
    metalness: .03, map: viewTexture, emissive: 0xa9c3b1, emissiveIntensity: .13, edges: false,
  });
  windowGlow.material.side = THREE.DoubleSide;

  // Segunda face da janela: durante a rotação completa, o verso mantém a mesma
  // luminosidade e o mesmo desenho de persianas, em vez de revelar o vidro marrom.
  const exteriorWindowGlow = addObject(new THREE.PlaneGeometry(10.55, 2.88), {
    position: [windowCenter, 1.94, -4.54], rotation: [0, Math.PI, 0], color: 0xe3ece5,
    order: .966, roughness: .06, metalness: .03, map: viewTexture,
    emissive: 0xa9c3b1, emissiveIntensity: .13, edges: false,
  });
  exteriorWindowGlow.material.side = THREE.DoubleSide;
  for (let y = 1.62; y <= 3.34; y += .095) {
    box([10.55, .026, .052], [windowCenter, y, -4.59], 0xe9e7e1, .968 + (y - 1.62) * .004, {
      rotation: [.09, 0, 0], roughness: .72, edges: false,
    });
  }
  [-2.5, .18, 2.86].forEach((x, index) => {
    box([.018, 1.8, .03], [x, 2.48, -4.625], 0x8a847c, .982 + index * .002, { edges: false });
  });

  const shadowMaterial = new THREE.ShadowMaterial({ color: 0x1a120d, opacity: .16, transparent: true });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(18, 16), shadowMaterial);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -.255;
  shadowPlane.receiveShadow = true;
  apartment.add(shadowPlane);

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
    camera.aspect = aspect;
    camera.fov = window.innerWidth <= 760 ? 52 : 31;
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

    // A volta termina antes do fim do scroll, reservando o trecho final para
    // contemplar a maquete pronta em um ângulo mais frontal e aberto.
    const rotationPhase = smooth((progress - .42) / .38);
    const finalViewPhase = smooth((progress - .8) / .16);
    apartment.rotation.y = -.28 + rotationPhase * (Math.PI * 2 + .48);
    apartment.rotation.x = -.025 + progress * .035;
    camera.position.x = 14.8 - progress * 2.15 - finalViewPhase * 1.85;
    camera.position.y = 10.8 - progress * 1.42 - finalViewPhase * .9;
    camera.position.z = 18.5 + progress * .62 + finalViewPhase * 1.8;

    if (window.innerWidth > 760) {
      camera.fov = 31 + finalViewPhase * 3;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(.4, .25, 0);
    glow.intensity = smooth((progress - .67) / .2) * 5;
    indirectLight.intensity = smooth((progress - .72) / .18) * 4.2;
    glow.position.x = -6 + progress * 13;
    sun.intensity = 1.25 + materialPhase * 2.25;
    windowLight.intensity = 3.2 + materialPhase * 5.4;
    diningGlow.intensity = materialPhase * 2.1;
    warmFill.intensity = .5 + materialPhase * 2.2;
    renderer.toneMappingExposure = .92 + materialPhase * .18;
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
