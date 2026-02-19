// تهيئة المشهد
let scene, camera, renderer, controls, composer;
let currentGalaxy,
  galaxies = [];
let stars = [];
let nebulae = [];
let autoRotate = true;
let currentType = "spiral";
let rotationSpeed = 0.001;
let showStars = true;
let showNebulae = true;
let galaxyCollision = false;
let collisionProgress = 0;

// بيانات أنواع المجرات
const galaxyTypes = {
  spiral: {
    name: "المجرة الحلزونية",
    description: "أذرع حلزونية جميلة تحوي مناطق تشكل نجوم جديدة",
    shape: "أذرع حلزونية",
    stars: "100-400 مليار",
    size: "30,000-100,000 سنة ضوئية",
    blackhole: "ثقب أسود فائق الكتلة",
    age: "10-13 مليار سنة",
    example: "درب التبانة، أندروميدا",
    color: 0x9664ff,
    radius: 10,
    armCount: 4,
  },
  elliptical: {
    name: "المجرة الإهليلجية",
    description: "شكل بيضاوي، غالباً ما تكون قديمة مع نجوم حمراء",
    shape: "إهليلجية/بيضاوية",
    stars: "10 مليار - تريليون",
    size: "3,000-300,000 سنة ضوئية",
    blackhole: "ثقب أسود فائق الكتلة",
    age: "10-13 مليار سنة",
    example: "M87، M60",
    color: 0xff9966,
    radius: 8,
    ellipticity: 0.7,
  },
  irregular: {
    name: "المجرة غير المنتظمة",
    description: "لا تملك شكل محدد، غالباً ما تكون صغيرة وتشكل نجوم جديدة",
    shape: "غير منتظمة",
    stars: "100 مليون - 10 مليار",
    size: "3,000-30,000 سنة ضوئية",
    blackhole: "صغير أو معدوم",
    age: "1-10 مليار سنة",
    example: "سحابة ماجلان الكبرى",
    color: 0x66ff99,
    radius: 6,
    irregularity: 0.8,
  },
  lenticular: {
    name: "المجرة العدسية",
    description: "شكل قرص بدون أذرع حلزونية واضحة",
    shape: "قرصية بدون أذرع",
    stars: "100-400 مليار",
    size: "30,000-100,000 سنة ضوئية",
    blackhole: "ثقب أسود فائق الكتلة",
    age: "10-13 مليار سنة",
    example: "NGC 5866",
    color: 0x66ccff,
    radius: 9,
    bulgeSize: 0.4,
  },
  barred: {
    name: "المجرة الحلزونية المصراعية",
    description: "تحوي شريط مركزي من النجوم يربط الأذرع الحلزونية",
    shape: "شريط مركزي مع أذرع",
    stars: "100-400 مليار",
    size: "30,000-100,000 سنة ضوئية",
    blackhole: "ثقب أسود فائق الكتلة",
    age: "10-13 مليار سنة",
    example: "درب التبانة، NGC 1300",
    color: 0xff66cc,
    radius: 10,
    barLength: 0.6,
  },
};

// بيانات المجرات المشهورة
const famousGalaxies = {
  milkyway: {
    name: "درب التبانة",
    type: "barred",
    description: "مجرة حلزونية مصراعية، موطن نظامنا الشمسي",
    stars: "100-400 مليار",
    size: "100,000 سنة ضوئية",
    distance: "26,000 سنة ضوئية من المركز",
    features: "4 أذرع حلزونية رئيسية، ثقب أسود مركزي",
  },
  andromeda: {
    name: "أندروميدا (M31)",
    type: "spiral",
    description: "أكبر مجرة في المجموعة المحلية، تتجه نحو درب التبانة",
    stars: "تريليون نجمة",
    size: "220,000 سنة ضوئية",
    distance: "2.5 مليون سنة ضوئية",
    features: "تتصادم مع درب التبانة خلال 4.5 مليار سنة",
  },
  sombrero: {
    name: "مجرة سومبريرو (M104)",
    type: "spiral",
    description: "شكلها يشبه قبعة سومبريرو مع حافة غبارية بارزة",
    stars: "800 مليار",
    size: "50,000 سنة ضوئية",
    distance: "28 مليون سنة ضوئية",
    features: "قرص غبار ضخم، انتفاخ مركزي كبير",
  },
  whirlpool: {
    name: "المجرة الدوامة (M51)",
    type: "spiral",
    description: "مجرة حلزونية كلاسيكية مع مجرة مرافقة",
    stars: "160 مليار",
    size: "60,000 سنة ضوئية",
    distance: "23 مليون سنة ضوئية",
    features: "أذرع حلزونية مثالية، تفاعل مع مجرة قزمة",
  },
  triangulum: {
    name: "مجرة المثلث (M33)",
    type: "spiral",
    description: "ثالث أكبر مجرة في المجموعة المحلية",
    stars: "40 مليار",
    size: "50,000 سنة ضوئية",
    distance: "2.7 مليون سنة ضوئية",
    features: "مجرة حلزونية بدون انتفاخ مركزي كبير",
  },
};

