import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/home.vue';
import HelloWorld from '../components/HelloWorld.vue';
import ThreeDPage from '@/pages/3D.vue';
import DevelopmentPage from '@/pages/Development.vue';
import PhotographyPage from '@/pages/Photography.vue';
import VideoPage from '@/pages/Video.vue';
import GraphicDesignPage from '@/pages/GraphicDesign.vue';

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/3D',
    name: '3D',
    component: ThreeDPage
  },
  {
    path: '/development',
    name: 'Development',
    component: DevelopmentPage
  },
  {
    path: '/photography',
    name: 'Photography',
    component: PhotographyPage
  },
  {
    path: '/video',
    name: 'Video',
    component: VideoPage
  },
  {
    path: '/graphic-design',
    name: 'GraphicDesign',
    component: GraphicDesignPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
