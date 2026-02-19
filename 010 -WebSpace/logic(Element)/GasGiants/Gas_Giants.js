// Gas Giants Simulation - Scientific Educational System
// Backend in English, Frontend in Arabic
// Version 3.0 - Advanced Scientific Simulation

"use strict";

class GasGiantsSimulation {
  constructor() {
    // Core systems
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    // Scientific data
    this.planets = [];
    this.rings = [];
    this.moons = [];
    this.atmosphere = null;
    this.magneticField = null;
    this.simulationTime = 0;

    // Astronomical physical constants
    this.physics = {
      gravitationalConstant: 6.6743e-11,
      stefanBoltzmann: 5.670374419e-8,
      gasConstant: 8.314462618,
      lightSpeed: 299792458,
      astronomicalUnit: 1.496e11,
    };

    // Gas giant planet types
    this.planetTypes = {
      jupiter: {
        name: "المشتري",
        type: "عملاق غازي",
        classification: "عملاق غازي (مشتري حار)",
        mass: "1.898 × 10²⁷ كجم (317.8 كتلة أرضية)",
        radius: "69,911 كم (10.97 نصف قطر أرضي)",
        surfaceGravity: "24.79 م/ث² (2.528 ج)",
        surfaceTemperature: "165 كلفن (-108°م)",
        rotationPeriod: "9.925 ساعة",
        distanceFromSun: "5.203 وحدة فلكية",
        orbitalPeriod: "11.862 سنة أرضية",
        axialTilt: "3.13°",
        color: 0xffcc99,
        chemicalComposition: {
          hydrogen: "89.8%",
          helium: "10.2%",
          methane: "0.3%",
          ammonia: "0.026%",
          ethane: "0.0006%",
          water: "0.0004%",
        },
        scientificData: {
          density: "1.326 جم/سم³",
          escapeVelocity: "59.5 كم/ث",
          magneticFieldStrength: "4.28 غاوس",
          atmosphericPressure: "1-10 بار",
          internalLuminosity: "7.485 × 10¹⁷ واط",
        },
      },
      saturn: {
        name: "زحل",
        type: "عملاق غازي",
        classification: "عملاق غازي (زحلي)",
        mass: "5.683 × 10²⁶ كجم (95.16 كتلة أرضية)",
        radius: "58,232 كم (9.14 نصف قطر أرضي)",
        surfaceGravity: "10.44 م/ث² (1.065 ج)",
        surfaceTemperature: "134 كلفن (-139°م)",
        rotationPeriod: "10.7 ساعة",
        distanceFromSun: "9.537 وحدة فلكية",
        orbitalPeriod: "29.457 سنة أرضية",
        axialTilt: "26.73°",
        color: 0xffdd99,
        chemicalComposition: {
          hydrogen: "96.3%",
          helium: "3.25%",
          methane: "0.45%",
          ammonia: "0.0125%",
          ethane: "0.0007%",
        },
        scientificData: {
          density: "0.687 جم/سم³",
          escapeVelocity: "35.5 كم/ث",
          magneticFieldStrength: "0.21 غاوس",
          atmosphericPressure: "1-10 بار",
          internalLuminosity: "1.79 × 10¹⁷ واط",
        },
      },
      uranus: {
        name: "أورانوس",
        type: "عملاق جليدي",
        classification: "عملاق جليدي (نبتون صغير)",
        mass: "8.681 × 10²⁵ كجم (14.54 كتلة أرضية)",
        radius: "25,362 كم (3.98 نصف قطر أرضي)",
        surfaceGravity: "8.69 م/ث² (0.886 ج)",
        surfaceTemperature: "76 كلفن (-197°م)",
        rotationPeriod: "17.24 ساعة",
        distanceFromSun: "19.191 وحدة فلكية",
        orbitalPeriod: "84.020 سنة أرضية",
        axialTilt: "97.77°",
        color: 0x99ccff,
        chemicalComposition: {
          hydrogen: "82.5%",
          helium: "15.2%",
          methane: "2.3%",
          ammonia: "0.01%",
          water: "0.0001%",
        },
        scientificData: {
          density: "1.27 جم/سم³",
          escapeVelocity: "21.3 كم/ث",
          magneticFieldStrength: "0.23 غاوس",
          atmosphericPressure: "1-2 بار",
          internalLuminosity: "1.1 × 10¹⁵ واط",
        },
      },
      neptune: {
        name: "نبتون",
        type: "عملاق جليدي",
        classification: "عملاق جليدي (نبتوني)",
        mass: "1.024 × 10²⁶ كجم (17.15 كتلة أرضية)",
        radius: "24,622 كم (3.86 نصف قطر أرضي)",
        surfaceGravity: "11.15 م/ث² (1.14 ج)",
        surfaceTemperature: "72 كلفن (-201°م)",
        rotationPeriod: "16.11 ساعة",
        distanceFromSun: "30.069 وحدة فلكية",
        orbitalPeriod: "164.8 سنة أرضية",
        axialTilt: "28.32°",
        color: 0x3366ff,
        chemicalComposition: {
          hydrogen: "80%",
          helium: "19%",
          methane: "1.5%",
          ammonia: "0.01%",
          ethane: "0.00025%",
        },
        scientificData: {
          density: "1.638 جم/سم³",
          escapeVelocity: "23.5 كم/ث",
          magneticFieldStrength: "0.14 غاوس",
          atmosphericPressure: "1-5 بار",
          internalLuminosity: "2.7 × 10¹⁵ واط",
        },
      },
      exoplanet: {
        name: "كوكب خارجي غازي",
        type: "مشتري حار",
        classification: "كوكب خارج المجموعة الشمسية",
        mass: "1-13 كتلة مشتري",
        radius: "1-2 نصف قطر مشتري",
        surfaceGravity: "متغيرة",
        surfaceTemperature: "1000-2000 كلفن",
        rotationPeriod: "1-10 أيام",
        distanceFromStar: "0.01-0.1 وحدة فلكية",
        orbitalPeriod: "1-10 أيام",
        axialTilt: "متغير",
        color: 0xff6699,
        chemicalComposition: {
          hydrogen: "90%",
          helium: "9%",
          waterVapor: "1%",
          carbonMonoxide: "0.1%",
          methane: "0.01%",
        },
        scientificData: {
          density: "0.2-2 جم/سم³",
          escapeVelocity: "20-60 كم/ث",
          magneticFieldStrength: "غير معروف",
          atmosphericPressure: "10-100 بار",
          thermalLuminosity: "عالٍ جدًا",
        },
      },
    };

    // Simulation parameters
    this.currentType = "jupiter";
    this.showRings = true;
    this.showMoons = true;
    this.showAtmosphere = true;
    this.showMagneticField = false;
    this.showWindCurrents = false;
    this.studyMode = false;
    this.timeScale = 1.0;
    this.animateClouds = true;

    // Scientific interface
    this.dataPanels = {};
    this.liveMetrics = {};

    this.initialize();
  }

