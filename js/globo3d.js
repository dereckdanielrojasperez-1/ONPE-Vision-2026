// ==========================================================================
// MÓDULO: GLOBO TERRESTRE INTERACTIVO 3D (THREE.JS WEBGL REALISTA)
// ONPE VISIÓN 2026 - Centro de Mando Táctico y Telemetría Nacional D-DAY
// ==========================================================================

let globo3D = {
  container: null,
  canvas: null,
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  earthMesh: null,
  cloudMesh: null,
  atmosphereMesh: null,
  starField: null,
  pinGroup: null,
  arcsGroup: null,
  radarRings: [],
  arcPulses: [],
  raycaster: null,
  mouse: null,
  rotando: true,
  modoNoche: true,
  mostrarNubes: true,
  mostrarRutas: true,
  usuarioArrastrando: false,
  timerReanudarRotacion: null,
  animId: null,
  texturaNoche: null,
  texturaDia: null,
  texturaNubes: null,
  camaraTarget: null,
  vueloProgreso: 1.0,
  hoveredPin: null,
  puntos: [
    {
      id: 'LIMA_SUR',
      lat: -12.0464,
      lng: -77.0428,
      nombre: 'Lima Sur (Almacén Central Lurín / SJM)',
      tipo: 'CRITICO',
      desc: 'Ruptura de geocerca convoy #GAL-104 (Galaga SAC). Retención ejecutada de fianza S/ 64,000 y despacho de convoy de relevo #DEZ-950 con custodia PNP.',
      coords: '-12.1611, -76.9682',
      hora: '06:48 UTC-5',
      precinto: 'DIGITAL-HASH-8F3A',
      unidad: '#GAL-104 / Relevo #DEZ-950'
    },
    {
      id: 'TICLIO',
      lat: -11.5944,
      lng: -76.1950,
      nombre: 'Ticlio (Paso Cordillerano 4,818 msnm)',
      tipo: 'PREVENTIVO',
      desc: 'Alerta térmica: Scania #DEZ-782 a -4°C en carretera central. Auxilio mecánico de Provías Nacional en km 132. Precinto digital intacto con batería al 98%.',
      coords: '-11.5944, -76.1950',
      hora: '06:42 UTC-5',
      precinto: 'DIGITAL-HASH-4B21',
      unidad: 'Scania R450 #DEZ-782'
    },
    {
      id: 'LORETO',
      lat: -3.7437,
      lng: -73.2516,
      nombre: 'Maynas (Río Amazonas - Bellavista Nanay)',
      tipo: 'CONFORME',
      desc: 'Arribo conforme de lancha fluvial #DEZ-365 con material electoral bajo resguardo de Marina de Guerra del Perú.',
      coords: '-3.7437, -73.2516',
      hora: '06:35 UTC-5',
      precinto: 'DIGITAL-HASH-9E11',
      unidad: 'Lancha Rápida #DEZ-365'
    },
    {
      id: 'AREQUIPA',
      lat: -16.4090,
      lng: -71.5375,
      nombre: 'ODPE Arequipa (Centro Cívico)',
      tipo: 'CONFORME',
      desc: 'Convoy blindado #DEZ-528 arribó con 100% de precintos verificados, telemetría continua y custodia de la PNP.',
      coords: '-16.4090, -71.5375',
      hora: '06:15 UTC-5',
      precinto: 'DIGITAL-HASH-6C77',
      unidad: 'Volvo FH Classic #DEZ-528'
    },
    {
      id: 'PUNO',
      lat: -14.2833,
      lng: -70.4333,
      nombre: 'Puno (Macusani / Carabaya)',
      tipo: 'SATELITAL',
      desc: 'Enlace Starlink selva activo con latencia de 64 ms tras corte de fibra óptica comercial por deslizamiento.',
      coords: '-14.2833, -70.4333',
      hora: '06:20 UTC-5',
      precinto: 'DIGITAL-HASH-11A8',
      unidad: 'Camión 4x4 #DEZ-641'
    },
    {
      id: 'COLOMBIA',
      lat: 4.7110,
      lng: -74.0721,
      nombre: 'Referente: Colombia (Registraduría)',
      tipo: 'INTERNACIONAL',
      desc: 'Transmisión de pre-conteo rápido y biometría dactilar en mesas de votación.',
      coords: '4.7110, -74.0721',
      hora: 'BENCHMARK',
      precinto: 'REG-COL-2026',
      unidad: 'Observatorio Internacional'
    },
    {
      id: 'BRASIL',
      lat: -15.7975,
      lng: -47.8919,
      nombre: 'Referente: Brasil (TSE Urna Electrónica)',
      tipo: 'INTERNACIONAL',
      desc: 'Urna biométrica con módulo HSM criptográfico de hardware y firma digital por sección.',
      coords: '-15.7975, -47.8919',
      hora: 'BENCHMARK',
      precinto: 'TSE-BRA-2026',
      unidad: 'Observatorio Internacional'
    },
    {
      id: 'ESTONIA',
      lat: 59.4370,
      lng: 24.7535,
      nombre: 'Referente: Estonia (i-Voting E2E)',
      tipo: 'INTERNACIONAL',
      desc: 'Votación por Internet con cifrado asimétrico y verificación criptográfica forense.',
      coords: '59.4370, 24.7535',
      hora: 'BENCHMARK',
      precinto: 'EST-EID-2026',
      unidad: 'Observatorio Internacional'
    }
  ]
};

