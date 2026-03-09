<template>
  <div class="page-container">
    <Header :pageName="$route.name" />
    <div class="page-element">
      <h2 class="titles">The Vault</h2>
      <p class="desc">A secure place for limited collectibles — press an item to view details.</p>
      <div class="boxContainer">
        <button class="vault-btn" @click="goToCursedRelics">Cursed Relics</button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './header.vue';
export default {
  name: 'TheVault',
  components: { Header },
  methods: {
    goToCursedRelics() {
      this.$router.push('/cursed-relics');
    }
  }
}
</script>

<style scoped lang="scss">
@use '../assets/styles/global.scss' as *;

.vault-btn {
  background-color: var(--Primary, #3897f0);
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
}

.boxContainer {
  margin-top: 20px;
}
</style>
<!-- Image credits:

https://tenor.com/view/itadori-finger-gif-25596116
https://es.pinterest.com/pin/967992513657734958/
https://es.pinterest.com/pin/215609900900232441/ -->