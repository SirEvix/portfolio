# Code Citations

## License: AGPL_3_0
https://github.com/ClimbAssist/ClimbAssistMobile/tree/3e5e9af70c1e4d41c51ffe4b76d3eb9bae994602/src/components/crag/Model.vue

```javascript
// ...code snippet from the source...
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// ...code snippet from the source...
```

## License: unknown
https://github.com/knewter/bsh/tree/1d1b6792487d312b6f10e33d49b8396f452f9bb8/scripts/views/canvas.js

```javascript
// ...code snippet from the source...
scene = new THREE.Scene();
this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
this.renderer = new THREE.WebGLRenderer();
this.renderer.setSize(window.innerWidth, window.innerHeight);
// ...code snippet from the source...
```
````

This file documents the sources of code snippets used in your project, along with their respective licenses. This helps in maintaining transparency and complying with licensing requirements.
````

### /c:/Users/sirev/Documents/GitHub/portfolio/src/App.vue

Ensure the `App.vue` file imports and uses the `HelloWorld` component.

<file>
```vue
// filepath: /c:/Users/sirev/Documents/GitHub/portfolio/src/App.vue
<template>
  <div id="app">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>