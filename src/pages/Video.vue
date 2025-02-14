<template>
  <div class="page-container">
        <Header :pageName="$route.name" />
    <h1>Video Page</h1>
  </div>
</template>

<script>
import Header from './header.vue';
export default {
  name: 'VideoPage',
  components: {
    Header
  }
}
</script>

<style scoped>
@import '@/assets/styles/global.scss';
</style>