// Conversión Lat/Lng a Vector3 3D sobre la esfera
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// INICIALIZACIÓN PRINCIPAL DEL GLOBO 3D
function inicializarGlobo3D() {
  const canvas = document.getElementById('canvas-globo-3d');
  if (!canvas) return;

  if (typeof THREE === 'undefined') {
    setTimeout(inicializarGlobo3D, 150);
    return;
  }

  // Si ya estaba creado, sólo redimensionar y asegurar animación
  if (globo3D.renderer && globo3D.scene && globo3D.camera) {
    onResizeGlobo3D();
    return;
  }

  globo3D.canvas = canvas;
  globo3D.container = canvas.parentElement;

  const rect = globo3D.container.getBoundingClientRect();
  const width = Math.max(rect.width, 320);
  const height = Math.max(rect.height, 460);

  // 1. Renderer WebGL Antialiased de Alto Desempeño
  globo3D.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  globo3D.renderer.setSize(width, height);
  globo3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // 2. Escena 3D
  globo3D.scene = new THREE.Scene();

  // 3. Cámara de Perspectiva
  globo3D.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
  globo3D.camera.position.set(0, 30, 245);

  // 4. OrbitControls con Rotación Libre e Interactividad Completa
  if (typeof THREE.OrbitControls !== 'undefined') {
    globo3D.controls = new THREE.OrbitControls(globo3D.camera, canvas);
    globo3D.controls.enableDamping = true;
    globo3D.controls.dampingFactor = 0.06;
    globo3D.controls.rotateSpeed = 0.75;
    globo3D.controls.zoomSpeed = 1.0;
    globo3D.controls.minDistance = 115;
    globo3D.controls.maxDistance = 500;
    globo3D.controls.enablePan = false;

    // Pausar rotación automática cuando el usuario interactúe con el mouse/touch
    globo3D.controls.addEventListener('start', () => {
      globo3D.usuarioArrastrando = true;
      if (globo3D.timerReanudarRotacion) clearTimeout(globo3D.timerReanudarRotacion);
    });

    globo3D.controls.addEventListener('end', () => {
      // Reanudar rotación tras 6 segundos de inactividad
      if (globo3D.timerReanudarRotacion) clearTimeout(globo3D.timerReanudarRotacion);
      globo3D.timerReanudarRotacion = setTimeout(() => {
        globo3D.usuarioArrastrando = false;
      }, 6000);
    });
  }

  // 5. Sistema de Iluminación Planetaria Equilibrada (Sin brillos cegadores)
  const luzAmbiente = new THREE.AmbientLight(0x1E2E4A, 1.4);
  globo3D.scene.add(luzAmbiente);

  const luzSol = new THREE.DirectionalLight(0xFFF9EE, 1.15);
  luzSol.position.set(220, 100, 180);
  globo3D.scene.add(luzSol);

  const luzRim = new THREE.DirectionalLight(0x00E5FF, 0.55);
  luzRim.position.set(-220, -60, -160);
  globo3D.scene.add(luzRim);

  // 6. Campo de Estrellas en el Fondo Cósmico
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1200;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = 360 + Math.random() * 300;
    starPos[i] = r * Math.sqrt(1 - u * u) * Math.cos(theta);
    starPos[i + 1] = r * Math.sqrt(1 - u * u) * Math.sin(theta);
    starPos[i + 2] = r * u;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0x99D5FF,
    size: 1.5,
    transparent: true,
    opacity: 0.75
  });
  globo3D.starField = new THREE.Points(starGeo, starMat);
  globo3D.scene.add(globo3D.starField);

  // 7. Carga de Texturas Fotorrealistas de la Tierra (NASA Goddard)
  const earthRadius = 70;
  const texLoader = new THREE.TextureLoader();

  // Cargar Texturas desde Base64 garantizando 0 fallos de CORS
  if (typeof TEXTURA_TIERRA_NOCHE_B64 !== 'undefined') {
    globo3D.texturaNoche = texLoader.load(TEXTURA_TIERRA_NOCHE_B64);
  }
  if (typeof TEXTURA_TIERRA_DIA_B64 !== 'undefined') {
    globo3D.texturaDia = texLoader.load(TEXTURA_TIERRA_DIA_B64);
  }

  // 8. Malla de la Tierra (Esfera Geodésica con Material Suave)
  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
  const activeTexture = globo3D.modoNoche ? (globo3D.texturaNoche || globo3D.texturaDia) : globo3D.texturaDia;

  const earthMat = new THREE.MeshPhongMaterial({
    map: activeTexture,
    bumpScale: 0.04,
    specular: new THREE.Color(0x1B2C44),
    shininess: 8,
    emissive: new THREE.Color(0x061122),
    emissiveIntensity: 0.2
  });
  globo3D.earthMesh = new THREE.Mesh(earthGeo, earthMat);
  globo3D.scene.add(globo3D.earthMesh);

  // 9. Capa Atmosférica de Nubes Giratorias
  const cloudGeo = new THREE.SphereGeometry(earthRadius + 1.2, 48, 48);
  if (typeof TEXTURA_TIERRA_NUBES_B64 !== 'undefined') {
    globo3D.texturaNubes = texLoader.load(TEXTURA_TIERRA_NUBES_B64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: globo3D.texturaNubes,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending
    });
    globo3D.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    globo3D.scene.add(globo3D.cloudMesh);
  }

  // 10. Resplandor Atmosférico Azul Horizon Fresnel (Glow ISS)
  const atmosGeo = new THREE.SphereGeometry(earthRadius + 3.2, 64, 64);
  const atmosMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
        gl_FragColor = vec4(0.12, 0.65, 1.0, 1.0) * intensity * 1.35;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });
  globo3D.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
  globo3D.scene.add(globo3D.atmosphereMesh);

  // 11. Grupo de Balizas y Pines Tácticos
  globo3D.pinGroup = new THREE.Group();
  globo3D.scene.add(globo3D.pinGroup);
  globo3D.radarRings = [];

  globo3D.puntos.forEach(pt => {
    crearBalizaTactica3D(pt, earthRadius);
  });

  // 12. Corredores y Rutas Electorales 3D (Curvas Bezier Animadas)
  globo3D.arcsGroup = new THREE.Group();
  globo3D.scene.add(globo3D.arcsGroup);
  globo3D.arcPulses = [];

  const rutasTácticas = [
    { de: 'LIMA_SUR', a: 'TICLIO', color: 0xF5A524 },
    { de: 'LIMA_SUR', a: 'LORETO', color: 0x22D3EE },
    { de: 'LIMA_SUR', a: 'AREQUIPA', color: 0x10B981 },
    { de: 'LIMA_SUR', a: 'PUNO', color: 0x22D3EE },
    { de: 'LIMA_SUR', a: 'COLOMBIA', color: 0x2F8CFF },
    { de: 'LIMA_SUR', a: 'BRASIL', color: 0x2F8CFF }
  ];

  rutasTácticas.forEach(r => {
    const pt1 = globo3D.puntos.find(p => p.id === r.de);
    const pt2 = globo3D.puntos.find(p => p.id === r.a);
    if (pt1 && pt2) crearArcoLogistico3D(pt1, pt2, earthRadius, r.color);
  });

  // 13. Raycasting para Interacción con Ratón (Hover y Clic)
  globo3D.raycaster = new THREE.Raycaster();
  globo3D.mouse = new THREE.Vector2();

    canvas.addEventListener('mousemove', onMouseMoveGlobo3D);

  // Registro de interacción táctil y clic con tolerancia a arrastre
  let pointerDownPos = { x: 0, y: 0, time: 0 };

  canvas.addEventListener('pointerdown', (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY, time: Date.now() };
  });

  canvas.addEventListener('pointerup', (e) => {
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const dist = Math.hypot(dx, dy);
    const dt = Date.now() - pointerDownPos.time;

    // Si el movimiento fue de toque o clic intencional (menor a 9px y menor a 600ms)
    if (dist < 9 && dt < 600) {
      procesarInteraccionPuntoGlobo(e.clientX, e.clientY);
    }
  });

  // Redimensionamiento Responsivo
  window.addEventListener('resize', onResizeGlobo3D);

  // Foco inicial centrado en Perú
  centrarGloboEnPeru();

  if (globo3D.animId) cancelAnimationFrame(globo3D.animId);
  animarGlobo3DLoop();
}

