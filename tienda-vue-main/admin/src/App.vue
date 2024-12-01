<template>
  <div id="app">
    <nav>
      <!-- <Sidebar/> -->
      <notifications group="foo" />
      <router-view/>
      
    </nav>
  </div>
</template>

<script>
import NavBar from '@/components/TopNav.vue';
import Sidebar from '@/components/Sidebar.vue';
export default {
  components:{
    Sidebar,
    NavBar
  }
}

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh !important;
}

</style>
