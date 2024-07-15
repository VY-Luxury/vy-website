import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControl.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Information
//
// Units: mm, 
//

// Scene 
const scene = new THREE.Scene();

// Sizes
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// }

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false
controls.enableDamping = true
controls.maxDistance = 100

// Create Torus Object
const geometry = new THREE.TorusGeometry(12, 3.5, 16, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0xFFFDD0,
  wireframe: true
});
const object = new THREE.Mesh(geometry, material);
scene.add(object);

// Load the .glb model
const loader = new GLTFLoader();
loader.load(
  '/static/models/VY-Frames1.glb',
  function (gltf) {
    const model = gltf.scene;
    console.log('Model loaded:', model); // Debugging line

    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);

    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('Error loading model:', error); // Debugging line
  }
);

// Animate
function animate() {
  // Rotate the model if you want
  if (scene.children.length > 0) {
    const model = scene.children[0];
    model.rotation.x += 0.008;
    model.rotation.y += 0.005;
    model.rotation.z -= 0.009;
  }

  renderer.render(scene, camera);
}

// Resize
window.addEventListener("resize", () => {
  // Update Camera
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})