<template>
  <div class="lightbox" @click="close">
    <div class="lightbox-content" @click.stop>
      <img :src="require(`@/assets/images/${image.split('/').pop()}`)" alt="Lightbox Image" />
      <button class="close-btn" @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LightboxComponent',
  props: {
    image: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-content {
  position: relative;
  max-width: 60%; 
  max-height: 100vh;
}

.lightbox-content img {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 95vh;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
