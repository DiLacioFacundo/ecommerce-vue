import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from 'vue-notification';
import VuePaginate from 'vue-paginate';
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue';
import axios from 'axios';
import 'vue-search-select/dist/VueSearchSelect.css';

import './styles.css';

Vue.config.productionTip = false;
Vue.prototype.$url = 'http://localhost:4201/api';
Vue.prototype.$token = localStorage.getItem('token');

let isRefreshing = false; // Variable para evitar múltiples solicitudes de renovación
let failedRequestsQueue = []; // Cola para reintentar solicitudes

// Configuración de Axios
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Token expirado, intentamos renovarlo
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const response = await axios.post(`${Vue.prototype.$url}/renovar_token`, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          const newToken = response.data.token;
          console.log('Token renovado exitosamente:', newToken);

          // Guardar el nuevo token
          localStorage.setItem('token', newToken);
          Vue.prototype.$token = newToken;

          // Reintentar todas las solicitudes fallidas
          failedRequestsQueue.forEach((cb) => cb(newToken));
          failedRequestsQueue = [];

          // Continuar con la solicitud original
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (err) {
          console.error('Error al renovar el token:', err);
          failedRequestsQueue = [];
          localStorage.removeItem('token');
          router.push({ name: 'home' }); // Redirigir al login
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // Agregar la solicitud actual a la cola mientras se renueva el token
      return new Promise((resolve) => {
        failedRequestsQueue.push((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(axios(originalRequest));
        });
      });
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
  render: (h) => h(App),
}).$mount('#app');
