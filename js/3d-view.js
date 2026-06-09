import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/addons/loaders/GLTFLoader.js';


// A simple hex dictionary map that correlates UI buttons with real hex colors
const colorPalette = {
    black: 0x1a1a1a, grey: 0x888888, navy: 0x1d3557, crimson: 0xe63946, forest: 0x2a9d8f,
    white: 0xffffff, cream: 0xf4f1de, canary: 0xe9c46a, coral: 0xf4a261, lilac: 0xa8dadc
};

// Keep tracking variables of your parts globally or within closure scope
let outerCapsMesh, innerCapsMesh, caseMesh;


// Set up UI Interaction Listeners
document.querySelectorAll('.swatch-row .swatch').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const swatch = e.target;
        const rowId = swatch.parentElement.id;
        const targetColor = swatch.getAttribute('data-color');
        
        // Toggle Active UI States
        swatch.parentElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        
        // Update Label Text indicator
        if(rowId === 'outer-swatches') {
            document.getElementById('outer-label-text').innerText = targetColor;
            if(outerCapsMesh) outerCapsMesh.material.color.setHex(colorPalette[targetColor]);
        } else {
            document.getElementById('inner-label-text').innerText = targetColor;
            if(innerCapsMesh) innerCapsMesh.material.color.setHex(colorPalette[targetColor]);
        }
    });
});

// Material adjustment switcher
document.querySelectorAll('.material-selector .mat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mat-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const type = e.target.getAttribute('data-material');
        if(!caseMesh) return;
        
        if(type === 'metallic') {
            caseMesh.material.metalness = 0.8;
            caseMesh.material.roughness = 0.2;
        } else {
            caseMesh.material.metalness = 0.0;
            caseMesh.material.roughness = 0.6;
        }
        caseMesh.material.needsUpdate = true;
    });
});

// Initialize the texture loader
const textureLoader = new THREE.TextureLoader();

// Load your separate texture files
const textureInnerKeycaps = textureLoader.load('./3d-models/textures/white_keycaps_texture.png');
const textureOutterKeycaps = textureLoader.load('./3d-models/textures/black_keycaps_texture.png');
//const textureKeyboardBody = textureLoader.load('/3d-models/textures/keyboard_body_textures.png');

// Fix alignment and color profile (Essential for Three.js v0.160+)
textureInnerKeycaps.flipY = false;
textureInnerKeycaps.colorSpace = THREE.SRGBColorSpace;

textureOutterKeycaps.flipY = false;
textureOutterKeycaps.colorSpace = THREE.SRGBColorSpace;

// textureKeyboardBody.flipY = false;
// textureKeyboardBody.colorSpace = THREE.SRGBColorSpace;
// ... Keep all the rest of your 3D code below exactly the same ...

    // 1. Target your specific container box
const container = document.getElementById('my-3d-container');

    // 2. Setup the 3D Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#111111'); // Match your container bg

    // 3. Setup Camera based on the container's size (NOT the whole screen)
// 1. Find your camera setup line
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);

// 2. Change your old camera.position.set(...) to this:
camera.position.set(0, 7, 3.5);

    // 4. Setup Renderer and put it inside the container
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

    // 5. Add Lights (Crucial for seeing your 3D model)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
    
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

    // 6. Add Controls so users can drag/rotate the model with their mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 1. CAN'T MOVE (Disable Panning)
// This stops users from right-clicking or using two fingers to drag the camera away from the keyboard center.
controls.enablePan = false;

// 2. RESTRICT ZOOM (Min and Max Limits)
// Adjust these numbers based on your keyboard's size. 
controls.minDistance = 4; // How close you can zoom in (Stops camera from passing through the keys)
controls.maxDistance = 8.0; // How far you can zoom out (Stops the keyboard from becoming a tiny speck)

// 3. CAN'T LOOK UNDER THE OBJECT (Polar Angle Limits)
// In Three.js, angles are in radians. Math.PI / 2 is exactly 90 degrees (the horizon line).
// This completely blocks the camera from going below the floor level.
controls.maxPolarAngle = Math.PI / 2;

    // 7. LOAD YOUR 3D MODEL (.glb file)
const loader = new GLTFLoader();
loader.load(
    './3d-models/model/keyboard.glb',
    function (gltf) {
        const model = gltf.scene;

        // Auto-centering helper
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        // LOOP THROUGH THE INDIVIDUAL PARTS
        model.traverse(function (child) {
            if (child.isMesh) {
                console.log("Found mesh name:", child.name);
                
                if (child.name === 'white_keycaps') {
                    child.material.map = textureInnerKeycaps;
                    // 🚀 Force default White on load
                    child.material.color.setHex(0xffffff); 
                    child.material.needsUpdate = true;
                    innerCapsMesh = child;
                }
                
                if (child.name === 'black_keycaps') {
                    child.material.map = textureOutterKeycaps;
                    // 🚀 Force default Black on load
                    child.material.color.setHex(0x1a1a1a); 
                    child.material.needsUpdate = true;
                    outerCapsMesh = child;
                }

                if (child.name === 'keyboard_body') {
                    // child.material.map = textureKeyboardBody;
                    // child.material.needsUpdate = true;
                    // caseMesh = child;
                }
            }
        });

        // Add the fully prepared model to the scene
        scene.add(model);

        // 🚀 SMOOTHLY FADE OUT THE LOADING SCREEN
        const loaderElement = document.getElementById('3d-loader');
        if (loaderElement) {
            loaderElement.style.opacity = '0';
            loaderElement.style.visibility = 'hidden';
            
            // Optional: Completely remove it from the DOM after it fades out
            setTimeout(() => loaderElement.remove(), 500);
        }
    }
);

    // 8. Animation Loop
function animate() {
        requestAnimationFrame(animate);
        controls.update(); // smoothly updates mouse dragging
        renderer.render(scene, camera);
}
animate();

    // 9. Keep it responsive if the browser changes size
// window.addEventListener('resize', () => {
//         camera.aspect = container.clientWidth / container.clientHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(container.clientWidth, container.clientHeight);
// });

// 🚀 Dynamic Resize Handler
// 🚀 DYNAMIC MOBILE & DESKTOP RESIZE HANDLER
window.addEventListener('resize', () => {
    if (!container || !camera || !renderer) return;

    // 1. Grab the updated CSS container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 2. Update the camera lens aspect ratio to prevent stretching
    camera.aspect = width / height;
    
    // 3. Adjust zoom level automatically for narrow mobile screens
    if (width < 600) {
        camera.position.set(5, 6, 5); // Backs the camera up slightly so the keyboard fits on mobile
    } else {
        camera.position.set(3.5, 5, 3.5); // Your premium desktop view angle
    }

    camera.updateProjectionMatrix();

    // 4. Redraw the canvas size
    renderer.setSize(width, height);
});

// Run it once immediately on load to establish mobile dimensions right away
window.dispatchEvent(new Event('resize'));