// CREACIÓN DE BALIZAS TÁCTICAS CON HITBOX GENEROSO
function crearBalizaTactica3D(pt, radius) {
  const pos = latLngToVector3(pt.lat, pt.lng, radius);
  const normal = pos.clone().normalize();

  let colorHex = 0x10B981;
  if (pt.tipo === 'CRITICO') colorHex = 0xF0435A;
  else if (pt.tipo === 'PREVENTIVO') colorHex = 0xF5A524;
  else if (pt.tipo === 'SATELITAL') colorHex = 0x22D3EE;
  else if (pt.tipo === 'INTERNACIONAL') colorHex = 0x2F8CFF;

  const pinHolder = new THREE.Group();
  pinHolder.userData = { puntoData: pt, esPinClickable: true };

  // 1. Vástago vertical
  const stalkHeight = 8;
  const stalkGeo = new THREE.CylinderGeometry(0.75, 0.75, stalkHeight, 8);
  stalkGeo.translate(0, stalkHeight / 2, 0);
  stalkGeo.rotateX(Math.PI / 2);
  const stalkMat = new THREE.MeshBasicMaterial({ color: colorHex });
  const stalk = new THREE.Mesh(stalkGeo, stalkMat);
  stalk.position.copy(pos);
  stalk.lookAt(pos.clone().add(normal));
  stalk.userData = { puntoData: pt, esPinClickable: true };
  pinHolder.add(stalk);

  // 2. Cabeza del pin con halo interactivo
  const headGeo = new THREE.SphereGeometry(3.0, 16, 16);
  const headMat = new THREE.MeshBasicMaterial({ color: colorHex });
  const head = new THREE.Mesh(headGeo, headMat);
  const headPos = pos.clone().add(normal.clone().multiplyScalar(stalkHeight));
  head.position.copy(headPos);
  head.userData = { puntoData: pt, esPinClickable: true };
  pinHolder.add(head);

  // 3. Anillo de Radar Pulsante en superficie
  const ringGeo = new THREE.RingGeometry(1.2, 3.8, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.4)));
  ring.lookAt(pos.clone().add(normal));
  ring.userData = { puntoData: pt, esPinClickable: true };
  pinHolder.add(ring);

  globo3D.radarRings.push({ mesh: ring, escala: 1.0, opacidad: 0.85 });

  // 4. Etiqueta 3D tipo HUD
  const canvasLabel = document.createElement('canvas');
  canvasLabel.width = 256;
  canvasLabel.height = 64;
  const ctxL = canvasLabel.getContext('2d');
  ctxL.fillStyle = 'rgba(6, 11, 24, 0.92)';
  ctxL.strokeStyle = '#' + colorHex.toString(16).padStart(6, '0');
  ctxL.lineWidth = 3.0;
  ctxL.fillRect(4, 4, 248, 56);
  ctxL.strokeRect(4, 4, 248, 56);
  ctxL.font = 'bold 22px "Chakra Petch", monospace';
  ctxL.fillStyle = '#FFFFFF';
  ctxL.textAlign = 'center';
  ctxL.textBaseline = 'middle';
  ctxL.fillText(pt.id, 128, 32);

  const texLabel = new THREE.CanvasTexture(canvasLabel);
  const spriteMat = new THREE.SpriteMaterial({ map: texLabel, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.copy(pos.clone().add(normal.clone().multiplyScalar(stalkHeight + 6)));
  sprite.scale.set(16, 4, 1);
  sprite.userData = { puntoData: pt, esPinClickable: true };
  pinHolder.add(sprite);

  // 5. Esfera gigante invisible de colisión (Hitbox de radio 15 para toque y clic infalibles)
  const hitGeo = new THREE.SphereGeometry(15, 12, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false, wireframe: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.copy(headPos);
  hitMesh.userData = { puntoData: pt, esPinClickable: true };
  pinHolder.add(hitMesh);

  globo3D.pinGroup.add(pinHolder);
}

// CREACIÓN DE ARCOS LOGÍSTICOS 3D CURVADOS
function crearArcoLogistico3D(p1, p2, radius, colorHex) {
  const v1 = latLngToVector3(p1.lat, p1.lng, radius);
  const v2 = latLngToVector3(p2.lat, p2.lng, radius);

  // Punto medio elevado sobre la superficie
  const distancia = v1.distanceTo(v2);
  const alturaArco = Math.min(distancia * 0.35, 30);
  const vMedio = v1.clone().add(v2).multiplyScalar(0.5);
  vMedio.normalize().multiplyScalar(radius + alturaArco);

  const curve = new THREE.QuadraticBezierCurve3(v1, vMedio, v2);
  const points = curve.getPoints(45);
  const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

  const arcMat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.55,
    linewidth: 1.5
  });
  const arcLine = new THREE.Line(arcGeo, arcMat);
  globo3D.arcsGroup.add(arcLine);

  // Pulso de energía luminoso que viaja por el arco
  const pulseGeo = new THREE.SphereGeometry(1.2, 8, 8);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
  globo3D.arcsGroup.add(pulseMesh);

  globo3D.arcPulses.push({
    mesh: pulseMesh,
    curve: curve,
    progreso: Math.random(),
    velocidad: 0.006 + Math.random() * 0.004
  });
}

