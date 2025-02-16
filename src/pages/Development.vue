<template>
  <div class="page-container">
    <Header :pageName="$route.name" />
    <div class="page-element">
      <h2 class="titles">Itineraris app</h2>
      <div class="boxContainer">
        <div class="infoBox">
          <h3 class="subtitle">Description</h3>
          <p class="desc">For this project, we worked as a team of three. My colleagues focused on the design aspect, using Figma to create the visual elements and user interface. I was responsible for all the programming, utilizing React Native and JavaScript to bring our designs to life. You can check out their work and follow them on Instagram: Colleague 1's Instagram and Colleague 2's Instagram. It was a collaborative effort that combined our strengths to produce a seamless and visually appealing app.</p>
        </div>
        <div class="infoBox">
          <h3 class="subtitle">Objective</h3>
          <p class="desc">The project is focused on people who have traveled or want to travel. Within the application, users have two functions: those who have already traveled, have created their own itinerary and want to share it with others, and those who want to travel but don't know or are unsure of which itinerary to follow. These users will be able to browse the application in search of the itinerary that best suits their trip.</p>
        </div>
        <div class="infoBox">
          <h3 class="subtitle">Functionality</h3>
          <p class="desc">Most itineraries will be created by other users who have already done it, but some, especially in the most famous cities, will be pre-determined and created by the application creators (us). Within these itineraries, the duration, approximate price, and the time of year to do the route will be specified. Users, in addition to listing the places they have visited, can add extra comments, such as which bus to take to go to X place from the train station, the best time to visit X place, etc. All user-created itineraries will be visible, but the more likes (given by users who have followed the route) an itinerary has, the higher it will appear. Additionally, users can comment on their experiences.</p>
        </div>
      </div>
      <h3 class="subtitle">Branding</h3>
      <img class="brandingImage" src="@/assets/images/dev1.png" alt="Branding Image">
      <div class="galleryContainer">
        <img class="brandingImage1" src="@/assets/images/dev7.png" alt="Branding Image 7">
        <img class="brandingImage2" src="@/assets/images/dev8.png" alt="Branding Image 8">
        <img class="brandingImage3" src="@/assets/images/dev9.png" alt="Branding Image 9">
      </div>
      <h2 class="titles">Components</h2>
      <img class="brandingImage" src="@/assets/images/dev2.png" alt="Branding Image 2">
    </div>
    <div class="page-element">
      <h3 class="subtitle">Overview</h3>
      <div class="boxContainer">
        <p class="desc">Building on our established design system, I developed the Itinerary App using React Native, with a strong focus on modularity and dynamic user experience. Here are some of the core technical achievements:</p>
        <p class="desc">Below are screenshots that illustrate the key elements of this development process—from context management and dynamic navigation to the interactive itinerary creation and native integrations.</p>
      </div>
      <div class="boxContainer2">
        <div class="infoBox2">
          <h3 class="subtitle">Context-Driven Data Management</h3>
          <p class="desc2">I created dedicated context folders (e.g., User Context and Itinerary Context) that ensure seamless data flow across the app. For instance, when a user updates their profile settings—such as setting a username or capturing a profile picture via the device’s camera—these changes instantly reflect across all relevant pages, from profile displays to itinerary creation.</p>
        </div>
        <div class="infoBox2">
          <h3 class="subtitle">Adaptive Navigation Components</h3>
          <p class="desc2">I built custom header and footer components that adjust based on the current page. The header intelligently switches between a back arrow or a home icon and even displays secondary navigation when needed. Similarly, the footer highlights the active page by darkening the corresponding button, ensuring a smooth, intuitive navigation experience.</p>
        </div>
        <div class="infoBox2">
          <h3 class="subtitle">Interactive Itinerary Creation</h3>
          <p class="desc2">The itinerary creation flow is designed for user-friendliness and flexibility:</p>
          <ul class="bulletpoints">
            <li>Users can add or remove itinerary days and places dynamically.</li>
            <li>A simple interface allows users to input titles, select cost and intensity levels from predefined options, and add descriptive tags.</li>
            <li>As users progress, the app guides them through each day’s itinerary—letting them add detailed information (title and description for each place), with the option to delete or add entries on the fly.</li>
            <li>Once published, itineraries appear on the “My Itineraries” page, where each day’s content is collapsible for a clean overview. Detailed views include official descriptions (for notable locations), user comments, and ratings, all designed to foster a community-driven review system.</li>
          </ul>
        </div>
        <div class="infoBox2">
          <h3 class="subtitle">Native Device Integration</h3>
          <p class="desc2">Beyond standard UI elements, I integrated native device capabilities. For example, a dedicated button in the profile settings opens the device’s camera, allowing users to capture and instantly update their profile avatar—enhancing personalization within the app.</p>
        </div>
        <div class="infoBox2">
          <h3 class="subtitle">Clean, Reusable Code Architecture</h3>
          <p class="desc2">Using a component-based approach, I ensured that every part of the app—from the itinerary blocks to the dynamic navigation elements—is built to be reusable and easy to maintain. This strategy not only speeds up development but also lays the groundwork for future feature enhancements.</p>
        </div>
      </div>
      <div class="galleryContainer2">
        <img class="brandingImage2" src="@/assets/images/dev3.gif" alt="Development GIF 3">
        <img class="brandingImage2" src="@/assets/images/dev4.gif" alt="Development GIF 4">
        <img class="brandingImage2" src="@/assets/images/dev5.gif" alt="Development GIF 5">
        <img class="brandingImage2" src="@/assets/images/dev6.gif" alt="Development GIF 6">
      </div>
    </div>
  </div>
</template>

<script>
import Header from './header.vue';
export default {
  name: 'DevelopmentPage',
  components: {
    Header
  }
}
</script>

<style scoped lang="scss">
@import '../assets/styles/global.scss';

.brandingImage {
  width: 100%;
  height: auto;
  margin: 10px 0;
}

.brandingImage1,
.brandingImage2,
.brandingImage3 {
  width: auto;
  height: auto;
  margin: 200px 0;
}

.galleryContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.galleryContainer2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.brandingImage2 {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 300px;
  margin: 10px;
}

.infoBox {
  align-self: flex-start;
}

.infoBox2 {
  align-self: flex-start;
  margin-bottom: 20px; /* Add gap between infoBoxes */
  margin-top: 60px;
  width: 300px; /* Make the infoBoxes smaller in width */
  max-width: 300px; /* Ensure they are contained within the element width */
}

.infoBox2 .subtitle {
  width: 100%; /* Ensure subtitles take the full width of the infoBox */
}

.desc2 {
  width: 100%; /* Ensure descriptions take the full width of the infoBox */
}

.bulletpoints {
  padding-left: 20px;
}

.boxContainer2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row; /* Ensure infoBoxes are in the same row */
  flex-wrap: wrap; /* Allow wrapping if necessary */
  width: 100%;
}

@media (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .titles {
    font-size: 1.5em;
  }

  .boxContainer, .boxContainer2 {
    flex-direction: column;
    align-items: center;
  }

  .infoBox, .infoBox2 {
    width: 100%;
    margin-bottom: 20px;
  }

  .brandingImage, .brandingImage1, .brandingImage2, .brandingImage3 {
    width: 100%;
    height: auto;
  }

  .desc, .desc2 {
    width: 100%;
    font-size: 14px;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .galleryContainer, .galleryContainer2 {
    flex-direction: column;
    align-items: center;
  }

  .galleryContainer2 .brandingImage2 {
    width: 100%;
    height: 100vh;
    object-fit: contain;
  }
}
</style>
