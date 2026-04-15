<script setup>
import MenuTop from './components/pages/layout/MenuTop.vue'
import Footer from './components/pages/layout/Footer.vue'
</script>

<template>
  <div class="app">
    <MenuTop />

    <div class="app-body">
      <router-view />
    </div>

    <Footer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

 
.app-body {
  flex: 1;
  width: 100%;
  padding-top: 70px;  
  box-sizing: border-box;
}
</style>