function init() {
  // إنشاء المشهد
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0020, 50, 500);

  // إنشاء الكاميرا
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 15, 40);

  // إنشاء الـ Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document
    .getElementById("galaxies-container")
    .appendChild(renderer.domElement);

  // إنشاء EffectComposer للتأثيرات البصرية
  composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  // إضافة تأثيرات الشادر للنجوم البعيدة
  addStarEffects();

  // إضافة التحكم بالكاميرا
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 10;
  controls.maxDistance = 200;
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;

  // إضافة الإضاءة
  setupLighting();

  // إنشاء المجرة الحالية
  createGalaxy();

  // إنشاء النجوم البعيدة
  createDistantStars();

  // إنشاء السدم
  createNebulae();

  // إضافة أحداث النافذة
  window.addEventListener("resize", onWindowResize);

  // إعداد أدوات التحكم
  setupControls();

  // إضافة أحداث النقر على الأنواع
  setupTypeEvents();

  // إضافة أحداث المجرات المشهورة
  setupFamousGalaxies();

  // بدء الحركة
  animate();
}

function setupLighting() {
  // إضاءة من المركز (الثقب الأسود/الانتفاخ)
  const coreLight = new THREE.PointLight(0x9664ff, 2, 100);
  coreLight.position.set(0, 0, 0);
  scene.add(coreLight);

  // إضاءة محيطية
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  // إضاءة اتجاهية للقرص
  const diskLight = new THREE.DirectionalLight(0xffffff, 0.8);
  diskLight.position.set(0, 1, 0);
  scene.add(diskLight);
}

function createGalaxy() {
  // مسح المجرة الحالية إذا وجدت
  galaxies.forEach((galaxy) => scene.remove(galaxy));
  galaxies = [];

  const typeData = galaxyTypes[currentType];

  // إنشاء المجرة حسب النوع
  switch (currentType) {
    case "spiral":
      createSpiralGalaxy(typeData);
      break;
    case "elliptical":
      createEllipticalGalaxy(typeData);
      break;
    case "irregular":
      createIrregularGalaxy(typeData);
      break;
    case "lenticular":
      createLenticularGalaxy(typeData);
      break;
    case "barred":
      createBarredSpiralGalaxy(typeData);
      break;
  }

  // إنشاء الثقب الأسود المركزي
  createCentralBlackHole(typeData);

  // إنشاء الانتفاخ المركزي
  createGalacticBulge(typeData);

  // إنشاء الهالة النجمية
  createGalacticHalo(typeData);

  // تحديث العرض
  updateGalaxyInfo(typeData);
}

function createSpiralGalaxy(typeData) {
  const armCount = typeData.armCount;
  const galaxyRadius = typeData.radius * 10;

  // إنشاء الأذرع الحلزونية
  for (let arm = 0; arm < armCount; arm++) {
    const armAngle = (arm / armCount) * Math.PI * 2;

    // إنشاء الذراع باستخدام جسيمات
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // حساب الموضع على الذراع الحلزوني
      const t = i / particleCount;
      const radius = t * galaxyRadius;

      // معادلة الحلزون اللوغاريتمي
      const angle = armAngle + t * Math.PI * 4;
      const spiralFactor = 0.3; // مدى التفاف الذراع

      const x = Math.cos(angle + Math.log(radius + 1) * spiralFactor) * radius;
      const y = (Math.random() - 0.5) * 0.5; // ارتفاع بسيط
      const z = Math.sin(angle + Math.log(radius + 1) * spiralFactor) * radius;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // ألوان النجوم في الذراع
      // النجوم الشابة زرقاء في المناطق الداخلية، النجوم الأكبر سناً حمراء في الخارج
      const age = t;
      if (age < 0.3) {
        // نجوم زرقاء شابة
        colors[i3] = 0.4;
        colors[i3 + 1] = 0.6;
        colors[i3 + 2] = 1.0;
      } else if (age < 0.7) {
        // نجوم صفراء متوسطة
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 0.6;
      } else {
        // نجوم حمراء قديمة
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.6;
        colors[i3 + 2] = 0.4;
      }

      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const armParticles = new THREE.Points(geometry, material);
    galaxies.push(armParticles);
    scene.add(armParticles);
  }

  // إضافة مناطق تشكل النجوم (سدم) في الأذرع
  createStarFormationRegions(typeData);
}

