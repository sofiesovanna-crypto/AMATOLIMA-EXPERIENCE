"use strict";

/*
 * Amato Lima — camada de refinamento da maquete.
 * Mantém a composição original e aplica cirurgicamente o hall privativo,
 * elevador e melhorias de render antes de executar apartment-build.js.
 */
(async () => {
  const SOURCE = "assets/js/apartment-build.js?v=20260905-27";
  try {
    const response = await fetch(SOURCE, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    let source = await response.text();

    // Mais definição sem sacrificar demais notebooks/celulares.
    source = source
      .replace("Math.min(window.devicePixelRatio || 1, 1.6)", "Math.min(window.devicePixelRatio || 1, 2)")
      .replace("sun.shadow.mapSize.set(2048, 2048)", "sun.shadow.mapSize.set(3072, 3072)")
      .replace("radius = .08, segments = 4", "radius = .08, segments = 7")
      .replace("new THREE.CylinderGeometry(radius, radius, height, 32)", "new THREE.CylinderGeometry(radius, radius, height, 48)")
      .replace("texture.repeat.set(kind === \"wood\" ? 2.4 : 3.2, kind === \"wood\" ? 5.2 : 3.2)", "texture.repeat.set(kind === \"wood\" ? 1.55 : kind === \"travertine\" ? 1.35 : 2.15, kind === \"wood\" ? 3.1 : kind === \"travertine\" ? 1.45 : 2.15)");

    const startMarker = "  // Corredor do andar: extensão real da circulação, em vez de um volume fechado.";
    const endMarker = "  // Esquadria panorâmica clara: perfis finos, quatro folhas e persianas horizontais.";
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);
    if (start < 0 || end < 0 || end <= start) throw new Error("Bloco do corredor não localizado");

    const hall = `  // Hall privativo do andar — um único apartamento, sem portas vizinhas.\n  // O piso prolonga a arquitetura do apartamento e elimina a leitura de bloco sem saída.\n  box([5.9, .14, 2.34], [-10.22, -.09, .975], palette.travertine, .22, { roughness: .7 });\n  // Juntas largas e irregulares de placas de pedra dão escala ao piso.\n  [-8.35, -9.75, -11.18, -12.55].forEach((x, index) => {\n    box([.018, .018, 2.16], [x, -.012, .975], 0x9f8c72, .224 + index * .002, { roughness: .9, edges: false });\n  });\n\n  // Paredes laterais contínuas: hall de chegada, não corredor coletivo.\n  box([5.92, 3.32, .15], [-10.22, 1.51, -.14], palette.plaster, .23, { roughness: .92 });\n  box([5.92, 3.32, .15], [-10.22, 1.51, 2.09], palette.plasterWarm, .23, { roughness: .9 });\n  // Rodapé negativo escuro + filete de madeira, mais residencial e menos geométrico.\n  box([5.76, .055, .035], [-10.22, .16, -.045], 0x5d5046, .232, { edges: false, roughness: .55 });\n  box([5.76, .09, .04], [-10.22, .23, -.035], palette.woodLight, .234, { edges: false, roughness: .58 });\n  box([5.76, .055, .035], [-10.22, .16, 1.995], 0x5d5046, .232, { edges: false, roughness: .55 });\n\n  // Teto parcial, aberto no topo da maquete, com sanca linear recuada.\n  box([5.7, .08, 2.08], [-10.18, 3.08, .975], 0xe7e1d8, .236, { roughness: .92 });\n  box([4.95, .025, .035], [-10.08, 3.025, .12], 0xffdfad, .24, {\n    emissive: 0xffb967, emissiveIntensity: 2.25, roughness: .14, edges: false,\n  });\n  box([4.95, .025, .035], [-10.08, 3.025, 1.83], 0xffdfad, .241, {\n    emissive: 0xffb967, emissiveIntensity: 2.25, roughness: .14, edges: false,\n  });\n\n  // Painel de madeira ripada curto junto à chegada — quebra a parede longa sem inventar outra porta.\n  box([1.72, 2.54, .065], [-9.15, 1.48, 1.99], palette.woodLight, .245, { roughness: .5 });\n  for (let x = -9.92; x <= -8.4; x += .13) {\n    box([.028, 2.38, .025], [x, 1.48, 1.945], 0x8f7155, .247, { roughness: .52, edges: false });\n  }\n\n  // Banco escultórico baixo e aparador estreito: pequenas referências de escala humana.\n  roundedBox([1.25, .18, .48], [-10.35, .48, 1.7], 0xc8b69f, .252, { radius: .08, roughness: .9 });\n  roundedBox([.16, .46, .4], [-10.82, .25, 1.7], 0x8a725d, .254, { radius: .035, roughness: .58 });\n  roundedBox([.16, .46, .4], [-9.88, .25, 1.7], 0x8a725d, .254, { radius: .035, roughness: .58 });\n\n  // Parede de fundo do hall e portal do elevador.\n  box([.16, 3.3, 2.34], [-13.08, 1.5, .975], palette.plasterWarm, .26, { roughness: .9 });\n  // Marco em bronze champagne escovado.\n  box([.12, 2.82, .14], [-12.965, 1.47, .25], 0xa78d6e, .266, { metalness: .64, roughness: .28 });\n  box([.12, 2.82, .14], [-12.965, 1.47, 1.70], 0xa78d6e, .266, { metalness: .64, roughness: .28 });\n  box([.12, .14, 1.58], [-12.965, 2.84, .975], 0xa78d6e, .268, { metalness: .64, roughness: .28 });\n  // Duas folhas reais do elevador, com encontro central e leve variação de reflexão.\n  roundedBox([.085, 2.56, .69], [-12.89, 1.48, .615], 0x8d8378, .272, { radius: .018, metalness: .72, roughness: .24 });\n  roundedBox([.085, 2.56, .69], [-12.89, 1.48, 1.335], 0x978b7e, .273, { radius: .018, metalness: .7, roughness: .27 });\n  box([.018, 2.48, .018], [-12.835, 1.48, .975], 0x403a35, .278, { metalness: .45, roughness: .3, edges: false });\n  // Soleira em pedra escura.\n  box([.34, .045, 1.56], [-12.84, .015, .975], 0x65594f, .28, { roughness: .38, metalness: .08, edges: false });\n\n  // Botoeira mínima, indicador e botão circular iluminado.\n  roundedBox([.045, .52, .18], [-12.77, 1.48, 1.84], 0x6f655d, .282, { radius: .018, metalness: .62, roughness: .22 });\n  box([.018, .12, .105], [-12.742, 1.67, 1.84], 0x211f1d, .284, { edges: false, roughness: .12 });\n  cylinder(.036, .018, [-12.735, 1.39, 1.84], 0xe5c994, .286, { rotation: [0, 0, Math.PI / 2], metalness: .7, roughness: .18, emissive: 0xffc66c, emissiveIntensity: .45, edges: false });\n\n  // Balizadores baixos apenas em uma parede: ritmo elegante, sem aparência de hotel.\n  [-8.45, -9.85, -11.25].forEach((x, index) => {\n    roundedBox([.32, .055, .025], [x, .43, -.055], 0xffd9a0, .288 + index * .003, {\n      radius: .018, emissive: 0xffb65f, emissiveIntensity: 1.85, roughness: .16, edges: false,\n    });\n  });\n\n  // Luz de teto em dois pontos cria profundidade e reflexos no metal do elevador.\n  [-9.35, -11.55].forEach((x, index) => {\n    cylinder(.095, .025, [x, 3.025, .975], 0xffe4bb, .294 + index * .002, {\n      emissive: 0xffc878, emissiveIntensity: 1.55, roughness: .12, edges: false,\n    });\n  });\n  const corridorGlow = new THREE.PointLight(0xffc982, 0, 8.5, 2);\n  corridorGlow.position.set(-10.65, 2.35, .98);\n  apartment.add(corridorGlow);\n\n`;

    source = source.slice(0, start) + hall + source.slice(end);

    // Micro-refinamentos: sombras um pouco mais presentes e materiais menos chapados.
    source = source
      .replace("clearcoat: .16, clearcoatRoughness: .58", "clearcoat: .2, clearcoatRoughness: .48")
      .replace("bumpScale: .028", "bumpScale: .038")
      .replace("bumpScale: .038", "bumpScale: .045")
      .replace("sheen: .28, sheenRoughness: .82", "sheen: .38, sheenRoughness: .74")
      .replace("bumpScale: .018", "bumpScale: .026")
      .replace("renderer.toneMappingExposure = .92 + materialPhase * .18", "renderer.toneMappingExposure = .94 + materialPhase * .2");

    // Executa o arquivo original já refinado. sourceURL facilita depuração no navegador.
    const run = new Function(`${source}\n//# sourceURL=apartment-build-enhanced-runtime.js`);
    run();
  } catch (error) {
    console.error("[Amato Lima] Falha ao carregar maquete refinada:", error);
    // Fallback: nunca deixa a seção quebrar por causa da camada de refinamento.
    const script = document.createElement("script");
    script.src = SOURCE;
    script.defer = true;
    document.head.appendChild(script);
  }
})();
