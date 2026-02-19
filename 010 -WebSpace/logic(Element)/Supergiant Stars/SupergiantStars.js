// النجوم العملاقة العظمى ثلاثية الأبعاد
import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";

const container = document.getElementById("supergiant-container");

// ========== إعداد المشهد ==========
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(0, 50, 200);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// ========== خلفية النجوم ==========
function createStarfield() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 8000;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;

    const radius = 500 + Math.random() * 1000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);

    const temp = Math.random();
    if (temp > 0.7) {
      starColors[i3] = 0.6;
      starColors[i3 + 1] = 0.7;
      starColors[i3 + 2] = 1.0;
    } else if (temp > 0.4) {
      starColors[i3] = 1.0;
      starColors[i3 + 1] = 1.0;
      starColors[i3 + 2] = 1.0;
    } else {
      starColors[i3] = 1.0;
      starColors[i3 + 1] = 0.7 + Math.random() * 0.3;
      starColors[i3 + 2] = 0.4;
    }

    starSizes[i] = Math.random() * 2 + 0.5;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  starsGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
  starsGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

  const starsMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  return new THREE.Points(starsGeometry, starsMaterial);
}

const stars = createStarfield();
scene.add(stars);

// ========== بيانات أنواع النجوم ==========
const starTypes = {
  red: {
    name: "Betelgeuse",
    color: 0xff4422,
    coreColor: 0xff8844,
    glowColor: 0xff6633,
    temperature: 3500,
    radius: 80,
    coronaColor: 0xff2200,
  },
  blue: {
    name: "Rigel",
    color: 0x88bbff,
    coreColor: 0xffffff,
    glowColor: 0x6699ff,
    temperature: 12000,
    radius: 60,
    coronaColor: 0x4488ff,
  },
  yellow: {
    name: "Polaris",
    color: 0xffdd44,
    coreColor: 0xffffaa,
    glowColor: 0xffcc33,
    temperature: 6000,
    radius: 70,
    coronaColor: 0xffaa00,
  },
};

let currentStarType = "red";