function createEllipticalGalaxy(typeData) {
  const galaxyRadius = typeData.radius * 8;
  const ellipticity = typeData.ellipticity;

  // إنشاء مجرة إهليلجية باستخدام جسيمات
  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // توزيع إهليلجي للنجوم
    const u = Math.pow(Math.random(), 1 / 3);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const radius = u * galaxyRadius;

    // تطبيق الشكل الإهليلجي
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * ellipticity;
    const z = radius * Math.cos(phi);

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // ألوان النجوم في المجرات الإهليلجية (معظمها حمراء/صفراء)
    const colorRand = Math.random();
    if (colorRand < 0.7) {
      // نجوم حمراء قديمة
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.6;
      colors[i3 + 2] = 0.4;
    } else if (colorRand < 0.9) {
      // نجوم صفراء متوسطة
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.9;
      colors[i3 + 2] = 0.6;
    } else {
      // بعض النجوم الزرقاء
      colors[i3] = 0.4;
      colors[i3 + 1] = 0.6;
      colors[i3 + 2] = 1.0;
    }

    sizes[i] = 0.3 + Math.random() * 1.2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const galaxyParticles = new THREE.Points(geometry, material);
  galaxies.push(galaxyParticles);
  scene.add(galaxyParticles);
}

function createIrregularGalaxy(typeData) {
  const galaxyRadius = typeData.radius * 6;
  const irregularity = typeData.irregularity;

  // إنشاء مجرة غير منتظمة
  const particleCount = 3000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // توزيع غير منتظم مع بعض التكتلات
    const cluster = Math.floor(Math.random() * 3);
    const clusterCenter = [
      (Math.random() - 0.5) * galaxyRadius,
      (Math.random() - 0.5) * galaxyRadius * 0.5,
      (Math.random() - 0.5) * galaxyRadius,
    ];

    const clusterRadius = galaxyRadius * (0.2 + Math.random() * 0.3);

    // إحداثيات كروية مع تشويه
    const u = Math.pow(Math.random(), 1 / 3);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const radius = u * clusterRadius * irregularity;

    const x = clusterCenter[0] + radius * Math.sin(phi) * Math.cos(theta);
    const y =
      clusterCenter[1] +
      radius * Math.sin(phi) * Math.sin(theta) * (0.5 + Math.random() * 0.5);
    const z = clusterCenter[2] + radius * Math.cos(phi);

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // ألوان النجوم في المجرات غير المنتظمة (شابة وزرقاء)
    const age = Math.random();
    if (age < 0.6) {
      // نجوم زرقاء شابة
      colors[i3] = 0.3;
      colors[i3 + 1] = 0.5;
      colors[i3 + 2] = 1.0;
    } else if (age < 0.9) {
      // نجوم بيضاء
      colors[i3] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 1.0;
    } else {
      // بعض النجوم الحمراء
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.7;
      colors[i3 + 2] = 0.5;
    }

    sizes[i] = 0.4 + Math.random() * 1.6;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const galaxyParticles = new THREE.Points(geometry, material);
  galaxies.push(galaxyParticles);
  scene.add(galaxyParticles);

  // إضافة مناطق تشكل نجوم كثيفة
  createDenseStarFormationRegions(typeData);
}

function createLenticularGalaxy(typeData) {
  const galaxyRadius = typeData.radius * 9;
  const bulgeSize = typeData.bulgeSize;

  // إنشاء مجرة عدسية (قرص بدون أذرع واضحة)
  const particleCount = 4000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // توزيع قرصي مسطح
    const t = Math.random();
    const radius = Math.sqrt(t) * galaxyRadius;
    const angle = Math.random() * Math.PI * 2;

    // ارتفاع في القرص (مسطح جداً)
    const height = (Math.random() - 0.5) * galaxyRadius * 0.1;

    // إضافة انتفاخ مركزي
    const bulgeFactor = Math.exp(-radius / (galaxyRadius * bulgeSize));
    const bulgeHeight = height * (1 + bulgeFactor * 2);

    const x = Math.cos(angle) * radius;
    const y = bulgeHeight;
    const z = Math.sin(angle) * radius;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // ألوان النجوم في المجرات العدسية (مختلطة)
    const colorRand = Math.random();
    if (colorRand < 0.4) {
      // نجوم صفراء
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.9;
      colors[i3 + 2] = 0.6;
    } else if (colorRand < 0.7) {
      // نجوم برتقالية
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.7;
      colors[i3 + 2] = 0.4;
    } else {
      // نجوم حمراء
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.5;
      colors[i3 + 2] = 0.3;
    }

    sizes[i] = 0.3 + Math.random() * 1.0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const galaxyParticles = new THREE.Points(geometry, material);
  galaxies.push(galaxyParticles);
  scene.add(galaxyParticles);
}

