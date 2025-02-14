<template>
  <div>
    <Header :pageName="$route.name" />
    <h1>3D Page</h1>
  </div>
</template>

<script>
import Header from './header.vue';
export default {
  name: '3DPage',
  components: {
    Header
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
