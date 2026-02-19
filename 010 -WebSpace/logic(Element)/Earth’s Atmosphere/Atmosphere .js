// تهيئة المشهد
let scene, camera, renderer, controls;
let earth,
  atmosphereLayers = [];
let clouds = [];
let windParticles = [];
let isDay = true;
let autoRotate = true;
let currentLayer = "all";
let showWind = false;
let showPollution = false;

// بيانات طبقات الغلاف الجوي
const layersData = {
  troposphere: {
    name: "التروبوسفير",
    description: "الطبقة السفلية حيث تحدث معظم ظواهر الطقس والحياة",
    height: "0-12 كم",
    temperature: "15°C إلى -60°C",
    pressure: "1013 إلى 200 مليبار",
    phenomena: "غيوم، أمطار، ثلوج، رياح، عواصف",
    composition: "نيتروجين، أكسجين، بخار الماء، ثاني أكسيد الكربون",
    activities: "طيران مدني، طقس، حياة، تنفس",
    color: 0x40a4ff,
    radius: 6.4,
    thickness: 0.12,
  },
  stratosphere: {
    name: "الستراتوسفير",
    description: "تحتوي على طبقة الأوزون التي تحمينا من الأشعة فوق البنفسجية",
    height: "12-50 كم",
    temperature: "-60°C إلى 0°C",
    pressure: "200 إلى 1 مليبار",
    phenomena: "طبقة الأوزون، تيارات نفاثة",
    composition: "أوزون، نيتروجين، أكسجين",
    activities: "طيران عال، بالونات علمية، أقمار صناعية منخفضة",
    color: 0x2084ff,
    radius: 6.52,
    thickness: 0.38,
  },
  mesosphere: {
    name: "الميزوسفير",
    description: "أبرد طبقة في الغلاف الجوي، تحترق فيها النيازك",
    height: "50-85 كم",
    temperature: "0°C إلى -90°C",
    pressure: "1 إلى 0.001 مليبار",
    phenomena: "نيازك، غيوم ليلية متوهجة، أمواج جوية",
    composition: "أيونات، جزيئات متعادلة",
    activities: "صواريخ بحثية، نيازك محترقة",
    color: 0x0066cc,
    radius: 6.9,
    thickness: 0.35,
  },
  thermosphere: {
    name: "الثرموسفير",
    description:
      "طبقة ساخنة جداً بسبب امتصاص الأشعة السينية والأشعة فوق البنفسجية",
    height: "85-600 كم",
    temperature: "-90°C إلى +1500°C",
    pressure: "0.001 إلى 0.0000001 مليبار",
    phenomena: "شفق قطبي، أيونات، حرارة عالية",
    composition: "أيونات، إلكترونات حرة، ذرات متعادلة",
    activities: "محطة الفضاء الدولية، أقمار صناعية، شفق قطبي",
    color: 0xff4040,
    radius: 7.5,
    thickness: 5.15,
  },
  exosphere: {
    name: "الإكسوسفير",
    description: "الطبقة الخارجية حيث يمتزج الغلاف الجوي مع الفضاء الخارجي",
    height: "600-10,000 كم",
    temperature: "1500°C إلى -270°C",
    pressure: "ضئيل جداً يقترب من الصفر",
    phenomena: "ذرات تهرب إلى الفضاء، غلاف مغناطيسي",
    composition: "هيدروجين، هيليوم، ذرات متفرقة",
    activities: "أقمار صناعية جغرافية، أبحاث فضائية",
    color: 0x9933ff,
    radius: 12.6,
    thickness: 9.4,
  },
};

function init() {
  // إنشاء المشهد
  scene = new THREE.Scene();

  // إضافة ضباب للعمق
  scene.fog = new THREE.Fog(0x0a0a2a, 50, 300);

  // إنشاء الكاميرا
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 30);

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
    .getElementById("atmosphere-container")
    .appendChild(renderer.domElement);

  // إضافة التحكم بالكاميرا
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 15;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;

  // إضافة الإضاءة
  setupLighting();

  // إنشاء الأرض والغلاف الجوي
  createEarth();
  createAtmosphereLayers();
  createClouds();

  // إضافة تأثيرات النجوم
  createStars();

  // إضافة أحداث النافذة
  window.addEventListener("resize", onWindowResize);

  // إعداد أدوات التحكم
  setupControls();

  // إضافة أحداث النقر على الطبقات
  setupLayerEvents();

  // بدء الحركة
  animate();
}

