// تهيئة المشهد
let scene, camera, renderer, controls, composer;
let blackHole,
  accretionDisk = [],
  eventHorizon,
  singularity;
let stars = [];
let jets = [];
let gravitationalLensing = false;
let showAccretionDisk = true;
let showJets = false;
let attractStars = false;
let autoRotate = true;
let currentType = "stellar";

// بيانات أنواع الثقوب السوداء
const blackHoleTypes = {
  stellar: {
    name: "الثقب الأسود النجمي",
    description: "يتشكل من انهيار نجم ضخم (أكثر من 3 كتل شمسية)",
    mass: "5-20 كتلة شمسية",
    radius: "15-60 كم",
    spin: "تصل إلى 90% من سرعة الضوء",
    temperature: "10⁻⁸ كلفن",
    age: "ملايين إلى مليارات السنين",
    properties: "تفرد، أفق حدث، إشعاع هوكينغ",
    color: 0xff3232,
    size: 3,
    accretionSize: 8,
  },
  intermediate: {
    name: "الثقب الأسود المتوسط",
    description: "كتلته بين الثقوب النجمية والفائقة الكتلة",
    mass: "100-10,000 كتلة شمسية",
    radius: "300-30,000 كم",
    spin: "تصل إلى 80% من سرعة الضوء",
    temperature: "10⁻¹⁰ كلفن",
    age: "مليارات السنين",
    properties: "نادر، موجود في العناقيد النجمية",
    color: 0xff6600,
    size: 5,
    accretionSize: 12,
  },
  supermassive: {
    name: "الثقب الأسود فائق الكتلة",
    description: "يوجد في مراكز المجرات، كتلته هائلة",
    mass: "ملايين إلى مليارات الكتل الشمسية",
    radius: "ملايين إلى مليارات الكيلومترات",
    spin: "تصل إلى 99% من سرعة الضوء",
    temperature: "10⁻¹⁴ كلفن",
    age: "مليارات السنين",
    properties: "قرص مزود ضخم، نفاثات نسبوية",
    color: 0xcc00cc,
    size: 8,
    accretionSize: 20,
  },
  primordial: {
    name: "الثقب الأسود البدائي",
    description: "تشكل في الكون المبكر بعد الانفجار العظيم",
    mass: "أقل من كتلة جبل!",
    radius: "أصغر من البروتون",
    spin: "غير معروف",
    temperature: "عالية جداً",
    age: "13.8 مليار سنة",
    properties: "افتراضي، لم يكتشف بعد",
    color: 0x00cccc,
    size: 2,
    accretionSize: 6,
  },
};

// متغيرات فيزيائية
let gravitationalForce = 0;
let timeDilation = 1;

function init() {
  // إنشاء المشهد
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 50, 300);

  // إنشاء الكاميرا
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 40);

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
    .getElementById("blackhole-container")
    .appendChild(renderer.domElement);

  // إنشاء EffectComposer للتأثيرات البصرية
  composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  // إضافة تأثيرات الشادر للتشويه الجذبي
  addGravitationalEffects();

  // إضافة التحكم بالكاميرا
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 5;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;

  // إضافة الإضاءة
  setupLighting();

  // إنشاء الثقب الأسود
  createBlackHole();

  // إنشاء القرص المزود
  createAccretionDisk();

  // إنشاء النجوم الخلفية
  createStars();

  // إضافة أحداث النافذة
  window.addEventListener("resize", onWindowResize);

  // إعداد أدوات التحكم
  setupControls();

  // إضافة أحداث النقر على الأنواع
  setupTypeEvents();

  // بدء الحركة
  animate();
}

function setupLighting() {
  // إضاءة من القرص المزود
  const diskLight = new THREE.PointLight(0xff3232, 2, 100);
  diskLight.position.set(0, 0, 0);
  scene.add(diskLight);

  // إضاءة محيطية حمراء
  const ambientLight = new THREE.AmbientLight(0x330000, 0.5);
  scene.add(ambientLight);

  // إضاءة اتجاهية للنفاثات
  const jetLight = new THREE.DirectionalLight(0x00ffff, 0.5);
  jetLight.position.set(0, 1, 0);
  scene.add(jetLight);
}

