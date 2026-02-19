export function createStarBackground(THREE) {
  const starsTexture = new THREE.TextureLoader().load(
    "./EarthTextures/Wallpaper/Earth.png"
  );

  return starsTexture; // لا حركة، مجرد صورة ثابتة
}
