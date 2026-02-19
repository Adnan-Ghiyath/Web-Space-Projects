// السوبرنوفا - الانفجار النجمي ثلاثي الأبعاد
import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";

const container = document.getElementById("supernova-container");

// ========== إعداد المشهد ==========
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// ========== خلفية النجوم ==========
function createStarfield() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 5000;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 500;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 500;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 500;

    starColors[i3] = 0.8 + Math.random() * 0.2;
    starColors[i3 + 1] = 0.8 + Math.random() * 0.2;
    starColors[i3 + 2] = 1.0;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  starsGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

  const starsMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  return new THREE.Points(starsGeometry, starsMaterial);
}

const stars = createStarfield();
scene.add(stars);

// ========== نواة الانفجار ==========
const coreGeometry = new THREE.SphereGeometry(3, 32, 32);
const coreMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 1,
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// هالة النواة المتوهجة
const glowGeometry = new THREE.SphereGeometry(5, 32, 32);
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffaa00,
  transparent: true,
  opacity: 0.6,
  side: THREE.BackSide,
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(glow);

// هالة خارجية
const glow2Geometry = new THREE.SphereGeometry(8, 32, 32);
const glow2Material = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  transparent: true,
  opacity: 0.3,
  side: THREE.BackSide,
});
const glow2 = new THREE.Mesh(glow2Geometry, glow2Material);
scene.add(glow2);

// ========== جزيئات الانفجار ==========
function createExplosionParticles() {
  const particleCount = 15000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const colorPalette = [
    { r: 1.0, g: 1.0, b: 1.0 }, // أبيض
    { r: 1.0, g: 0.9, b: 0.3 }, // أصفر
    { r: 1.0, g: 0.5, b: 0.0 }, // برتقالي
    { r: 1.0, g: 0.2, b: 0.0 }, // أحمر
    { r: 0.8, g: 0.0, b: 0.2 }, // أحمر داكن
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // البداية من المركز
    positions[i3] = (Math.random() - 0.5) * 2;
    positions[i3 + 1] = (Math.random() - 0.5) * 2;
    positions[i3 + 2] = (Math.random() - 0.5) * 2;

    // سرعة انفجار عشوائية
    const speed = 0.2 + Math.random() * 0.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    velocities[i3] = speed * Math.sin(phi) * Math.cos(theta);
    velocities[i3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
    velocities[i3 + 2] = speed * Math.cos(phi);

    // ألوان متدرجة
    const colorIndex = Math.floor(Math.random() * colorPalette.length);
    const color = colorPalette[colorIndex];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = Math.random() * 3 + 0.5;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

const explosionParticles = createExplosionParticles();
scene.add(explosionParticles);

// ========== موجات الصدمة ==========
function createShockwave(radius, color, opacity) {
  const geometry = new THREE.RingGeometry(radius, radius + 0.5, 64);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(geometry, material);
  return ring;
}

const shockwaves = [];
for (let i = 0; i < 3; i++) {
  const wave = createShockwave(5 + i * 3, 0xff6600, 0.4 - i * 0.1);
  scene.add(wave);
  shockwaves.push(wave);
}

// ========== شظايا كبيرة ==========
function createDebris() {
  const debrisGroup = new THREE.Group();
  const debrisCount = 50;

  for (let i = 0; i < debrisCount; i++) {
    const size = Math.random() * 1.5 + 0.5;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0xff4400 : 0xffaa00,
      transparent: true,
      opacity: 0.8,
    });
    const debris = new THREE.Mesh(geometry, material);

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const speed = 0.3 + Math.random() * 0.5;

    debris.userData.velocity = new THREE.Vector3(
      speed * Math.sin(phi) * Math.cos(theta),
      speed * Math.sin(phi) * Math.sin(theta),
      speed * Math.cos(phi)
    );

    debris.userData.rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    );

    debrisGroup.add(debris);
  }

  return debrisGroup;
}

const debris = createDebris();
scene.add(debris);

