import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from 'vue-notification';
import VuePaginate from 'vue-paginate';
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue';
import axios from 'axios';
import 'vue-search-select/dist/VueSearchSelect.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Configuración global
Vue.config.productionTip = false;
Vue.prototype.$url = 'http://localhost:4201/api'; // Base URL para las solicitudes API
Vue.prototype.$token = localStorage.getItem('token'); // Token inicial

// Configuración de Axios: Interceptor para manejar tokens expirados
axios.interceptors.response.use(
  response => {
    // Si la respuesta es exitosa, simplemente devuélvela
    return response;
  },
  async error => {
    if (error.response && error.response.status === 401) {
      console.warn('Token expirado. Intentando renovar...');
      try {
        const response = await axios.post(`${Vue.prototype.$url}/renovar_token`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Token actual para renovar
          }
        });

        // Guardar el nuevo token en localStorage y actualizar Vue.prototype
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        Vue.prototype.$token = newToken;

        console.log('Token renovado:', newToken);

        // Reintentar la solicitud original con el nuevo token
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(error.config);

      } catch (tokenError) {
        console.error('Error al renovar el token:', tokenError);
        // Redirigir al login si no se pudo renovar
        router.push({ name: 'login' });
        return Promise.reject(tokenError);
      }
    }
    return Promise.reject(error);
  }
);

// Uso de plugins
Vue.use(Notifications);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);
Vue.use(VuePaginate);
Vue.use(IconsPlugin);

// Crear instancia de Vue
new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount('#app');
