<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* When admin mode requires the whole page to scroll, toggle this class on <body> */
body.admin-visible, html.admin-visible, #app.admin-visible {
  height: auto;
  overflow: auto;
}
</style>