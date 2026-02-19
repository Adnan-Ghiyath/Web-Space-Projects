// المذنبات ثلاثية الأبعاد
import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";

const container = document.getElementById("comets-container");

// ========== إعداد المشهد ==========
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000510);
scene.fog = new THREE.Fog(0x000510, 10, 150);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 3, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// ========== خلفية النجوم ==========
function createStarfield() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 8000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 0.8,
  });

  return new THREE.Points(starsGeometry, starsMaterial);
}

const stars = createStarfield();
scene.add(stars);

// ========== المذنب ==========
const cometGroup = new THREE.Group();

// ========== نواة المذنب (غير منتظمة) ==========
const nucleusGeometry = new THREE.SphereGeometry(0.6, 32, 32);

// تشويه الشكل ليبدو غير منتظم
const positions = nucleusGeometry.attributes.position;
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i);
  const y = positions.getY(i);
  const z = positions.getZ(i);

  const noise = Math.random() * 0.15;
  positions.setXYZ(
    i,
    x * (1 + noise),
    y * (1 + noise * 0.8),
    z * (1 + noise * 1.2)
  );
}
positions.needsUpdate = true;
nucleusGeometry.computeVertexNormals();

const nucleusMaterial = new THREE.MeshPhongMaterial({
  color: 0x8899aa,
  emissive: 0x223344,
  shininess: 5,
  roughness: 0.9,
});

const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
cometGroup.add(nucleus);

// ========== الهالة المحيطة (Coma) ==========
const comaGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const comaMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ccff,
  transparent: true,
  opacity: 0.15,
  side: THREE.BackSide,
});
const coma = new THREE.Mesh(comaGeometry, comaMaterial);
cometGroup.add(coma);

// هالة ثانية
const coma2Geometry = new THREE.SphereGeometry(1.5, 32, 32);
const coma2Material = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  transparent: true,
  opacity: 0.08,
  side: THREE.BackSide,
});
const coma2 = new THREE.Mesh(coma2Geometry, coma2Material);
cometGroup.add(coma2);

// ========== الذيل الأيوني (الأزرق المستقيم) ==========
function createIonTail() {
  const tailGeometry = new THREE.ConeGeometry(0.4, 12, 16, 1, true);
  const tailMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ddff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });

  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.rotation.x = Math.PI / 2;
  tail.position.z = 6;

  return tail;
}

const ionTail = createIonTail();
cometGroup.add(ionTail);

// ========== الذيل الغباري (الأصفر المنحني) ==========
function createDustTail() {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, -1, 8),
    new THREE.Vector3(3, -2, 14)
  );

  const dustGeometry = new THREE.TubeGeometry(curve, 50, 0.5, 8, false);

  const dustMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc44,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });

  const dustTail = new THREE.Mesh(dustGeometry, dustMaterial);
  return dustTail;
}

const dustTail = createDustTail();
cometGroup.add(dustTail);

scene.add(cometGroup);

// تحديد موقع المذنب (يمكنك تغيير هذه القيم)
cometGroup.position.set(0, 0, 0);

// ========== جزيئات متطايرة ==========
function createParticles() {
  const particleCount = 1500;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.8;
    const length = Math.random() * 15;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = Math.sin(angle) * radius - length * 0.1;
    positions[i3 + 2] = length;

    // سرعة الجزيئات
    velocities[i3] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 2] = 0.02 + Math.random() * 0.03;

    // ألوان متنوعة (أزرق وأبيض)
    const colorChoice = Math.random();
    if (colorChoice > 0.5) {
      colors[i3] = 0.3;
      colors[i3 + 1] = 0.8;
      colors[i3 + 2] = 1.0;
    } else {
      colors[i3] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 1.0;
    }
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute(
    "velocity",
    new THREE.BufferAttribute(velocities, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(particleGeometry, particleMaterial);
}

const particles = createParticles();
cometGroup.add(particles);

// ========== شظايا متطايرة كبيرة ==========
function createDebris() {
  const debrisGroup = new THREE.Group();
  const debrisCount = 30;

  for (let i = 0; i < debrisCount; i++) {
    const size = Math.random() * 0.15 + 0.05;
    const geometry = new THREE.SphereGeometry(size, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0xaabbcc : 0x889999,
      transparent: true,
      opacity: 0.6,
    });
    const debris = new THREE.Mesh(geometry, material);

    const angle = Math.random() * Math.PI * 2;
    const radius = 1 + Math.random() * 2;
    const height = Math.random() * 5;

    debris.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.5,
      height
    );

    debris.userData.velocity = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: 0.03 + Math.random() * 0.02,
    };

    debrisGroup.add(debris);
  }

  return debrisGroup;
}

