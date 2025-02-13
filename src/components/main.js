import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

let coordsCount = 0;

// Variables for camera positions
const btn1Position = new THREE.Vector3(0, 0, 7.5);
const btn2Position = new THREE.Vector3(2.8, 3.1, -1.3); // back/forth --- up/down --- left/right
const btn3Position = new THREE.Vector3(15, 10, 8);
const btn4Position = new THREE.Vector3(4.5, 2.98, -2.5);

// Variables for camera target positions
const tgtPos1 = [-5.5, 3.60, 7.5];
const tgtPos2 = [1.7, 2.98, -1.94];
const tgtPos3 = [2, 3, 9];
const tgtPos4 = [2.4, 3, -2];

const target = new THREE.Vector3(...tgtPos1); // Initial target


// Create Cube Buttons
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshBasicMaterial({ color: 0x2415A7 });
const button1 = new THREE.Mesh(geometry, material);
const button2 = new THREE.Mesh(geometry, material);

// Position the buttons
button1.position.set(2.2, 3, -2.39);  // Left
button2.position.set(2.2, 2.7, -2.39);   // Right


button1.rotation.x = Math.PI / 0.000001;  // 45 degrees
button1.rotation.y = Math.PI / 3.05; // 45 degrees
button1.rotation.z = Math.PI / 0.000001;  // 45 degrees
button2.rotation.x = Math.PI / 0.000001;  // 45 degrees
button2.rotation.y = Math.PI / 3.05; // 45 degrees
button2.rotation.z = Math.PI / 0.000001;  // 45 degrees


// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(16, 3, 6); // Set initial camera position
// Use your tgtPos1 for the initial target
const initialTarget = new THREE.Vector3(7, 2, 8); // 7, 2, 8 #ff0000
camera.lookAt(initialTarget);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
RectAreaLightUniformsLib.init();
const rectLight = new THREE.RectAreaLight(0x0005FF, 50, 4.7, 1.2);
rectLight.position.set(-0.75, 6.05, 7.56);
rectLight.lookAt(50, 6.05, 7.56);
scene.add(rectLight);

const rectLight1 = new THREE.RectAreaLight(0x0005FF, 300, 1.5, 1.5);
rectLight1.position.set(1.7, 3, -1.6);
rectLight1.lookAt(50, 6.5, 26);
scene.add(rectLight1);

const rectLight2 = new THREE.RectAreaLight(0xFFFFFF, 1, 1.5, 1.5);
rectLight2.position.set(1.78, 3, -1.6);
rectLight2.lookAt(-50, -4, -33);
scene.add(rectLight2);

const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xCF00FF, 100, 100);
pointLight.position.set(6.7, 6, 16.3);
scene.add(pointLight);

const pointLight1 = new THREE.PointLight(0xCF00FF, 100, 100);
pointLight1.position.set(3.8, 6, 11.95);
scene.add(pointLight1);

const rectLight3 = new THREE.RectAreaLight();
rectLight3.position.set(0, 5, 7.5);
rectLight3.lookAt(0, 0, 7.5);
rectLight3.intensity = 10; // Adjust intensity of the po
rectLight3.width = 1;
rectLight3.height = 5;
rectLight3.color.set(0xFFFFFF);
scene.add(rectLight3);


const pointLight3 = new THREE.PointLight(0xFF0000, 100, 100);
pointLight3.position.set(-0.5, 9, 5.2);
scene.add(pointLight3);

// Load GLTF model
const loader = new GLTFLoader();
loader.load('/models/cubes._Export_Blend.glb', function (gltf) {
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.error(error);
});




loader.load('/models/cubes._Export_Blend.glb', function (gltf) {
  scene.add(gltf.scene);
  document.getElementById('loadingScreen').style.display = 'none'; // Hide loading screen once loaded
}, function (xhr) {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); // Progress log (optional)
}, function (error) {
  console.error(error);
});









// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(initialTarget);  // Set controls target to initial target
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.update(); // Ensure controls are updated with the new target

// Display coordinates
const coordinates = document.getElementById('coordinates');


// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add camera movement code
document.addEventListener('DOMContentLoaded', function () {
  const btn1 = document.getElementById('btn1');
  const btn2 = document.getElementById('btn2');
  const btn3 = document.getElementById('btn3');
  const btn4 = document.getElementById('btn4');
  const btnBack = document.getElementById('btnBack');
  const tvOverlay = document.getElementById('tvOverlay');
  const btns = document.getElementById('btns');

  btn1.addEventListener('click', function () {
    moveCamera(btn1Position, tgtPos1, () => {
      controls.enabled = false;
      tvOverlay.style.display = 'flex';
      btnBack.style.display = 'block';
      btns.style.display = 'none';
    });
    coordsCount = 0;  // Reset count
  });


  btn2.addEventListener('click', function () {
    moveCamera(btn2Position, tgtPos2, () => {
      controls.enabled = false;
      btnBack.style.display = 'block';
      btns.style.display = 'none';
    });
    coordsCount = 0;  // Reset count
  });

  btn3.addEventListener('click', function () {
    moveCamera(btn3Position, tgtPos3);
    coordsCount++;  // Increment count
    console.log(coordsCount);  // For debugging purposes
  });

  btn4.addEventListener('click', function () {
    moveCamera(btn4Position, tgtPos4);
    coordsCount = 0;  // Reset count
  });

  btnBack.addEventListener('click', function () {
    tvOverlay.style.display = 'none';
    btnBack.style.display = 'none';
    controls.enabled = true;
    btns.style.display = 'flex';
  });

  function moveCamera(position, targetPos, onComplete) {
    const duration = 2; // Duration of the animation in seconds
    const target = new THREE.Vector3(...targetPos);

    gsap.to(camera.position, {
      duration: duration,
      x: position.x,
      y: position.y,
      z: position.z,
      onUpdate: function () {
        camera.lookAt(target);
      },
      onComplete: function () {
        controls.target.copy(target);
        controls.update();
        if (onComplete) onComplete();
      }
    });

    gsap.to(controls.target, {
      duration: duration,
      x: target.x,
      y: target.y,
      z: target.z,
      onUpdate: function () {
        controls.update();
      }
    });
  }
});



// Load font
const fontLoader = new FontLoader();
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry = new TextGeometry('Click the buttons', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  textMesh.position.set(2.13, 3.5, -2.4);  // Position -->  back/forth --- up/down --- left/right

  textMesh.rotation.x = Math.PI / 0.000001;  // 45 degrees
  textMesh.rotation.y = Math.PI / 3.05; // 45 degrees
  textMesh.rotation.z = Math.PI / 0.000001;  // 45 degrees

  textMesh.scale.set(0.022, 0.022, 0.002);  // Scale uniformly

  textMesh.material.color.set(0x000000);  // Change color to green

  scene.add(textMesh);
});
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry1 = new TextGeometry('to scroll', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const textMesh = new THREE.Mesh(textGeometry1, textMaterial);

  textMesh.position.set(2.16, 3.45, -2.44);  // Position -->  back/forth --- up/down --- left/right

  textMesh.rotation.x = Math.PI / 0.000001;  // 45 degrees
  textMesh.rotation.y = Math.PI / 3.05; // 45 degrees
  textMesh.rotation.z = Math.PI / 0.000001;  // 45 degrees

  textMesh.scale.set(0.022, 0.022, 0.002);  // Scale uniformly

  textMesh.material.color.set(0x000000);  // Change color to green

  scene.add(textMesh);
});
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry('through my models', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(2.128, 3.4, -2.39);  // Position -->  back/forth --- up/down --- left/right

  textMesh.rotation.x = Math.PI / 0.000001;  // 45 degrees
  textMesh.rotation.y = Math.PI / 3.05; // 45 degrees
  textMesh.rotation.z = Math.PI / 0.000001;  // 45 degrees

  textMesh.scale.set(0.022, 0.022, 0.002);  // Scale uniformly

  textMesh.material.color.set(0x000000);  // Change color to green

  scene.add(textMesh);
});
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry3 = new TextGeometry('\u2191', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const textMesh = new THREE.Mesh(textGeometry3, textMaterial);

  textMesh.position.set(2.24, 2.99, -2.35);  // Position -->  back/forth --- up/down --- left/right

  textMesh.rotation.x = Math.PI / 0.000001;  // 45 degrees
  textMesh.rotation.y = Math.PI / 3.05; // 45 degrees
  textMesh.rotation.z = Math.PI / 0.000001;  // 45 degrees

  textMesh.scale.set(0.04, 0.04, 0.04);  // Scale uniformly

  textMesh.material.color.set(0x000000);  // Change color to green

  scene.add(textMesh);
});
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry4 = new TextGeometry('\u2193', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const textMesh = new THREE.Mesh(textGeometry4, textMaterial);

  textMesh.position.set(2.24, 2.695, -2.35);  // Position -->  back/forth --- up/down --- left/right

  textMesh.rotation.x = Math.PI / 0.000001;  // 45 degrees
  textMesh.rotation.y = Math.PI / 3.05; // 45 degrees
  textMesh.rotation.z = Math.PI / 0.000001;  // 45 degrees

  textMesh.scale.set(0.04, 0.04, 0.04);  // Scale uniformly

  textMesh.material.color.set(0x000000);  // Change color to green

  scene.add(textMesh);
});
// ------------------------------------------------------------------------------------------1st line of text ........................................
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry('Florin Lica', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial;
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(4.001, 0.4, 10);  // Position -->  back/forth --- up/down --- left/right

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(1, 1, 0.1);  // Scale uniformly  Width / height / depth

  textMesh.material.color.set(0xF5F5F5);  // Change color to green

  scene.add(textMesh);
});


fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry('Florin Lica', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    opacity: 0.25,
    transparent: true,
    side: THREE.DoubleSide
    });
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(4, 0.1, 10);  // Position -->  back/forth --- up/down --- left/right

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(1, 1, 0.1);  // Scale uniformly  Width / height / depth


  scene.add(textMesh);
});

// ------------------------------------------------------------------------------------------2nd line of text ........................................
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry('(+34) 632 629 721', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial;
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(4.8001, 0.4, 10);  // Position -->  back/forth --- up/down --- left/right     0xffffff Position 0xffffff

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(0.4, 0.4, 0.1);  // Scale uniformly  Width / height / depth

  textMesh.material.color.set(0xF5F5F5);  // Change color to green

  scene.add(textMesh);
});


fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry('(+34) 632 629 721', {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    opacity: 0.25,
    transparent: true,
    side: THREE.DoubleSide
    });
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(4.8, 0.1, 10);  // Position -->  back/forth --- up/down --- left/right     0xffffff Position 0xffffff

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(0.4, 0.4, 0.1);  // Scale uniformly  Width / height / depth


  scene.add(textMesh);
});

// ------------------------------------------------------------------------------------------3rd line of text ........................................
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry("Florinlica@hotmail.com", {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial;
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(5.651, 0.4, 10);  // Position -->  back/forth --- up/down --- left/right     0xffffff Position 0xffffff

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(0.4, 0.4, 0.1);  // Scale uniformly  Width / height / depth

  textMesh.material.color.set(0xF5F5F5);  // Change color to green

  scene.add(textMesh);
});


fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry("Florinlica@hotmail.com", {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    opacity: 0.25,
    transparent: true,
    side: THREE.DoubleSide
    });
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(5.65, 0.1, 10);  // Position -->  back/forth --- up/down --- left/right     0xffffff Position 0xffffff

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(0.4, 0.4, 0.1);  // Scale uniformly  Width / height / depth


  scene.add(textMesh);
});

// ------------------------------------------------------------------------------------------4TH line of text ........................................
fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry("L'Armentera, 17472 (Girona), Spain", {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial;
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(6.501, 0.4, 10);  // Position -->  back/forth --- up/down --- left/right     0xffffff Position 0xffffff

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(0.4, 0.4, 0.1);  // Scale uniformly  Width / height / depth

  textMesh.material.color.set(0xF5F5F5);  // Change color to green

  scene.add(textMesh);
});


