<template>
  <div>
    <header class="home-header" @mouseover="showButtons = true" @mouseleave="showButtons = false">
      <div class="buttons-left" v-if="showButtons">
        <button @click="navigateTo('3D')">3D</button>
        <button @click="navigateTo('Development')">Development</button>
        <button @click="navigateTo('Photography')">Photography</button>
      </div>
      <div class="center-content">
        <img class="logo" alt="logo" src="@/assets/images/logo.png">
        <h1>{{ pageName }}</h1> <!-- Display the current page name -->
      </div>
      <div class="buttons-right" v-if="showButtons">
        <button @click="navigateTo('Video')">Video</button>
        <button @click="navigateTo('GraphicDesign')">Graphic Design</button>
        <button @click="goBack">Back</button>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MainHeader',
  props: {
    pageName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showButtons: false
    };
  },
  methods: {
    navigateTo(page) {
      this.$router.push({ name: page });
    },
    goBack() {
      if (this.$route.name === 'HomePage') {
        this.$router.push({ name: 'HelloWorld' });
      } else {
        this.$router.push({ name: 'HomePage' });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log(`_Layout says - route: ${to.path}`);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    console.log(`_Layout says - route: ${to.path}`);
    next();
  }
}
</script>

<style lang="scss" scoped>
.home-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gray);
  color: white;
  padding: 10px;
  width: 300px;
  height: 60px;
  border-radius: 10px;
  position: relative;
  transition: all 0.8s ease;
  &:hover {
    width: 900px;
  }
}
.center-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
.buttons-left, .buttons-right {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.buttons-left {
  left: 10px;
}
.buttons-right {
  right: 10px;
}
.buttons-left button, .buttons-right button {
  margin: 10px;
  border-radius: 10px;
  padding: 10px;
  background-color: var(--gray);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
  &:hover {
    background-color: var(--darkgray);
    transition: all 0.6s ease;
  }
}
</style>
