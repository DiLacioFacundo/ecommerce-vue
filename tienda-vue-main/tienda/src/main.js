import { createApp } from 'vue';  // Importar la función createApp desde Vue 3
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)  
  .use(router)   
  .use(store)   
  .mount('#app'); 
