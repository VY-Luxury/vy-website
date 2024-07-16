import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
controls.enableRotate = false;
controls.enableDamping = true;
controls.maxDistance = 100;

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
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to initialize the virtual try-on experience
function initVirtualTryOn() {
    const videoElement = document.createElement('video');
    videoElement.id = 'video';
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    const faceMeshScript = document.createElement('script');
    faceMeshScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';
    faceMeshScript.onload = () => {
        const cameraUtilsScript = document.createElement('script');
        cameraUtilsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils';
        cameraUtilsScript.onload = startVirtualTryOn;
        document.body.appendChild(cameraUtilsScript);
    };
    document.body.appendChild(faceMeshScript);
}

async function startVirtualTryOn() {
    const { FaceMesh } = window;
    const { Camera } = window;
    const videoElement = document.getElementById('video');

    // Initialize MediaPipe Face Mesh
    const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    camera.start();

    faceMesh.onResults(onResults);

    function onResults(results) {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
        const landmarks = results.multiFaceLandmarks[0];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const nose = landmarks[1];

        const leftEyePosition = new THREE.Vector3(leftEye.x * 2 - 1, -(leftEye.y * 2 - 1), -leftEye.z);
        const rightEyePosition = new THREE.Vector3(rightEye.x * 2 - 1, -(rightEye.y * 2 - 1), -rightEye.z);
        const nosePosition = new THREE.Vector3(nose.x * 2 - 1, -(nose.y * 2 - 1), -nose.z);

        if (glasses) {
            // Position the glasses
            const centerPosition = leftEyePosition.clone().add(rightEyePosition).multiplyScalar(0.5);
            glasses.position.copy(centerPosition);
            glasses.lookAt(nosePosition);
        }
    }

    // Initialize Three.js for virtual try-on
    const tryOnScene = new THREE.Scene();
    const tryOnCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const tryOnRenderer = new THREE.WebGLRenderer();
    tryOnRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(tryOnRenderer.domElement);

    const tryOnControls = new OrbitControls(tryOnCamera, tryOnRenderer.domElement);
    tryOnCamera.position.set(0, 0, 5);
    tryOnControls.update();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 10).normalize();
    tryOnScene.add(light);

    const loader = new GLTFLoader();
    loader.load('path/to/your/glasses_model.glb', function (gltf) {
        glasses = gltf.scene;
        glasses.scale.set(0.1, 0.1, 0.1); // Adjust scale as necessary
        tryOnScene.add(glasses);
    });

    function animateTryOn() {
        requestAnimationFrame(animateTryOn);
        tryOnControls.update();
        tryOnRenderer.render(tryOnScene, tryOnCamera);
    }

    animateTryOn();
}

// Add event listener to the button
const button = document.getElementById('virtual-try-on-button');
button.addEventListener('click', initVirtualTryOn);
