<template>
  <div class="home-container">
    <Header :pageName="$route.name" /> <!-- Pass the current route name as a prop -->
    <h1>Welcome to My Portfolio</h1>
    <div class="thumbnails-container">
      <div class="thumbnail" v-for="section in sections" :key="section.name">
        <img :src="section.image" :alt="section.name" />
        <p>{{ section.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './header.vue';
export default {
  name: 'HomePage',
  components: {
    Header // Register the Header component
  },
  data() {
    return {
      sections: [
        { name: '3D', image: '/assets/images/th3dgif' },
        { name: 'Development', image: '@/assets/images/thdev.gif' },
        { name: 'Photography', image: '@/assets/images/thph.png' },
        { name: 'Video', image: '@/assets/images/thvid.gif' },
        { name: 'Graphic Design', image: '@/assets/images/thgd.png' }
      ]
    };
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.home-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Center vertically */
    align-items: center; /* Center horizontally */
    height: 100vh; /* Full height of the viewport */
}
.thumbnails-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
}
.thumbnail {
  width: 170px;
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
  text-align: center;
  margin: 10px;
}
.thumbnail img {
  width: 100%;
  height: 80%;
  object-fit: cover;
}
.thumbnail p {
  margin: 10px 0 0 0;
  font-size: 16px;
  color: #333;
}
</style>