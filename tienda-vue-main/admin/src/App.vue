<template>
  <div id="app">
    <nav>
      <notifications group="foo" />
      <router-view />
    </nav>
  </div>
</template>

<script>
import NavBar from '@/components/TopNav.vue';
import Sidebar from '@/components/Sidebar.vue';

export default {
  components: {
    Sidebar,
    NavBar,
  },
};
</script>

<style scoped>
/* Configuración Global para Fuentes */
#app {
  font-family: 'Arial', 'Helvetica', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh !important;
}

/* Aplicación global de soporte para acentos */
body, h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea {
  font-family: 'Arial', 'Helvetica', sans-serif;
  unicode-bidi: embed;
  direction: ltr;
  font-size: 16px;
  line-height: 1.5;
}

/* Texto con caracteres especiales */
.unicode-text {
  font-family: inherit;
  unicode-bidi: embed;
  direction: ltr;
}

/* Normalización de campos de entrada y textos */
input, textarea {
  font-size: 16px;
  font-family: inherit;
}

</style>