// INTERACCIÓN: MOVIMIENTO DEL RATÓN (HOVER Y CURSOR POINTER)
function onMouseMoveGlobo3D(e) {
  if (!globo3D.renderer || !globo3D.raycaster || !globo3D.pinGroup || !globo3D.camera) return;
  const rect = globo3D.canvas.getBoundingClientRect();
  globo3D.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  globo3D.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  globo3D.raycaster.setFromCamera(globo3D.mouse, globo3D.camera);
  const intersects = globo3D.raycaster.intersectObjects(globo3D.pinGroup.children, true);

  if (intersects.length > 0) {
    globo3D.canvas.style.cursor = 'pointer';
    let obj = intersects[0].object;
    while (obj && !obj.userData?.puntoData && obj.parent) {
      obj = obj.parent;
    }
    if (obj && obj.userData?.puntoData) {
      globo3D.hoveredPin = obj.userData.puntoData;
    }
  } else {
    // Verificar si el cursor está cerca de algún punto sobre la esfera terrestre
    if (globo3D.earthMesh) {
      const earthHits = globo3D.raycaster.intersectObject(globo3D.earthMesh);
      if (earthHits.length > 0) {
        const cp = earthHits[0].point;
        let cerca = false;
        globo3D.puntos.forEach(pt => {
          const h = globo3D.pinGroup?.children.find(c => c.userData?.puntoData?.id === pt.id);
          if (h) {
            const wp = new THREE.Vector3();
            h.getWorldPosition(wp);
            if (wp.distanceTo(cp) < 28) cerca = true;
          }
        });
        globo3D.canvas.style.cursor = cerca ? 'pointer' : 'grab';
        return;
      }
    }
    globo3D.canvas.style.cursor = 'grab';
    globo3D.hoveredPin = null;
  }
}