function createBarredSpiralGalaxy(typeData) {
  const galaxyRadius = typeData.radius * 10;
  const barLength = typeData.barLength;

  // 1. إنشاء الشريط المركزي
  const barParticleCount = 1000;
  const barGeometry = new THREE.BufferGeometry();
  const barPositions = new Float32Array(barParticleCount * 3);
  const barColors = new Float32Array(barParticleCount * 3);
  const barSizes = new Float32Array(barParticleCount);

  for (let i = 0; i < barParticleCount; i++) {
    const i3 = i * 3;

    // توزيع على شكل شريط مستطيل
    const barHalfLength = galaxyRadius * barLength;
    const barWidth = galaxyRadius * 0.2;
    const barHeight = galaxyRadius * 0.1;

    const x = (Math.random() - 0.5) * barHalfLength * 2;
    const y = (Math.random() - 0.5) * barHeight;
    const z = (Math.random() - 0.5) * barWidth;

    barPositions[i3] = x;
    barPositions[i3 + 1] = y;
    barPositions[i3 + 2] = z;

    // نجوم صفراء/برتقالية في الشريط
    barColors[i3] = 1.0;
    barColors[i3 + 1] = 0.8;
    barColors[i3 + 2] = 0.5;

    barSizes[i] = 0.4 + Math.random() * 1.2;
  }

  barGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(barPositions, 3)
  );
  barGeometry.setAttribute("color", new THREE.BufferAttribute(barColors, 3));
  barGeometry.setAttribute("size", new THREE.BufferAttribute(barSizes, 1));

  const barMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const bar = new THREE.Points(barGeometry, barMaterial);
  galaxies.push(bar);
  scene.add(bar);

  // 2. إنشاء الأذرع الحلزونية الخارجة من طرفي الشريط
  const armCount = 2;
  for (let arm = 0; arm < armCount; arm++) {
    const armAngle = (arm / armCount) * Math.PI;

    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const t = i / particleCount;
      const radius =
        galaxyRadius * barLength + t * (galaxyRadius * (1 - barLength));

      // بدء الذراع من طرف الشريط
      const startAngle = armAngle;
      const spiralAngle = startAngle + t * Math.PI * 2;

      const x = Math.cos(spiralAngle) * radius;
      const y = (Math.random() - 0.5) * 0.3;
      const z = Math.sin(spiralAngle) * radius;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // ألوان النجوم في الأذرع
      const age = t;
      if (age < 0.3) {
        colors[i3] = 0.4;
        colors[i3 + 1] = 0.6;
        colors[i3 + 2] = 1.0;
      } else if (age < 0.7) {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 0.6;
      } else {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.6;
        colors[i3 + 2] = 0.4;
      }

      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const armParticles = new THREE.Points(geometry, material);
    galaxies.push(armParticles);
    scene.add(armParticles);
  }
}

