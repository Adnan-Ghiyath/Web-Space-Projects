import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";

const container = document.getElementById("moon-container");

// المشهد
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// الكاميرا
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-0.3, 0, 3.2);

// الرندر
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// تحميل Texture القمر
const loader = new THREE.TextureLoader();
const moonColor = loader.load("../The Moon/Moon TEX/2k_moon.jpg");

// 🌕 القمر
const moonGeometry = new THREE.SphereGeometry(1, 128, 128);

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonColor,
  roughness: 1,
  metalness: 0,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// 🌞 الإضاءة (سر الواقعية)
scene.add(new THREE.AmbientLight(0xffffff, 0.08));

const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
sunLight.position.set(5, 1.5, 3);
scene.add(sunLight);

// حركة بطيئة جدًا (طبيعية)
function animate() {
  requestAnimationFrame(animate);

  moon.rotation.y += 0.005;

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
