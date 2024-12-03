import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from 'vue-notification';
import VuePaginate from 'vue-paginate';
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue';
import 'vue-search-select/dist/VueSearchSelect.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

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

new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount('#app');
