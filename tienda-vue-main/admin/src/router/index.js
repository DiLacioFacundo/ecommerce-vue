import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store'; // Asegúrate de importar el store
import { jwtDecode } from 'jwt-decode';

import LoginApp from '../views/LoginApp.vue';
import CreateColaboradorApp from '../views/colaboradores/CreateColaboradorApp.vue';
import IndexColaboradorApp from '../views/colaboradores/IndexColaboradorApp.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'login', component: LoginApp, meta: { requiresAuth: false } },
  { path: '/colaborador', name: 'colaborador-index', component: IndexColaboradorApp, meta: { requiresAuth: true } },
  { path: '/colaborador/create', name: 'colaborador-create', component: CreateColaboradorApp, meta: { requiresAuth: true } },
  { path: '/colaborador/edit/:id', name: 'colaborador-edit', component: () => import('@/views/colaboradores/EditColaboradorApp.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardApp.vue'), meta: { requiresAuth: true } },

  // Productos
  { path: '/producto', name: 'producto-index', component: () => import('@/views/productos/IndexProductoApp.vue'), meta: { requiresAuth: true } },
  { path: '/producto/create', name: 'producto-create', component: () => import('@/views/productos/CreateProductoApp.vue'), meta: { requiresAuth: true } },
  { path: '/producto/edit/:id', name: 'producto-edit', component: () => import('@/views/productos/EditProductoApp.vue'), meta: { requiresAuth: true } },
  { path: '/producto/galeria/:id', name: 'producto-galeria', component: () => import('@/views/productos/GaleriaProductoApp.vue'), meta: { requiresAuth: true } },

  // Ingresos
  { path: '/ingreso/create', name: 'ingreso-create', component: () => import('@/views/ingreso/CreateIngresoApp.vue'), meta: { requiresAuth: true } },
  { path: '/ingreso', name: 'ingreso-index', component: () => import('@/views/ingreso/IndexIngresoApp.vue'), meta: { requiresAuth: true } },
  { path: '/ingreso/:id', name: 'ingreso-detalle', component: () => import('@/views/ingreso/DetalleIngresoApp.vue'), meta: { requiresAuth: true } },

  // Ventas
  { path: '/ventas', name: 'ventas-index', component: () => import('@/views/ventas/VentasIndexApp.vue'), meta: { requiresAuth: true } },
  { path: '/ventas/:id', name: 'ventas-detalle', component: () => import('@/views/ventas/VentasDetalleApp.vue'), meta: { requiresAuth: true } },

  // Categorías
  { path: '/categorias', name: 'categorias', component: () => import('@/views/categorias/IndexCategoriaApp.vue'), meta: { requiresAuth: true } },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes, // Pasamos 'routes', no 'api'
});

// Middleware global antes de cada ruta
router.beforeEach((to, from, next) => {
  const token = store.state.token; // Obtén el token del estado

  // Verifica si la ruta requiere autenticación
  if (to.matched.some(item => item.meta.requiresAuth)) {
    if (!token) {
      // No hay token, redirige al login
      return next({ name: 'login' });
    }

    try {
      const decodedToken = jwtDecode(token); // Decodifica el token

      // Si el token ha expirado, redirige al login
      if (decodedToken.exp * 1000 <= Date.now()) {
        store.commit('setToken', null); // Limpia el token en el store
        localStorage.removeItem('token'); // Limpia el token en localStorage
        return next({ name: 'login' });
      }
    } catch (error) {
      console.error('Error decodificando el token:', error.message);
      store.commit('setToken', null); // Limpia el token en el store
      localStorage.removeItem('token'); // Limpia el token en localStorage
      return next({ name: 'login' });
    }

    // Token válido, continúa a la ruta
    return next();
  }

  // Si el usuario está autenticado y trata de ir al login, redirige al dashboard
  if (to.name === 'login' && token) {
    return next({ name: 'dashboard' });
  }

  // Ruta pública, continúa
  return next();
});


export default router;
