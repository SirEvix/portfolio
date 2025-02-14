<template>
  <div>
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
/* Add your styles here */
</style>
