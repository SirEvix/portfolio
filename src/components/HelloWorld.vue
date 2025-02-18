<template>
  <div class="container">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-1016336595"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'AW-1016336595');
    </script>
    <div ref="sceneContainer"></div>
    <div v-if="loading" class="loading-overlay">
      <img :src="loadingGif" alt="Loading..." />
    </div>
    <button @click="updateCameraAndTarget1">Portfolio</button>
    <button @click="updateCameraAndTarget2">3D Objects</button>
    <button @click="updateCameraAndTarget3">Recenter</button>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { gsap } from 'gsap';
import ConstantColors from '../constants/constantcolors';
import loadingGif from '../assets/images/loadingGif.gif'; // Ensure the path is correct
const fontUrl = '/assets/fonts/TimesNewRomanCyrBold.json'; // Use absolute path for public assets

// Text properties
const TEXTS = [
  { text: 'Florin Lica', position: { x: 5, y: 0.1, z: 10 }, rotation: { x: Math.PI / 2, y: Math.PI / 1, z: 4.7 }, size: 1 }, // Adjusted size
  { text: '(+34) 632 629 721', position: { x: 5.75, y: 0.1, z: 10 }, rotation: { x: Math.PI / 2, y: Math.PI / 1, z: 4.7 }, size: 0.4 }, // Adjusted size
  { text: 'Florinlica@hotmai.com', position: { x: 6.5, y: 0.1, z: 10 }, rotation: { x: Math.PI / 2, y: Math.PI / 1, z: 4.7 }, size: 0.4 }, // Adjusted size
  { text: "L'armentera, 17472 (Girona), Spain", position: { x: 7.25, y: 0.1, z: 10 }, rotation: { x: Math.PI / 2, y: Math.PI / 1, z: 4.7 }, size: 0.4 } // Adjusted size
];

const TEXT_COLOR = ConstantColors.o.white;
const TEXT_HEIGHT = 0.1;
const TEXT_SCALE = { x: 1, y: 1, z: 0.0001 };
const TEXT_OFFSET_Y = 0.2; // Adjusted line height

let TARGET_COORDINATES = { x: 0, y: 0, z: 0 };
let Target1 = { x: -2, y: 3.6, z: 7.5 }; // Front/Back  -  Up/Down - +Left/-Right
let CamPos1 = { x: 0.5, y: 2, z: 7.5 };
let Target2 = { x: 1.2, y: 3, z: -2 };
let CamPos2 = { x: 3.5, y: 3.3, z: -1.5 };
let Target3 = { x: 6, y: 2, z: 8 }; // Recenter target coordinates
let CamPos3 = { x: 10, y: 8, z: 10 }; // Recenter camera position

const models = [
  '../assets/3dObjects/models/dbl1.glb',
  '../assets/3dObjects/models/dbl2.glb',
  '../assets/3dObjects/models/dbl3.glb',
  '../assets/3dObjects/models/dbl4.glb',
  '../assets/3dObjects/models/dbl5.glb',
  '../assets/3dObjects/models/dbl6.glb',
  '../assets/3dObjects/models/dbl7.glb',
  '../assets/3dObjects/models/dbl8.glb'
];

let currentModelIndex = -1;
let currentModel = null;
let targetHelperVisible = false; // Variable to control the visibility of the target helper