function createCentralBlackHole(typeData) {
  // إنشاء الثقب الأسود المركزي
  const blackHoleRadius = typeData.radius * 0.2;

  const blackHoleGeometry = new THREE.SphereGeometry(blackHoleRadius, 32, 32);
  const blackHoleMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    emissive: 0x330000,
    emissiveIntensity: 0.3,
  });

  const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
  galaxies.push(blackHole);
  scene.add(blackHole);

  // إضافة توهج حول الثقب الأسود
  const glowGeometry = new THREE.SphereGeometry(blackHoleRadius * 1.5, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      glowColor: { value: new THREE.Color(0xff3333) },
    },
    vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform float time;
            uniform vec3 glowColor;
            varying vec3 vNormal;
            
            void main() {
                float intensity = 0.5 + 0.5 * sin(time * 2.0);
                float glow = intensity * (1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))));
                vec3 finalColor = glowColor * glow * 0.5;
                gl_FragColor = vec4(finalColor, glow * 0.3);
            }
        `,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.userData = { material: glowMaterial };
  galaxies.push(glow);
  scene.add(glow);
}

function createGalacticBulge(typeData) {
  // إنشاء الانتفاخ المركزي للمجرة
  const bulgeRadius = typeData.radius * 2;

  const bulgeGeometry = new THREE.SphereGeometry(bulgeRadius, 32, 32);
  const bulgeMaterial = new THREE.MeshBasicMaterial({
    color: typeData.color,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  });

  const bulge = new THREE.Mesh(bulgeGeometry, bulgeMaterial);
  galaxies.push(bulge);
  scene.add(bulge);
}

function createGalacticHalo(typeData) {
  // إنشاء الهالة النجمية المحيطة بالمجرة
  const haloRadius = typeData.radius * 15;

  const haloGeometry = new THREE.SphereGeometry(haloRadius, 32, 32);
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: typeData.color,
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide,
  });

  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  galaxies.push(halo);
  scene.add(halo);

  // إضافة نجوم متفرقة في الهالة
  const haloStarCount = 500;
  for (let i = 0; i < haloStarCount; i++) {
    const starGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc99,
      emissive: 0xff9966,
      emissiveIntensity: 0.3,
    });

    const star = new THREE.Mesh(starGeometry, starMaterial);

    // توزيع كروي حول المجرة
    const distance =
      typeData.radius * 8 + Math.random() * (haloRadius - typeData.radius * 8);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    star.position.x = distance * Math.sin(phi) * Math.cos(theta);
    star.position.y = distance * Math.sin(phi) * Math.sin(theta);
    star.position.z = distance * Math.cos(phi);

    galaxies.push(star);
    scene.add(star);
  }
}

function createStarFormationRegions(typeData) {
  // إنشاء مناطق تشكل النجوم (سدم) في الأذرع الحلزونية
  const regionCount = 8;

  for (let i = 0; i < regionCount; i++) {
    const angle = (i / regionCount) * Math.PI * 2;
    const radius = typeData.radius * (4 + Math.random() * 4);

    const nebulaGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 0.5;
    const z = Math.sin(angle) * radius;

    nebula.position.set(x, y, z);

    galaxies.push(nebula);
    scene.add(nebula);
  }
}

function createDenseStarFormationRegions(typeData) {
  // إنشاء مناطق تشكل نجوم كثيفة في المجرات غير المنتظمة
  const regionCount = 5;

  for (let i = 0; i < regionCount; i++) {
    const regionRadius = typeData.radius * (0.5 + Math.random() * 2);
    const regionAngle = Math.random() * Math.PI * 2;

    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let j = 0; j < particleCount; j++) {
      const j3 = j * 3;

      // توزيع كروي في المنطقة
      const u = Math.pow(Math.random(), 1 / 3);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const distance = u * regionRadius;

      const x =
        Math.cos(regionAngle) * distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = Math.sin(regionAngle) * distance * Math.cos(phi);

      positions[j3] = x;
      positions[j3 + 1] = y;
      positions[j3 + 2] = z;

      // ألوان النجوم الشابة (زرقاء/بيضاء)
      colors[j3] = 0.3 + Math.random() * 0.3;
      colors[j3 + 1] = 0.5 + Math.random() * 0.3;
      colors[j3 + 2] = 0.8 + Math.random() * 0.2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const starCluster = new THREE.Points(geometry, material);
    galaxies.push(starCluster);
    scene.add(starCluster);
  }
}

function createDistantStars() {
  // إنشاء النجوم البعيدة في الخلفية
  if (!showStars) return;

  const starCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;

    // توزيع كروي للنجوم البعيدة
    const distance = 200 + Math.random() * 800;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = distance * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = distance * Math.cos(phi);

    // ألوان مختلفة للنجوم
    const starType = Math.random();
    if (starType < 0.6) {
      // نجوم صفراء/بيضاء
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.9 + Math.random() * 0.1;
      colors[i3 + 2] = 0.8 + Math.random() * 0.2;
    } else if (starType < 0.8) {
      // نجوم زرقاء
      colors[i3] = 0.6 + Math.random() * 0.2;
      colors[i3 + 1] = 0.7 + Math.random() * 0.2;
      colors[i3 + 2] = 1.0;
    } else if (starType < 0.95) {
      // نجوم حمراء
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.6 + Math.random() * 0.2;
      colors[i3 + 2] = 0.4 + Math.random() * 0.2;
    } else {
      // نجوم نادرة زرقاء/بيضاء شديدة اللمعان
      colors[i3] = 0.8;
      colors[i3 + 1] = 0.9;
      colors[i3 + 2] = 1.0;
    }

    sizes[i] = 0.5 + Math.random() * 2.5;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    sizeAttenuation: true,
  });

  const starField = new THREE.Points(geometry, material);
  starField.userData = { type: "distant-stars" };
  stars.push(starField);
  scene.add(starField);
}

function createNebulae() {
  // إنشاء سدم كونية في الخلفية
  if (!showNebulae) return;

  const nebulaCount = 10;

  for (let i = 0; i < nebulaCount; i++) {
    const nebulaType = Math.random();
    let color, size, opacity;

    if (nebulaType < 0.4) {
      // سدم انبعاثية (حمراء)
      color = new THREE.Color(0xff4466);
      size = 20 + Math.random() * 40;
      opacity = 0.1 + Math.random() * 0.2;
    } else if (nebulaType < 0.7) {
      // سدم انعكاسية (زرقاء)
      color = new THREE.Color(0x4466ff);
      size = 15 + Math.random() * 30;
      opacity = 0.05 + Math.random() * 0.15;
    } else {
      // سدم داكنة
      color = new THREE.Color(0x333344);
      size = 30 + Math.random() * 50;
      opacity = 0.2 + Math.random() * 0.3;
    }

    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nebula = new THREE.Mesh(geometry, material);

    // توزيع السدم في الفضاء
    const distance = 150 + Math.random() * 350;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    nebula.position.x = distance * Math.sin(phi) * Math.cos(theta);
    nebula.position.y = distance * Math.sin(phi) * Math.sin(theta);
    nebula.position.z = distance * Math.cos(phi);

    nebula.userData = { type: "nebula" };
    nebulae.push(nebula);
    scene.add(nebula);
  }
}

function addStarEffects() {
  // إضافة تأثيرات الشادر للنجوم البعيدة
  const starEffect = new THREE.ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0.0 },
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float time;
            varying vec2 vUv;
            
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                
                // إضافة توهج خفيف للنجوم الزرقاء
                if (color.b > color.r && color.b > color.g) {
                    float glow = sin(time * 2.0 + vUv.x * 10.0) * 0.1 + 0.9;
                    color.rgb *= glow;
                }
                
                gl_FragColor = color;
            }
        `,
  });

  composer.addPass(starEffect);
}

