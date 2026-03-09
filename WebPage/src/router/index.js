import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/home.vue';
import HelloWorld from '../components/HelloWorld.vue';
import ThreeDPage from '@/pages/3D.vue';
import DevelopmentPage from '@/pages/Development.vue';
import PhotographyPage from '@/pages/Photography.vue';
import VideoPage from '@/pages/Video.vue';
import GraphicDesignPage from '@/pages/GraphicDesign.vue';
import TheVaultPage from '@/pages/TheVault.vue';
import CursedRelicsPage from '@/pages/cursed-relics.vue';

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
,
  {
    path: '/the-vault',
    name: 'TheVault',
    component: TheVaultPage
  },
  {
    path: '/cursed-relics',
    name: 'CursedRelics',
    component: CursedRelicsPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
