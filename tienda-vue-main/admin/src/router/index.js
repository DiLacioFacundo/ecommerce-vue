import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store"; // Asegúrate de que el store esté importado correctamente
import * as jwtDecode from "jwt-decode";

import LoginApp from "../views/LoginApp.vue";
import DashboardApp from "../views/DashboardApp.vue"; // Si es necesario, importa las vistas correctamente

Vue.use(VueRouter);

// Define las rutas
const routes = [
  { path: "/perfil", name: "perfil", component: () => import("../views/MyPerfilApp.vue"), meta: { requiresAuth: true } },

  { path: "/login", name: "login", component: LoginApp, meta: { requiresAuth: false } },
  { path: "/dashboard", name: "dashboard", component: DashboardApp, meta: { requiresAuth: true } },

  // Clientes
  { path: "/cliente", name: "cliente-index", component: () => import("../views/clientes/IndexClienteApp.vue"), meta: { requiresAuth: true } },

  // Usuarios
  { path: "/usuario", name: "usuario-index", component: () => import("../views/usuarios/IndexUsuarioApp.vue"), meta: { requiresAuth: true } },
  { path: "/usuario/create", name: "usuario-create", component: () => import("../views/usuarios/CreateUsuarioApp.vue"), meta: { requiresAuth: true } },
  { path: "/usuario/edit/:id", name: "usuario-edit", component: () => import("../views/usuarios/EditUsuarioApp.vue"), meta: { requiresAuth: true } },

  // Productos
  { path: "/producto", name: "producto-index", component: () => import("../views/productos/IndexProductoApp.vue"), meta: { requiresAuth: true } },
  { path: "/producto/create", name: "producto-create", component: () => import("../views/productos/CreateProductoApp.vue"), meta: { requiresAuth: true } },
  { path: "/producto/edit/:id", name: "producto-edit", component: () => import("../views/productos/EditProductoApp.vue"), meta: { requiresAuth: true } },

  // Ventas
  { path: "/ventas", name: "ventas-index", component: () => import("../views/ventas/VentasIndexApp.vue"), meta: { requiresAuth: true } },

  // Categorías
  { path: "/categorias", name: "categorias", component: () => import("../views/categorias/CreateCategoriaApp.vue"), meta: { requiresAuth: true } },

  // Subcategorías
  {
    path: "/subcategoria/create/:categoriaId",
    name: "subcategoria-create",
    component: () => import("../views/categorias/CreateSubCategoriaApp.vue"),
    meta: { requiresAuth: true },
  },

  // E-commerce
  {
    path: "/ecommerce",
    name: "ecommerce",
    beforeEnter(to, from, next) {
      window.open("http://localhost:8086/", "_blank");
      next(false); // Cancela la navegación interna de Vue Router
    },
    meta: { requiresAuth: true },
  },

  // Ruta por defecto si no encuentra ninguna
  { path: "*", redirect: "/login" },
];

// Configuración de VueRouter
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Middleware global para la autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (!token) {
      return next({ name: "login" });
    }

    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 <= Date.now()) {
        localStorage.removeItem("token");
        return next({ name: "login" });
      }

      // Verificar roles
      if (to.meta.roles && !to.meta.roles.includes(decodedToken.role)) {
        return next({ name: "dashboard" }); // Redirige si el rol no coincide
      }

      return next();
    } catch (error) {
      console.error("Token error:", error);
      localStorage.removeItem("token");
      return next({ name: "login" });
    }
  }

  return next();
});



export default router;