function simulateGalaxyCollision() {
  if (!galaxyCollision) return;

  collisionProgress += 0.001;

  // محاكاة تصادم مجرتين
  galaxies.forEach((galaxy, index) => {
    if (galaxy.position) {
      // تحريك المجرة الثانية نحو الأولى
      if (index % 2 === 0) {
        const collisionDistance = 20;
        const angle = collisionProgress * Math.PI;

        galaxy.position.x = Math.cos(angle) * collisionDistance;
        galaxy.position.z = Math.sin(angle) * collisionDistance;

        // تشويه المجرة عند الاقتراب
        const distortion = Math.sin(collisionProgress * Math.PI) * 0.5;
        galaxy.scale.set(1 + distortion, 1 + distortion * 0.5, 1 + distortion);
      }
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // تحديث التحكم
  controls.update();

  // دوران المجرة
  if (autoRotate) {
    galaxies.forEach((galaxy) => {
      if (galaxy.rotation) {
        galaxy.rotation.y += rotationSpeed;
      }
    });
  }

  // محاكاة تصادم المجرات
  if (galaxyCollision) {
    simulateGalaxyCollision();
  }

  // تحديث تأثيرات الشادر
  scene.traverse((obj) => {
    if (obj.userData && obj.userData.material) {
      if (
        obj.userData.material.uniforms &&
        obj.userData.material.uniforms.time
      ) {
        obj.userData.material.uniforms.time.value = time;
      }
    }
  });

  // تحديث عرض البيانات
  updateDataDisplay();

  // عرض المشهد مع التأثيرات
  composer.render();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function setupControls() {
  // زر تبديل نوع المجرة
  document.getElementById("type-btn").addEventListener("click", function () {
    const types = ["spiral", "elliptical", "irregular", "lenticular", "barred"];
    let currentIndex = types.indexOf(currentType);
    currentType = types[(currentIndex + 1) % types.length];

    createGalaxy();
    updateButtonText("type-btn", `🌀 ${galaxyTypes[currentType].name}`);

    // تحديث أزرار الأنواع
    document.querySelectorAll(".type-btn").forEach((btn) => {
      if (btn.dataset.type === currentType) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });

  // زر تغيير سرعة الدوران
  document.getElementById("speed-btn").addEventListener("click", function () {
    const speeds = [0.0005, 0.001, 0.002, 0.005, 0.01];
    let currentIndex = speeds.indexOf(rotationSpeed);

    if (currentIndex === -1 || currentIndex === speeds.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }

    rotationSpeed = speeds[currentIndex];
    updateButtonText(
      "speed-btn",
      `⚡ سرعة: ${(rotationSpeed * 1000).toFixed(1)}x`
    );
  });

  // زر إظهار/إخفاء النجوم
  document.getElementById("stars-btn").addEventListener("click", function () {
    showStars = !showStars;
    stars.forEach((star) => {
      star.visible = showStars;
    });
    updateButtonText(
      "stars-btn",
      showStars ? "✨ إخفاء النجوم" : "✨ إظهار النجوم"
    );
  });

  // زر إظهار السدم
  document.getElementById("nebula-btn").addEventListener("click", function () {
    showNebulae = !showNebulae;
    nebulae.forEach((nebula) => {
      nebula.visible = showNebulae;
    });
    updateButtonText(
      "nebula-btn",
      showNebulae ? "🌫️ إخفاء السدم" : "🌫️ إظهار السدم"
    );
  });

  // زر محاكاة تصادم المجرات
  document
    .getElementById("collision-btn")
    .addEventListener("click", function () {
      galaxyCollision = !galaxyCollision;

      if (galaxyCollision) {
        // إنشاء مجرة ثانية للتصادم
        createCollisionGalaxy();
      } else {
        // إزالة المجرة الثانية
        removeCollisionGalaxy();
        collisionProgress = 0;
      }

      updateButtonText(
        "collision-btn",
        galaxyCollision ? "💥 إيقاف التصادم" : "💥 محاكاة تصادم المجرات"
      );
    });

  // زر الدوران التلقائي
  document
    .getElementById("auto-rotate-btn")
    .addEventListener("click", function () {
      autoRotate = !autoRotate;
      updateButtonText(
        "auto-rotate-btn",
        autoRotate ? "⏸️ إيقاف الدوران" : "🔄 تشغيل الدوران"
      );
    });

  // تهيئة نصوص الأزرار
  updateButtonText("type-btn", `🌀 ${galaxyTypes[currentType].name}`);
  updateButtonText("speed-btn", "⚡ سرعة: 1.0x");
  updateButtonText("stars-btn", "✨ إخفاء النجوم");
  updateButtonText("nebula-btn", "🌫️ إظهار السدم");
  updateButtonText("collision-btn", "💥 محاكاة تصادم المجرات");
  updateButtonText("auto-rotate-btn", "⏸️ إيقاف الدوران");
}

function setupTypeEvents() {
  // أحداث أزرار الأنواع
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = this.dataset.type;

      if (type === "all") {
        // عرض معرض المجرات
        showFamousGalaxies();
      } else {
        currentType = type;
        createGalaxy();
        showGalaxyInfo(galaxyTypes[type]);
      }

      // تحديث النشاط
      document
        .querySelectorAll(".type-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // تحديث زر النوع الرئيسي
      if (type !== "all") {
        updateButtonText("type-btn", `🌀 ${galaxyTypes[type].name}`);
      }
    });
  });

  // زر إغلاق معلومات المجرة
  document
    .querySelector(".close-galaxy-btn")
    .addEventListener("click", function () {
      document.querySelector(".galaxy-info-box").classList.add("hidden");
    });
}

function setupFamousGalaxies() {
  // عرض لوحة المجرات المشهورة
  const famousPanel = document.querySelector(".famous-galaxies");

  // أحداث أزرار المجرات المشهورة
  document.querySelectorAll(".famous-buttons button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const galaxy = this.dataset.galaxy;

      if (galaxy === "close") {
        famousPanel.classList.add("hidden");
      } else {
        showFamousGalaxyInfo(famousGalaxies[galaxy]);
      }
    });
  });
}

