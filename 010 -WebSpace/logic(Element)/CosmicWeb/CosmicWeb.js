// الشبكة الكونية ثلاثية الأبعاد - محاكاة البنية العظمى للكون
import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";

const container = document.getElementById("cosmic-container");

// ========== إعداد المشهد ==========
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.00008);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  20000
);
camera.position.set(0, 800, 2000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// ========== متغيرات التحكم ==========
let showFilaments = true;
let showNodes = true;
let showVoids = true;
let showWalls = true;
let showDarkMatter = false;
let zoomLevel = 1;

// ========== خلفية الكون ==========
function createCosmicBackground() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 30000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;

    const radius = 5000 + Math.random() * 10000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const brightness = Math.random();
    colors[i3] = 0.7 + brightness * 0.3;
    colors[i3 + 1] = 0.7 + brightness * 0.3;
    colors[i3 + 2] = 1.0;

    sizes[i] = Math.random() * 3 + 0.5;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  return new THREE.Points(starsGeometry, material);
}

const cosmicBackground = createCosmicBackground();
scene.add(cosmicBackground);

// ========== إنشاء شبكة العقد (Grid of Nodes) ==========
const gridSize = 10;
const gridSpacing = 300;
const nodes = [];

for (let x = 0; x < gridSize; x++) {
  for (let y = 0; y < gridSize; y++) {
    for (let z = 0; z < gridSize; z++) {
      const offsetX =
        (x - gridSize / 2) * gridSpacing + (Math.random() - 0.5) * 100;
      const offsetY =
        (y - gridSize / 2) * gridSpacing + (Math.random() - 0.5) * 100;
      const offsetZ =
        (z - gridSize / 2) * gridSpacing + (Math.random() - 0.5) * 100;

      nodes.push({
        position: new THREE.Vector3(offsetX, offsetY, offsetZ),
        density: Math.random() * 0.7 + 0.3,
        connections: [],
      });
    }
  }
}

// ========== الخيوط الكونية (Cosmic Filaments) ==========
function createCosmicFilaments() {
  const filamentGroup = new THREE.Group();

  // ربط العقد القريبة ببعضها
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = nodes[i].position.distanceTo(nodes[j].position);

      if (distance < gridSpacing * 1.8 && Math.random() > 0.4) {
        nodes[i].connections.push(j);

        // إنشاء خيط
        const particleCount = Math.floor(50 + Math.random() * 100);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const dir = new THREE.Vector3().subVectors(
          nodes[j].position,
          nodes[i].position
        );
        const length = dir.length();
        dir.normalize();

        for (let p = 0; p < particleCount; p++) {
          const p3 = p * 3;
          const t = p / particleCount;

          // منحنى طبيعي للخيط
          const curve = Math.sin(t * Math.PI) * 30;
          const pos = new THREE.Vector3()
            .copy(nodes[i].position)
            .add(dir.clone().multiplyScalar(t * length));

          const perpendicular = new THREE.Vector3(
            (Math.random() - 0.5) * curve,
            (Math.random() - 0.5) * curve,
            (Math.random() - 0.5) * curve
          );

          pos.add(perpendicular);

          positions[p3] = pos.x;
          positions[p3 + 1] = pos.y;
          positions[p3 + 2] = pos.z;

          const intensity = Math.sin(t * Math.PI) * 0.5 + 0.5;
          colors[p3] = 0.5 + intensity * 0.5;
          colors[p3 + 1] = 0.3 + intensity * 0.4;
          colors[p3 + 2] = 1.0;

          sizes[p] =
            ((intensity * 2 + 0.5) * (nodes[i].density + nodes[j].density)) / 2;
        }

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
          size: 1.5,
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const filament = new THREE.Points(geometry, material);
        filamentGroup.add(filament);
      }
    }
  }

  return filamentGroup;
}

const filaments = createCosmicFilaments();
scene.add(filaments);