function setupLighting() {
  // ضوء الشمس (الاتجاهي)
  const sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.set(100, 100, 50);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  scene.add(sunLight);

  // ضوء محيط
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  // ضوء نقطي للأرض
  const earthLight = new THREE.PointLight(0x40a4ff, 0.5, 100);
  earthLight.position.set(0, 0, 0);
  scene.add(earthLight);
}

function createEarth() {
  // إنشاء الأرض (كرة)
  const earthGeometry = new THREE.SphereGeometry(6, 64, 64);

  // إنشاء مادة الأرض مع خريطة طبيعية
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a5fb4,
    emissive: 0x0a3b7a,
    emissiveIntensity: 0.2,
    shininess: 30,
    specular: 0x111111,
  });

  earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.rotation.x = Math.PI * 0.1;
  scene.add(earth);

  // إضافة توهج للأرض
  createEarthGlow();
}

function createEarthGlow() {
  const glowGeometry = new THREE.SphereGeometry(6.2, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x40a4ff) },
      intensity: { value: 0.5 },
    },
    vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform vec3 glowColor;
            uniform float intensity;
            varying vec3 vNormal;
            
            void main() {
                float glow = intensity * (1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))));
                vec3 finalGlow = glowColor * glow * 0.3;
                gl_FragColor = vec4(finalGlow, glow * 0.5);
            }
        `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glow);
}

function createAtmosphereLayers() {
  // إنشاء جميع طبقات الغلاف الجوي
  Object.keys(layersData).forEach((layerKey) => {
    const layer = layersData[layerKey];
    createAtmosphereLayer(layer, layerKey);
  });
}

function createAtmosphereLayer(layerData, layerKey) {
  const innerRadius = layerData.radius;
  const outerRadius = innerRadius + layerData.thickness;

  // إنشاء شكل كروي مجوف للطبقة
  const layerGeometry = new THREE.SphereGeometry(
    outerRadius,
    64,
    64,
    0,
    Math.PI * 2,
    0,
    Math.PI
  );
  const layerMaterial = new THREE.MeshPhongMaterial({
    color: layerData.color,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    emissive: layerData.color,
    emissiveIntensity: 0.1,
    depthWrite: false,
  });

  const layer = new THREE.Mesh(layerGeometry, layerMaterial);
  layer.userData = { type: layerKey, ...layerData };

  // إضافة تأثير شفافية متدرج
  layerMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      `
            varying vec3 vWorldPosition;
            void main() {
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
            varying vec3 vWorldPosition;
            void main() {
                float distance = length(vWorldPosition);
                float alpha = 0.3 * (1.0 - smoothstep(${innerRadius.toFixed(
                  1
                )}, ${outerRadius.toFixed(1)}, distance));
            `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
      "gl_FragColor = vec4( outgoingLight, alpha );"
    );
  };

  scene.add(layer);
  atmosphereLayers.push(layer);

  // إضافة طبقة داخلية للتوهج
  createLayerGlow(layerData, innerRadius, outerRadius);
}

function createLayerGlow(layerData, innerRadius, outerRadius) {
  const glowGeometry = new THREE.SphereGeometry(outerRadius + 0.1, 48, 48);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(layerData.color) },
      innerRadius: { value: innerRadius },
      outerRadius: { value: outerRadius },
      time: { value: 0.0 },
    },
    vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform vec3 glowColor;
            uniform float innerRadius;
            uniform float outerRadius;
            uniform float time;
            varying vec3 vWorldPosition;
            
            void main() {
                float distance = length(vWorldPosition);
                float pulse = sin(time * 2.0) * 0.3 + 0.7;
                float alpha = 0.2 * pulse * (1.0 - smoothstep(innerRadius, outerRadius, distance));
                vec3 finalColor = glowColor * alpha * 1.5;
                gl_FragColor = vec4(finalColor, alpha * 0.5);
            }
        `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.userData = { material: glowMaterial };
  scene.add(glow);
  atmosphereLayers.push(glow);
}

function createClouds() {
  // إنشاء نظام السحب
  const cloudCount = 50;

  for (let i = 0; i < cloudCount; i++) {
    // تحديد طبقة السحابة (معظم السحب في التروبوسفير)
    const altitude = 6.5 + Math.random() * 0.5; // فوق سطح الأرض مباشرة

    // إنشاء سحابة باستخدام كرات متعددة
    const cloudGroup = new THREE.Group();
    const cloudPieces = Math.floor(Math.random() * 5) + 3;

    for (let j = 0; j < cloudPieces; j++) {
      const cloudSize = Math.random() * 1.5 + 0.5;
      const cloudGeometry = new THREE.SphereGeometry(cloudSize, 8, 8);
      const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: Math.random() * 0.3 + 0.4,
        emissive: 0x888888,
        emissiveIntensity: 0.1,
      });

      const cloudPiece = new THREE.Mesh(cloudGeometry, cloudMaterial);

      // توزيع قطع السحابة بشكل عشوائي
      cloudPiece.position.x = (Math.random() - 0.5) * 3;
      cloudPiece.position.y = (Math.random() - 0.5) * 1;
      cloudPiece.position.z = (Math.random() - 0.5) * 3;

      cloudGroup.add(cloudPiece);
    }

    // وضع السحابة في موقع عشوائي حول الأرض
    const latitude = Math.random() * Math.PI * 2;
    const longitude = Math.random() * Math.PI * 2;

    cloudGroup.position.x = altitude * Math.sin(latitude) * Math.cos(longitude);
    cloudGroup.position.y = altitude * Math.sin(latitude) * Math.sin(longitude);
    cloudGroup.position.z = altitude * Math.cos(latitude);

    // جعل السحابة تنظر للأرض
    cloudGroup.lookAt(0, 0, 0);

    // تخزين بيانات الحركة
    cloudGroup.userData = {
      altitude: altitude,
      latitude: latitude,
      longitude: longitude,
      speed: Math.random() * 0.001 + 0.0005,
      rotationSpeed: Math.random() * 0.01 + 0.005,
    };

    scene.add(cloudGroup);
    clouds.push(cloudGroup);
  }
}