function showFamousGalaxies() {
  // عرض لوحة المجرات المشهورة
  const famousPanel = document.querySelector(".famous-galaxies");
  famousPanel.classList.remove("hidden");
}

function showFamousGalaxyInfo(galaxyData) {
  // عرض معلومات المجرة المشهورة
  const infoBox = document.querySelector(".galaxy-info-box");
  const title = document.getElementById("galaxy-title");
  const desc = document.getElementById("galaxy-desc");
  const shape = document.getElementById("galaxy-shape");
  const stars = document.getElementById("galaxy-stars");
  const size = document.getElementById("galaxy-size");
  const blackhole = document.getElementById("galaxy-blackhole");
  const age = document.getElementById("galaxy-age");
  const example = document.getElementById("galaxy-example");

  title.textContent = galaxyData.name;
  desc.textContent = galaxyData.description;
  shape.textContent = galaxyTypes[galaxyData.type].shape;
  stars.textContent = galaxyData.stars;
  size.textContent = galaxyData.size;
  blackhole.textContent = galaxyData.features;
  age.textContent = "10-13 مليار سنة";
  example.textContent = galaxyData.name;

  infoBox.classList.remove("hidden");

  // إخفاء لوحة المجرات المشهورة
  document.querySelector(".famous-galaxies").classList.add("hidden");
}

