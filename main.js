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
camera.position.z = 14;

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

// Load the .glb models
// First glb model path /static/models/CE Blender Exp - Copy.glb
// Second glb model path /static/models/OG Frames.glb

const loader = new GLTFLoader();
let currentModel = null;
let isModel1Displayed = true;

function loadModel(modelPath) {
  // Remove the current model from the scene
  if (currentModel) {
    scene.remove(currentModel);
  }

  // Load the new model
  loader.load(
    modelPath,
    function (gltf) {
      const newModel = gltf.scene;
      console.log('New model loaded:', newModel); // Debugging line

      newModel.position.set(0, 0, 0);
      newModel.scale.set(1, 1, 1);

      scene.add(newModel);
      currentModel = newModel;
    },
    undefined,
    function (error) {
      console.error('Error loading new model:', error); // Debugging line
    }
  );
}

// Function to toggle between models
function toggleModel() {
  if (isModel1Displayed) {
    loadModel('/static/models/CE-Frames.glb');
  } else {
    loadModel('/static/models/OG-Frames.glb');
  }
  isModel1Displayed = !isModel1Displayed;
}

// Button event listener
const changeModelButton = document.getElementById('change-model-button');
changeModelButton.addEventListener('click', toggleModel);

// Display the initial model
loadModel('/static/models/OG-Frames.glb');

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


// Add event listener to a button in index.html
const contactButton = document.getElementById('contact-button');
contactButton.addEventListener('click', openContactWindow);
function openContactWindow() {
  const contactEmail = 'vyluxurysales@gmail.com';

  const contactWindow = document.createElement('div');
  contactWindow.style.position = 'fixed';
  contactWindow.style.top = '50%';
  contactWindow.style.left = '50%';
  contactWindow.style.transform = 'translate(-50%, -50%)';
  contactWindow.style.padding = '10px';
  contactWindow.style.backgroundColor = '#FFFDD0';
  contactWindow.style.border = '1px solid black';
  contactWindow.style.borderRadius = '5px';
  contactWindow.style.zIndex = '9999';

  const emailText = document.createElement('p');
  emailText.textContent = 'Contact Email: ' + contactEmail;
  emailText.style.margin = '0';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(contactWindow);
  });

  contactWindow.appendChild(emailText);
  contactWindow.appendChild(closeButton);

  document.body.appendChild(contactWindow);
}