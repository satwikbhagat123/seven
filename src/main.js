import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('.canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// Camera position
camera.position.set(0, 2, 3.5);
camera.lookAt(0, 0, 0);

// Orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/zwartkops_pit_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;
});

// Add some lights to better see the model
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Declare a global variable for the model
let model;

// Load 3D model
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    '/src/the_one_ring.glb',
    (gltf) => {
        model = gltf.scene; // Assign the model to the global variable
        model.scale.set(50, 50, 50); // Scale the model
        model.position.set(0, -1, 1.5); // Center the model
        model.rotation.x = Math.PI / 24; // Optional rotation
        scene.add(model);

        // Optional: Log to confirm model is loaded
        console.log('Model loaded successfully');
    },
    // Add progress callback
    (progress) => {
        console.log('Loading progress: ', (progress.loaded / progress.total * 100) + '%');
    },
    // Add error callback
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Responsive handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (model) { // Check if the model is loaded
        model.rotation.z += 0.01; // Rotate the model around the Y-axis
    }

    renderer.render(scene, camera);
}

animate(); // Start the animation loop
