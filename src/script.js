import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Debug
 */
const gui = new GUI();
gui.hide();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;

const fontsLoader = new FontLoader();
const textGroup = new THREE.Group();

fontsLoader.load("/fonts/Bebas_Neue_Regular.json", (font) => {
  const textGeometry = new TextGeometry("Julián Ramírez", {
    font: font,
    size: 0.25,
    depth: 0.4,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
    center: true,
  });

  const text = new THREE.Mesh(textGeometry, material);
  // textMaterial.wireframe = true;

  text.position.y = 0.6;
  textGeometry.center();
  textGroup.add(text);
});

const lines = ["Creative", "Developer"];
const lineHeight = 0.6;

fontsLoader.load("/fonts/Bebas_Neue_Regular.json", (font) => {
  lines.forEach((line, i) => {
    const textGeometry = new TextGeometry(line, {
      font: font,
      size: 0.5,
      depth: 0.4,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
      center: true,
    });

    const text = new THREE.Mesh(textGeometry, material);
    // textMaterial.wireframe = true;
    text.position.y = -i * lineHeight;
    textGeometry.center();
    textGroup.add(text);
  });
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};
const smoothCursor = {
  x: 0,
  y: 0,
};
// Función lerp (interpolación lineal)
const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

const updateCursor = (clientX, clientY) => {
  cursor.x = clientX / sizes.width - 0.5;
  cursor.y = -(clientY / sizes.height - 0.5);
};

window.addEventListener("mousemove", (e) => {
  updateCursor(e.clientX, e.clientY);
});
window.addEventListener("touchmove", (e) => {
  // Toma el primer toque (puedes ajustar esto para múltiples toques si es necesario)
  const touch = e.touches[0];
  updateCursor(touch.clientX, touch.clientY);
});
// Para dispositivos móviles (orientación del dispositivo)
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    // Ajustar los valores según la rotación del dispositivo
    let rotationX = event.beta; // Inclinar adelante/atrás
    let rotationY = event.gamma; // Inclinar izquierda/derecha

    // Limitar los valores para evitar que el texto se "acueste"
    rotationX = Math.min(Math.max(rotationX, -45), 45); // Limita el rango entre -45 y 45 grados
    rotationY = Math.min(Math.max(rotationY, -45), 45); // Limita el rango entre -45 y 45 grados

    // Normalizar el rango de beta y gamma a valores entre -0.5 y 0.5
    cursor.x = rotationY / 90; // Normalizar gamma a un rango [-0.5, 0.5]
    cursor.y = rotationX / 90; // Normalizar beta a un rango [-0.5, 0.5]
  });
}

// Scene
const scene = new THREE.Scene();

// Axes Helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Object
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// console.time("donuts");

// console.timeEnd("donuts");
const group = new THREE.Group();

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 30);
const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);
  const box = new THREE.Mesh(boxGeometry, material);

  donut.position.x = (Math.random() - 0.5) * 20;
  donut.position.y = (Math.random() - 0.5) * 20;
  donut.position.z = (Math.random() - 0.5) * 20;

  box.position.x = (Math.random() - 0.5) * 20;
  box.position.y = (Math.random() - 0.5) * 20;
  box.position.z = (Math.random() - 0.5) * 20;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  box.rotation.x = Math.random() * Math.PI;
  box.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();

  donut.scale.set(scale, scale, scale);

  box.scale.set(scale, scale, scale);

  group.add(donut, box);
}

scene.add(textGroup);
scene.add(group);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

/**
 * Controls
 */
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Resize
 */
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/*
 * Animations
 */
const clock = new THREE.Clock();
const tick = () => {
  // clock
  const elapsedTime = clock.getElapsedTime();

  // Aplicar lerp para suavizar el movimiento
  smoothCursor.x = lerp(smoothCursor.x, cursor.x, 0.05); // El tercer parámetro controla la suavidad (más bajo = más suave)
  smoothCursor.y = lerp(smoothCursor.y, cursor.y, 0.05);

  camera.position.x = -Math.sin(smoothCursor.x) * 10;
  camera.position.y = -smoothCursor.y * 10;
  camera.position.z = Math.cos(smoothCursor.x) * 3;

  // update objects
  if (textGroup && group) {
    textGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
    textGroup.rotation.z = Math.cos(elapsedTime * 0.3) * 0.4;

    group.rotation.x = Math.cos(elapsedTime * 0.1) * 0.6;
    group.rotation.y = Math.sin(elapsedTime * 0.1) * 0.7;
    camera.lookAt(textGroup.position);
  }

  // update controls
  // controls.update();

  // render
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};
tick();
