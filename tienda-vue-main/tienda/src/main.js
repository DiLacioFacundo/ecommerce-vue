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

// Configuración Global
Vue.prototype.$url = 'http://localhost:4201/api';

// Interceptores de Axios
let isRefreshing = false;
let failedRequestsQueue = [];

axios.interceptors.request.use(
  (config) => {
    const token = store.state.token; // Usa el token directamente desde Vuex
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const response = await axios.post(`${Vue.prototype.$url}/renovar_token`, {}, {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          });

          const newToken = response.data.token;

          // Guardar el nuevo token en Vuex y localStorage
          store.dispatch('saveToken', newToken);

          // Reintentar solicitudes fallidas
          failedRequestsQueue.forEach((cb) => cb(newToken));
          failedRequestsQueue = [];

          // Continuar con la solicitud original
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (err) {
          console.error('Error al renovar el token:', err);
          failedRequestsQueue = [];
          store.dispatch('logout'); // Limpia la sesión
          router.push({ name: 'home' }); // Redirige al login
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // Agregar solicitud a la cola
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

// Plugins
Vue.use(Notifications);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);
Vue.use(VuePaginate);
Vue.use(IconsPlugin);

// Inicializar Auth
store.dispatch('initializeAuth');

// Crear instancia de Vue
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
