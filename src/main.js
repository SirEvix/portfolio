import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Ensure the router is imported
import './assets/styles/variables.css'; // Import the global CSS file
import '@/assets/styles/global.scss'; // Import the global stylesheet


createApp(App).use(router).mount('#app'); // Ensure the router is used