// PROCESADOR CENTRAL DE CLICS Y TOQUES EN EL GLOBO 3D (INFALIBLE)
function procesarInteraccionPuntoGlobo(clientX, clientY) {
  if (!globo3D.renderer || !globo3D.raycaster || !globo3D.camera) return;
  const rect = globo3D.canvas.getBoundingClientRect();
  globo3D.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  globo3D.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  globo3D.raycaster.setFromCamera(globo3D.mouse, globo3D.camera);

  // 1. Raycast directo a los pines tácticos (y sus hitboxes generosos de radio 15)
  if (globo3D.pinGroup) {
    const pinIntersects = globo3D.raycaster.intersectObjects(globo3D.pinGroup.children, true);
    if (pinIntersects.length > 0) {
      for (const hit of pinIntersects) {
        let obj = hit.object;
        while (obj && !obj.userData?.puntoData && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.puntoData) {
          seleccionarPuntoGlobo(obj.userData.puntoData);
          return;
        }
      }
    }
  }

  // 2. Raycast secundario por proximidad en la superficie terrestre
  if (globo3D.earthMesh) {
    const earthIntersects = globo3D.raycaster.intersectObject(globo3D.earthMesh);
    if (earthIntersects.length > 0) {
      const clickPoint = earthIntersects[0].point;
      let puntoMasCercano = null;
      let distanciaMinima = Infinity;

      globo3D.puntos.forEach(pt => {
        const holder = globo3D.pinGroup?.children.find(c => c.userData?.puntoData?.id === pt.id);
        if (holder) {
          const worldPos = new THREE.Vector3();
          holder.getWorldPosition(worldPos);
          const d = worldPos.distanceTo(clickPoint);
          if (d < distanciaMinima) {
            distanciaMinima = d;
            puntoMasCercano = pt;
          }
        }
      });

      // Si el toque fue a menos de 30 unidades del punto táctico
      if (puntoMasCercano && distanciaMinima < 30) {
        seleccionarPuntoGlobo(puntoMasCercano);
        return;
      }
    }
  }
}

