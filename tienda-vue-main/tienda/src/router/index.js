import Vue from 'vue'; // Import Vue
import VueRouter from 'vue-router'; // Import VueRouter
import HomeView from '../views/HomeView.vue'; // Import your views
import jwtDecode from "jwt-decode";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/login', name: 'login', component: () => import('@/views/LoginApp.vue')  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/productos/IndexProductoApp.vue'),
    props: (route) => ({ query: route.query })
  },
  { path: '/cart', name: 'cart', component: () => import('@/views/compras/CarritoView.vue') },
  { path: '/productos/:slug', name: 'show-productos', component: () => import('@/views/productos/ShowProductoApp.vue'), props: true },
  { path: '/cuenta/direcciones', name: 'direcciones', component: () => import('@/views/compras/CarritoView.vue') },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/compras/CheckoutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/success",
    name: "Success",
    component: () => import("@/views/compras/ConfirmacionCompra.vue"),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue')
  },
  { path: '/contact', name: 'contact', component: () => import('@/views/Contact.vue') },
  { path: '/categories', name: 'categories', component: () => import('@/views/CategoriesView.vue') }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Middleware de autenticación en el frontend
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (!token) {
      return next({ name: 'login' }); // Redirige al login si no hay token
    }

    try {
      const decodedToken = jwtDecode(token); // Decodifica el token
      console.log('Token decodificado:', decodedToken);

      if (decodedToken.exp * 1000 <= Date.now()) {
        // Si el token ha expirado, elimínalo y redirige al login
        localStorage.removeItem('token');
        return next({ name: 'login' });
      }

      // Guarda el usuario en Vuex si no está presente
      if (!router.app.$store.getters.currentUser) {
        router.app.$store.dispatch('decodeAndSaveToken', token);
      }

      return next();
    } catch (error) {
      console.error('Error en el token:', error);
      localStorage.removeItem('token');
      return next({ name: 'login' });
    }
  }

  if (to.name === 'login' && token) {
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 > Date.now()) {
        return next({ name: 'home' }); // Redirige al home si el usuario ya está logueado
      }
      localStorage.removeItem('token');
    } catch (error) {
      localStorage.removeItem('token');
    }
  }

  next();
});


export default router;