function createBlackHole() {
  // مسح الثقب الأسود الحالي إذا وجد
  if (blackHole) scene.remove(blackHole);
  if (eventHorizon) scene.remove(eventHorizon);
  if (singularity) scene.remove(singularity);

  const typeData = blackHoleTypes[currentType];

  // 1. أفق الحدث (كرة سوداء)
  const horizonGeometry = new THREE.SphereGeometry(typeData.size, 64, 64);
  const horizonMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.BackSide,
  });

  eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
  scene.add(eventHorizon);

  // 2. التفرد (نقطة صغيرة في المركز)
  const singularityGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const singularityMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    emissive: 0xff0000,
    emissiveIntensity: 1,
  });

  singularity = new THREE.Mesh(singularityGeometry, singularityMaterial);
  scene.add(singularity);

  // 3. تأثير الجاذبية حول الثقب الأسود
  createGravityDistortion(typeData.size);

  // 4. تأثير شفارتزشيلد (توهج حول أفق الحدث)
  createSchwarzschildGlow(typeData);

  // تخزين المرجع
  blackHole = eventHorizon;
}

function createGravityDistortion(size) {
  // إنشاء مجال تشويه الجاذبية
  const distortionGeometry = new THREE.SphereGeometry(size * 1.5, 48, 48);
  const distortionMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      intensity: { value: 0.5 },
    },
    vertexShader: `
            uniform float time;
            uniform float intensity;
            varying vec3 vPosition;
            
            void main() {
                vPosition = position;
                
                // تشويه الجاذبية
                float distance = length(position);
                float distortion = intensity * (1.0 / (distance + 0.1));
                vec3 distortedPosition = position * (1.0 + distortion * sin(time * 2.0 + distance * 5.0));
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(distortedPosition, 1.0);
            }
        `,
    fragmentShader: `
            varying vec3 vPosition;
            
            void main() {
                float distance = length(vPosition);
                float alpha = 0.1 * (1.0 - smoothstep(0.0, 1.5, distance));
                gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
            }
        `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const distortion = new THREE.Mesh(distortionGeometry, distortionMaterial);
  distortion.userData = { material: distortionMaterial };
  scene.add(distortion);
}

function createSchwarzschildGlow(typeData) {
  // تأثير توهج أفق الحدث
  const glowGeometry = new THREE.SphereGeometry(typeData.size * 1.1, 48, 48);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(typeData.color) },
      time: { value: 0.0 },
      intensity: { value: 0.8 },
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
            uniform float time;
            uniform float intensity;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                float distance = length(vPosition);
                float pulse = sin(time * 3.0) * 0.3 + 0.7;
                float glow = intensity * pulse * exp(-distance * 2.0);
                
                // تأثير دوبلر (انزياح أحمر)
                float redshift = 1.0 / (1.0 + distance * 0.5);
                vec3 finalColor = glowColor * glow * redshift;
                
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
  scene.add(glow);
}

function createAccretionDisk() {
  // مسح القرص المزود الحالي
  accretionDisk.forEach((part) => scene.remove(part));
  accretionDisk = [];

  if (!showAccretionDisk) return;

  const typeData = blackHoleTypes[currentType];
  const diskRadius = typeData.accretionSize;

  // إنشاء القرص المزود من عدة حلقات
  const ringCount = 20;

  for (let i = 0; i < ringCount; i++) {
    const innerRadius = typeData.size * 1.2 + (i * diskRadius) / ringCount;
    const outerRadius = innerRadius + diskRadius / ringCount;

    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

    // تدرج لوني من الأحمر إلى الأزرق (تأثير دوبلر)
    const hue = 0.0 + (i / ringCount) * 0.3; // من الأحمر إلى البرتقالي
    const color = new THREE.Color().setHSL(hue, 1.0, 0.5);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1 + (i / ringCount) * 0.3,
      blending: THREE.AdditiveBlending,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = Math.random() * Math.PI * 2;

    // سرعات مختلفة للحلقات (تتناقص مع البعد)
    ring.userData = {
      rotationSpeed: 0.02 / (i + 1),
      timeOffset: Math.random() * Math.PI * 2,
    };

    scene.add(ring);
    accretionDisk.push(ring);
  }

  // إضافة بعض الغازات الساخنة في القرص
  createHotGasParticles(diskRadius);
}