export default {
  data() {
    return {
      loading: true,
      loadingGif,
    };
  },
  mounted() {
    console.log('HelloWorld.vue mounted'); // Log to verify mounting
    this.initThreeJS();
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initThreeJS() {
      const container = this.$refs.sceneContainer;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 2000); // Adjust near and far clipping planes
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = false;
      this.controls.maxPolarAngle = Math.PI / 2;

      const loader = new GLTFLoader();
      loader.load('/assets/3dObjects/cubes_Export_Blend.glb', (gltf) => {
        this.scene.add(gltf.scene);
        this.loading = false;
      }, undefined, (error) => {
        console.error('An error happened while loading the 3D model:', error);
        this.loading = false;
      });

      // Add lights
      RectAreaLightUniformsLib.init();

      const rectLight = new THREE.RectAreaLight(ConstantColors.o.blue, 50, 4.7, 1.2);
      rectLight.position.set(-0.75, 6.05, 7.56);
      rectLight.lookAt(50, 6.05, 7.56);
      this.scene.add(rectLight);

      const rectLight1 = new THREE.RectAreaLight(ConstantColors.o.blue, 300, 1.5, 1.5);
      rectLight1.position.set(1.7, 3, -1.6);
      rectLight1.lookAt(50, 6.5, 26);
      this.scene.add(rectLight1);

      const rectLight2 = new THREE.RectAreaLight(ConstantColors.o.white, 1, 1.5, 1.5);
      rectLight2.position.set(1.78, 3, -1.6);
      rectLight2.lookAt(-50, -4, -33);
      this.scene.add(rectLight2);

      const pointLight = new THREE.PointLight(ConstantColors.o.light, 100, 100);
      pointLight.position.set(6.7, 6, 16.3);
      this.scene.add(pointLight);

      const pointLight1 = new THREE.PointLight(ConstantColors.o.light, 100, 100);
      pointLight1.position.set(3.8, 6, 11.95);
      this.scene.add(pointLight1);

      const rectLight3 = new THREE.RectAreaLight();
      rectLight3.position.set(0, 5, 7.5);
      rectLight3.lookAt(0, 0, 7.5);
      rectLight3.intensity = 10; // Adjust intensity of the po
      rectLight3.width = 1;
      rectLight3.height = 5;
      rectLight3.color.set(ConstantColors.o.white);
      this.scene.add(rectLight3);

      const pointLight3 = new THREE.PointLight(ConstantColors.o.red, 100, 100);
      pointLight3.position.set(-0.5, 9, 5.2);
      this.scene.add(pointLight3);

      // Load font and create text geometry
      const fontLoader = new FontLoader();
      fontLoader.load(fontUrl, (font) => { // Use the correct path for the font
        TEXTS.forEach((item) => {
          const textGeometry = new TextGeometry(item.text, {
            font: font,
            size: item.size,
            height: TEXT_HEIGHT,
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color: TEXT_COLOR });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(item.position.x, item.position.y + TEXT_OFFSET_Y, item.position.z);
          textMesh.scale.set(TEXT_SCALE.x, TEXT_SCALE.y, TEXT_SCALE.z);
          textMesh.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
          this.scene.add(textMesh);

          // Add reflection with lower opacity
          const reflectionGeometry = new TextGeometry(item.text, {
            font: font,
            size: item.size,
            height: TEXT_HEIGHT,
          });
          const reflectionMaterial = new THREE.MeshBasicMaterial({
            color: TEXT_COLOR,
            opacity: 0.2,
            transparent: true,
            depthWrite: false, // Ensure the reflection is rendered properly
            depthTest: false,  // Ensure the reflection is always rendered on top
          });
          const reflectionMesh = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
          reflectionMesh.position.set(item.position.x, item.position.y - TEXT_OFFSET_Y, item.position.z);
          reflectionMesh.scale.set(TEXT_SCALE.x, TEXT_SCALE.y, TEXT_SCALE.z);
          reflectionMesh.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
          this.scene.add(reflectionMesh);
        });
      });

      // add a n arrow pointing up on one side of the button
      const arrowGeometry = new THREE.ConeGeometry(0.1, 0.28, 4.2);
      const arrowMaterial = new THREE.MeshBasicMaterial({ color: ConstantColors.o.light });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      // Rotate on y axis 45 degrees
      arrow.rotation.y = Math.PI / 1.3;
      arrow.position.set(2.22, 3, -2.452 );
      this.scene.add(arrow);

      //add another arrow under this une on the y axis and rotate it 180 degrees
      const arrowGeometry1 = new THREE.ConeGeometry(0.1, 0.28, 4.2);
      const arrowMaterial1 = new THREE.MeshBasicMaterial({ color: ConstantColors.o.light });
      const arrow1 = new THREE.Mesh(arrowGeometry1, arrowMaterial1);
      // Rotate on y axis 45 degrees
      arrow1.rotation.y = Math.PI / 1.6;
      arrow1.rotation.x = Math.PI;
      arrow1.position.set(2.25, 2.5, -2.44 );
      this.scene.add(arrow1);

      arrow1.userData = { direction: 'up' };
      arrow.userData = { direction: 'down' };

      this.arrows = [arrow, arrow1];

      window.addEventListener('click', this.onDocumentMouseDown, false);

      // __________________________

      // Remove the duplicate fontLoader declaration and reuse the existing one
      fontLoader.load(fontUrl, (font) => {
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

        this.scene.add(textMesh);
      });

      fontLoader.load(fontUrl, (font) => {
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

        this.scene.add(textMesh);
      });

      fontLoader.load(fontUrl, (font) => {
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

        this.scene.add(textMesh);
      });

      // _________________________________________________________
      // Add a helper at the target coordinates
      this.targetHelper = new THREE.AxesHelper(5);
      this.targetHelper.position.set(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z);
      this.targetHelper.visible = targetHelperVisible; // Set visibility based on the variable
      this.scene.add(this.targetHelper);

      // Initialize the camera position and lookAt after everything is added to the scene
      this.camera.position.set(10, 10, 20);
      this.camera.lookAt(new THREE.Vector3(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z));

      const animate = () => {
        requestAnimationFrame(animate);
        this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        if (currentModel) {
          currentModel.rotation.y += 0.01; // Spin the model slowly
        }
        this.renderer.render(this.scene, this.camera);
      };

      animate();
    },
    onDocumentMouseDown(event) {
      event.preventDefault();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects(this.arrows);

      if (intersects.length > 0) {
        this.scrollModels({ target: intersects[0].object });
      }
    },
    scrollModels(event) {
      console.log('Arrow clicked:', event.target.userData.direction);
      const direction = event.target.userData.direction;
      if (currentModel) {
        this.scene.remove(currentModel);
      }
      this.loading = true;
      if (direction === 'up') {
        currentModelIndex = (currentModelIndex + 1) % models.length;
      } else {
        currentModelIndex = (currentModelIndex - 1 + models.length) % models.length;
      }
      const loader = new GLTFLoader();
      loader.load(models[currentModelIndex], (gltf) => {
        currentModel = gltf.scene;
        currentModel.position.set(2.1, 2.7, -1.5);
        currentModel.scale.set(0.2, 0.2, 0.2);
        this.scene.add(currentModel);
        this.loading = false;
      });
    },
    updateCameraAndTarget1() {
      this.updateCameraAndTarget(Target1, CamPos1, () => {
        setTimeout(() => {
          this.$router.push({ name: 'HomePage' });
        }, 500); // 0.5 second delay
      });
    },
    updateCameraAndTarget2() {
      this.updateCameraAndTarget(Target2, CamPos2);
    },
    updateCameraAndTarget3() {
      this.updateCameraAndTarget(Target3, CamPos3);
    },
    updateCameraAndTarget(target, camPos, callback) {
      TARGET_COORDINATES = target;
      this.targetHelper.position.set(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z);

      // Update OrbitControls target
      gsap.to(this.controls.target, {
        x: TARGET_COORDINATES.x,
        y: TARGET_COORDINATES.y,
        z: TARGET_COORDINATES.z,
        duration: 2,
        onUpdate: () => {
          this.controls.update();
        },
        onComplete: callback
      });

      // Animate camera position
      gsap.to(this.camera.position, {
        x: camPos.x,
        y: camPos.y,
        z: camPos.z,
        duration: 2,
        onUpdate: () => {
          this.camera.lookAt(new THREE.Vector3(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z));
        }
      });
    },
    navigateToHome() {
      this.$router.push({ name: 'HomePage' });
    },
    onWindowResize() {
      const camera = this.camera;
      const renderer = this.renderer;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
</script>

<style scoped>
html, body, .container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
button {
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 10;
  padding: 15px;
  border-radius: 10px;
  background: #0000FF; /* Replace with the actual color value from ConstantColors.o.blue */
  color: aliceblue;
  font-size: 16px;
  font-weight: bold;
}
button:nth-child(2) {
  left: 100px;
}
button:nth-child(3) {
  left: 210px;
}
button:nth-child(4) {
  left: 335px;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.781); /* Darker filter */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}
.loading-gif {
  z-index: 21;
}

@media (max-width: 768px) {
  html, body, .container {
    height: 100vh;
  }
  button {
    left: 5px;
    top: 10px;
  }
  button:nth-child(2) {
    left: 5px;
    top: 10px;
  }
  button:nth-child(3) {
    left: 5px;
    top: 80px;
  }
  button:nth-child(4) {
    left: 5px;
    top: 150px;
  }
}
</style>