// ========== إنشاء النجم العملاق ==========
function createSupergiantStar(type) {
  const starGroup = new THREE.Group();
  const config = starTypes[type];

  // النواة الداخلية المتوهجة
  const coreGeometry = new THREE.SphereGeometry(config.radius * 0.6, 64, 64);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: config.coreColor,
    transparent: true,
    opacity: 0.9,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  starGroup.add(core);

  // الطبقة الرئيسية مع shader
  const starGeometry = new THREE.SphereGeometry(config.radius, 128, 128);

  // تشويه السطح لمحاكاة النشاط النجمي
  const positions = starGeometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    const noise = Math.random() * 0.08;
    positions.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise));
  }
  positions.needsUpdate = true;
  starGeometry.computeVertexNormals();

  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(config.color) },
      glowColor: { value: new THREE.Color(config.glowColor) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        // تموجات السطح
        vec3 newPosition = position;
        float wave = sin(position.x * 0.1 + time) * sin(position.y * 0.1 + time) * 2.0;
        newPosition += normal * wave;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform vec3 glowColor;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // تأثير الإضاءة من المركز
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        
        // نقاط ساخنة متحركة
        float hotspot = sin(vPosition.x * 0.2 + time) * sin(vPosition.y * 0.2 + time * 0.7);
        hotspot = smoothstep(0.3, 1.0, hotspot);
        
        vec3 finalColor = mix(color, glowColor, intensity);
        finalColor = mix(finalColor, glowColor * 1.5, hotspot * 0.3);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.FrontSide,
  });

  const star = new THREE.Mesh(starGeometry, starMaterial);
  starGroup.add(star);

  // الهالة المحيطة (Corona)
  const coronaGeometry = new THREE.SphereGeometry(config.radius * 1.3, 64, 64);
  const coronaMaterial = new THREE.MeshBasicMaterial({
    color: config.coronaColor,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  starGroup.add(corona);

  // هالة خارجية أكبر
  const outerCoronaGeo = new THREE.SphereGeometry(config.radius * 1.6, 64, 64);
  const outerCoronaMat = new THREE.MeshBasicMaterial({
    color: config.coronaColor,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const outerCorona = new THREE.Mesh(outerCoronaGeo, outerCoronaMat);
  starGroup.add(outerCorona);

  return starGroup;
}

let supergiantStar = createSupergiantStar(currentStarType);
scene.add(supergiantStar);

// ========== البروزات الشمسية (Solar Prominences) ==========
function createProminences(count, type) {
  const prominencesGroup = new THREE.Group();
  const radius = starTypes[type].radius;

  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2;

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0),
      new THREE.Vector3(
        Math.cos(theta) * (radius + 20),
        Math.sin(theta) * (radius + 20),
        15
      ),
      new THREE.Vector3(
        Math.cos(theta) * (radius + 10),
        Math.sin(theta) * (radius + 10),
        25
      )
    );

    const tubeGeometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({
      color: starTypes[type].coronaColor,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const prominence = new THREE.Mesh(tubeGeometry, tubeMaterial);
    prominencesGroup.add(prominence);
  }

  return prominencesGroup;
}

let prominences = createProminences(12, currentStarType);
scene.add(prominences);

// ========== جزيئات الرياح النجمية ==========
function createStellarWind(type) {
  const particleCount = 8000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const radius = starTypes[type].radius;
  const color = new THREE.Color(starTypes[type].glowColor);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const r = radius + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    const speed = 0.2 + Math.random() * 0.5;
    velocities[i3] = (positions[i3] / r) * speed;
    velocities[i3 + 1] = (positions[i3 + 1] / r) * speed;
    velocities[i3 + 2] = (positions[i3 + 2] / r) * speed;

    colors[i3] = color.r * (0.8 + Math.random() * 0.2);
    colors[i3 + 1] = color.g * (0.8 + Math.random() * 0.2);
    colors[i3 + 2] = color.b * (0.8 + Math.random() * 0.2);

    sizes[i] = Math.random() * 2 + 0.5;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

let stellarWind = createStellarWind(currentStarType);
scene.add(stellarWind);

// ========== البقع النجمية (Starspots) ==========
function createStarspots(type) {
  const spotsGroup = new THREE.Group();
  const spotCount = 15;
  const radius = starTypes[type].radius;

  for (let i = 0; i < spotCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    const spotGeo = new THREE.SphereGeometry(radius * 0.1, 16, 16);
    const spotMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
    });
    const spot = new THREE.Mesh(spotGeo, spotMat);

    spot.position.set(
      radius * Math.sin(phi) * Math.cos(theta) * 1.01,
      radius * Math.sin(phi) * Math.sin(theta) * 1.01,
      radius * Math.cos(phi) * 1.01
    );

    spotsGroup.add(spot);
  }

  return spotsGroup;
}

let starspots = createStarspots(currentStarType);
supergiantStar.add(starspots);

// ========== الشمس للمقارنة ==========
let sun = null;

function createSun() {
  const sunGroup = new THREE.Group();

  const sunGeo = new THREE.SphereGeometry(3, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xffdd00,
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunGroup.add(sunMesh);

  const sunGlow = new THREE.SphereGeometry(4, 32, 32);
  const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
  });
  const sunGlowMesh = new THREE.Mesh(sunGlow, sunGlowMat);
  sunGroup.add(sunGlowMesh);

  sunGroup.position.set(starTypes[currentStarType].radius + 50, 0, 0);

  return sunGroup;
}

// ========== الإضاءة ==========
const starLight = new THREE.PointLight(
  starTypes[currentStarType].color,
  3,
  500
);
starLight.position.set(0, 0, 0);
scene.add(starLight);

const ambientLight = new THREE.AmbientLight(0x221100, 0.3);
scene.add(ambientLight);

// ========== التفاعل ==========
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener("mousemove", (event) => {
  targetX = (event.clientX / window.innerWidth) * 2 - 1;
  targetY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ========== انفجار شمسي ==========
function createSolarFlare() {
  const flareCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(flareCount * 3);
  const colors = new Float32Array(flareCount * 3);
  const velocities = new Float32Array(flareCount * 3);

  const radius = starTypes[currentStarType].radius;
  const color = new THREE.Color(starTypes[currentStarType].coronaColor);

  for (let i = 0; i < flareCount; i++) {
    const i3 = i * 3;

    const theta = Math.random() * Math.PI * 0.5;
    const phi = Math.random() * Math.PI * 2;

    positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i3 + 2] = radius * Math.cos(theta);

    const speed = 2 + Math.random() * 3;
    velocities[i3] = (positions[i3] / radius) * speed;
    velocities[i3 + 1] = (positions[i3 + 1] / radius) * speed;
    velocities[i3 + 2] = (positions[i3 + 2] / radius) * speed;

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

  const material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
  });

  const flare = new THREE.Points(geometry, material);
  scene.add(flare);

  // تحريك الانفجار
  let time = 0;
  const animateFlare = () => {
    time += 0.016;
    if (time > 3) {
      scene.remove(flare);
      geometry.dispose();
      material.dispose();
      return;
    }

    const pos = flare.geometry.attributes.position.array;
    const vel = flare.geometry.attributes.velocity.array;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += vel[i];
      pos[i + 1] += vel[i + 1];
      pos[i + 2] += vel[i + 2];
    }
    flare.geometry.attributes.position.needsUpdate = true;
    flare.material.opacity = Math.max(0, 1 - time / 3);

    requestAnimationFrame(animateFlare);
  };
  animateFlare();
}

