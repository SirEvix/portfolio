import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueLazyload from 'vue-lazyload';
import './assets/styles/variables.css'; // Import the global CSS file
import '@/assets/styles/global.scss'; // Import the global stylesheet

// Set favicon to project logo (imported so webpack resolves the hashed URL)
import logo from '@/assets/images/logo.png';

const app = createApp(App);

app.use(router);
app.use(VueLazyload);

// Ensure a favicon link exists and set it to the imported logo
try {
	const head = document.getElementsByTagName('head')[0];
	let link = head.querySelector("link[rel*='icon']");
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		head.appendChild(link);
	}
	link.type = 'image/png';
	link.href = logo;
} catch (e) {
	// ignore DOM errors during server-side rendering or non-browser environments
	// small failure is non-critical for app runtime
}

app.mount('#app');