function createCollisionGalaxy() {
  // إنشاء مجرة ثانية للتصادم
  const collisionGalaxy = createCollisionGalaxyInstance();
  galaxies.push(collisionGalaxy);
  scene.add(collisionGalaxy);
}

function createCollisionGalaxyInstance() {
  // إنشاء نسخة من المجرة الحالية للتصادم
  const typeData = galaxyTypes[currentType];
  const galaxyGroup = new THREE.Group();

  // نسخ بسيطة للنجوم
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const radius = typeData.radius * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const distance = Math.pow(Math.random(), 1 / 3) * radius;

    positions[i3] = distance * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = distance * Math.sin(phi) * Math.sin(theta) * 0.3;
    positions[i3 + 2] = distance * Math.cos(phi);

    colors[i3] = 0.8 + Math.random() * 0.2;
    colors[i3 + 1] = 0.6 + Math.random() * 0.2;
    colors[i3 + 2] = 0.8 + Math.random() * 0.2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const galaxyParticles = new THREE.Points(geometry, material);
  galaxyGroup.add(galaxyParticles);

  // وضع المجرة الثانية بعيداً
  galaxyGroup.position.x = 30;
  galaxyGroup.position.z = 30;

  return galaxyGroup;
}

function removeCollisionGalaxy() {
  // إزالة المجرة الثانية
  const collisionIndex = galaxies.findIndex(
    (g) => g.position && g.position.x === 30
  );
  if (collisionIndex !== -1) {
    scene.remove(galaxies[collisionIndex]);
    galaxies.splice(collisionIndex, 1);
  }
}

function updateGalaxyInfo(typeData) {
  // تحديث معلومات المجرة المعروضة
  document.getElementById("galaxy-type-value").textContent = typeData.name;
  document.getElementById("stars-count").textContent =
    typeData.stars.split("-")[0] + " نجمة";
  document.getElementById("galaxy-size-value").textContent =
    typeData.size.split("-")[0];

  // حساب سرعة الدوران بناءً على النوع
  let rotationSpeedKm;
  switch (currentType) {
    case "spiral":
    case "barred":
      rotationSpeedKm = "220 كم/ث";
      break;
    case "elliptical":
      rotationSpeedKm = "100 كم/ث";
      break;
    case "irregular":
      rotationSpeedKm = "50 كم/ث";
      break;
    case "lenticular":
      rotationSpeedKm = "180 كم/ث";
      break;
    default:
      rotationSpeedKm = "200 كم/ث";
  }
  document.getElementById("rotation-speed").textContent = rotationSpeedKm;
}

function showGalaxyInfo(typeData) {
  const infoBox = document.querySelector(".galaxy-info-box");
  const title = document.getElementById("galaxy-title");
  const desc = document.getElementById("galaxy-desc");
  const shape = document.getElementById("galaxy-shape");
  const stars = document.getElementById("galaxy-stars");
  const size = document.getElementById("galaxy-size");
  const blackhole = document.getElementById("galaxy-blackhole");
  const age = document.getElementById("galaxy-age");
  const example = document.getElementById("galaxy-example");

  title.textContent = typeData.name;
  desc.textContent = typeData.description;
  shape.textContent = typeData.shape;
  stars.textContent = typeData.stars;
  size.textContent = typeData.size;
  blackhole.textContent = typeData.blackhole;
  age.textContent = typeData.age;
  example.textContent = typeData.example;

  infoBox.classList.remove("hidden");
}

function updateButtonText(buttonId, text) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.textContent = text;
  }
}

function updateDataDisplay() {
  // تحديث شريط البيانات السفلي
  const typeData = galaxyTypes[currentType];

  document.getElementById("galaxy-type-value").textContent = typeData.name
    .split(" ")
    .pop(); // عرض النوع فقط

  document.getElementById("stars-count").textContent =
    typeData.stars.split("-")[0];

  document.getElementById("galaxy-size-value").textContent =
    typeData.size.split("-")[0];

  // تحديث سرعة الدوران
  let rotationSpeedKm;
  switch (currentType) {
    case "spiral":
    case "barred":
      rotationSpeedKm = "220";
      break;
    case "elliptical":
      rotationSpeedKm = "100";
      break;
    case "irregular":
      rotationSpeedKm = "50";
      break;
    case "lenticular":
      rotationSpeedKm = "180";
      break;
    default:
      rotationSpeedKm = "200";
  }
  document.getElementById("rotation-speed").textContent =
    rotationSpeedKm + " كم/ث";
}

// بدء التطبيق
init();