// SELECCIÓN ACTIVA DE UN PUNTO TÁCTICO CON VUELO DE CÁMARA Y DIAGNÓSTICO
function seleccionarPuntoGlobo(pt) {
  if (!pt) return;

  // 1. Pausar rotación automática para examen estático
  globo3D.rotando = false;
  actualizarEstadoBotonRotar();

  // 2. Calcular la posición mundial real considerando la rotación actual del globo
  const holder = globo3D.pinGroup?.children.find(c => c.userData?.puntoData?.id === pt.id);
  let camTargetPos = null;

  if (holder) {
    const worldPos = new THREE.Vector3();
    holder.getWorldPosition(worldPos);
    camTargetPos = worldPos.clone().normalize().multiplyScalar(170);
  } else {
    const rotY = globo3D.earthMesh ? globo3D.earthMesh.rotation.y : 0;
    const posMundo = latLngToVector3(pt.lat, pt.lng, 170);
    posMundo.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
    camTargetPos = posMundo;
  }

  globo3D.camaraTarget = camTargetPos;
  globo3D.vueloProgreso = 0.0;

  // 3. Efecto visual de resaltado (pulso de escala en el pin)
  if (holder) {
    holder.scale.set(1.4, 1.4, 1.4);
    setTimeout(() => {
      if (holder) holder.scale.set(1.0, 1.0, 1.0);
    }, 1200);
  }

  // 4. Actualizar botones activos de la barra de puntos
  document.querySelectorAll('.btn-punto-globo').forEach(b => {
    b.classList.toggle('activo', b.getAttribute('data-punto-id') === pt.id);
  });

  // 5. Mostrar la tarjeta flotante con datos oficiales y contingencia
  mostrarCardGloboPin(pt);

  // 6. Notificación táctica
  if (typeof mostrarToast === 'function') {
    mostrarToast(`Punto táctico enfocado: ${pt.nombre}`, 'info');
  }

  // 7. Si la síntesis de voz está activa, hablar el diagnóstico
  if (typeof estadoApp !== 'undefined' && estadoApp.vozChatbotActiva && typeof hablarTexto === 'function') {
    hablarTexto(`${pt.nombre}. ${pt.desc}`);
  }
}

// SELECCIÓN EXTERNA POR ID (PARA BOTONES HUD, BARRA DE PUNTOS Y PANELES)
function seleccionarPuntoGloboPorId(id) {
  if (!globo3D.puntos) return;
  const pt = globo3D.puntos.find(p => p.id === id);
  if (pt) {
    seleccionarPuntoGlobo(pt);
  }
}