  initialize() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.setupLighting();
    this.createSpace();
    this.setupInterface();
    this.createPlanet();
    this.setupEventListeners();
    this.startAnimation();

    this.logSimulationStart();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000020);
    this.scene.fog = new THREE.Fog(0x000020, 100, 1000);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100000
    );
    this.camera.position.set(0, 0, 50);
  }

  createRenderer() {
    const container = document.getElementById("planet-container");
    if (!container) {
      throw new Error("Planet container element not found");
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: "highp",
      powerPreference: "high-performance",
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    container.appendChild(this.renderer.domElement);
  }

  createControls() {
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minPolarAngle = 0;

    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
  }

  setupLighting() {
    // Sun simulation
    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    sun.position.set(100, 50, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    this.scene.add(sun);

    // Ambient light
    const ambient = new THREE.AmbientLight(0x334477, 0.2);
    this.scene.add(ambient);

    // Glow light
    const glow = new THREE.PointLight(0x4488ff, 0.5, 200);
    glow.position.set(0, 0, 0);
    this.scene.add(glow);
  }

  createSpace() {
    // Star background
    this.createStars();

    // Add sun as reference
    this.createSun();
  }

  createStars() {
    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;

      // Spherical distribution
      const radius = 500 + Math.random() * 2000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = radius * Math.cos(phi);

      // Different star colors
      const starType = Math.random();
      if (starType < 0.6) {
        // Yellow/white stars
        colors[idx] = 1.0;
        colors[idx + 1] = 0.9;
        colors[idx + 2] = 0.8;
      } else if (starType < 0.85) {
        // Blue stars
        colors[idx] = 0.6;
        colors[idx + 1] = 0.7;
        colors[idx + 2] = 1.0;
      } else if (starType < 0.95) {
        // Red stars
        colors[idx] = 1.0;
        colors[idx + 1] = 0.5;
        colors[idx + 2] = 0.5;
      } else {
        // Blue giant stars
        colors[idx] = 0.4;
        colors[idx + 1] = 0.6;
        colors[idx + 2] = 1.0;
      }

      sizes[i] = 0.1 + Math.random() * 0.3;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }

  createSun() {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });

    this.sun = new THREE.Mesh(geometry, material);
    this.sun.position.set(100, 0, 0);
    this.scene.add(this.sun);
  }

  createPlanet() {
    this.clearPreviousPlanet();

    const planetData = this.planetTypes[this.currentType];

    // Create main planet
    this.createGasGiant(planetData);

    // Create rings
    if (this.showRings) {
      this.createPlanetRings(planetData);
    }

    // Create moons
    if (this.showMoons) {
      this.createPlanetMoons(planetData);
    }

    // Create atmosphere
    if (this.showAtmosphere) {
      this.createAtmosphere(planetData);
    }

    // Create magnetic field
    if (this.showMagneticField) {
      this.createMagneticField(planetData);
    }

    // Create wind currents
    if (this.showWindCurrents) {
      this.createWindCurrents(planetData);
    }

    // Update scientific interface
    this.updateScientificInterface(planetData);
  }

  createGasGiant(planetData) {
    const size = this.calculatePlanetSize(planetData);

    this.planetGroup = new THREE.Group();

    const radius = size;
    const detail = 128;

    const planetSurface = this.createPlanetSurface(radius, detail, planetData);
    this.planetGroup.add(planetSurface);

    this.addSurfaceDetails(planetSurface, radius, planetData);

    this.planetGroup.userData = {
      type: planetData.type,
      size: size,
      data: planetData,
      rotationSpeed: this.calculateRotationSpeed(planetData),
      internalStructure: this.simulateInternalStructure(planetData),
    };

    this.scene.add(this.planetGroup);
    this.planets.push(this.planetGroup);

    this.addGlowEffect(radius, planetData.color);
  }

  calculatePlanetSize(planetData) {
    const sizes = {
      jupiter: 10,
      saturn: 8,
      uranus: 4,
      neptune: 3.8,
      exoplanet: 12,
    };
    return sizes[this.currentType] || 5;
  }

  calculateRotationSpeed(planetData) {
    const speeds = {
      jupiter: 0.01,
      saturn: 0.008,
      uranus: 0.005,
      neptune: 0.006,
      exoplanet: 0.02,
    };
    return speeds[this.currentType] || 0.01;
  }

  createPlanetSurface(radius, detail, planetData) {
    const geometry = new THREE.SphereGeometry(radius, detail, detail);

    const material = new THREE.MeshStandardMaterial({
      color: planetData.color,
      roughness: 0.8,
      metalness: 0.2,
      emissive: planetData.color,
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });

    return new THREE.Mesh(geometry, material);
  }

  addSurfaceDetails(surface, radius, planetData) {
    switch (this.currentType) {
      case "jupiter":
        this.addJupiterSpots(surface, radius);
        this.addJupiterBelts(surface, radius);
        break;

      case "saturn":
        this.addSaturnClouds(surface, radius);
        break;

      case "uranus":
        this.addUranusClouds(surface, radius);
        break;

      case "neptune":
        this.addNeptuneStorm(surface, radius);
        break;

      case "exoplanet":
        this.addExoplanetEffects(surface, radius);
        break;
    }
  }

  addJupiterSpots(surface, radius) {
    const redSpot = this.createRedSpot(radius * 1.01);
    surface.add(redSpot);

    for (let i = 0; i < 5; i++) {
      const whiteSpot = this.createWhiteSpot(radius * 1.005);
      surface.add(whiteSpot);
    }
  }

  createRedSpot(radius) {
    const geometry = new THREE.CircleGeometry(0.5, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });

    const spot = new THREE.Mesh(geometry, material);
    spot.rotation.x = Math.PI / 2;
    spot.position.set(0, 0, radius);

    spot.userData = {
      rotationSpeed: 0.002,
    };

    return spot;
  }

  createWhiteSpot(radius) {
    const geometry = new THREE.CircleGeometry(0.2, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });

    const spot = new THREE.Mesh(geometry, material);
    spot.rotation.x = Math.PI / 2;
    spot.position.set((Math.random() - 0.5) * radius * 0.5, 0, radius);

    return spot;
  }

  addJupiterBelts(surface, radius) {
    const beltCount = 6;
    const beltWidth = 0.1;

    for (let i = 0; i < beltCount; i++) {
      const latitude = (i / beltCount) * Math.PI - Math.PI / 2;
      const belt = this.createCloudBelt(radius * 1.005, latitude, beltWidth);
      surface.add(belt);
    }
  }

  createCloudBelt(radius, latitude, width) {
    const geometry = new THREE.RingGeometry(radius, radius + width, 64);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff9966,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const belt = new THREE.Mesh(geometry, material);
    belt.rotation.x = latitude;

    return belt;
  }

  addSaturnClouds(surface, radius) {
    const layerCount = 8;

    for (let i = 0; i < layerCount; i++) {
      const layer = this.createCloudLayer(radius * 1.01, i / layerCount);
      surface.add(layer);
    }
  }

  createCloudLayer(radius, position) {
    const geometry = new THREE.RingGeometry(
      radius * 0.8,
      radius * 1.2,
      128,
      1,
      position * Math.PI * 2,
      Math.PI / 4
    );

    const material = new THREE.MeshBasicMaterial({
      color: 0xffdd99,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });

    const layer = new THREE.Mesh(geometry, material);
    layer.rotation.x = Math.PI / 2;

    return layer;
  }

  addUranusClouds(surface, radius) {
    const clouds = this.createClouds(radius * 1.01, 0x99ccff);
    surface.add(clouds);
  }

  createClouds(radius, color) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });

    return new THREE.Mesh(geometry, material);
  }

  addNeptuneStorm(surface, radius) {
    const darkSpot = this.createDarkSpot(radius * 1.01);
    surface.add(darkSpot);
  }

  createDarkSpot(radius) {
    const geometry = new THREE.CircleGeometry(0.3, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000066,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });

    const spot = new THREE.Mesh(geometry, material);
    spot.rotation.x = Math.PI / 4;
    spot.position.set(
      radius * Math.sin(Math.PI / 4),
      0,
      radius * Math.cos(Math.PI / 4)
    );

    return spot;
  }

  addExoplanetEffects(surface, radius) {
    const thermalEffect = this.createThermalEffect(radius * 1.02);
    surface.add(thermalEffect);

    const thermalGlow = this.createThermalGlow(radius * 1.05);
    surface.add(thermalGlow);
  }

  createThermalEffect(radius) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });

    return new THREE.Mesh(geometry, material);
  }

  createThermalGlow(radius) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Mesh(geometry, material);
  }

  addGlowEffect(radius, color) {
    const glowGeometry = new THREE.SphereGeometry(radius * 1.1, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(glow);
  }

  createPlanetRings(planetData) {
    const ringSettings = {
      jupiter: { count: 3, transparency: 0.3 },
      saturn: { count: 7, transparency: 0.8 },
      uranus: { count: 2, transparency: 0.2 },
      neptune: { count: 1, transparency: 0.1 },
      exoplanet: { count: 4, transparency: 0.5 },
    };

    const settings = ringSettings[this.currentType] || {
      count: 2,
      transparency: 0.3,
    };

    const innerRadius = this.calculatePlanetSize(planetData) * 1.5;

    for (let i = 0; i < settings.count; i++) {
      const ring = this.createSingleRing(
        innerRadius + i * 0.2,
        innerRadius + i * 0.2 + 0.1,
        i,
        settings.transparency
      );
      this.planetGroup.add(ring);
      this.rings.push(ring);
    }
  }

  createSingleRing(inner, outer, index, transparency) {
    const geometry = new THREE.RingGeometry(inner, outer, 128);

    let color;
    if (index % 3 === 0) {
      color = 0xffdd99;
    } else if (index % 3 === 1) {
      color = 0xcc9966;
    } else {
      color = 0x996633;
    }

    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: transparency,
      side: THREE.DoubleSide,
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2;

    ring.userData = {
      rotationSpeed: 0.005 + Math.random() * 0.005,
    };

    return ring;
  }

  createPlanetMoons(planetData) {
    const moonCount = this.calculateMoonCount(planetData);
    const planetRadius = this.calculatePlanetSize(planetData);

    for (let i = 0; i < moonCount; i++) {
      const moon = this.createSingleMoon(i, moonCount, planetRadius);
      this.planetGroup.add(moon);
      this.moons.push(moon);
    }
  }

  calculateMoonCount(planetData) {
    const counts = {
      jupiter: 4,
      saturn: 8,
      uranus: 5,
      neptune: 2,
      exoplanet: 3,
    };
    return counts[this.currentType] || 2;
  }

  createSingleMoon(index, total, planetRadius) {
    const size = 0.5 + Math.random() * 1.0;
    const distance = planetRadius * 3 + index * 2;
    const angle = (index / total) * Math.PI * 2;

    const geometry = new THREE.SphereGeometry(size, 16, 16);

    const colors = [0xcccccc, 0x999999, 0x666666, 0x333333];
    const color = colors[index % colors.length];

    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.1,
    });

    const moon = new THREE.Mesh(geometry, material);

    moon.position.x = Math.cos(angle) * distance;
    moon.position.z = Math.sin(angle) * distance;

    moon.userData = {
      distance: distance,
      angle: angle,
      orbitSpeed: 0.002 + Math.random() * 0.003,
      rotationSpeed: 0.01 + Math.random() * 0.02,
    };

    return moon;
  }

  createAtmosphere(planetData) {
    const planetRadius = this.calculatePlanetSize(planetData);
    const layerCount = 3;

    const atmosphereGroup = new THREE.Group();

    for (let i = 0; i < layerCount; i++) {
      const layer = this.createAtmosphereLayer(
        planetRadius,
        i,
        layerCount,
        planetData
      );
      atmosphereGroup.add(layer);
    }

    this.scene.add(atmosphereGroup);
    this.atmosphere = atmosphereGroup;
  }

  createAtmosphereLayer(planetRadius, layer, totalLayers, planetData) {
    const thickness = 0.5;
    const innerRadius = planetRadius * (1 + layer * thickness);
    const outerRadius = innerRadius + planetRadius * thickness;

    const geometry = new THREE.SphereGeometry(
      (innerRadius + outerRadius) / 2,
      64,
      64
    );

    let color, transparency;
    if (layer === 0) {
      color = planetData.color;
      transparency = 0.3;
    } else if (layer === 1) {
      color = this.mixColors(planetData.color, 0xffffff);
      transparency = 0.2;
    } else {
      color = this.mixColors(planetData.color, 0x88aaff);
      transparency = 0.1;
    }

    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: transparency,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    const atmosphereLayer = new THREE.Mesh(geometry, material);

    atmosphereLayer.userData = {
      rotationSpeed: 0.005 * (layer + 1),
    };

    return atmosphereLayer;
  }

  mixColors(color1, color2) {
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    return c1.clone().lerp(c2, 0.5).getHex();
  }

  createMagneticField(planetData) {
    const planetRadius = this.calculatePlanetSize(planetData);
    const fieldStrength = this.calculateMagneticFieldStrength(planetData);

    const field = this.createMagneticFieldVisualization(
      planetRadius,
      fieldStrength
    );
    this.scene.add(field);
    this.magneticField = field;
  }

  calculateMagneticFieldStrength(planetData) {
    const strengths = {
      jupiter: 3.0,
      saturn: 0.5,
      uranus: 0.3,
      neptune: 0.2,
      exoplanet: 1.0,
    };
    return strengths[this.currentType] || 1.0;
  }

  createMagneticFieldVisualization(radius, strength) {
    const group = new THREE.Group();

    const lineCount = 12;

    for (let i = 0; i < lineCount; i++) {
      const line = this.createMagneticFieldLine(
        radius,
        strength,
        i / lineCount
      );
      group.add(line);
    }

    const northPole = this.createMagneticPole(radius, 0x3366ff);
    const southPole = this.createMagneticPole(radius, 0xff3333);

    southPole.rotation.y = Math.PI;

    group.add(northPole);
    group.add(southPole);

    return group;
  }

  createMagneticFieldLine(radius, strength, position) {
    const points = [];
    const pointCount = 50;

    for (let i = 0; i < pointCount; i++) {
      const t = i / pointCount;
      const angle = t * Math.PI * 2;

      const x =
        (radius * 2 + strength * 5) * Math.cos(angle + position * Math.PI * 2);
      const y = radius * 2 * Math.sin(angle);
      const z =
        (radius * 2 + strength * 5) * Math.sin(angle + position * Math.PI * 2);

      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.3,
    });

    return new THREE.Line(geometry, material);
  }

  createMagneticPole(radius, color) {
    const geometry = new THREE.ConeGeometry(0.5, 2, 8);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7,
    });

    const pole = new THREE.Mesh(geometry, material);
    pole.position.y = radius * 1.2;

    return pole;
  }

  createWindCurrents(planetData) {
    const planetRadius = this.calculatePlanetSize(planetData);
    const currentCount = 20;

    const currentsGroup = new THREE.Group();

    for (let i = 0; i < currentCount; i++) {
      const current = this.createWindCurrent(planetRadius, i / currentCount);
      currentsGroup.add(current);
    }

    this.scene.add(currentsGroup);
  }

  createWindCurrent(radius, position) {
    const points = [];
    const pointCount = 30;

    const latitude = (Math.random() - 0.5) * Math.PI;

    for (let i = 0; i < pointCount; i++) {
      const t = i / pointCount;
      const longitude = t * Math.PI * 2;

      const x = radius * 1.01 * Math.cos(longitude) * Math.cos(latitude);
      const y = radius * 1.01 * Math.sin(latitude);
      const z = radius * 1.01 * Math.sin(longitude) * Math.cos(latitude);

      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x88ff88,
      transparent: true,
      opacity: 0.4,
    });

    const current = new THREE.Line(geometry, material);
    current.userData = {
      latitude: latitude,
    };

    return current;
  }

  simulateInternalStructure(planetData) {
    return {
      core: {
        type: "صخرية/جليدية",
        radius: "0.2-0.5 نصف قطر الكوكب",
        mass: "5-15 كتلة أرضية",
        temperature: "20000-30000 كلفن",
      },
      metallicHydrogenLayer: {
        type: "هيدروجين معدني",
        state: "موصل فائق",
        pressure: "2-4 مليون بار",
      },
      molecularHydrogenLayer: {
        type: "هيدروجين جزيئي",
        state: "سائل مضغوط",
        depth: "10000-20000 كم",
      },
      atmosphere: {
        type: "هيدروجين وهيليوم غازي",
        thickness: "1000-5000 كم",
        surfacePressure: "1-10 بار",
      },
    };
  }

  clearPreviousPlanet() {
    if (this.planetGroup) {
      this.scene.remove(this.planetGroup);
      this.planetGroup = null;
    }

    this.rings.forEach((ring) => {
      if (ring.parent) ring.parent.remove(ring);
    });
    this.rings = [];

    this.moons.forEach((moon) => {
      if (moon.parent) moon.parent.remove(moon);
    });
    this.moons = [];

    if (this.atmosphere) {
      this.scene.remove(this.atmosphere);
      this.atmosphere = null;
    }

    if (this.magneticField) {
      this.scene.remove(this.magneticField);
      this.magneticField = null;
    }

    this.planets = [];
  }

  updateScientificInterface(planetData) {
    this.updateDataPanel("planet-info", {
      name: planetData.name,
      type: planetData.type,
      classification: planetData.classification,
      rotationPeriod: planetData.rotationPeriod,
      orbitalPeriod: planetData.orbitalPeriod,
      axialTilt: planetData.axialTilt,
    });

    this.updateDataPanel("physical-properties", {
      mass: planetData.mass,
      radius: planetData.radius,
      surfaceGravity: planetData.surfaceGravity,
      surfaceTemperature: planetData.surfaceTemperature,
      distanceFromSun: planetData.distanceFromSun,
    });

    this.updateDataPanel("scientific-data", planetData.scientificData);

    this.updateChemicalCompositionPanel(planetData.chemicalComposition);

    this.updateLiveMetrics();
  }

  updateDataPanel(panelId, data) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    let html = "";
    for (const [key, value] of Object.entries(data)) {
      html += `<div class="data-row">
                <span class="data-label">${this.formatLabel(key)}:</span>
                <span class="data-value">${value}</span>
            </div>`;
    }

    panel.innerHTML = html;
  }

  updateChemicalCompositionPanel(composition) {
    const panel = document.getElementById("chemical-composition");
    if (!panel) return;

    let html = "<h4>التركيب الكيميائي</h4>";
    for (const [element, percentage] of Object.entries(composition)) {
      const numericPercentage = parseFloat(percentage);
      html += `<div class="chemical-element">
                <span class="element-name">${element}:</span>
                <div class="percentage-bar">
                    <div class="filled-bar" style="width: ${numericPercentage}%"></div>
                </div>
                <span class="element-percentage">${percentage}</span>
            </div>`;
    }

    panel.innerHTML = html;
  }

  formatLabel(label) {
    const labels = {
      name: "الاسم",
      type: "النوع",
      classification: "التصنيف",
      rotationPeriod: "فترة الدوران",
      orbitalPeriod: "الفترة المدارية",
      axialTilt: "الميل المحوري",
      mass: "الكتلة",
      radius: "نصف القطر",
      surfaceGravity: "الجاذبية السطحية",
      surfaceTemperature: "درجة حرارة السطح",
      distanceFromSun: "البعد عن الشمس",
      density: "الكثافة",
      escapeVelocity: "سرعة الإفلات",
      magneticFieldStrength: "شدة المجال المغناطيسي",
      atmosphericPressure: "الضغط الجوي",
      internalLuminosity: "اللمعان الداخلي",
    };

    return labels[label] || label;
  }

  updateLiveMetrics() {
    const panel = document.getElementById("live-metrics");
    if (!panel) return;

    const planetData = this.planetTypes[this.currentType];

    const html = `
            <div class="metric">
                <span class="metric-label">السرعة الدورانية:</span>
                <span class="metric-value">${planetData.rotationPeriod}</span>
            </div>
            <div class="metric">
                <span class="metric-label">سرعة المدار:</span>
                <span class="metric-value">${this.calculateOrbitalSpeed(
                  planetData
                )} كم/ث</span>
            </div>
            <div class="metric">
                <span class="metric-label">التسارع المركزي:</span>
                <span class="metric-value">${this.calculateCentripetalAcceleration(
                  planetData
                )} م/ث²</span>
            </div>
        `;

    panel.innerHTML = html;
  }

  calculateOrbitalSpeed(planetData) {
    const speeds = {
      jupiter: "13.1",
      saturn: "9.7",
      uranus: "6.8",
      neptune: "5.4",
      exoplanet: ">100",
    };
    return speeds[this.currentType] || "?";
  }

  calculateCentripetalAcceleration(planetData) {
    const accelerations = {
      jupiter: "23.1",
      saturn: "10.4",
      uranus: "8.7",
      neptune: "11.2",
      exoplanet: ">30",
    };
    return accelerations[this.currentType] || "?";
  }

  setupInterface() {
    this.setupControlElements();
    this.createDataPanels();
  }

  setupControlElements() {
    document.getElementById("planet-type").addEventListener("change", (e) => {
      this.currentType = e.target.value;
      this.createPlanet();
    });

    document.getElementById("toggle-rings").addEventListener("change", (e) => {
      this.showRings = e.target.checked;
      this.createPlanet();
    });

    document.getElementById("toggle-moons").addEventListener("change", (e) => {
      this.showMoons = e.target.checked;
      this.createPlanet();
    });

    document
      .getElementById("toggle-atmosphere")
      .addEventListener("change", (e) => {
        this.showAtmosphere = e.target.checked;
        this.createPlanet();
      });

    document
      .getElementById("toggle-magnetic-field")
      .addEventListener("change", (e) => {
        this.showMagneticField = e.target.checked;
        this.createPlanet();
      });

    document
      .getElementById("toggle-wind-currents")
      .addEventListener("change", (e) => {
        this.showWindCurrents = e.target.checked;
        this.createPlanet();
      });

    document.getElementById("time-scale").addEventListener("input", (e) => {
      this.timeScale = parseFloat(e.target.value);
      document.getElementById(
        "time-scale-value"
      ).textContent = `${this.timeScale}x`;
    });

    document
      .getElementById("animate-clouds")
      .addEventListener("change", (e) => {
        this.animateClouds = e.target.checked;
      });

    document.getElementById("study-mode").addEventListener("change", (e) => {
      this.studyMode = e.target.checked;
      this.toggleStudyMode();
    });
  }

  createDataPanels() {
    const panels = [
      {
        id: "planet-info",
        title: "معلومات الكوكب",
        position: "top-right",
      },
      {
        id: "physical-properties",
        title: "الخصائص الفيزيائية",
        position: "top-left",
      },
      {
        id: "scientific-data",
        title: "البيانات العلمية",
        position: "bottom-right",
      },
      {
        id: "chemical-composition",
        title: "التركيب الكيميائي",
        position: "bottom-left",
      },
      {
        id: "live-metrics",
        title: "المقاييس الحية",
        position: "bottom-center",
      },
    ];

    panels.forEach((panel) => {
      this.dataPanels[panel.id] = panel;
    });
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.onWindowResize());

    document.addEventListener("keydown", (event) => this.onKeyPress(event));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onKeyPress(event) {
    const key = event.key.toLowerCase();

    switch (key) {
      case "1":
        this.currentType = "jupiter";
        break;
      case "2":
        this.currentType = "saturn";
        break;
      case "3":
        this.currentType = "uranus";
        break;
      case "4":
        this.currentType = "neptune";
        break;
      case "5":
        this.currentType = "exoplanet";
        break;
      case "r":
        this.showRings = !this.showRings;
        document.getElementById("toggle-rings").checked = this.showRings;
        break;
      case "m":
        this.showMoons = !this.showMoons;
        document.getElementById("toggle-moons").checked = this.showMoons;
        break;
      case "a":
        this.showAtmosphere = !this.showAtmosphere;
        document.getElementById("toggle-atmosphere").checked =
          this.showAtmosphere;
        break;
      case "f":
        this.showMagneticField = !this.showMagneticField;
        document.getElementById("toggle-magnetic-field").checked =
          this.showMagneticField;
        break;
      case "w":
        this.showWindCurrents = !this.showWindCurrents;
        document.getElementById("toggle-wind-currents").checked =
          this.showWindCurrents;
        break;
      case "c":
        this.animateClouds = !this.animateClouds;
        document.getElementById("animate-clouds").checked = this.animateClouds;
        break;
      case "s":
        this.studyMode = !this.studyMode;
        document.getElementById("study-mode").checked = this.studyMode;
        this.toggleStudyMode();
        break;
      default:
        return;
    }

    if (["1", "2", "3", "4", "5"].includes(key)) {
      document.getElementById("planet-type").value = this.currentType;
      this.createPlanet();
    } else if (["r", "m", "a", "f", "w"].includes(key)) {
      this.createPlanet();
    }

    event.preventDefault();
  }

  toggleStudyMode() {
    if (this.studyMode) {
      this.showMagneticField = true;
      this.showWindCurrents = true;
      this.showAtmosphere = true;
      this.showRings = true;
      this.showMoons = true;

      document.getElementById("toggle-magnetic-field").checked = true;
      document.getElementById("toggle-wind-currents").checked = true;
      document.getElementById("toggle-atmosphere").checked = true;
      document.getElementById("toggle-rings").checked = true;
      document.getElementById("toggle-moons").checked = true;

      document.getElementById("study-mode-indicator").style.display = "block";

      this.createPlanet();
    } else {
      document.getElementById("study-mode-indicator").style.display = "none";
    }
  }

  logSimulationStart() {
    console.log(`
            Gas Giants Simulation v3.0
            Author: Institute of Astronomy and Space Sciences
            Scientific Educational System
            Features:
            - Realistic gas giant modeling
            - Multi-layer atmosphere simulation
            - Ring and moon systems
            - Magnetic fields and wind currents
            - Advanced study mode
        `);
  }

  startAnimation() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
      this.render();
    };
    animate();
  }

  update() {
    const delta = this.clock.getDelta() * this.timeScale;
    this.simulationTime += delta;

    if (this.planetGroup && this.planetGroup.userData) {
      this.planetGroup.rotation.y +=
        this.planetGroup.userData.rotationSpeed * delta * 60;
    }

    this.rings.forEach((ring) => {
      if (ring.userData && ring.userData.rotationSpeed) {
        ring.rotation.z += ring.userData.rotationSpeed * delta * 60;
      }
    });

    this.moons.forEach((moon) => {
      if (moon.userData) {
        moon.rotation.y += moon.userData.rotationSpeed * delta * 60;

        moon.userData.angle += moon.userData.orbitSpeed * delta * 60;
        moon.position.x =
          Math.cos(moon.userData.angle) * moon.userData.distance;
        moon.position.z =
          Math.sin(moon.userData.angle) * moon.userData.distance;
      }
    });

    if (this.atmosphere) {
      this.atmosphere.children.forEach((layer) => {
        if (layer.userData && layer.userData.rotationSpeed) {
          layer.rotation.y += layer.userData.rotationSpeed * delta * 60;
        }
      });
    }

    if (this.magneticField) {
      this.magneticField.rotation.y += 0.001 * delta * 60;
    }

    if (this.controls) {
      this.controls.update();
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  // Advanced research functions
  exportScientificData() {
    const data = {
      planet: this.planetTypes[this.currentType],
      simulationSettings: {
        simulationTime: this.simulationTime,
        timeScale: this.timeScale,
        showRings: this.showRings,
        showMoons: this.showMoons,
        showAtmosphere: this.showAtmosphere,
        showMagneticField: this.showMagneticField,
        showWindCurrents: this.showWindCurrents,
      },
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  savePlanetAnalysis() {
    const data = this.exportScientificData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `planet_analysis_${this.currentType}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  captureScientificImage() {
    if (!this.renderer || !this.renderer.domElement) return;

    this.renderer.domElement.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `planet_image_${this.currentType}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      "image/png",
      1.0
    );
  }

  analyzeScientificData() {
    const analysis = {
      timestamp: new Date().toISOString(),
      planet: this.currentType,
      data: this.planetTypes[this.currentType],
      simulationStatistics: {
        simulationTime: this.simulationTime.toFixed(2),
        timeScale: this.timeScale,
        moonCount: this.moons.length,
        ringCount: this.rings.length,
      },
    };

    return analysis;
  }
}

// Start simulation
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Check if container exists
    if (!document.getElementById("planet-container")) {
      throw new Error(
        'Planet container element not found. Add <div id="planet-container"></div> to HTML'
      );
    }

    // Check WebGL support
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      throw new Error("WebGL not supported in your browser");
    }

    // Check Three.js
    if (typeof THREE === "undefined") {
      throw new Error("Three.js library not loaded");
    }

    // Start simulation
    const simulation = new GasGiantsSimulation();
    window.gasGiantsSimulation = simulation;

    // Add control buttons
    const controlButtons = `
            <div class="advanced-controls">
                <button id="analyze-btn" class="control-btn analyze">
                    <i class="fas fa-chart-bar"></i> تحليل البيانات
                </button>
                <button id="save-btn" class="control-btn save">
                    <i class="fas fa-save"></i> حفظ التحليل
                </button>
                <button id="capture-btn" class="control-btn capture">
                    <i class="fas fa-camera"></i> التقاط صورة
                </button>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", controlButtons);

    // Add event listeners for buttons
    document.getElementById("analyze-btn").addEventListener("click", () => {
      const analysis = simulation.analyzeScientificData();
      console.log("Scientific Analysis:", analysis);
      alert(
        "تم تحليل البيانات العلمية بنجاح. راجع وحدة التحكم للحصول على التفاصيل."
      );
    });

    document.getElementById("save-btn").addEventListener("click", () => {
      simulation.savePlanetAnalysis();
    });

    document.getElementById("capture-btn").addEventListener("click", () => {
      simulation.captureScientificImage();
    });

    console.log("✅ Gas Giants Simulation Ready");
    console.log("📋 Available Commands:");
    console.log("1. window.gasGiantsSimulation.savePlanetAnalysis()");
    console.log("2. window.gasGiantsSimulation.captureScientificImage()");
    console.log("3. window.gasGiantsSimulation.exportScientificData()");
    console.log("4. window.gasGiantsSimulation.analyzeScientificData()");
  } catch (error) {
    console.error("❌ Simulation Initialization Failed:", error);

    const errorMessage = `
            <div class="error-message">
                <h2><i class="fas fa-exclamation-triangle"></i> فشل في تهيئة المحاكاة</h2>
                <p><strong>الخطأ:</strong> ${error.message}</p>
                <div class="requirements">
                    <h3>متطلبات النظام:</h3>
                    <ul>
                        <li><i class="fas fa-check-circle"></i> متصفح يدعم WebGL (Chrome, Firefox, Edge)</li>
                        <li><i class="fas fa-check-circle"></i> مكتبة Three.js محملة</li>
                        <li><i class="fas fa-check-circle"></i> عنصر div مع id="planet-container"</li>
                    </ul>
                </div>
                <button onclick="location.reload()" class="reload-btn">
                    <i class="fas fa-redo"></i> إعادة تحميل الصفحة
                </button>
            </div>
        `;

    document.body.innerHTML += errorMessage;

    // Add error styles
    const style = document.createElement("style");
    style.textContent = `
            .error-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff4d4d, #ff1a1a);
                color: white;
                padding: 40px;
                border-radius: 20px;
                max-width: 600px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .error-message h2 {
                margin-top: 0;
                font-size: 28px;
            }
            .error-message p {
                font-size: 18px;
                margin: 20px 0;
            }
            .requirements {
                text-align: right;
                margin: 30px 0;
            }
            .requirements h3 {
                font-size: 22px;
                margin-bottom: 15px;
            }
            .requirements ul {
                list-style: none;
                padding: 0;
            }
            .requirements li {
                margin: 10px 0;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 10px;
            }
            .reload-btn {
                background: white;
                color: #ff1a1a;
                border: none;
                padding: 12px 30px;
                font-size: 18px;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 20px;
                transition: all 0.3s;
            }
            .reload-btn:hover {
                background: #f0f0f0;
                transform: translateY(-2px);
            }
        `;
    document.head.appendChild(style);
  }
});
