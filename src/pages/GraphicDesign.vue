<template>
  <div class="page-container">
    <Header :pageName="$route.name" />
    <div class="page-element">
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Magazine</h3>
          <p class="desc">This is a magazine layout that I created for a fictional magazine. I worked on the entire branding for it and I wanted to create something that was visually interesting and engaging, so I decided to use a combination of different fonts and colors. I also included some illustrations and photos to add some visual interest and break up the text. I think the final result turned out really well and I'm really happy with how it looks.</p>
        </div>
        <img class="forgeImage" alt="Magazine Image" src="@/assets/images/gd6.png" @click="openLightbox('@/assets/images/gd6.png')">
      </div>
    </div>
    <div class="page-element">
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Fires de Sant Narcis</h3>
          <p class="desc">This is a project I did for the Fires de Sant Narcis. I was in charge of creating the poster for the event. I wanted to create something that was fun and colorful, so I decided to use bright colors and a playful font. I also included some illustrations of the different activities that would be taking place at the event. I think the final result turned out really well and I'm really happy with how it looks.</p>
        </div>
        <img class="forgeImage" alt="Fires de Sant Narcis Image" src="@/assets/images/gd1.png" @click="openLightbox('@/assets/images/gd1.png')">
      </div>
    </div>
    <div class="page-element">
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Attack On Titan Map</h3>
          <p class="desc">This is a map that I made based on the anime series Attack on Titan. I wanted to create something that was detailed and accurate to the show, so I spent a lot of time researching and planning out the layout of the map. I also included some illustrations of the different locations and landmarks from the show. I think the final result turned out really well and I'm really happy with how it looks.</p>
        </div>
        <img class="forgeImage" alt="Attack On Titan Map Image" src="@/assets/images/gd2.png" @click="openLightbox('@/assets/images/gd2.png')">
      </div>
    </div>
    <div class="page-element">
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Curling</h3>
          <p class="desc">For this project we were tasked with describing a sport with a poster. I chose curling because it is a sport that is not very well known and I thought it would be interesting to learn more about it. I decided to use a simple and clean design for the poster, with a focus on the equipment used in the sport. I also included some information about the rules and history of curling. I think the final result turned out really well and I'm really happy with how it looks.</p>
        </div>
        <img class="forgeImage" alt="Curling Image" src="@/assets/images/gd3.png" @click="openLightbox('@/assets/images/gd3.png')">
      </div>
    </div>
    <div class="page-element">
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Self Illustrated Portrait</h3>
          <p class="desc">This is a self-portrait that I created using a combination of photography and illustration. I wanted to create something that was unique and personal to me, so I decided to use a photo of myself as the base and then vectorize it. I also included a shape as the background to add some visual interest, and one element from the photo that I wanted to highlight in another color.</p>
        </div>
        <img class="forgeImage" alt="Self Illustrated Portrait Image" src="@/assets/images/gd4.png" @click="openLightbox('@/assets/images/gd4.png')">
      </div>
    </div>
    <div class="page-element">
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Abstract Shapes</h3>
          <p class="desc">This is a project I did where I had to create a series of abstract shapes. I wanted to create something that was visually interesting and dynamic, so I decided to use a combination of different colors. I also played around with the placement and size of the shapes to create a sense of movement and depth.</p>
        </div>
        <img class="forgeImage" alt="Abstract Shapes Image" src="@/assets/images/thgd.png" @click="openLightbox('@/assets/images/thgd.png')">
      </div>
    </div>
    <div class="page-element">
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Vanguard Entertainment</h3>
          <p class="desc">This is a project I did for Vanguard Entertainment (fictional company). I was charged with creating a poster with the phrase "Music feeds the soul." I wanted to create something that was visually interesting and engaging, so I decided to use a combination of different fonts and colors. I also included some illustrations and photos to add some visual interest and break up the text. Played with the composition and the placement of the elements to create a sense of meaning to the phrase and to make it visually appealing. And this is the final result.</p>
        </div>
        <img class="forgeImage" alt="Vanguard Entertainment Image" src="@/assets/images/gd7.png" @click="openLightbox('@/assets/images/gd7.png')">
      </div>
    </div>
    <LightboxComponent v-if="lightboxVisible" :image="lightboxImage" @close="closeLightbox" />
  </div>
</template>

<script>
import Header from './header.vue';
import LightboxComponent from '@/components/Lightbox.vue';

export default {
  name: 'GraphicDesignPage',
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

<style scoped lang="scss">
@import '../assets/styles/global.scss';
.forgeImage {
  height: 80vh;
  margin-top: 20px;
  align-self: center;
  cursor: pointer;
}
.desc {
  margin-top: 10px;
}
</style>
