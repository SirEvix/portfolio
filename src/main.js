import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueLazyload from 'vue-lazyload';
import './assets/styles/variables.css'; // Import the global CSS file
import '@/assets/styles/global.scss'; // Import the global stylesheet

const app = createApp(App);

app.use(router);
app.use(VueLazyload);

app.mount('#app');
