import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/addons/loaders/GLTFLoader.js';

const colorPalette = {
    black: 0x1a1a1a,
    grey: 0x888888,
    navy: 0x1d3557,
    crimson: 0xe63946,
    forest: 0x2a9d8f,
    white: 0xffffff,
    cream: 0xf4f1de,
    canary: 0xe9c46a,
    coral: 0xf4a261,
    lilac: 0xa8dadc
};

let outerCapsMesh, innerCapsMesh, caseMesh;

const container = document.getElementById('my-3d-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#111111');

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(0, 7, 3.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

const textureInnerKeycaps = textureLoader.load('/3d-models/textures/white_keycaps_texture.png');
const textureOutterKeycaps = textureLoader.load('/3d-models/textures/black_keycaps_texture.png');
const textureKeyboardBody = textureLoader.load('/3d-models/textures/keyboard_body_textures.png');

function improveTexture(texture) {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
}

improveTexture(textureInnerKeycaps);
improveTexture(textureOutterKeycaps);
improveTexture(textureKeyboardBody);

function createKeycapMaterial(texture, baseColor, symbolColor, symbolsAreLight = true) {
    const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.55,
        metalness: 0.0,
        map: texture
    });

    material.userData.symbolColor = new THREE.Color(symbolColor);
    material.userData.symbolsAreLight = symbolsAreLight ? 1.0 : 0.0;

    material.onBeforeCompile = shader => {
        shader.uniforms.symbolColor = {
            value: material.userData.symbolColor
        };

        shader.uniforms.symbolsAreLight = {
            value: material.userData.symbolsAreLight
        };

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
            #include <common>
            uniform vec3 symbolColor;
            uniform float symbolsAreLight;

            float getLuminance(vec3 color) {
                return dot(color, vec3(0.299, 0.587, 0.114));
            }
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #ifdef USE_MAP
                vec4 sampledDiffuseColor = texture2D(map, vMapUv);
                float lum = getLuminance(sampledDiffuseColor.rgb);

                // Wider mask = thicker symbols
                float lightSymbolMask = smoothstep(0.38, 0.62, lum);
                float darkSymbolMask = 1.0 - smoothstep(0.38, 0.62, lum);

                float symbolMask = mix(darkSymbolMask, lightSymbolMask, symbolsAreLight);

                // Boost symbol thickness/visibility
                symbolMask = clamp(symbolMask * 1.8, 0.0, 1.0);

                diffuseColor.rgb = mix(diffuseColor.rgb, symbolColor, symbolMask);
            #endif
            `
        );

        material.userData.shader = shader;
    };

    return material;
}

function setKeycapColor(mesh, hexColor) {
    if (!mesh) return;
    mesh.material.color.setHex(hexColor);
}

document.querySelectorAll('.swatch-row .swatch').forEach(btn => {
    btn.addEventListener('click', e => {
        const swatch = e.target;
        const rowId = swatch.parentElement.id;
        const targetColor = swatch.getAttribute('data-color');

        swatch.parentElement
            .querySelectorAll('.swatch')
            .forEach(s => s.classList.remove('active'));

        swatch.classList.add('active');

        if (rowId === 'outer-swatches') {
            document.getElementById('outer-label-text').innerText = targetColor;
            setKeycapColor(outerCapsMesh, colorPalette[targetColor]);
        } else {
            document.getElementById('inner-label-text').innerText = targetColor;
            setKeycapColor(innerCapsMesh, colorPalette[targetColor]);
        }
    });
});

document.querySelectorAll('.material-selector .mat-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelectorAll('.mat-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const type = e.target.getAttribute('data-material');

        if (!caseMesh) return;

        if (type === 'metallic') {
            caseMesh.material.metalness = 0.8;
            caseMesh.material.roughness = 0.2;
        } else {
            caseMesh.material.metalness = 0.0;
            caseMesh.material.roughness = 0.6;
        }

        caseMesh.material.needsUpdate = true;
    });
});

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI / 2;

const loader = new GLTFLoader();

loader.load(
    '/3d-models/model/keyboard.glb',

    gltf => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;

        model.traverse(child => {
            if (!child.isMesh) return;

            console.log('Found mesh name:', child.name);

            if (child.name === 'white_keycaps') {
                child.material = createKeycapMaterial(
                    textureInnerKeycaps,
                    0xffffff,
                    0x111111,
                    false
                );

                innerCapsMesh = child;
            }

            if (child.name === 'black_keycaps') {
                child.material = createKeycapMaterial(
                    textureOutterKeycaps,
                    0x888888,
                    0xffffff,
                    true
                );

                outerCapsMesh = child;
            }

            if (child.name === 'keyboard_body') {
                child.material = new THREE.MeshStandardMaterial({
                    map: textureKeyboardBody,
                    color: 0xffffff,
                    roughness: 0.6,
                    metalness: 0.0
                });

                caseMesh = child;
            }
        });

        scene.add(model);

        const loaderElement = document.getElementById('3d-loader');

        if (loaderElement) {
            loaderElement.style.opacity = '0';
            loaderElement.style.visibility = 'hidden';
            setTimeout(() => loaderElement.remove(), 500);
        }
    },

    undefined,

    error => {
        console.error('Error loading GLB model:', error);
    }
);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;

    if (width < 600) {
        camera.position.set(5, 6, 5);
    } else {
        camera.position.set(3.5, 5, 3.5);
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.dispatchEvent(new Event('resize'));