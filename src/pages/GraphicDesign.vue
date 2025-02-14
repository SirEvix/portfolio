<template>
  <div class="page-container">
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

<style scoped lang="scss">
@import '../assets/styles/global.scss';

</style>
