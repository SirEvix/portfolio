<template>
  <div class="container">
    <div ref="sceneContainer"></div>
    <button @click="updateCameraAndTarget">Update Camera and Target</button>
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

let TARGET_COORDINATES = { x: 0, y: 0, z: 0 };
let Target1 = { x: 0, y: 4, z: 7.5 }; // Front/Back  -  Up/Down - +Left/-Right
let CamPos1 = { x: 15, y: 7, z: 7.5 };

export default {
  mounted() {
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
      const scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = false;
      this.controls.maxPolarAngle = Math.PI / 2;

      const loader = new GLTFLoader();
      loader.load('/assets/3dObjects/cubes_Export_Blend.glb', function (gltf) {
        scene.add(gltf.scene);
      }, undefined, function (error) {
        console.error('An error happened while loading the 3D model:', error);
      });

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

      // Load font and create text geometry
      const fontLoader = new FontLoader();
      fontLoader.load('/assets/fonts/Times New Roman Cyr_Regular.json', function (font) {
        const texts = [
          { text: 'Florin Lica', position: { x: 5, y: 0.1, z: 10 } },
          { text: '(+34) 632 629 721', position: { x: 7, y: 0.1, z: 10 } },
          { text: 'Florinlica@hotmai.com', position: { x: 9, y: 0.1, z: 10 } },
          { text: "L'armentera, 17472 (Girona), Spain", position: { x: 11, y: 0.1, z: 10 } }
        ];

        texts.forEach((item) => {
          const textGeometry = new TextGeometry(item.text, {
            font: font,
            size: 1,
            height: 0.1,
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(item.position.x, item.position.y + 0.5, item.position.z);
          textMesh.scale.set(1, 1, 0.0001);
          textMesh.rotation.set(Math.PI / 2, Math.PI / 1, 4.7);
          scene.add(textMesh);

          // Add reflection
          const reflectionGeometry = new TextGeometry(item.text, {
            font: font,
            size: 1,
            height: 0.1,
          });
          const reflectionMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
          const reflectionMesh = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
          reflectionMesh.position.set(item.position.x, item.position.y, item.position.z);
          reflectionMesh.scale.set(1, 1, 0.0001);
          reflectionMesh.rotation.set(Math.PI / 2, Math.PI / 1, 4.7);
          scene.add(reflectionMesh);
        });
      });

      // Add a helper at the target coordinates
      this.targetHelper = new THREE.AxesHelper(5);
      this.targetHelper.position.set(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z);
      scene.add(this.targetHelper);

      // Initialize the camera position and lookAt after everything is added to the scene
      this.camera.position.set(10, 10, 20);
      this.camera.lookAt(new THREE.Vector3(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z));

      const animate = () => {
        requestAnimationFrame(animate);
        this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        this.renderer.render(scene, this.camera);
      };

      animate();
    },
    updateCameraAndTarget() {
      TARGET_COORDINATES = Target1;
      this.targetHelper.position.set(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z);

      // Update OrbitControls target
      gsap.to(this.controls.target, {
        x: TARGET_COORDINATES.x,
        y: TARGET_COORDINATES.y,
        z: TARGET_COORDINATES.z,
        duration: 2,
        onUpdate: () => {
          this.controls.update();
        }
      });

      // Animate camera position
      gsap.to(this.camera.position, {
        x: CamPos1.x,
        y: CamPos1.y,
        z: CamPos1.z,
        duration: 2,
        onUpdate: () => {
          this.camera.lookAt(new THREE.Vector3(TARGET_COORDINATES.x, TARGET_COORDINATES.y, TARGET_COORDINATES.z));
        }
      });
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
  top: 10px;
  left: 10px;
  z-index: 10;
}
</style>