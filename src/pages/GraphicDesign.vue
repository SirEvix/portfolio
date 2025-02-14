<template>
  <div>
    <Header :pageName="$route.name" />
    <h1>Graphic Design Page</h1>
  </div>
</template>

<script>
import Header from './header.vue';
export default {
  name: 'GraphicDesignPage',
  components: {
    Header
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
