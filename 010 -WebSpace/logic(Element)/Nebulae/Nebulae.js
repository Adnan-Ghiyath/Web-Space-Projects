// تهيئة المشهد
let scene, camera, renderer, controls;
let nebulaParticles = [];
let stars = [];
let autoRotate = true;
let currentNebulaType = "emission";

// متغيرات إضافية للتحكم
let isStarsVisible = true;

// ألوان السدم حسب النوع
const nebulaColors = {
  emission: { primary: 0xff3366, secondary: 0xff0066, accent: 0xff6699 }, // أحمر
  reflection: { primary: 0x3366ff, secondary: 0x0066ff, accent: 0x6699ff }, // أزرق
  dark: { primary: 0x333333, secondary: 0x222222, accent: 0x444444 }, // داكن
  planetary: { primary: 0x33ff66, secondary: 0x00ff66, accent: 0x66ff99 }, // أخضر
  supernova: { primary: 0xff9933, secondary: 0xff6600, accent: 0xff9966 }, // برتقالي
};

// كثافات مختلفة حسب نوع السديم
const nebulaDensities = {
  emission: 2000,
  reflection: 1500,
  dark: 800,
  planetary: 1200,
  supernova: 2500,
};

// متغير لتخزين المرجع إلى كائنات الدوران
let rotationGroup;

function init() {
  // إنشاء المشهد
  scene = new THREE.Scene();

  // إنشاء مجموعة للدوران (تحتوي على السديم فقط)
  rotationGroup = new THREE.Group();
  scene.add(rotationGroup);

  // إنشاء الكاميرا
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);

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
  document.getElementById("nebula-container").appendChild(renderer.domElement);

  // إضافة التحكم بالكاميرا
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 20;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;

  // إضافة الإضاءة
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // إنشاء السديم داخل مجموعة الدوران
  createNebula();

  // إنشاء النجوم الخلفية (خارج مجموعة الدوران)
  createStars();

  // إضافة أحداث النافذة
  window.addEventListener("resize", onWindowResize);

  // إضافة أحداث الأزرار
  setupControls();

  // إضافة تعليمات الاستخدام
  showInstructions();

  // بدء الحركة
  animate();
}

function createNebula() {
  // مسح السديم الحالي إذا وجد
  while (rotationGroup.children.length > 0) {
    rotationGroup.remove(rotationGroup.children[0]);
  }
  nebulaParticles = [];

  const colors = nebulaColors[currentNebulaType];
  const density = nebulaDensities[currentNebulaType];

  // إنشاء نواة السديم المركزية
  createNebulaCore(colors);

  // إنشاء السحب الغازية حول النواة
  for (let i = 0; i < density; i++) {
    // تحديد نوع الجسيم (غاز، غبار، إلخ)
    const particleType = Math.random();
    let size, color, opacity;

    if (particleType < 0.3) {
      // غاز كثيف
      size = Math.random() * 0.8 + 0.2;
      color = colors.primary;
      opacity = Math.random() * 0.4 + 0.3;
    } else if (particleType < 0.6) {
      // غبار كوني
      size = Math.random() * 0.4 + 0.1;
      color = colors.secondary;
      opacity = Math.random() * 0.3 + 0.2;
    } else {
      // مناطق شفافة
      size = Math.random() * 1.2 + 0.3;
      color = colors.accent;
      opacity = Math.random() * 0.2 + 0.1;
    }

    // إنشاء شكل كروي للجسيم
    const geometry = new THREE.SphereGeometry(size, 8, 8);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      emissive: color,
      emissiveIntensity: 0.3,
    });

    const particle = new THREE.Mesh(geometry, material);

    // توزيع الجسيمات في شكل كروي غير منتظم
    const radius = Math.random() * 15 + 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
    particle.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.7; // تسطيح في المحور Y
    particle.position.z = radius * Math.cos(phi);

    // إضافة حركة دائرية خفيفة
    particle.userData = {
      originalX: particle.position.x,
      originalY: particle.position.y,
      originalZ: particle.position.z,
      speed: Math.random() * 0.002 + 0.001,
      rotationSpeed: Math.random() * 0.02 + 0.01,
      timeOffset: Math.random() * Math.PI * 2,
    };

    rotationGroup.add(particle);
    nebulaParticles.push(particle);
  }

  // إنشاء حلقات أو أعمدة حسب نوع السديم
  if (currentNebulaType === "planetary" || currentNebulaType === "supernova") {
    createRings(colors);
  }

  if (currentNebulaType === "emission" || currentNebulaType === "reflection") {
    createPillars(colors);
  }
}

function createNebulaCore(colors) {
  // إنشاء النواة المركزية للسديم
  const coreGeometry = new THREE.SphereGeometry(3, 32, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: colors.primary,
    transparent: true,
    opacity: 0.6,
    emissive: colors.primary,
    emissiveIntensity: 0.8,
  });

  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  rotationGroup.add(core);
  nebulaParticles.push(core);

  // إضافة تأثير التوهج للنواة
  createGlowEffect(core, colors.primary, 4);
}

