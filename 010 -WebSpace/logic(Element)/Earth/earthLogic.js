// المستوى الثاني: Logic Layer
import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";
import { createStarBackground } from "./EarthTextures/Wallpaper/Wallpaper.js";

const container = document.getElementById("earth-container");

// المشهد
const scene = new THREE.Scene();
scene.background = createStarBackground(THREE);

// الكاميرا
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-1, 0, 3);

// الرندر
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// تحميل التكتشر مباشرة من مجلد textures
const loader = new THREE.TextureLoader();
const earthTexture = loader.load("./EarthTextures/earth.jpg");
const specularTexture = loader.load("./EarthTextures/earth-specular.jpg");
const normalMap = loader.load("./EarthTextures/earth-normal.jpg");

// إنشاء الكرة الأرضية
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshPhongMaterial({
  map: earthTexture,
  specularMap: specularTexture,
  normalMap: normalMap,
  shininess: 10,
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// الإضاءة
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(5, 3, 5);
scene.add(sun);

// الحركة
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.02;

  renderer.render(scene, camera);
}

animate();

// تحديث الحجم
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
