import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store"; // Asegúrate de que el store esté importado correctamente
import { jwtDecode } from "jwt-decode";

import LoginApp from "../views/LoginApp.vue";
import DashboardApp from "../views/DashboardApp.vue"; // Si es necesario, importa las vistas correctamente

Vue.use(VueRouter);

// Define las rutas
const routes = [
  { path: "/login", name: "login", component: LoginApp, meta: { requiresAuth: false } },
  { path: "/dashboard", name: "dashboard", component: DashboardApp, meta: { requiresAuth: true } },

  // Colaboradores
  { path: "/colaborador", name: "colaborador-index", component: () => import("../views/colaboradores/IndexColaboradorApp.vue"), meta: { requiresAuth: true } },
  { path: "/colaborador/create", name: "colaborador-create", component: () => import("../views/colaboradores/CreateColaboradorApp.vue"), meta: { requiresAuth: true } },
  { path: "/colaborador/edit/:id", name: "colaborador-edit", component: () => import("../views/colaboradores/EditColaboradorApp.vue"), meta: { requiresAuth: true } },

  // Productos
  { path: "/producto", name: "producto-index", component: () => import("../views/productos/IndexProductoApp.vue"), meta: { requiresAuth: true } },
  { path: "/producto/create", name: "producto-create", component: () => import("../views/productos/CreateProductoApp.vue"), meta: { requiresAuth: true } },
  { path: "/producto/edit/:id", name: "producto-edit", component: () => import("../views/productos/EditProductoApp.vue"), meta: { requiresAuth: true } },

  // Ingresos
  { path: "/ingreso/create", name: "ingreso-create", component: () => import("../views/ingreso/CreateIngresoApp.vue"), meta: { requiresAuth: true } },
  { path: "/ingreso", name: "ingreso-index", component: () => import("../views/ingreso/IndexIngresoApp.vue"), meta: { requiresAuth: true } },
  { path: "/ingreso/:id", name: "ingreso-detalle", component: () => import("../views/ingreso/DetalleIngresoApp.vue"), meta: { requiresAuth: true } },

  // Ventas
  { path: "/ventas", name: "ventas-index", component: () => import("../views/ventas/VentasIndexApp.vue"), meta: { requiresAuth: true } },
  { path: "/ventas/:id", name: "ventas-detalle", component: () => import("../views/ventas/VentasDetalleApp.vue"), meta: { requiresAuth: true } },

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
    beforeEnter() {
      window.open("http://localhost:8086/", "_blank");
    },
    meta: { requiresAuth: true }
  },

  // Clientes
  //{ path: "/clientes", name: "clientes", component: () => import("../views/clientes/ClientesApp.vue"), meta: { requiresAuth: true } },

  // Ruta por defecto si no encuentra ninguna
  { path: "*", redirect: { name: "login" } },
];

// Configuración de VueRouter
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Middleware global para la autenticación
router.beforeEach((to, from, next) => {
  const token = store.state.token;

  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (!token) {
      // No hay token, redirige al login
      return next({ name: "login" });
    }

    try {
      const decodedToken = jwtDecode(token);

      // Si el token está vencido, redirige al login
      if (decodedToken.exp * 1000 <= Date.now()) {
        store.commit("setToken", null); // Limpia el token
        localStorage.removeItem("token");
        return next({ name: "login" });
      }

      // Token válido, continúa a la ruta protegida
      return next();
    } catch (error) {
      console.error("Error decodificando el token:", error.message);
      store.commit("setToken", null);
      localStorage.removeItem("token");
      return next({ name: "login" });
    }
  }

  // Ruta pública: Si el usuario está autenticado y trata de ir al login, redirige al dashboard
  if (to.name === "login" && token) {
    try {
      const decodedToken = jwtDecode(token);

      // Si el token está vencido, permite acceder al login
      if (decodedToken.exp * 1000 <= Date.now()) {
        store.commit("setToken", null);
        localStorage.removeItem("token");
        return next();
      }

      // Token válido, redirige al dashboard
      return next({ name: "dashboard" });
    } catch (error) {
      console.error("Error decodificando el token:", error.message);
      store.commit("setToken", null);
      localStorage.removeItem("token");
      return next();
    }
  }

  // Ruta pública: continúa sin restricciones
  return next();
});

export default router;
