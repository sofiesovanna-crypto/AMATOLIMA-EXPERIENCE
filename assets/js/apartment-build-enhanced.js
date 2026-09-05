"use strict";

/* Amato Lima — refinement layer for the Three.js apartment. */
(async () => {
  const SOURCE = "assets/js/apartment-build.js?v=20260905-27";
  try {
    const response = await fetch(SOURCE, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    let source = await response.text();

    source = source
      .replace("Math.min(window.devicePixelRatio || 1, 1.6)", "Math.min(window.devicePixelRatio || 1, 2)")
      .replace("sun.shadow.mapSize.set(2048, 2048)", "sun.shadow.mapSize.set(3072, 3072)")
      .replace("radius = .08, segments = 4", "radius = .08, segments = 8")
      .replace("new THREE.CylinderGeometry(radius, radius, height, 32)", "new THREE.CylinderGeometry(radius, radius, height, 56)")
      .replace("texture.repeat.set(kind === \"wood\" ? 2.4 : 3.2, kind === \"wood\" ? 5.2 : 3.2)", "texture.repeat.set(kind === \"wood\" ? 1.35 : kind === \"travertine\" ? .92 : kind === \"quartz\" ? 1.12 : 1.65, kind === \"wood\" ? 2.45 : kind === \"travertine\" ? 1.05 : kind === \"quartz\" ? 1.18 : 1.65)")
      .replace("for (let i = 0; i < 72; i += 1)", "for (let i = 0; i < 118; i += 1)")
      .replace("for (let i = 0; i < 900; i += 1)", "for (let i = 0; i < 1550; i += 1)")
      .replace("for (let i = 0; i < 9; i += 1)", "for (let i = 0; i < 17; i += 1)")
      .replace("clearcoat: .16, clearcoatRoughness: .58", "clearcoat: .22, clearcoatRoughness: .46")
      .replace("bumpScale: .028", "bumpScale: .042")
      .replace("bumpScale: .038", "bumpScale: .055")
      .replace("bumpScale: .026", "bumpScale: .035")
      .replace("bumpScale: .012", "bumpScale: .02")
      .replace("sheen: .28, sheenRoughness: .82", "sheen: .4, sheenRoughness: .72");

    const startMarker = "  // Corredor do andar: extensão real da circulação, em vez de um volume fechado.";
    const endMarker = "  // Esquadria panorâmica clara: perfis finos, quatro folhas e persianas horizontais.";
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);
    if (start < 0 || end < 0 || end <= start) throw new Error("Bloco do corredor não localizado");

    const hall = `  // Hall privativo aberto — maquete sem teto e sem a parede frontal.\n  // Só o piso, a parede posterior e o fundo do elevador permanecem: o corredor pode ser lido por inteiro.\n  box([5.95, .14, 2.34], [-10.22, -.09, .975], palette.travertine, .22, { roughness: .7 });\n  [-8.25, -9.55, -10.92, -12.25].forEach((x, index) => {\n    box([.018, .018, 2.18], [x, -.012, .975], 0x9a876d, .222 + index * .002, { roughness: .92, edges: false });\n  });\n  // Uma única parede longitudinal; o lado voltado para a câmera fica completamente aberto.\n  box([5.92, 3.25, .15], [-10.22, 1.48, 2.09], palette.plasterWarm, .23, { roughness: .94 });\n  box([5.72, .055, .035], [-10.22, .16, 1.995], 0x66584d, .232, { edges: false, roughness: .62 });\n  box([5.72, .09, .04], [-10.22, .23, 1.975], palette.woodLight, .234, { edges: false, roughness: .58 });\n\n  // Painéis minerais rasos criam sombra e variação na parede, sem fechar a maquete.\n  [-9.05, -10.45, -11.85].forEach((x, index) => {\n    roundedBox([1.12, 2.35, .035], [x, 1.48, 2.0], index === 1 ? 0xd2c8b8 : 0xdad2c6, .238 + index * .003, { radius: .025, roughness: .96, edges: false });\n  });\n  // Veios/estratificação fina visíveis na parede mineral.\n  for (let y = .48; y < 2.7; y += .24) {\n    box([4.72, .012, .012], [-10.55, y, 1.972], y % .48 < .1 ? 0xb9aa95 : 0xc8bbaa, .247, { edges: false, roughness: 1 });\n  }\n\n  // Fundo do hall + elevador; nenhuma porta vizinha.\n  box([.16, 3.28, 2.34], [-13.08, 1.49, .975], palette.plasterWarm, .26, { roughness: .94 });\n  box([.12, 2.82, .14], [-12.965, 1.47, .25], 0xa78d6e, .266, { metalness: .64, roughness: .28 });\n  box([.12, 2.82, .14], [-12.965, 1.47, 1.70], 0xa78d6e, .266, { metalness: .64, roughness: .28 });\n  box([.12, .14, 1.58], [-12.965, 2.84, .975], 0xa78d6e, .268, { metalness: .64, roughness: .28 });\n  roundedBox([.085, 2.56, .69], [-12.89, 1.48, .615], 0x8d8378, .272, { radius: .018, metalness: .72, roughness: .24 });\n  roundedBox([.085, 2.56, .69], [-12.89, 1.48, 1.335], 0x978b7e, .273, { radius: .018, metalness: .7, roughness: .27 });\n  box([.018, 2.48, .018], [-12.835, 1.48, .975], 0x403a35, .278, { metalness: .45, roughness: .3, edges: false });\n  box([.34, .045, 1.56], [-12.84, .015, .975], 0x65594f, .28, { roughness: .38, metalness: .08, edges: false });\n  roundedBox([.045, .52, .18], [-12.77, 1.48, 1.84], 0x6f655d, .282, { radius: .018, metalness: .62, roughness: .22 });\n  cylinder(.036, .018, [-12.735, 1.39, 1.84], 0xe5c994, .286, { rotation: [0, 0, Math.PI / 2], metalness: .7, roughness: .18, emissive: 0xffc66c, emissiveIntensity: .7, edges: false });\n  // Balizadores na única parede; sem teto.\n  [-8.45, -9.85, -11.25].forEach((x, index) => {\n    roundedBox([.32, .055, .025], [x, .43, 1.985], 0xffd9a0, .288 + index * .003, { radius: .018, emissive: 0xffb65f, emissiveIntensity: 2.35, roughness: .16, edges: false });\n  });\n  const corridorGlow = new THREE.PointLight(0xffc982, 0, 8.5, 2);\n  corridorGlow.position.set(-10.65, 2.1, 1.5);\n  apartment.add(corridorGlow);\n\n`;
    source = source.slice(0, start) + hall + source.slice(end);

    // Kitchen: stronger integrated indirect light + layered joinery and less boxy island.
    const kitchenMarker = "  // Leitura residencial da cozinha de referência: torre de eletros, geladeira e nichos abertos.";
    const kp = source.indexOf(kitchenMarker);
    if (kp > 0) {
      const details = `  // Camadas de marcenaria, frisos, backsplash e luz integrada — leitura de cozinha construída, não blocos.\n  box([4.72, 1.0, .055], [-3.55, 1.34, -4.31], palette.travertine, .401, { roughness: .72, edges: false });\n  for (let x = -5.65; x <= -1.55; x += .82) box([.014, .86, .018], [x, 1.34, -4.275], 0xb7a58d, .402, { edges: false, roughness: .9 });\n  // LED contínuo sob a bancada posterior e sob a ilha: emissivo + luz física para aparecer no render.\n  box([4.72, .028, .045], [-3.55, .92, -4.30], 0xffe1ac, .403, { emissive: 0xffb65f, emissiveIntensity: 4.8, roughness: .1, edges: false });\n  box([4.18, .032, .045], [-2.4, .77, -2.58], 0xffdfaa, .404, { emissive: 0xffae4e, emissiveIntensity: 5.2, roughness: .08, edges: false });\n  const kitchenGlow = new THREE.RectAreaLight(0xffc77a, 7.5, 4.6, .7);\n  kitchenGlow.position.set(-3.45, 1.08, -3.55);\n  kitchenGlow.lookAt(-3.45, .45, -2.4);\n  kitchenGroup.add(kitchenGlow);\n  // Frentes com recuos e puxadores cava.\n  for (let x = -5.45; x <= -1.7; x += .94) {\n    roundedBox([.78, .58, .035], [x, .42, -3.455], 0xd5cbbd, .405, { radius: .018, roughness: .82, edges: false });\n    box([.58, .018, .022], [x, .63, -3.43], 0x796858, .406, { edges: false, roughness: .45 });\n  }\n  // Ilha com base recuada/sombra para parecer mais leve e orgânica.\n  roundedBox([3.86, .62, 1.04], [-2.4, .39, -1.95], 0xb99a77, .407, { radius: .12, roughness: .58, edges: false });\n  // Cuba, torneira e placa de cocção.\n  roundedBox([.72, .035, .48], [-3.25, .935, -1.95], 0x5d5954, .408, { radius: .055, metalness: .38, roughness: .25, edges: false });\n  addObject(new THREE.TorusGeometry(.18, .022, 12, 36, Math.PI), { position: [-3.72, 1.12, -1.95], rotation: [0, Math.PI / 2, 0], color: 0x8c7965, order: .409, roughness: .24, metalness: .72, edges: false });\n  box([.72, .018, .54], [-1.62, .94, -1.95], 0x292927, .41, { roughness: .08, metalness: .18, edges: false });\n  // Objetos orgânicos: bandeja, garrafa, taças, cerâmica e ramo.\n  cylinder(.38, .035, [-2.3, .95, -1.55], palette.woodLight, .411, { roughness: .5, edges: false });\n  cylinder(.105, .42, [-2.18, 1.18, -1.55], 0x6f765f, .412, { roughness: .28, edges: false });\n  cylinder(.055, .16, [-2.18, 1.47, -1.55], 0xb79a71, .413, { metalness: .42, roughness: .2, edges: false });\n  [-1.93,-1.72].forEach((x, index) => {\n    addObject(new THREE.CylinderGeometry(.095, .045, .12, 28), { position: [x, 1.04, -1.55], color: palette.glass, order: .414 + index*.002, roughness: .06, metalness: .02, edges: false });\n    cylinder(.012, .18, [x, .92, -1.55], 0xb8a083, .415 + index*.002, { metalness: .5, roughness: .18, edges: false });\n    cylinder(.07, .012, [x, .82, -1.55], 0xb8a083, .416 + index*.002, { metalness: .5, roughness: .18, edges: false });\n  });\n  const vase = addObject(new THREE.SphereGeometry(.16, 32, 20), { position: [-4.65, 1.05, -3.75], color: 0xd7c9b7, order: .417, roughness: .94, edges: false });\n  vase.scale.set(.82, 1.35, .82); objects[objects.length - 1].baseScale.copy(vase.scale);\n  [[-.08,.28],[.02,.42],[.1,.34]].forEach(([dx,dy], i) => cylinder(.009, .55 + i*.08, [-4.65+dx, 1.35+dy/2, -3.75], 0x66705d, .418+i*.002, { rotation: [0,0,dx*2], roughness: .85, edges: false }));\n\n`;
      source = source.slice(0, kp) + details + source.slice(kp);
    }

    // Dining/living stone tops: extra concentric mineral detail to avoid flat discs.
    source = source.replace("cylinder(.74, .2, [1.34, .2, 1.95], palette.stone, .66);", "cylinder(.74, .2, [1.34, .2, 1.95], palette.stone, .66); addObject(new THREE.TorusGeometry(.58, .018, 12, 52), { position:[1.34,.31,1.95], rotation:[Math.PI/2,0,0], color:0xb8aa98, order:.661, roughness:.82, edges:false });")
      .replace("cylinder(.48, .28, [.25, .24, 2.5], palette.wood, .67);", "cylinder(.48, .28, [.25, .24, 2.5], palette.wood, .67); addObject(new THREE.TorusGeometry(.35, .014, 12, 48), { position:[.25,.39,2.5], rotation:[Math.PI/2,0,0], color:0x73513b, order:.671, roughness:.65, edges:false });")
      .replace("renderer.toneMappingExposure = .92 + materialPhase * .18", "renderer.toneMappingExposure = .95 + materialPhase * .22");

    const run = new Function(`${source}\n//# sourceURL=apartment-build-enhanced-runtime.js`);
    run();
  } catch (error) {
    console.error("[Amato Lima] Falha ao carregar maquete refinada:", error);
    const script = document.createElement("script");
    script.src = SOURCE;
    script.defer = true;
    document.head.appendChild(script);
  }
})();
