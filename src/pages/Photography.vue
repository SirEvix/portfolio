<template>
  <div class="page-container">
    <Header :pageName="$route.name" />
    <h1>Photography Page</h1>
  </div>
</template>

<script>
import Header from './header.vue';
export default {
  name: 'PhotographyPage',
  components: {
    Header
  }
}
</script>

<style scoped>
@import '@/assets/styles/global.scss';
</style>