function createStars() {
  // إنشاء النجوم الخلفية
  const starGeometry = new THREE.SphereGeometry(0.1, 4, 4);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < 1000; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);

    // توزيع النجوم في كل الاتجاهات
    const distance = 100 + Math.random() * 900;
    const latitude = Math.random() * Math.PI * 2;
    const longitude = Math.random() * Math.PI * 2;

    star.position.x = distance * Math.sin(latitude) * Math.cos(longitude);
    star.position.y = distance * Math.sin(latitude) * Math.sin(longitude);
    star.position.z = distance * Math.cos(latitude);

    // جعل بعض النجوم أكبر وأكثر لمعاناً
    if (Math.random() > 0.7) {
      star.scale.multiplyScalar(Math.random() * 3 + 1);
    }

    scene.add(star);
  }
}

function createWindParticles() {
  // مسح جسيمات الرياح الحالية
  windParticles.forEach((particle) => scene.remove(particle));
  windParticles = [];

  if (!showWind) return;

  // إنشاء جسيمات الرياح
  const particleCount = 200;

  for (let i = 0; i < particleCount; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    // توزيع الجسيمات في طبقات مختلفة
    const layerIndex = Math.floor(Math.random() * 5);
    const layerKey = Object.keys(layersData)[layerIndex];
    const layer = layersData[layerKey];

    const altitude = layer.radius + Math.random() * layer.thickness;
    const latitude = Math.random() * Math.PI * 2;
    const longitude = Math.random() * Math.PI * 2;

    particle.position.x = altitude * Math.sin(latitude) * Math.cos(longitude);
    particle.position.y = altitude * Math.sin(latitude) * Math.sin(longitude);
    particle.position.z = altitude * Math.cos(latitude);

    // تحديد سرعة واتجاه الرياح بناءً على الطبقة
    let windSpeed;
    switch (layerKey) {
      case "troposphere":
        windSpeed = Math.random() * 0.02 + 0.01;
        break;
      case "stratosphere":
        windSpeed = Math.random() * 0.05 + 0.03; // تيارات نفاثة أسرع
        break;
      default:
        windSpeed = Math.random() * 0.01 + 0.005;
    }

    particle.userData = {
      altitude: altitude,
      latitude: latitude,
      longitude: longitude,
      speed: windSpeed,
      direction: Math.random() * Math.PI * 2,
    };

    scene.add(particle);
    windParticles.push(particle);
  }
}

function updateLayerVisibility() {
  atmosphereLayers.forEach((layer) => {
    if (layer.userData && layer.userData.type) {
      if (currentLayer === "all" || layer.userData.type === currentLayer) {
        layer.visible = true;
      } else {
        layer.visible = false;
      }
    }
  });
}

