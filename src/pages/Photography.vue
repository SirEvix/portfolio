<template>
  <div class="page-container">
    <Header :pageName="$route.name" />
    <h1>Photography Page</h1>
    <div class="page-element">
      <div class="textContainer">
        <h2 class="titles">Night Photography</h2>
        <p class="desc">This is a collection of night photographs that I took in various locations. I wanted to capture the beauty of the night sky and the way it interacts with the urban landscape.</p>
      </div>
      <div class="galleryContainer">
        <img class="photoImage" src="@/assets/images/ph1.jpg" @click="openLightbox('@/assets/images/ph1.jpg')" alt="Night Photo 1">
        <img class="photoImage" src="@/assets/images/thph.jpg" @click="openLightbox('@/assets/images/thph.jpg')" alt="Night Photo 2">
        <img class="photoImage" src="@/assets/images/ph3.jpg" @click="openLightbox('@/assets/images/ph3.jpg')" alt="Night Photo 3">
        <img class="photoImage" src="@/assets/images/ph4.jpg" @click="openLightbox('@/assets/images/ph4.jpg')" alt="Night Photo 4">
        <img class="photoImage" src="@/assets/images/ph5.jpg" @click="openLightbox('@/assets/images/ph5.jpg')" alt="Night Photo 5">
        <img class="photoImage" src="@/assets/images/ph6.jpg" @click="openLightbox('@/assets/images/ph6.jpg')" alt="Night Photo 6">
        <img class="photoImage" src="@/assets/images/ph7.jpg" @click="openLightbox('@/assets/images/ph7.jpg')" alt="Night Photo 7">
        <img class="photoImage" src="@/assets/images/ph9.jpg" @click="openLightbox('@/assets/images/ph9.jpg')" alt="Night Photo 9">
        <img class="photoImage" src="@/assets/images/ph10.jpg" @click="openLightbox('@/assets/images/ph10.jpg')" alt="Night Photo 10">
        <img class="photoImage" src="@/assets/images/ph8.jpg" @click="openLightbox('@/assets/images/ph8.jpg')" alt="Night Photo 8">
      </div>
    </div>
    <div class="page-element">
      <div class="textContainer">
        <h2 class="titles">Urban and Landscape Photography</h2>
        <p class="desc">This is a collection of urban and landscape photographs that I took during my travels. I wanted to capture the essence of each location and the unique beauty it has to offer.</p>
      </div>
      <div class="galleryContainer">
        <img class="photoImage" src="@/assets/images/ul3.JPG" @click="openLightbox('@/assets/images/ul3.JPG')" alt="Urban Landscape Photo 3">
        <img class="photoImage" src="@/assets/images/ul12.JPG" @click="openLightbox('@/assets/images/ul12.JPG')" alt="Urban Landscape Photo 12">
        <img class="photoImage" src="@/assets/images/ul10.JPG" @click="openLightbox('@/assets/images/ul10.JPG')" alt="Urban Landscape Photo 10">
        <img class="photoImage" src="@/assets/images/ul1.JPG" @click="openLightbox('@/assets/images/ul1.JPG')" alt="Urban Landscape Photo 1">
        <img class="photoImage" src="@/assets/images/ul2.JPG" @click="openLightbox('@/assets/images/ul2.JPG')" alt="Urban Landscape Photo 2">
        <img class="photoImage" src="@/assets/images/ul4.JPG" @click="openLightbox('@/assets/images/ul4.JPG')" alt="Urban Landscape Photo 4">
        <img class="photoImage" src="@/assets/images/ul5.JPG" @click="openLightbox('@/assets/images/ul5.JPG')" alt="Urban Landscape Photo 5">
        <img class="photoImage" src="@/assets/images/ul6.JPG" @click="openLightbox('@/assets/images/ul6.JPG')" alt="Urban Landscape Photo 6">
        <img class="photoImage" src="@/assets/images/ul7.JPG" @click="openLightbox('@/assets/images/ul7.JPG')" alt="Urban Landscape Photo 7">
        <img class="photoImage" src="@/assets/images/ul8.JPG" @click="openLightbox('@/assets/images/ul8.JPG')" alt="Urban Landscape Photo 8">
        <img class="photoImage" src="@/assets/images/ul9.JPG" @click="openLightbox('@/assets/images/ul9.JPG')" alt="Urban Landscape Photo 9">
        <img class="photoImage" src="@/assets/images/ul11.JPG" @click="openLightbox('@/assets/images/ul11.JPG')" alt="Urban Landscape Photo 11">
        <img class="photoImage" src="@/assets/images/ul13.JPG" @click="openLightbox('@/assets/images/ul13.JPG')" alt="Urban Landscape Photo 13">
        <img class="photoImage" src="@/assets/images/ul14.JPG" @click="openLightbox('@/assets/images/ul14.JPG')" alt="Urban Landscape Photo 14">
        <img class="photoImage" src="@/assets/images/ul15.JPG" @click="openLightbox('@/assets/images/ul15.JPG')" alt="Urban Landscape Photo 15">
        <img class="photoImage" src="@/assets/images/ul16.JPG" @click="openLightbox('@/assets/images/ul16.JPG')" alt="Urban Landscape Photo 16">
        <img class="photoImage" src="@/assets/images/ul17.JPG" @click="openLightbox('@/assets/images/ul17.JPG')" alt="Urban Landscape Photo 17">
      </div>
    </div>
    <LightboxComponent v-if="lightboxVisible" :image="lightboxImage" @close="closeLightbox" />
  </div>
</template>

<script>
import Header from './header.vue';
import LightboxComponent from '@/components/Lightbox.vue';

export default {
  name: 'PhotographyPage',
  components: {
    Header,
    LightboxComponent
  },
  data() {
    return {
      lightboxVisible: false,
      lightboxImage: ''
    };
  },
  methods: {
    openLightbox(image) {
      this.lightboxImage = image;
      this.lightboxVisible = true;
    },
    closeLightbox() {
      this.lightboxVisible = false;
      this.lightboxImage = '';
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/global.scss';
.photoImage {
  width: 100%;
  height: auto;
  cursor: pointer;
}
.textContainer {
  flex: 1;
  padding-right: 20px;
}
.galleryContainer {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.page-element {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
</style>