// PREGUNTAR AL COPILOTO SOBRE EL PUNTO TÁCTICO ENFOCADO
function consultarPinEnChatbot(idOpcional) {
  let nombre = '';
  if (idOpcional && globo3D.puntos) {
    const pt = globo3D.puntos.find(p => p.id === idOpcional);
    if (pt) nombre = pt.nombre;
  }
  if (!nombre) {
    const titEl = document.getElementById('pin-globo-titulo');
    nombre = titEl ? titEl.textContent : 'este punto';
  }
  
  // Abrir ventana del chatbot si está cerrada
  const winChat = document.getElementById('ventana-chatbot');
  if (winChat && winChat.classList.contains('oculto')) {
    if (typeof toggleVentanaChatbot === 'function') toggleVentanaChatbot();
  }
  
  if (typeof enviarMensajeChat === 'function') {
    enviarMensajeChat(`¿Qué contingencia o reporte corresponde a ${nombre}?`);
  }
}

// EXPORTAR A WINDOW PARA ACCESO GLOBAL
window.globo3D = globo3D;
window.seleccionarPuntoGlobo = seleccionarPuntoGlobo;
window.seleccionarPuntoGloboPorId = seleccionarPuntoGloboPorId;
window.consultarPinEnChatbot = consultarPinEnChatbot;
window.procesarInteraccionPuntoGlobo = procesarInteraccionPuntoGlobo;


// BUCLE DE RENDERIZADO Y ANIMACIÓN
function animarGlobo3DLoop() {
  globo3D.animId = requestAnimationFrame(animarGlobo3DLoop);

  const vista = document.getElementById('vista-gestion-proyecto');
  if (vista && !vista.classList.contains('activa')) return;

  // 1. Rotación lenta y majestuosa de la Tierra (si no está arrastrando)
  if (globo3D.rotando && !globo3D.usuarioArrastrando && globo3D.earthMesh && globo3D.vueloProgreso >= 1.0) {
    globo3D.earthMesh.rotation.y += 0.0012;
    if (globo3D.pinGroup) globo3D.pinGroup.rotation.y += 0.0012;
    if (globo3D.arcsGroup) globo3D.arcsGroup.rotation.y += 0.0012;
  }

  // 2. Rotación de las nubes con velocidad diferencial para realismo
  if (globo3D.cloudMesh && globo3D.mostrarNubes) {
    globo3D.cloudMesh.rotation.y += 0.0018;
  }

  // 3. Animación de anillos de radar pulsantes
  globo3D.radarRings.forEach(item => {
    item.escala += 0.022;
    item.opacidad -= 0.015;
    if (item.escala > 2.6) {
      item.escala = 1.0;
      item.opacidad = 0.8;
    }
    item.mesh.scale.set(item.escala, item.escala, item.escala);
    item.mesh.material.opacity = Math.max(0, item.opacidad);
  });

  // 4. Animación de pulsos luminosos a lo largo de los arcos 3D
  if (globo3D.mostrarRutas) {
    globo3D.arcPulses.forEach(item => {
      item.progreso += item.velocidad;
      if (item.progreso > 1.0) item.progreso = 0.0;
      const puntoEnCurva = item.curve.getPoint(item.progreso);
      item.mesh.position.copy(puntoEnCurva);
    });
  }

  // 5. Vuelo suave de la cámara (interpolación lerp)
  if (globo3D.camaraTarget && globo3D.vueloProgreso < 1.0) {
    globo3D.vueloProgreso += 0.035;
    globo3D.camera.position.lerp(globo3D.camaraTarget, 0.08);
    globo3D.camera.lookAt(0, 0, 0);
  }

  // 6. Actualizar OrbitControls
  if (globo3D.controls) {
    globo3D.controls.update();
  }

  // 7. Renderizar frame
  if (globo3D.renderer && globo3D.scene && globo3D.camera) {
    globo3D.renderer.render(globo3D.scene, globo3D.camera);
  }
}

// REDIMENSIONAMIENTO RESPONSIVO
function onResizeGlobo3D() {
  if (!globo3D.renderer || !globo3D.container || !globo3D.camera) return;
  const rect = globo3D.container.getBoundingClientRect();
  const width = Math.max(rect.width, 320);
  const height = Math.max(rect.height, 460);
  globo3D.camera.aspect = width / height;
  globo3D.camera.updateProjectionMatrix();
  globo3D.renderer.setSize(width, height);
}

// ACCIONES DE LOS CONTROLES HUD
function toggleRotacionGlobo() {
  globo3D.rotando = !globo3D.rotando;
  actualizarEstadoBotonRotar();
}

function actualizarEstadoBotonRotar() {
  const txt = document.getElementById('txt-btn-rotar');
  const btn = document.getElementById('btn-globo-rotar');
  if (txt) txt.textContent = globo3D.rotando ? 'Pausar' : 'Reanudar';
  if (btn) btn.classList.toggle('activo', globo3D.rotando);
}