// ========== العقد المجرية (Galaxy Nodes) ==========
function createGalaxyNodes() {
  const nodesGroup = new THREE.Group();

  nodes.forEach((node) => {
    const clusterSize = 50 + node.density * 150;
    const particleCount = Math.floor(500 + node.density * 1000);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const radius = Math.pow(Math.random(), 0.5) * clusterSize;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] =
        node.position.x + radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] =
        node.position.y + radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = node.position.z + radius * Math.cos(phi);

      const mixValue = radius / clusterSize;
      colors[i3] = 1.0 - mixValue * 0.3;
      colors[i3 + 1] = 0.8 - mixValue * 0.5;
      colors[i3 + 2] = 1.0;

      sizes[i] = (1 - mixValue) * 2 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const cluster = new THREE.Points(geometry, material);
    nodesGroup.add(cluster);

    // نواة ساطعة
    const coreGeo = new THREE.SphereGeometry(clusterSize * 0.15, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(node.position);
    nodesGroup.add(core);
  });

  return nodesGroup;
}

const galaxyNodes = createGalaxyNodes();
scene.add(galaxyNodes);

// ========== الفراغات الكونية (Cosmic Voids) ==========
function createCosmicVoids() {
  const voidsGroup = new THREE.Group();
  const voidCount = 20;

  for (let i = 0; i < voidCount; i++) {
    const x = (Math.random() - 0.5) * gridSize * gridSpacing * 0.8;
    const y = (Math.random() - 0.5) * gridSize * gridSpacing * 0.8;
    const z = (Math.random() - 0.5) * gridSize * gridSpacing * 0.8;

    const radius = 150 + Math.random() * 250;

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x001133,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    const voidSphere = new THREE.Mesh(geometry, material);
    voidSphere.position.set(x, y, z);
    voidsGroup.add(voidSphere);

    // حدود الفراغ
    const edgeGeo = new THREE.SphereGeometry(radius * 1.02, 32, 32);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.set(x, y, z);
    voidsGroup.add(edge);
  }

  return voidsGroup;
}

const voids = createCosmicVoids();
scene.add(voids);

// ========== الجدران المجرية (Galaxy Walls) ==========
function createGalaxyWalls() {
  const wallsGroup = new THREE.Group();
  const wallCount = 8;

  for (let i = 0; i < wallCount; i++) {
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const angle = (i / wallCount) * Math.PI * 2;
    const normalX = Math.cos(angle);
    const normalZ = Math.sin(angle);

    for (let p = 0; p < particleCount; p++) {
      const p3 = p * 3;

      const x = (Math.random() - 0.5) * gridSize * gridSpacing;
      const y = (Math.random() - 0.5) * gridSize * gridSpacing;
      const z = (Math.random() - 0.5) * gridSize * gridSpacing;

      const distanceFromPlane = Math.abs(x * normalX + z * normalZ);

      if (distanceFromPlane < 80) {
        positions[p3] = x;
        positions[p3 + 1] = y;
        positions[p3 + 2] = z;

        const intensity = 1 - distanceFromPlane / 80;
        colors[p3] = 0.8 + intensity * 0.2;
        colors[p3 + 1] = 0.6 + intensity * 0.4;
        colors[p3 + 2] = 0.3;

        sizes[p] = intensity * 1.5 + 0.3;
      } else {
        positions[p3] = 0;
        positions[p3 + 1] = 0;
        positions[p3 + 2] = 0;
        sizes[p] = 0;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const wall = new THREE.Points(geometry, material);
    wallsGroup.add(wall);
  }

  return wallsGroup;
}

const walls = createGalaxyWalls();
scene.add(walls);

// ========== هيكل المادة المظلمة ==========
function createDarkMatterStructure() {
  const darkMatterGroup = new THREE.Group();
  const particleCount = 50000;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const x = (Math.random() - 0.5) * gridSize * gridSpacing * 1.2;
    const y = (Math.random() - 0.5) * gridSize * gridSpacing * 1.2;
    const z = (Math.random() - 0.5) * gridSize * gridSpacing * 1.2;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    colors[i3] = 0.3;
    colors[i3 + 1] = 0.2;
    colors[i3 + 2] = 0.5;

    sizes[i] = Math.random() * 1.5 + 0.3;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const darkMatter = new THREE.Points(geometry, material);
  darkMatterGroup.add(darkMatter);
  darkMatterGroup.visible = showDarkMatter;

  return darkMatterGroup;
}

const darkMatter = createDarkMatterStructure();
scene.add(darkMatter);

// ========== الإضاءة ==========
const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x8a2be2, 1.5, 5000);
pointLight1.position.set(500, 500, 500);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff6b9d, 1.2, 5000);
pointLight2.position.set(-500, -500, -500);
scene.add(pointLight2);