// ========== الإضاءة ==========
const explosionLight = new THREE.PointLight(0xffaa00, 5, 200);
explosionLight.position.set(0, 0, 0);
scene.add(explosionLight);

const ambientLight = new THREE.AmbientLight(0x331100, 0.2);
scene.add(ambientLight);

// ========== متغيرات الحركة ==========
let explosionTime = 0;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener("mousemove", (event) => {
  targetX = (event.clientX / window.innerWidth) * 2 - 1;
  targetY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ========== وظيفة إعادة الانفجار ==========
function resetExplosion() {
  explosionTime = 0;

  // إعادة تعيين الجسيمات
  const positions = explosionParticles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2;
    positions[i + 1] = (Math.random() - 0.5) * 2;
    positions[i + 2] = (Math.random() - 0.5) * 2;
  }
  explosionParticles.geometry.attributes.position.needsUpdate = true;

  // إعادة تعيين الشظايا
  debris.children.forEach((d) => {
    d.position.set(0, 0, 0);
  });

  // إعادة تعيين موجات الصدمة
  shockwaves.forEach((wave, i) => {
    wave.scale.set(1, 1, 1);
    wave.material.opacity = 0.4 - i * 0.1;
  });

  // إعادة تعيين النواة
  core.scale.set(1, 1, 1);
  core.material.opacity = 1;
}

document
  .getElementById("restart-btn")
  .addEventListener("click", resetExplosion);

// ========== الحركة والتحريك ==========
function animate() {
  requestAnimationFrame(animate);
  explosionTime += 0.016;

  // حركة الماوس السلسة
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  // تحريك الجسيمات
  const positions = explosionParticles.geometry.attributes.position.array;
  const velocities = explosionParticles.geometry.attributes.velocity.array;
  const colors = explosionParticles.geometry.attributes.color.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];

    // تلاشي اللون مع الوقت
    const distance = Math.sqrt(
      positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2
    );
    const fade = Math.max(0, 1 - distance / 150);

    colors[i] *= 0.998;
    colors[i + 1] *= 0.998;
    colors[i + 2] *= 0.998;
  }
  explosionParticles.geometry.attributes.position.needsUpdate = true;
  explosionParticles.geometry.attributes.color.needsUpdate = true;

  // تحريك الشظايا
  debris.children.forEach((d) => {
    d.position.add(d.userData.velocity);
    d.rotation.x += d.userData.rotationSpeed.x;
    d.rotation.y += d.userData.rotationSpeed.y;
    d.rotation.z += d.userData.rotationSpeed.z;

    // تلاشي الشظايا
    d.material.opacity *= 0.998;
  });

  // توسع موجات الصدمة
  shockwaves.forEach((wave, i) => {
    const scale = 1 + explosionTime * (0.5 + i * 0.2);
    wave.scale.set(scale, scale, 1);
    wave.material.opacity = Math.max(0, 0.4 - i * 0.1 - explosionTime * 0.1);
    wave.rotation.z += 0.01;
  });

  // نبض النواة وتقلصها
  const coreScale = Math.max(0.1, 1 - explosionTime * 0.05);
  core.scale.set(coreScale, coreScale, coreScale);
  core.material.opacity = Math.max(0, 1 - explosionTime * 0.08);

  const glowScale = 1 + Math.sin(explosionTime * 3) * 0.2;
  glow.scale.set(glowScale, glowScale, glowScale);
  glow.material.opacity = Math.max(0, 0.6 - explosionTime * 0.05);

  glow2.scale.set(glowScale * 1.3, glowScale * 1.3, glowScale * 1.3);
  glow2.material.opacity = Math.max(0, 0.3 - explosionTime * 0.03);

  // إضاءة متذبذبة
  explosionLight.intensity = Math.max(
    0.5,
    5 - explosionTime * 0.2 + Math.sin(explosionTime * 5) * 0.5
  );

  // حركة الكاميرا
  camera.position.x += (mouseX * 30 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 30 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // دوران بطيء للنجوم
  stars.rotation.y += 0.0002;

  renderer.render(scene, camera);
}

animate();

// ========== تحديث الحجم ==========
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
