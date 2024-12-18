import Vue from 'vue'; // Import Vue
import VueRouter from 'vue-router'; // Import VueRouter
import HomeView from '../views/HomeView.vue'; // Import your views
import * as jwtDecode from "jwt-decode";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/login', name: 'login', component: () => import('@/views/LoginApp.vue') },
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
    component: () => import('@/views/compras/CheckoutView.vue')  },
  {
    path: "/success",
    name: "Success",
    component: () => import("@/views/compras/ConfirmacionCompra.vue"),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
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
  const token = localStorage.getItem("token");

  // Si la ruta requiere autenticación
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (!token) {
      // Redirige al login si no hay token
      return next({ name: "login" });
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Token decodificado:", decodedToken);

      // Si el token ha expirado, elimina el token y redirige al login
      if (decodedToken.exp * 1000 <= Date.now()) {
        localStorage.removeItem("token");
        return next({ name: "login" });
      }

      // Guarda el usuario en Vuex si no está presente
      if (!router.app.$store.getters.currentUser) {
        router.app.$store.dispatch("decodeAndSaveToken", token).then(() => {
          return next(); // Navegación permitida después de guardar el usuario
        });
      } else {
        return next(); // Navegación permitida si el usuario ya está cargado
      }
    } catch (error) {
      console.error("Error en el token:", error);
      localStorage.removeItem("token");
      return next({ name: "login" });
    }
  }

  // Si la ruta es "login" y el usuario ya está logueado
  if (to.name === "login" && token) {
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 > Date.now()) {
        return next({ name: "home" }); // Redirige al home si el token es válido
      }
      localStorage.removeItem("token"); // Limpia el token si expiró
    } catch (error) {
      localStorage.removeItem("token"); // Limpia el token si ocurre un error
    }
  }

  // Por defecto, permite la navegación
  next();
});


export default router;