fontLoader.load('/resources/Times New Roman_Regular.json', function (font) {
  const textGeometry2 = new TextGeometry("L'Armentera, 17472 (Girona), Spain", {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    opacity: 0.25,
    transparent: true,
    side: THREE.DoubleSide
    });
  const textMesh = new THREE.Mesh(textGeometry2, textMaterial);

  textMesh.position.set(6.5, 0.1, 10);  // Position -->  back/forth --- up/down --- left/right     0xffffff Position 0xffffff

  textMesh.rotation.x = -Math.PI / 2;  // Rotate 90 degrees around the X-axis
  textMesh.rotation.y = 0;  // No rotation around the Y-axis
  textMesh.rotation.z = 1.6;  // No rotation around the Z-axis
  

  textMesh.scale.set(0.4, 0.4, 0.1);  // Scale uniformly  Width / height / depth


  scene.add(textMesh);
});




scene.add(button1, button2);

// Array to hold model paths for easy looping
const models = ['/models/dbl1.glb', '/models/dbl2.glb', '/models/dbl3.glb', '/models/dbl4.glb', '/models/dbl5.glb', '/models/dbl6.glb', '/models/dbl7.glb', '/models/dbl8.glb'];

// Variable to hold the current index of the model
let currentIndex = 0;

// Variable to hold the currently loaded model
let currentModel = null;

// Function to load a GLTF model and remove any previous one
function loadModel(modelPath) {

    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';  // Show the GIF
  

  // Remove the previous model if it exists
  if (currentModel) {
      scene.remove(currentModel);
      currentModel.traverse((child) => {
          if (child.isMesh) {
              child.geometry.dispose();
              child.material.dispose();
          }
      });
      currentModel = null; // Clear the reference after removal
  }
  // Load the new model
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    function (gltf) {
      currentModel = gltf.scene;  // Store the reference to the currently loaded model
      currentModel.position.set(2.2, 2.7, -1.6); // Set the desired position for the model
      currentModel.scale.set(0.2, 0.2, 0.2);  // Adjust scale for each model
      scene.add(currentModel);

      // Hide loading screen once model is loaded
      loadingScreen.style.display = 'none';  // Hide the GIF
    },
    undefined,
    function (error) {
      console.error(error);
      loadingScreen.style.display = 'none';  // Hide the GIF even if there's an error
    }
  );
}
// Raycaster and mouse setup for detecting button clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle scrolling through models
function scrollModels(direction) {
    // Update the current index based on the direction
    if (direction === 'up') {
        currentIndex = (currentIndex - 1 + models.length) % models.length; // Scroll up and loop back
    } else if (direction === 'down') {
        currentIndex = (currentIndex + 1) % models.length; // Scroll down and loop back
    }

    // Load the model at the new index
    loadModel(models[currentIndex]);
}

// Handle mouse clicks to detect button clicks
function onMouseClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast to detect intersection with the buttons
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([button1, button2]);

    if (intersects.length > 0) {
        if (intersects[0].object === button1) {
            console.log('Button 1 clicked! Scrolling up');
            scrollModels('up');  // Scroll up (previous model)
        } else if (intersects[0].object === button2) {
            console.log('Button 2 clicked! Scrolling down');
            scrollModels('down');  // Scroll down (next model)
        }
    }
}

// Add the event listener to detect mouse clicks
window.addEventListener('click', onMouseClick);



// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate the current model on the Z-axis
  if (currentModel) {
    currentModel.rotation.y += 0.01;  // Adjust the speed of rotation here (0.01 is slow)
  }

  controls.update();
  renderer.render(scene, camera);

  // Display coordinates if coordsCount is greater than 5
  if (coordsCount > 10) {
    coordinates.innerText = `X: ${camera.position.x.toFixed(2)}, Y: ${camera.position.y.toFixed(2)}, Z: ${camera.position.z.toFixed(2)}`;
  } else {
    coordinates.innerText = '';  // Hide coordinates if less than or equal to 5
  }
}


animate();


// Can not upload the models to girhub as they are too big, they are saved in a folder on home pc desktop, remember to place them in /models before starting development next time ^_^