const debris = createDebris();
cometGroup.add(debris);

// ========== الإضاءة ==========
const ambientLight = new THREE.AmbientLight(0x4466aa, 0.3);
scene.add(ambientLight);

// ضوء الشمس
const sunLight = new THREE.DirectionalLight(0xffffee, 1.5);
sunLight.position.set(-8, 3, -5);
scene.add(sunLight);

// إضاءة جانبية
const fillLight = new THREE.PointLight(0x0088ff, 0.8, 20);
fillLight.position.set(5, 2, 5);
scene.add(fillLight);

// ========== متغيرات التحكم ==========
let movementSpeed = 1;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener("mousemove", (event) => {
  targetX = (event.clientX / window.innerWidth) * 2 - 1;
  targetY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ========== الحركة والتحريك ==========
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = clock.getDelta();

  // حركة الماوس السلسة
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  // دوران النواة
  nucleus.rotation.y += 0.003;
  nucleus.rotation.x += 0.001;

  // نبض الهالة
  const pulseScale = 1 + Math.sin(elapsedTime * 2) * 0.1;
  coma.scale.set(pulseScale, pulseScale, pulseScale);

  const pulseScale2 = 1 + Math.cos(elapsedTime * 1.5) * 0.08;
  coma2.scale.set(pulseScale2, pulseScale2, pulseScale2);

  // حركة الجزيئات
  const particlePositions = particles.geometry.attributes.position.array;
  const particleVelocities = particles.geometry.attributes.velocity.array;

  for (let i = 0; i < particlePositions.length; i += 3) {
    particlePositions[i] += particleVelocities[i] * movementSpeed;
    particlePositions[i + 1] += particleVelocities[i + 1] * movementSpeed;
    particlePositions[i + 2] += particleVelocities[i + 2] * movementSpeed;

    particlePositions[i] += Math.sin(elapsedTime + i) * 0.002;
    particlePositions[i + 1] += Math.cos(elapsedTime * 0.5 + i) * 0.002;

    // إعادة الجزيئات من البداية
    if (particlePositions[i + 2] > 20) {
      particlePositions[i + 2] = 0;
      particlePositions[i] = (Math.random() - 0.5) * 0.8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 0.8;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // حركة الشظايا
  debris.children.forEach((piece) => {
    piece.position.x += piece.userData.velocity.x * movementSpeed;
    piece.position.y += piece.userData.velocity.y * movementSpeed;
    piece.position.z += piece.userData.velocity.z * movementSpeed;

    piece.rotation.x += 0.02;
    piece.rotation.y += 0.03;

    if (piece.position.z > 15) {
      piece.position.z = 0;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 2;
      piece.position.x = Math.cos(angle) * radius;
      piece.position.y = Math.sin(angle) * radius * 0.5;
    }
  });

  // حركة الكاميرا
  camera.position.x += (mouseX * 8 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 8 + 3 - camera.position.y) * 0.05;
  camera.lookAt(cometGroup.position);

  // دوران النجوم
  stars.rotation.y += 0.0001;

  renderer.render(scene, camera);
}

animate();

// ========== إعداد الأزرار ==========
setTimeout(() => {
  const speedBtn = document.getElementById("speed-btn");
  if (speedBtn) {
    speedBtn.addEventListener("click", () => {
      movementSpeed = movementSpeed === 1 ? 3 : 1;
      speedBtn.textContent =
        movementSpeed === 1 ? "⚡ تسريع الحركة" : "🐌 إبطاء الحركة";
    });
  }

  const tailBtn = document.getElementById("tail-btn");
  if (tailBtn) {
    tailBtn.addEventListener("click", () => {
      ionTail.material.opacity = Math.min(ionTail.material.opacity + 0.1, 0.8);
      dustTail.material.opacity = Math.min(
        dustTail.material.opacity + 0.1,
        0.7
      );
      coma.material.opacity = Math.min(coma.material.opacity + 0.05, 0.5);
    });
  }

  const particlesBtn = document.getElementById("particles-btn");
  if (particlesBtn) {
    particlesBtn.addEventListener("click", () => {
      // إضافة شظايا جديدة
      for (let i = 0; i < 10; i++) {
        const size = Math.random() * 0.15 + 0.05;
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0xaabbcc : 0x889999,
          transparent: true,
          opacity: 0.6,
        });
        const newDebris = new THREE.Mesh(geometry, material);

        const angle = Math.random() * Math.PI * 2;
        const radius = 1 + Math.random() * 2;

        newDebris.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          0
        );

        newDebris.userData.velocity = {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: 0.03 + Math.random() * 0.02,
        };

        debris.add(newDebris);
      }
    });
  }
}, 100);

// ========== تحديث الحجم ==========
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