function createHotGasParticles(diskRadius) {
  const particleCount = 500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // توزيع الجسيمات في القرص
    const angle = Math.random() * Math.PI * 2;
    const distance =
      blackHoleTypes[currentType].size * 1.5 + Math.random() * diskRadius;
    const height = (Math.random() - 0.5) * 2;

    positions[i3] = Math.cos(angle) * distance;
    positions[i3 + 1] = height * 0.5;
    positions[i3 + 2] = Math.sin(angle) * distance;

    // ألوان ساخنة (من الأحمر إلى الأبيض)
    const heat = Math.random();
    if (heat < 0.3) {
      // أحمر
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.2;
      colors[i3 + 2] = 0.1;
    } else if (heat < 0.6) {
      // برتقالي
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.5;
      colors[i3 + 2] = 0.0;
    } else if (heat < 0.9) {
      // أصفر
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.9;
      colors[i3 + 2] = 0.0;
    } else {
      // أبيض
      colors[i3] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 1.0;
    }

    sizes[i] = Math.random() * 0.3 + 0.1;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  particles.userData = { rotationSpeed: 0.05 };
  scene.add(particles);
  accretionDisk.push(particles);
}

function createStars() {
  // مسح النجوم الحالية
  stars.forEach((star) => scene.remove(star));
  stars = [];

  // إنشاء النجوم الخلفية
  const starCount = 2000;

  for (let i = 0; i < starCount; i++) {
    const starGeometry = new THREE.SphereGeometry(0.1, 4, 4);

    // نجوم بألوان مختلفة
    const starColor = Math.random();
    let color;
    if (starColor < 0.6) {
      color = 0xffffff; // أبيض
    } else if (starColor < 0.8) {
      color = 0xffcccc; // أحمر فاتح
    } else if (starColor < 0.9) {
      color = 0xccccff; // أزرق فاتح
    } else {
      color = 0xffffcc; // أصفر فاتح
    }

    const starMaterial = new THREE.MeshBasicMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
    });

    const star = new THREE.Mesh(starGeometry, starMaterial);

    // توزيع النجوم في كل الاتجاهات
    const distance = 50 + Math.random() * 450;
    const latitude = Math.random() * Math.PI * 2;
    const longitude = Math.random() * Math.PI * 2;

    star.position.x = distance * Math.sin(latitude) * Math.cos(longitude);
    star.position.y = distance * Math.sin(latitude) * Math.sin(longitude);
    star.position.z = distance * Math.cos(latitude);

    // جعل بعض النجوم أكبر
    if (Math.random() > 0.7) {
      star.scale.multiplyScalar(Math.random() * 2 + 1);
    }

    // تخزين البيانات الأصلية للجاذبية
    star.userData = {
      originalPosition: star.position.clone(),
      distance: distance,
      latitude: latitude,
      longitude: longitude,
      speed: Math.random() * 0.0001 + 0.00005,
      attracted: false,
    };

    scene.add(star);
    stars.push(star);
  }
}

