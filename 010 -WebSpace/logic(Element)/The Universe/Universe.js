// الكون المرئي - كرة واحدة بسيطة
import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";

const container = document.getElementById("universe-container");

// ========== إعداد المشهد ==========
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(0, 0, 800);

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
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;

    const radius = 1500 + Math.random() * 2000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    colors[i3] = 0.8 + Math.random() * 0.2;
    colors[i3 + 1] = 0.8 + Math.random() * 0.2;
    colors[i3 + 2] = 1.0;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  return new THREE.Points(starsGeometry, material);
}

const stars = createStarfield();
scene.add(stars);

// ========== كرة الكون ==========
const universeRadius = 300;

// الكرة الرئيسية
const universeGeometry = new THREE.SphereGeometry(universeRadius, 128, 128);

// Shader مخصص للكون
const universeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
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
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // نمط المجرات
      float pattern = sin(vPosition.x * 0.05 + time) * 
                      sin(vPosition.y * 0.05 + time * 0.7) * 
                      sin(vPosition.z * 0.05 + time * 0.5);
      
      // الإضاءة من الحواف
      float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      rim = pow(rim, 2.0);
      
      // ألوان كونية
      vec3 color1 = vec3(1.0, 0.8, 0.3); // ذهبي
      vec3 color2 = vec3(0.3, 0.5, 1.0); // أزرق
      vec3 color3 = vec3(1.0, 0.3, 0.5); // وردي
      
      vec3 finalColor = mix(color1, color2, pattern * 0.5 + 0.5);
      finalColor = mix(finalColor, color3, rim * 0.3);
      
      // سطوع متغير
      float brightness = 0.6 + pattern * 0.4;
      finalColor *= brightness;
      
      gl_FragColor = vec4(finalColor, 0.9);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});

const universeSphere = new THREE.Mesh(universeGeometry, universeMaterial);
scene.add(universeSphere);
universeSphere.position.set(0, 0, 0);

// ========== هالة خارجية ==========
const glowGeometry = new THREE.SphereGeometry(universeRadius * 1.2, 64, 64);
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffd700,
  transparent: true,
  opacity: 0.15,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(glow);

// ========== هالة خارجية ثانية ==========
const glow2Geometry = new THREE.SphereGeometry(universeRadius * 1.4, 64, 64);
const glow2Material = new THREE.MeshBasicMaterial({
  color: 0xff8c00,
  transparent: true,
  opacity: 0.08,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
});
const glow2 = new THREE.Mesh(glow2Geometry, glow2Material);
scene.add(glow2);

// ========== جزيئات حول الكون ==========
function createUniverseParticles() {
  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const radius = universeRadius + 20 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const temp = Math.random();
    if (temp > 0.6) {
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.8;
      colors[i3 + 2] = 0.3;
    } else if (temp > 0.3) {
      colors[i3] = 0.3;
      colors[i3 + 1] = 0.6;
      colors[i3 + 2] = 1.0;
    } else {
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.3;
      colors[i3 + 2] = 0.6;
    }

    sizes[i] = Math.random() * 3 + 1;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

const universeParticles = createUniverseParticles();
scene.add(universeParticles);

// ========== الإضاءة ==========
const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffd700, 2, 2000);
pointLight1.position.set(500, 500, 500);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff6b9d, 1.5, 2000);
pointLight2.position.set(-500, -500, -500);
scene.add(pointLight2);

// ========== التفاعل ==========
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let rotationSpeed = 1;

window.addEventListener("mousemove", (event) => {
  targetX = (event.clientX / window.innerWidth) * 2 - 1;
  targetY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ========== الحركة والتحريك ==========
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // حركة الماوس السلسة
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  // تحديث shader
  universeMaterial.uniforms.time.value = elapsedTime;

  // دوران كرة الكون
  universeSphere.rotation.y += 0.0005 * rotationSpeed;
  universeSphere.rotation.x += 0.0002 * rotationSpeed;

  // نبض الهالات
  const glowScale = 1 + Math.sin(elapsedTime * 1.5) * 0.05;
  glow.scale.set(glowScale, glowScale, glowScale);

  const glow2Scale = 1 + Math.sin(elapsedTime * 1.2) * 0.08;
  glow2.scale.set(glow2Scale, glow2Scale, glow2Scale);

  // دوران الجزيئات
  universeParticles.rotation.y += 0.0003 * rotationSpeed;
  universeParticles.rotation.x -= 0.0001 * rotationSpeed;

  // نبض الإضاءة
  pointLight1.intensity = 2 + Math.sin(elapsedTime * 2) * 0.5;
  pointLight2.intensity = 1.5 + Math.cos(elapsedTime * 2.5) * 0.4;

  // حركة الكاميرا
  camera.position.x += (mouseX * 200 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 200 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // دوران الخلفية
  stars.rotation.y += 0.00005;

  renderer.render(scene, camera);
}

animate();

// ========== إعداد الأزرار ==========
setTimeout(() => {
  const rotationBtn = document.getElementById("rotation-btn");
  if (rotationBtn) {
    rotationBtn.addEventListener("click", () => {
      rotationSpeed = rotationSpeed === 1 ? 5 : 1;
      rotationBtn.textContent =
        rotationSpeed === 1 ? "⚡ تسريع الدوران" : "🐌 إبطاء الدوران";
    });
  }

  const densityBtn = document.getElementById("density-btn");
  if (densityBtn) {
    densityBtn.addEventListener("click", () => {
      universeParticles.material.opacity = Math.min(
        universeParticles.material.opacity + 0.1,
        1
      );
      glow.material.opacity = Math.min(glow.material.opacity + 0.05, 0.5);
    });
  }

  const darkMatterBtn = document.getElementById("dark-matter-btn");
  if (darkMatterBtn) {
    darkMatterBtn.addEventListener("click", () => {
      universeParticles.visible = !universeParticles.visible;
      darkMatterBtn.textContent = universeParticles.visible
        ? "🌟 إخفاء الجزيئات"
        : "🕳️ إظهار الجزيئات";
    });
  }
}, 100);

// ========== تحديث الحجم ==========
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
