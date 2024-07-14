import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0xFFFDD0,
  wireframe: true
});
const object = new THREE.Mesh(geometry, material);
scene.add(object);

camera.position.z = 30;

function animate() {

  object.rotation.x += 0.01;
  object.rotation.y += 0.005;
  object.rotation.z += 0.01;

  renderer.render(scene, camera);

}