function showLayerInfo(layerData) {
  const infoBox = document.querySelector(".layer-info-box");
  const title = document.getElementById("layer-title");
  const desc = document.getElementById("layer-desc");
  const height = document.getElementById("layer-height");
  const temp = document.getElementById("layer-temp");
  const pressure = document.getElementById("layer-pressure");
  const phenomena = document.getElementById("layer-phenomena");
  const composition = document.getElementById("layer-composition");
  const activities = document.getElementById("layer-activities");

  title.textContent = layerData.name;
  desc.textContent = layerData.description;
  height.textContent = layerData.height;
  temp.textContent = layerData.temperature;
  pressure.textContent = layerData.pressure;
  phenomena.textContent = layerData.phenomena;
  composition.textContent = layerData.composition;
  activities.textContent = layerData.activities;

  infoBox.classList.remove("hidden");
}

function updateDataDisplay() {
  // تحديث قيم العرض في الوقت الحقيقي
  const tempValue = document.getElementById("temp-value");
  const altitudeValue = document.getElementById("altitude-value");
  const windValue = document.getElementById("wind-value");
  const uvValue = document.getElementById("uv-value");

  // محاكاة تغيرات واقعية
  const time = Date.now() * 0.001;

  // درجة الحرارة (تعتمد على الطبقة النشطة)
  let baseTemp = 15;
  if (currentLayer !== "all") {
    const layer = layersData[currentLayer];
    const tempRange = layer.temperature.split("إلى");
    baseTemp = (parseFloat(tempRange[0]) + parseFloat(tempRange[1])) / 2;
  }

  const tempVariation = Math.sin(time * 0.5) * 5;
  tempValue.textContent = `${Math.round(baseTemp + tempVariation)}°C`;

  // الارتفاع
  let altitude = 0;
  if (currentLayer !== "all") {
    const layer = layersData[currentLayer];
    const heightRange = layer.height.split("-");
    altitude = (parseFloat(heightRange[0]) + parseFloat(heightRange[1])) / 2;
  }
  altitudeValue.textContent = `${altitude.toFixed(1)} كم`;

  // سرعة الرياح
  const windVariation = Math.sin(time * 0.3) * 10 + 20;
  windValue.textContent = `${Math.round(windVariation)} كم/ساعة`;

  // مؤشر الأشعة فوق البنفسجية
  const uvVariation = Math.sin(time * 0.2) * 3 + 5;
  uvValue.textContent = Math.round(uvVariation);
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // تحديث التحكم
  controls.update();

  // دوران الأرض إذا كان مفعلاً
  if (autoRotate) {
    earth.rotation.y += 0.001;

    // دوران السحب مع الأرض ولكن بسرعات مختلفة
    clouds.forEach((cloud) => {
      cloud.userData.longitude += cloud.userData.speed;

      const altitude = cloud.userData.altitude;
      const latitude = cloud.userData.latitude;
      const longitude = cloud.userData.longitude;

      cloud.position.x = altitude * Math.sin(latitude) * Math.cos(longitude);
      cloud.position.y = altitude * Math.sin(latitude) * Math.sin(longitude);
      cloud.position.z = altitude * Math.cos(latitude);

      cloud.lookAt(0, 0, 0);

      // دوران خفيف للسحابة نفسها
      cloud.rotation.z += cloud.userData.rotationSpeed;
    });

    // حركة جسيمات الرياح
    windParticles.forEach((particle) => {
      if (particle.userData) {
        particle.userData.longitude += particle.userData.speed;

        const altitude = particle.userData.altitude;
        const latitude = particle.userData.latitude;
        const longitude = particle.userData.longitude;

        particle.position.x =
          altitude * Math.sin(latitude) * Math.cos(longitude);
        particle.position.y =
          altitude * Math.sin(latitude) * Math.sin(longitude);
        particle.position.z = altitude * Math.cos(latitude);

        // حركة عمودية خفيفة
        particle.position.y +=
          Math.sin(time + particle.userData.direction) * 0.01;
      }
    });
  }

  // تحديث توهج الطبقات
  atmosphereLayers.forEach((layer) => {
    if (layer.userData && layer.userData.material) {
      layer.userData.material.uniforms.time.value = time;
    }
  });

  // تحديث عرض البيانات
  updateDataDisplay();

  // عرض المشهد
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupControls() {
  // زر تبديل طبقات الغلاف
  document.getElementById("layer-btn").addEventListener("click", function () {
    const layers = [
      "all",
      "troposphere",
      "stratosphere",
      "mesosphere",
      "thermosphere",
      "exosphere",
    ];
    let currentIndex = layers.indexOf(currentLayer);
    currentLayer = layers[(currentIndex + 1) % layers.length];

    updateLayerVisibility();
    updateButtonText(
      "layer-btn",
      `🌐 ${
        currentLayer === "all" ? "جميع الطبقات" : layersData[currentLayer].name
      }`
    );

    // تحديث أزرار الطبقات
    document.querySelectorAll(".layer-btn").forEach((btn) => {
      if (btn.dataset.layer === currentLayer) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });

  // زر إظهار/إخفاء السحب
  document.getElementById("clouds-btn").addEventListener("click", function () {
    clouds.forEach((cloud) => {
      cloud.visible = !cloud.visible;
    });
    updateButtonText(
      "clouds-btn",
      cloud.visible ? "☁️ إخفاء السحب" : "☁️ إظهار السحب"
    );
  });

  // زر تفعيل أنماط الرياح
  document.getElementById("wind-btn").addEventListener("click", function () {
    showWind = !showWind;
    createWindParticles();
    updateButtonText(
      "wind-btn",
      showWind ? "💨 إيقاف الرياح" : "💨 تفعيل الرياح"
    );
  });

  // زر تبديل الليل والنهار
  document
    .getElementById("daynight-btn")
    .addEventListener("click", function () {
      isDay = !isDay;

      // تغيير إضاءة المشهد
      const sunLight = scene.children.find(
        (child) => child.type === "DirectionalLight"
      );
      if (sunLight) {
        sunLight.intensity = isDay ? 1 : 0.1;
      }

      // تغيير لون الأرض
      earth.material.color.setHex(isDay ? 0x1a5fb4 : 0x0a3b7a);
      earth.material.emissiveIntensity = isDay ? 0.2 : 0.5;

      updateButtonText(
        "daynight-btn",
        isDay ? "🌙 وضع الليل" : "☀️ وضع النهار"
      );
    });

  // زر إظهار التلوث الجوي
  document
    .getElementById("pollution-btn")
    .addEventListener("click", function () {
      showPollution = !showPollution;

      // إضافة/إزالة تأثير التلوث
      if (showPollution) {
        createPollutionEffect();
      } else {
        removePollutionEffect();
      }

      updateButtonText(
        "pollution-btn",
        showPollution ? "🌿 إخفاء التلوث" : "🏭 إظهار التلوث"
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
  updateButtonText(
    "layer-btn",
    `🌐 ${
      currentLayer === "all" ? "جميع الطبقات" : layersData[currentLayer].name
    }`
  );
  updateButtonText("clouds-btn", "☁️ إخفاء السحب");
  updateButtonText("wind-btn", "💨 تفعيل الرياح");
  updateButtonText("daynight-btn", "🌙 وضع الليل");
  updateButtonText("pollution-btn", "🏭 إظهار التلوث");
  updateButtonText("auto-rotate-btn", "⏸️ إيقاف الدوران");
}

function setupLayerEvents() {
  // أحداث أزرار الطبقات
  document.querySelectorAll(".layer-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const layer = this.dataset.layer;
      currentLayer = layer;

      // تحديث النشاط
      document
        .querySelectorAll(".layer-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // تحديث الرؤية
      updateLayerVisibility();

      // عرض معلومات الطبقة
      if (layer !== "all") {
        showLayerInfo(layersData[layer]);
      } else {
        document.querySelector(".layer-info-box").classList.add("hidden");
      }

      // تحديث زر الطبقات الرئيسي
      updateButtonText(
        "layer-btn",
        `🌐 ${layer === "all" ? "جميع الطبقات" : layersData[layer].name}`
      );
    });
  });

  // زر إغلاق معلومات الطبقة
  document.querySelector(".close-btn").addEventListener("click", function () {
    document.querySelector(".layer-info-box").classList.add("hidden");
  });

  // أحداث النقر على الطبقات في المشهد
  document
    .getElementById("atmosphere-container")
    .addEventListener("click", function (event) {
      // في تطبيق كامل، يمكن إضافة Raycaster للكشف عن النقر على الكائنات
      // لكننا نستخدم حالياً الأزرار فقط للتبسيط
    });
}

function updateButtonText(buttonId, text) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.textContent = text;
  }
}

function createPollutionEffect() {
  // إنشاء تأثير التلوث الجوي
  const pollutionGeometry = new THREE.SphereGeometry(6.3, 32, 32);
  const pollutionMaterial = new THREE.MeshPhongMaterial({
    color: 0x666666,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
  });

  const pollution = new THREE.Mesh(pollutionGeometry, pollutionMaterial);
  pollution.userData = { type: "pollution" };
  scene.add(pollution);

  // تخزين المرجع لإزالته لاحقاً
  pollutionEffect = pollution;
}

function removePollutionEffect() {
  // إزالة تأثير التلوث
  if (pollutionEffect) {
    scene.remove(pollutionEffect);
    pollutionEffect = null;
  }
}

// بدء التطبيق
let pollutionEffect = null;
init();