function createGlowEffect(object, color, size) {
  // إنشاء كرة أكبر للتوهج
  const glowGeometry = new THREE.SphereGeometry(size, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(color) },
      intensity: { value: 1.0 },
      time: { value: 0.0 },
    },
    vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform vec3 glowColor;
            uniform float intensity;
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                float pulse = sin(time * 2.0) * 0.3 + 0.7;
                float glow = intensity * pulse * (1.0 - length(vPosition) / ${size.toFixed(
                  1
                )});
                vec3 finalGlow = glowColor * glow * 1.5;
                gl_FragColor = vec4(finalGlow, glow * 0.5);
            }
        `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.scale.multiplyScalar(1.2);

  // تخزين المرجع لتحديث الوقت في animation loop
  glow.userData = { material: glowMaterial };

  rotationGroup.add(glow);
  nebulaParticles.push(glow);

  return glow;
}

function createRings(colors) {
  // إنشاء حلقات للسديم الكوكبي أو بقايا المستعر الأعظم
  const ringCount = currentNebulaType === "planetary" ? 3 : 5;

  for (let i = 0; i < ringCount; i++) {
    const ringRadius = 8 + i * 3;
    const ringGeometry = new THREE.RingGeometry(
      ringRadius,
      ringRadius + 0.5,
      64
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: colors.accent,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3 - i * 0.05,
      blending: THREE.AdditiveBlending,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = Math.random() * Math.PI;

    rotationGroup.add(ring);
    nebulaParticles.push(ring);
  }
}

function createPillars(colors) {
  // إنشاء أعمدة الغاز والغبار (مثل أعمدة الخلق)
  const pillarCount = 4;

  for (let i = 0; i < pillarCount; i++) {
    const height = 15 + Math.random() * 10;
    const radius = 1 + Math.random() * 2;
    const segments = 8;

    const pillarGeometry = new THREE.CylinderGeometry(
      radius,
      radius * 1.5,
      height,
      segments
    );
    const pillarMaterial = new THREE.MeshPhongMaterial({
      color: colors.secondary,
      transparent: true,
      opacity: 0.4,
      emissive: colors.secondary,
      emissiveIntensity: 0.2,
    });

    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);

    // توزيع الأعمدة حول المركز
    const angle = (i / pillarCount) * Math.PI * 2;
    const distance = 12;

    pillar.position.x = Math.cos(angle) * distance;
    pillar.position.z = Math.sin(angle) * distance;
    pillar.position.y = (Math.random() - 0.5) * 10;

    // تدوير الأعمدة باتجاه المركز
    pillar.lookAt(0, pillar.position.y, 0);

    rotationGroup.add(pillar);
    nebulaParticles.push(pillar);
  }
}

function createStars() {
  // إنشاء النجوم الخلفية (في المشهد الرئيسي، ليس في مجموعة الدوران)
  stars = []; // إعادة تهيئة المصفوفة

  // إنشاء مجموعة كبيرة من النجوم البعيدة
  const starCount = 2000;

  // إنشاء نظام جسيمات للنجوم لتحسين الأداء
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    // توزيع النجوم في كل الاتجاهات
    const i3 = i * 3;

    // إنشاء توزيع كروي للنجوم
    const radius = 100 + Math.random() * 900;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);

    // ألوان النجوم (معظمها بيضاء مع القليل من الألوان)
    const starColor = Math.random();
    if (starColor < 0.7) {
      // نجوم بيضاء/صفراء
      starColors[i3] = 1.0;
      starColors[i3 + 1] = 1.0;
      starColors[i3 + 2] = 0.9;
    } else if (starColor < 0.85) {
      // نجوم زرقاء
      starColors[i3] = 0.7;
      starColors[i3 + 1] = 0.8;
      starColors[i3 + 2] = 1.0;
    } else {
      // نجوم حمراء
      starColors[i3] = 1.0;
      starColors[i3 + 1] = 0.7;
      starColors[i3 + 2] = 0.7;
    }

    // أحجام مختلفة للنجوم
    starSizes[i] = Math.random() * 2.5 + 0.5;
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
  starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

  const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    sizeAttenuation: true,
    alphaTest: 0.5,
  });

  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
  stars.push(starField);

  // إضافة بعض النجوم اللامعة الكبيرة
  const bigStarCount = 50;
  for (let i = 0; i < bigStarCount; i++) {
    const bigStarGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const bigStarMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      emissive: 0xffffaa,
      emissiveIntensity: 0.5,
    });

    const bigStar = new THREE.Mesh(bigStarGeometry, bigStarMaterial);

    // توزيع النجوم الكبيرة
    const radius = 50 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    bigStar.position.x = radius * Math.sin(phi) * Math.cos(theta);
    bigStar.position.y = radius * Math.sin(phi) * Math.sin(theta);
    bigStar.position.z = radius * Math.cos(phi);

    scene.add(bigStar);
    stars.push(bigStar);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // تحديث الوقت للتأثيرات
  const time = Date.now() * 0.001;

  // تحديث التحكم بالكاميرا
  controls.update();

  // دوران السديم إذا كان مفعلاً
  if (autoRotate) {
    rotationGroup.rotation.y += 0.001;
  }

  // حركة الجسيمات داخل السديم
  nebulaParticles.forEach((particle) => {
    if (particle.userData && particle.userData.speed) {
      // حركة دائرية خفيفة حول المركز
      const particleTime = time + particle.userData.timeOffset;
      particle.position.x =
        particle.userData.originalX + Math.sin(particleTime) * 0.5;
      particle.position.z =
        particle.userData.originalZ + Math.cos(particleTime) * 0.5;

      // حركة خفيفة في المحور Y
      particle.position.y =
        particle.userData.originalY + Math.sin(particleTime * 1.5) * 0.3;

      // دوران ذاتي
      if (particle.rotation) {
        particle.rotation.y += particle.userData.rotationSpeed * 0.1;
        particle.rotation.x += particle.userData.rotationSpeed * 0.05;
      }
    }

    // تمويج خفيف للشفافية
    if (particle.material && particle.material.opacity !== undefined) {
      const pulse =
        Math.sin(time * 2 + particle.userData?.timeOffset || 0) * 0.1 + 0.9;
      particle.material.opacity *= pulse;
      particle.material.opacity = Math.max(
        0.1,
        Math.min(1.0, particle.material.opacity)
      );
    }

    // تحديث مواد الشادر
    if (particle.userData && particle.userData.material) {
      particle.userData.material.uniforms.time.value = time;
    }
  });

  // عرض المشهد
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupControls() {
  // زر تغيير الألوان
  document.getElementById("color-btn").addEventListener("click", function () {
    const types = Object.keys(nebulaColors);
    let currentIndex = types.indexOf(currentNebulaType);
    currentNebulaType = types[(currentIndex + 1) % types.length];
    createNebula();
    updateNebulaTypeSelect();
    updateButtonText("color-btn", `🎨 ${getNebulaTypeName(currentNebulaType)}`);
  });

  // زر تغيير الكثافة
  document.getElementById("density-btn").addEventListener("click", function () {
    // تبديل بين كثافات مختلفة
    const densities = [500, 1000, 1500, 2000, 2500, 3000];
    let currentDensity = nebulaDensities[currentNebulaType];
    let currentIndex = densities.indexOf(currentDensity);

    if (currentIndex === -1 || currentIndex === densities.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }

    nebulaDensities[currentNebulaType] = densities[currentIndex];
    createNebula();
    updateButtonText(
      "density-btn",
      `🌌 كثافة: ${densities[currentIndex]} جسيم`
    );
  });

  // زر إخفاء/إظهار النجوم
  document.getElementById("stars-btn").addEventListener("click", function () {
    isStarsVisible = !isStarsVisible;
    stars.forEach((star) => {
      star.visible = isStarsVisible;
    });
    updateButtonText(
      "stars-btn",
      isStarsVisible ? "🌑 إخفاء النجوم" : "🌟 إظهار النجوم"
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

  // اختيار نوع السديم
  document
    .getElementById("nebula-type")
    .addEventListener("change", function (e) {
      currentNebulaType = e.target.value;
      createNebula();
    });

  // تهيئة نصوص الأزرار
  updateButtonText(
    "stars-btn",
    isStarsVisible ? "🌑 إخفاء النجوم" : "🌟 إظهار النجوم"
  );
  updateButtonText(
    "auto-rotate-btn",
    autoRotate ? "⏸️ إيقاف الدوران" : "🔄 تشغيل الدوران"
  );
  updateButtonText("color-btn", `🎨 ${getNebulaTypeName(currentNebulaType)}`);
  updateButtonText(
    "density-btn",
    `🌌 كثافة: ${nebulaDensities[currentNebulaType]} جسيم`
  );
}

function updateButtonText(buttonId, text) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.textContent = text;
  }
}

function updateNebulaTypeSelect() {
  const select = document.getElementById("nebula-type");
  if (select) {
    select.value = currentNebulaType;
  }
}

function getNebulaTypeName(type) {
  const names = {
    emission: "انبعاث",
    reflection: "انعكاس",
    dark: "مظلم",
    planetary: "كوكبي",
    supernova: "مستعر أعظم",
  };
  return names[type] || type;
}

function showInstructions() {
  console.log("🎮 تعليمات التحكم:");
  console.log("1. حرك الماوس للدوران حول السديم");
  console.log("2. استخدم عجلة التكبير/التصغير");
  console.log("3. اضغط واسحب للتحرك");
  console.log("4. استخدم الأزرار للتحكم في الخصائص");
}

// بدء التطبيق عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", init);

// معالجة الأخطاء
window.addEventListener("error", function (e) {
  console.error("حدث خطأ:", e.error);
  alert(
    "حدث خطأ في تحميل السديم ثلاثي الأبعاد. يرجى تحديث الصفحة أو استخدام متصفح آخر."
  );
});