// ========== الحركة والتحريك ==========
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = clock.getDelta();

  // حركة الماوس
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  // تحديث shader النجم
  if (supergiantStar.children[1]) {
    supergiantStar.children[1].material.uniforms.time.value = elapsedTime;
  }

  // دوران النجم
  supergiantStar.rotation.y += 0.0005;

  // نبض النواة
  const pulseScale = 1 + Math.sin(elapsedTime * 2) * 0.05;
  supergiantStar.children[0].scale.set(pulseScale, pulseScale, pulseScale);

  // نبض الهالة
  const coronaScale = 1 + Math.sin(elapsedTime * 1.5) * 0.08;
  supergiantStar.children[2].scale.set(coronaScale, coronaScale, coronaScale);
  supergiantStar.children[3].scale.set(
    coronaScale * 1.1,
    coronaScale * 1.1,
    coronaScale * 1.1
  );

  // حركة البروزات
  prominences.rotation.y += 0.001;

  // حركة الرياح النجمية
  const windPos = stellarWind.geometry.attributes.position.array;
  const windVel = stellarWind.geometry.attributes.velocity.array;
  const radius = starTypes[currentStarType].radius;

  for (let i = 0; i < windPos.length; i += 3) {
    windPos[i] += windVel[i];
    windPos[i + 1] += windVel[i + 1];
    windPos[i + 2] += windVel[i + 2];

    const dist = Math.sqrt(
      windPos[i] ** 2 + windPos[i + 1] ** 2 + windPos[i + 2] ** 2
    );

    if (dist > radius + 150) {
      const r = radius + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      windPos[i] = r * Math.sin(phi) * Math.cos(theta);
      windPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      windPos[i + 2] = r * Math.cos(phi);
    }
  }
  stellarWind.geometry.attributes.position.needsUpdate = true;

  // دوران الشمس
  if (sun) {
    sun.rotation.y += 0.01;
    const orbitRadius = starTypes[currentStarType].radius + 50;
    sun.position.x = Math.cos(elapsedTime * 0.2) * orbitRadius;
    sun.position.z = Math.sin(elapsedTime * 0.2) * orbitRadius;
  }

  // إضاءة نابضة
  starLight.intensity = 3 + Math.sin(elapsedTime * 1.5) * 0.5;

  // حركة الكاميرا
  camera.position.x += (mouseX * 60 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 60 + 50 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // تلألؤ النجوم
  stars.rotation.y += 0.0001;

  renderer.render(scene, camera);
}

animate();

// ========== إعداد الأزرار بعد تحميل الصفحة ==========
window.addEventListener("DOMContentLoaded", () => {
  // تغيير نوع النجم
  document.querySelectorAll(".star-type").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      currentStarType = type;

      // إزالة النجم القديم
      scene.remove(supergiantStar);
      scene.remove(prominences);
      scene.remove(stellarWind);

      // إنشاء نجم جديد
      supergiantStar = createSupergiantStar(type);
      prominences = createProminences(12, type);
      stellarWind = createStellarWind(type);
      starspots = createStarspots(type);
      supergiantStar.add(starspots);

      scene.add(supergiantStar);
      scene.add(prominences);
      scene.add(stellarWind);

      // تحديث الإضاءة
      starLight.color.set(starTypes[type].color);

      // تحديث موقع الشمس
      if (sun) {
        sun.position.set(starTypes[type].radius + 50, 0, 0);
      }
    });
  });

  // زر إضافة الشمس
  const solarBtn = document.getElementById("solar-btn");
  if (solarBtn) {
    solarBtn.addEventListener("click", () => {
      if (!sun) {
        sun = createSun();
        scene.add(sun);
        solarBtn.textContent = "🌍 إخفاء الشمس";
      } else {
        scene.remove(sun);
        sun = null;
        solarBtn.textContent = "🌍 إضافة الشمس للمقارنة";
      }
    });
  }

  // زر الانفجار الشمسي
  const flareBtn = document.getElementById("flare-btn");
  if (flareBtn) {
    flareBtn.addEventListener("click", () => {
      createSolarFlare();
    });
  }
});

// ========== تحديث الحجم ==========
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
