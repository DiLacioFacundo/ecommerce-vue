<template>
  <header class="header header-absolute">
    <!-- Barra Superior -->
    <div class="top-bar">
      <div class="container-fluid">
        <div class="row d-flex align-items-center">
          <div class="col-sm-7 d-none d-sm-block">
            <ul class="list-inline topbar-text mb-0">
              <li class="list-inline-item pe-3 me-0">
                <img src="/assets/icons/telephone-bl.png" style="width: 16px" />
                020-800-456-747
              </li>
              <li
                class="list-inline-item px-3 border-start d-none d-lg-inline-block"
              >
                Envío gratis desde $300
              </li>
            </ul>
          </div>
          <div class="col-sm-5 d-flex justify-content-end">
            <!-- Selección de Moneda -->
            <div class="dropdown ps-3 ms-0">
              <a
                class="dropdown-toggle topbar-link"
                id="currencyDropdown"
                href="#"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-haspopup="true"
                aria-expanded="false"
                >USD</a
              >
              <div
                class="dropdown-menu dropdown-menu-end dropdown-menu-animated"
                aria-labelledby="currencyDropdown"
              >
                <a class="dropdown-item text-sm" href="#">USD</a>
                <a class="dropdown-item text-sm" href="#">ARS</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <!-- Marca -->
        <a class="navbar-brand text-white" href="/">
          <img
            src="/assets/icons/vapelogo.png"
            alt="Logo"
            style="height: 30px"
          />
          Tienda de Vapes
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Menú"
        >
          <i class="fas fa-bars"></i>
        </button>

        <!-- Menú de Navegación -->
        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'shop' }"
                >Tienda</router-link
              >
            </li>
            <!-- Categorías -->
            <li class="nav-item dropdown position-static">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >Categorías</a
              >
              <div
                class="dropdown-menu dropdown-menu-animated py-3"
                id="categoriesDropdown"
              >
                <router-link
                  class="dropdown-item text-uppercase fw-bold text-center"
                  :to="{ name: 'categories' }"
                >
                  Ver todas las categorías
                </router-link>
                <hr />
                <div class="row px-3">
                  <div class="col-lg-4">
                    <h6 class="text-uppercase">Vapes</h6>
                    <ul class="list-unstyled">
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{ name: 'categories', params: { slug: 'pods' } }"
                          >Pods</router-link
                        >
                      </li>
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{ name: 'categories', params: { slug: 'mods' } }"
                          >Mods</router-link
                        >
                      </li>
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{
                            name: 'categories',
                            params: { slug: 'starter-kits' },
                          }"
                          >Kits de Inicio</router-link
                        >
                      </li>
                    </ul>
                  </div>
                  <div class="col-lg-4">
                    <h6 class="text-uppercase">Líquidos</h6>
                    <ul class="list-unstyled">
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{
                            name: 'categories',
                            params: { slug: 'salts' },
                          }"
                          >Sales Nicotina</router-link
                        >
                      </li>
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{
                            name: 'categories',
                            params: { slug: 'freebase' },
                          }"
                          >Freebase</router-link
                        >
                      </li>
                    </ul>
                  </div>
                  <div class="col-lg-4">
                    <h6 class="text-uppercase">Accesorios</h6>
                    <ul class="list-unstyled">
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{
                            name: 'categories',
                            params: { slug: 'coils' },
                          }"
                          >Resistencias</router-link
                        >
                      </li>
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{
                            name: 'categories',
                            params: { slug: 'baterias' },
                          }"
                          >Baterías</router-link
                        >
                      </li>
                      <li>
                        <router-link
                          class="dropdown-item"
                          :to="{
                            name: 'categories',
                            params: { slug: 'cargadores' },
                          }"
                          >Cargadores</router-link
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'contact' }"
                >Contacto</router-link
              >
            </li>
          </ul>
          <!-- Área de Usuario -->
          <div class="d-flex align-items-center">
            <router-link
              v-if="!isLoggedIn"
              class="btn btn-sm btn-outline-light me-2"
              to="/login"
            >
              <i class="fas fa-user"></i> Iniciar Sesión
            </router-link>
            <div v-if="isLoggedIn" class="dropdown">
              <a
                class="btn btn-sm btn-outline-light dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-user"></i>
                {{
                  user && user.nombres ? user.nombres.split(" ")[0] : "Usuario"
                }}
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <router-link class="dropdown-item" :to="{ name: 'profile' }"
                  >Mi Cuenta</router-link
                >
                <router-link class="dropdown-item" :to="{ name: 'orders' }"
                  >Mis Pedidos</router-link
                >
                <button class="dropdown-item" @click="logout">
                  Cerrar Sesión
                </button>
              </div>
            </div>
            <router-link
              class="btn btn-sm btn-outline-light ms-2"
              :to="{ name: 'cart' }"
            >
              <i class="fas fa-shopping-cart"></i> ({{ carrito_length }})
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex"; // Para integrar con Vuex
import { EventBus } from "@/utils/eventBus";

export default {
  name: "Header",
  data() {
    return {
      carrito_length: 0, // Contador de productos en el carrito
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "currentUser", "cartLength"]),
    user() {
      return this.currentUser; // Alias para el usuario actual
    },
  },
  methods: {
    // Inicializa el carrito y calcula el contador
    initCarrito() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      this.carrito_length = carrito.reduce(
        (total, item) => total + (item.cantidad || 0),
        0
      );
    },
    // Limpia el carrito y reinicia el contador
    limpiarCarrito() {
      localStorage.removeItem("carrito");
      this.carrito_length = 0; // Reinicia el contador
    },
    // Cerrar sesión
    logout() {
      this.$store
        .dispatch("logout") // Acción de Vuex para cerrar sesión
        .then(() => {
          this.$router.push("/login"); // Redirige a la página de inicio de sesión
        })
        .catch((error) => {
          console.error("Error al cerrar sesión:", error);
        });
    },
  },
  mounted() {
    this.initCarrito(); // Inicializa el carrito al montar el componente

    // Escucha el evento "carrito-actualizado" del EventBus
    EventBus.$on("carrito-actualizado", (nuevoContador) => {
      this.carrito_length = nuevoContador;
    });
  },
  beforeDestroy() {
    // Elimina el listener del EventBus al destruir el componente
    EventBus.$off("carrito-actualizado");
  },
};
</script>

<style>
.navbar-light .navbar-nav .nav-link,
.navbar-hover-light:hover .navbar-nav .nav-link,
.navbar-fixed-light.fixed-top .navbar-nav .nav-link {
  color: rgb(255, 255, 255) !important;
}

@media (min-width: 992px) {
  #categoriesDropdown {
    left: 50% !important;
    transform: translateX(-50%) !important;
    margin-top: 1rem;
    width: auto;
    max-width: 600px;
  }
}

.dropdown-menu .row {
  justify-content: center;
  text-align: center;
}

.dropdown-item {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: #2c3e50;
}

.dropdown-item:hover {
  background-color: #f39c12;
  color: #fff;
  transition: background-color 0.2s ease-in-out;
}
</style>
