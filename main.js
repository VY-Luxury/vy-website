import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('canvas-container').appendChild(renderer.domElement);

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

camera.position.z = 30;

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