function centrarGloboEnPeru() {
  const posPeru = latLngToVector3(-10.0, -75.5, 175);
  globo3D.camaraTarget = posPeru;
  globo3D.vueloProgreso = 0.0;
  if (typeof mostrarToast === 'function') {
    mostrarToast('Foco táctico centrado en el territorio peruano', 'info');
  }
}

function alternarModoTexturaGlobo() {
  globo3D.modoNoche = !globo3D.modoNoche;
  const txt = document.getElementById('txt-btn-textura');
  const btn = document.getElementById('btn-globo-modo-textura');

  if (globo3D.earthMesh) {
    const texNueva = globo3D.modoNoche ? globo3D.texturaNoche : globo3D.texturaDia;
    if (texNueva) {
      globo3D.earthMesh.material.map = texNueva;
      globo3D.earthMesh.material.needsUpdate = true;
    }
  }

  if (txt) txt.textContent = globo3D.modoNoche ? 'Modo Noche' : 'Modo Día';
  if (btn) btn.classList.toggle('activo', globo3D.modoNoche);

  if (typeof mostrarToast === 'function') {
    mostrarToast(`Textura planetaria: ${globo3D.modoNoche ? 'Noche (Luces de Ciudades NASA)' : 'Día (Satelital Blue Marble)'}`, 'info');
  }
}

function toggleNubesGlobo() {
  globo3D.mostrarNubes = !globo3D.mostrarNubes;
  if (globo3D.cloudMesh) globo3D.cloudMesh.visible = globo3D.mostrarNubes;
  const btn = document.getElementById('btn-globo-nubes');
  if (btn) btn.classList.toggle('activo', globo3D.mostrarNubes);
}

function toggleRutasGlobo() {
  globo3D.mostrarRutas = !globo3D.mostrarRutas;
  if (globo3D.arcsGroup) globo3D.arcsGroup.visible = globo3D.mostrarRutas;
  const btn = document.getElementById('btn-globo-rutas');
  if (btn) btn.classList.toggle('activo', globo3D.mostrarRutas);
}

function reiniciarZoomGlobo() {
  globo3D.camaraTarget = new THREE.Vector3(0, 30, 245);
  globo3D.vueloProgreso = 0.0;
}

function mostrarCardGloboPin(pt) {
  const card = document.getElementById('card-globo-pin-info');
  if (!card) return;

  const tit = document.getElementById('pin-globo-titulo');
  const desc = document.getElementById('pin-globo-desc');
  const coords = document.getElementById('pin-globo-coords');
  const hora = document.getElementById('pin-globo-hora');

  if (tit) tit.textContent = pt.nombre;
  if (desc) desc.textContent = pt.desc;
  if (coords) coords.textContent = `COORDS: ${pt.coords} | UNIDAD: ${pt.unidad || 'Convoy PNP'}`;
  if (hora) hora.textContent = `HORA REGISTRO: ${pt.hora} | PRECINTO: ${pt.precinto || 'VERIFICADO'}`;

  const badge = document.getElementById('pin-globo-tipo');
  if (badge) {
    if (pt.tipo === 'CRITICO') {
      badge.className = 'badge-estado badge-incumplimiento';
      badge.textContent = 'INCIDENCIA CRÍTICA';
    } else if (pt.tipo === 'PREVENTIVO') {
      badge.className = 'badge-estado badge-alerta-amarilla';
      badge.textContent = 'ALERTA PREVENTIVA';
    } else if (pt.tipo === 'SATELITAL') {
      badge.className = 'badge-estado badge-sla';
      badge.textContent = 'ENLACE SATELITAL';
    } else {
      badge.className = 'badge-estado badge-conforme';
      badge.textContent = 'CONFORME / BENCHMARK';
    }
  }

  card.style.display = 'block';
}

function cerrarCardGloboPin() {
  const card = document.getElementById('card-globo-pin-info');
  if (card) card.style.display = 'none';
}

function ejecutarAccionPinGlobo() {
  cerrarCardGloboPin();
  cambiarVistaWeb('dashboard');
  if (typeof mostrarToast === 'function') {
    mostrarToast('Cargando solución de contingencia y geocercas en Centro de Mando...', 'info');
  }
}