function createJets() {
  // مسح النفاثات الحالية
  jets.forEach((jet) => scene.remove(jet));
  jets = [];

  if (!showJets) return;

  const typeData = blackHoleTypes[currentType];

  // إنشاء النفاثات النسبوية (فوق وتحت الثقب الأسود)
  const jetLength = typeData.size * 10;
  const jetRadius = typeData.size * 0.5;

  // النفاثة العلوية
  const topJetGeometry = new THREE.CylinderGeometry(
    jetRadius * 0.1,
    jetRadius,
    jetLength,
    8,
    1,
    true
  );
  const topJetMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const topJet = new THREE.Mesh(topJetGeometry, topJetMaterial);
  topJet.position.y = jetLength / 2;
  scene.add(topJet);
  jets.push(topJet);

  // النفاثة السفلية
  const bottomJetGeometry = new THREE.CylinderGeometry(
    jetRadius * 0.1,
    jetRadius,
    jetLength,
    8,
    1,
    true
  );
  const bottomJetMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const bottomJet = new THREE.Mesh(bottomJetGeometry, bottomJetMaterial);
  bottomJet.position.y = -jetLength / 2;
  bottomJet.rotation.z = Math.PI;
  scene.add(bottomJet);
  jets.push(bottomJet);

  // إضافة جسيمات متحركة في النفاثات
  createJetParticles(jetLength);
}

function createJetParticles(jetLength) {
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // توزيع الجسيمات في النفاثات
    const inTopJet = Math.random() > 0.5;
    const distance = Math.random() * jetLength;

    positions[i3] = (Math.random() - 0.5) * 0.5;
    positions[i3 + 1] = inTopJet ? distance : -distance;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.5;

    // ألوان زرقاء إلى بيضاء
    const heat = Math.random();
    colors[i3] = 0.0 + heat * 0.5;
    colors[i3 + 1] = 0.5 + heat * 0.5;
    colors[i3 + 2] = 1.0;

    // سرعات متجهة للأعلى أو الأسفل
    velocities[i3] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 1] = (inTopJet ? 1 : -1) * (0.05 + Math.random() * 0.05);
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

  const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  particles.userData = { velocities: velocities };
  scene.add(particles);
  jets.push(particles);
}

