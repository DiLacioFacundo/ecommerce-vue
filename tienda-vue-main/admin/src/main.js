// Importaciones globales
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from 'vue-notification';
import VuePaginate from 'vue-paginate'

import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue';
// Bootstrap y BootstrapVue
import 'vue-search-select/dist/VueSearchSelect.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";


// Configuración global
Vue.config.productionTip = false;
Vue.prototype.$url = 'http://localhost:4201/api';
Vue.prototype.$token = localStorage.getItem('token');

// Uso de plugins
Vue.use(Notifications);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);
Vue.use(VuePaginate);
Vue.use(IconsPlugin);

// Creación de la instancia de Vue
new Vue({
  router,
  store,
  render: function (h) {return h(App)},
}).$mount('#app');
