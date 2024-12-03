import Vue from 'vue'; // Import Vue
import VueRouter from 'vue-router'; // Import VueRouter
import HomeView from '../views/HomeView.vue'; // Import your views

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/login', name: 'login', component: () => import('@/views/LoginApp.vue') },
  { path: '/shop', name: 'shop', component: () => import('@/views/productos/IndexProductoApp.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CarritoView.vue') },
  { path: '/productos/:slug', name: 'show-productos', component: () => import('@/views/productos/ShowProductoApp.vue') },
  { path: '/cuenta/direcciones', name: 'direcciones', component: () => import('@/views/CarritoView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  { path: '/verificacion/:estado/:direccion?', name: 'verificacion', component: () => import('@/views/VerificacionView.vue') },
  { path: '/cuenta/venta/:id', name: 'venta', component: () => import('@/views/cuenta/ventas/VentaDetalleApp.vue') },
  { path: '/cuenta/venta', name: 'venta-index', component: () => import('@/views/cuenta/ventas/VentaIndexApp.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/views/Contact.vue') },
  {path: '/categories',name: 'categories',component: () => import('@/views/CategoriesView.vue')}
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