// ========== التفاعل ==========
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

  // حركة الماوس السلسة
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  // دوران بطيء للشبكة
  if (filaments.visible) {
    filaments.rotation.y += 0.00005;
  }

  if (galaxyNodes.visible) {
    galaxyNodes.rotation.y += 0.00003;
    galaxyNodes.rotation.x += 0.00001;
  }

  if (walls.visible) {
    walls.rotation.y -= 0.00004;
  }

  if (voids.visible) {
    voids.rotation.y += 0.00002;
    voids.rotation.z += 0.00001;
  }

  if (darkMatter.visible) {
    darkMatter.rotation.y -= 0.00006;
    darkMatter.rotation.x += 0.00002;
  }

  // نبض الإضاءة
  pointLight1.intensity = 1.5 + Math.sin(elapsedTime * 0.5) * 0.3;
  pointLight2.intensity = 1.2 + Math.cos(elapsedTime * 0.7) * 0.3;

  // حركة الكاميرا
  camera.position.x += (mouseX * 500 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 500 + 800 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // دوران الخلفية
  cosmicBackground.rotation.y += 0.00001;

  renderer.render(scene, camera);
}

animate();

// ========== إعداد الأزرار ==========
setTimeout(() => {
  // تهيئة الحالة المرئية بناءً على حالة الأزرار الأولية
  const structureItems = document.querySelectorAll(".structure-item");
  structureItems.forEach((item) => {
    const type = item.dataset.type;
    const isActive = item.classList.contains("active");

    // تطبيق الحالة المرئية الأولية
    if (type === "filaments") {
      filaments.visible = isActive;
    } else if (type === "nodes") {
      galaxyNodes.visible = isActive;
    } else if (type === "voids") {
      voids.visible = isActive;
    } else if (type === "walls") {
      walls.visible = isActive;
    }
  });

  // تبديل مكونات الشبكة
  structureItems.forEach((item) => {
    item.addEventListener("click", () => {
      const type = item.dataset.type;
      const isActive = item.classList.contains("active");

      item.classList.toggle("active");
      const newState = !isActive; // الحالة الجديدة بعد التبديل

      if (type === "filaments") {
        filaments.visible = newState;
      } else if (type === "nodes") {
        galaxyNodes.visible = newState;
      } else if (type === "voids") {
        voids.visible = newState;
      } else if (type === "walls") {
        walls.visible = newState;
      }
    });
  });

  // زر التكبير
  const zoomBtn = document.getElementById("zoom-btn");
  if (zoomBtn) {
    zoomBtn.addEventListener("click", () => {
      zoomLevel = zoomLevel === 1 ? 0.5 : 1;
      const targetZ = zoomLevel === 1 ? 2000 : 1000;

      const duration = 2000;
      const start = Date.now();
      const startZ = camera.position.z;

      function animateZoom() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        camera.position.z = startZ + (targetZ - startZ) * eased;

        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        }
      }
      animateZoom();
    });
  }

  // زر الكثافة
  const densityBtn = document.getElementById("density-btn");
  if (densityBtn) {
    densityBtn.addEventListener("click", () => {
      // إضافة المزيد من الجسيمات للخيوط
      filaments.children.forEach((filament) => {
        if (filament.material) {
          filament.material.opacity = Math.min(
            filament.material.opacity + 0.1,
            1
          );
        }
      });
    });
  }

  // زر المادة المظلمة
  const darkMatterBtn = document.getElementById("dark-matter-btn");
  if (darkMatterBtn) {
    darkMatterBtn.addEventListener("click", () => {
      showDarkMatter = !showDarkMatter;
      darkMatter.visible = showDarkMatter;
      darkMatterBtn.textContent = showDarkMatter
        ? "🌟 إخفاء المادة المظلمة"
        : "🕳️ المادة المظلمة";
    });
  }
}, 100);

// ========== تحديث الحجم ==========
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