function addGravitationalEffects() {
  // تأثير عدسة الجاذبية (تشويه الخلفية)
  const lensingPass = new THREE.ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      blackHolePos: { value: new THREE.Vector2(0.5, 0.5) },
      strength: { value: 0.5 },
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
            uniform vec2 blackHolePos;
            uniform float strength;
            uniform float time;
            varying vec2 vUv;
            
            void main() {
                vec2 uv = vUv;
                
                // حساب المسافة إلى الثقب الأسود
                vec2 dir = blackHolePos - uv;
                float dist = length(dir);
                
                // تأثير عدسة الجاذبية
                if (dist > 0.01) {
                    float distortion = strength / (dist * dist + 0.01);
                    uv += dir * distortion * 0.1;
                }
                
                // إضافة تمويج للواقعية
                uv.x += sin(uv.y * 30.0 + time * 2.0) * 0.001;
                uv.y += cos(uv.x * 30.0 + time * 2.0) * 0.001;
                
                gl_FragColor = texture2D(tDiffuse, uv);
                
                // إضافة تأثير الانزياح الأحمر
                float redshift = 1.0 - dist * 0.5;
                gl_FragColor.rgb *= mix(1.0, redshift, 0.3);
            }
        `,
  });

  composer.addPass(lensingPass);
}

function applyGravitationalAttraction() {
  if (!attractStars) return;

  const typeData = blackHoleTypes[currentType];
  const blackHolePos = new THREE.Vector3(0, 0, 0);

  stars.forEach((star) => {
    const distance = star.position.length();

    // إذا كانت قريبة جداً، تجذب بقوة
    if (distance < typeData.size * 10 && !star.userData.attracted) {
      // اتجاه نحو الثقب الأسود
      const direction = new THREE.Vector3()
        .subVectors(blackHolePos, star.position)
        .normalize();

      // قوة الجذب (تتناسب عكسياً مع مربع المسافة)
      const force = 0.1 / (distance * distance + 0.01);

      // تطبيق القوة
      star.position.add(direction.multiplyScalar(force));

      // زيادة السرعة مع الاقتراب
      star.userData.speed += force * 0.01;

      // إذا اقتربت جداً، تختفي (تسقط في الثقب)
      if (distance < typeData.size * 1.5) {
        star.userData.attracted = true;
        star.visible = false;
      }

      // تحديث التحذير
      updateGravityWarning(distance);
    }
  });
}

function updateGravityWarning(distance) {
  const warning = document.getElementById("gravity-warning");
  const timeDilationEl = document.getElementById("time-dilation");
  const timeRatio = document.getElementById("time-ratio");

  const typeData = blackHoleTypes[currentType];
  const eventHorizonDistance = typeData.size;

  if (distance < eventHorizonDistance * 3) {
    warning.classList.remove("hidden");

    // حساب تمدد الزمن (نسبي)
    const dilationFactor =
      1 /
      Math.sqrt(
        1 -
          (eventHorizonDistance * eventHorizonDistance) / (distance * distance)
      );
    timeDilation = Math.min(dilationFactor, 100);

    timeRatio.textContent = timeDilation.toFixed(1) + " ثوان";
    timeDilationEl.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
    timeDilationEl.classList.add("hidden");
  }
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // تحديث التحكم
  controls.update();

  // دوران تلقائي
  if (autoRotate) {
    // دوران الثقب الأسود
    if (eventHorizon) eventHorizon.rotation.y += 0.005;
    if (singularity) singularity.rotation.y += 0.01;

    // دوران القرص المزود
    accretionDisk.forEach((ring) => {
      if (ring.userData && ring.userData.rotationSpeed) {
        ring.rotation.z += ring.userData.rotationSpeed;
      }
    });

    // حركة النجوم
    stars.forEach((star) => {
      if (star.userData && !star.userData.attracted) {
        star.userData.longitude += star.userData.speed;

        const distance = star.userData.distance;
        const latitude = star.userData.latitude;
        const longitude = star.userData.longitude;

        star.position.x = distance * Math.sin(latitude) * Math.cos(longitude);
        star.position.y = distance * Math.sin(latitude) * Math.sin(longitude);
        star.position.z = distance * Math.cos(latitude);
      }
    });

    // حركة جسيمات النفاثات
    jets.forEach((jet) => {
      if (jet.userData && jet.userData.velocities) {
        const positions = jet.geometry.attributes.position.array;
        const velocities = jet.userData.velocities;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // إعادة تدوير الجسيمات
          if (Math.abs(positions[i + 1]) > 50) {
            positions[i] = (Math.random() - 0.5) * 0.5;
            positions[i + 1] = positions[i + 1] > 0 ? -25 : 25;
            positions[i + 2] = (Math.random() - 0.5) * 0.5;
          }
        }

        jet.geometry.attributes.position.needsUpdate = true;
      }
    });
  }

  // تطبيق الجاذبية
  applyGravitationalAttraction();

  // تحديث تأثيرات الشادر
  scene.traverse((obj) => {
    if (obj.userData && obj.userData.material) {
      obj.userData.material.uniforms.time.value = time;
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
  // زر تبديل نوع الثقب
  document.getElementById("type-btn").addEventListener("click", function () {
    const types = ["stellar", "intermediate", "supermassive", "primordial"];
    let currentIndex = types.indexOf(currentType);
    currentType = types[(currentIndex + 1) % types.length];

    recreateBlackHole();
    updateButtonText("type-btn", `🌀 ${blackHoleTypes[currentType].name}`);

    // تحديث أزرار الأنواع
    document.querySelectorAll(".type-btn").forEach((btn) => {
      if (btn.dataset.type === currentType) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });

  // زر إظهار/إخفاء القرص المزود
  document
    .getElementById("accretion-btn")
    .addEventListener("click", function () {
      showAccretionDisk = !showAccretionDisk;
      createAccretionDisk();
      updateButtonText(
        "accretion-btn",
        showAccretionDisk ? "💫 إخفاء القرص المزود" : "💫 إظهار القرص المزود"
      );
    });

  // زر تأثير عدسة الجاذبية
  document.getElementById("lensing-btn").addEventListener("click", function () {
    gravitationalLensing = !gravitationalLensing;
    updateButtonText(
      "lensing-btn",
      gravitationalLensing ? "🌌 تعطيل عدسة الجاذبية" : "🌌 تفعيل عدسة الجاذبية"
    );
  });

  // زر إظهار النفاثات
  document.getElementById("jets-btn").addEventListener("click", function () {
    showJets = !showJets;
    createJets();
    updateButtonText(
      "jets-btn",
      showJets ? "⚡ إخفاء النفاثات" : "⚡ إظهار النفاثات"
    );
  });

  // زر جذب النجوم
  document.getElementById("stars-btn").addEventListener("click", function () {
    attractStars = !attractStars;
    updateButtonText(
      "stars-btn",
      attractStars ? "⭐ إيقاف جذب النجوم" : "⭐ جذب النجوم القريبة"
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
  updateButtonText("type-btn", `🌀 ${blackHoleTypes[currentType].name}`);
  updateButtonText("accretion-btn", "💫 إخفاء القرص المزود");
  updateButtonText("lensing-btn", "🌌 تفعيل عدسة الجاذبية");
  updateButtonText("jets-btn", "⚡ إظهار النفاثات");
  updateButtonText("stars-btn", "⭐ جذب النجوم القريبة");
  updateButtonText("auto-rotate-btn", "⏸️ إيقاف الدوران");
}

function setupTypeEvents() {
  // أحداث أزرار الأنواع
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = this.dataset.type;

      if (type === "all") {
        // عرض كل المعلومات
        document.querySelector(".blackhole-info-box").classList.add("hidden");
      } else {
        currentType = type;
        recreateBlackHole();
        showBlackHoleInfo(blackHoleTypes[type]);
      }

      // تحديث النشاط
      document
        .querySelectorAll(".type-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // تحديث زر النوع الرئيسي
      if (type !== "all") {
        updateButtonText("type-btn", `🌀 ${blackHoleTypes[type].name}`);
      }
    });
  });

  // زر إغلاق معلومات الثقب
  document
    .querySelector(".close-bh-btn")
    .addEventListener("click", function () {
      document.querySelector(".blackhole-info-box").classList.add("hidden");
    });
}

function recreateBlackHole() {
  // إعادة إنشاء الثقب الأسود بالنوع الجديد
  createBlackHole();
  createAccretionDisk();
  createStars();
  if (showJets) createJets();

  // إخفاء التحذيرات
  document.getElementById("gravity-warning").classList.add("hidden");
  document.getElementById("time-dilation").classList.add("hidden");
}

function showBlackHoleInfo(typeData) {
  const infoBox = document.querySelector(".blackhole-info-box");
  const title = document.getElementById("bh-title");
  const desc = document.getElementById("bh-desc");
  const mass = document.getElementById("bh-mass");
  const radius = document.getElementById("bh-radius");
  const spin = document.getElementById("bh-spin");
  const temp = document.getElementById("bh-temp");
  const age = document.getElementById("bh-age");
  const props = document.getElementById("bh-props");

  title.textContent = typeData.name;
  desc.textContent = typeData.description;
  mass.textContent = typeData.mass;
  radius.textContent = typeData.radius;
  spin.textContent = typeData.spin;
  temp.textContent = typeData.temperature;
  age.textContent = typeData.age;
  props.textContent = typeData.properties;

  infoBox.classList.remove("hidden");
}

function updateButtonText(buttonId, text) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.textContent = text;
  }
}

function updateDataDisplay() {
  const typeData = blackHoleTypes[currentType];

  // تحديث قيم العرض
  document.getElementById("mass-value").textContent =
    typeData.mass.split("-")[0] + " كتل شمسية";
  document.getElementById("radius-value").textContent =
    typeData.radius.split("-")[0];
  document.getElementById("spin-value").textContent = typeData.spin;
  document.getElementById("hawking-value").textContent = typeData.temperature;

  // تحديث قوة الجاذبية بناءً على المسافة
  if (camera) {
    const distance = camera.position.length();
    gravitationalForce = 1 / (distance * distance + 0.01);
  }
}

// بدء التطبيق
init();
