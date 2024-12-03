<template>
  <div class="home">
    <!-- Sección de cabecera -->
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-6 dark-overlay split-screen-column align-items-center align-items-lg-end"
            style="background-image: url('https://example.com/vapes-collection-mens.jpg'); background-color: #d2cecb;">
            <div class="overlay-content py-6 mt-6 px-lg-5 mt-lg-0 mb-lg-5">
              <h1 class="display-3 mb-4 text-white fw-bold split-screen-heading letter-spacing-1">Vapes para él</h1>
              <p class="lead mb-4">
                Descubre nuestra colección exclusiva de vapes para hombres. Innovación y estilo en cada calada.
              </p>
              <p>
                <router-link to="/shop?category=vapes" class="btn btn-outline-light mx-1 mb-1">Ver colección</router-link>
                <router-link to="/shop" class="btn btn-outline-light mx-1 mb-1">Explorar más</router-link>
              </p>
            </div>
          </div>
          <div class="col-lg-6 split-screen-column align-items-center align-items-lg-end"
            style="background-image: url('https://example.com/vapes-collection-womens.jpg'); background-color: #e5b6b4;">
            <div class="py-6 px-lg-5 mb-lg-5">
              <h1 class="display-3 mb-4 text-white fw-bold split-screen-heading letter-spacing-1">Vapes para ella</h1>
              <p class="lead mb-4">
                Nuestra selección de vapes para mujeres ofrece diseño elegante y sabores únicos.
              </p>
              <p>
                <router-link to="/shop?category=vapes" class="btn btn-outline-light mx-1 mb-1">Ver colección</router-link>
                <router-link to="/shop" class="btn btn-outline-light mx-1 mb-1">Explorar más</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de nuevos productos -->
    <section class="pt-6 pb-5">
      <div class="container">
        <div class="row">
          <div class="col-xl-8 mx-auto text-center mb-5">
            <h2 class="text-uppercase">Nuevos Vapes</h2>
            <p class="lead text-muted">
              Descubre los últimos modelos y sabores de nuestra tienda. Lo mejor para tu experiencia de vapeo.
            </p>
          </div>
        </div>
        <div class="row" v-if="cargandoNuevosProductos">
          <div class="col-12 text-center">
            <img src="/assets/media/loading.gif" alt="Cargando..." style="width: 80px" />
          </div>
        </div>
        <div class="row" v-if="!cargandoNuevosProductos">
          <div class="col-lg-3 col-md-4 col-6" v-for="producto in nuevosProductos" :key="producto.id">
            <div class="product">
              <div class="product-image">
                <div class="ribbon ribbon-danger" v-if="producto.descuento">Oferta</div>
                <img class="img-fluid" :src="`${$url}/obtener_portada_producto/${producto.portada}`"
                  :alt="producto.titulo" />
                <div class="product-hover-overlay">
                  <router-link :to="{ name: 'show-productos', params: { slug: producto.slug } }" class="product-hover-overlay-link"></router-link>
                </div>
              </div>
              <div class="py-2">
                <p class="text-muted text-sm mb-1">{{ producto.categoria }}</p>
                <h3 class="h6 text-uppercase mb-1">
                  <router-link :to="{ name: 'show-productos', params: { slug: producto.slug } }" class="text-dark">{{ producto.titulo }}</router-link>
                </h3>
                <span class="text-muted">{{ formatearMoneda(producto.precio) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de productos recomendados -->
    <section class="pt-6 pb-5">
      <div class="container">
        <div class="row">
          <div class="col-xl-8 mx-auto text-center mb-5">
            <h2 class="text-uppercase">Sabores y modelos recomendados</h2>
            <p class="lead text-muted">
              Basado en tus preferencias, te sugerimos estos vapes y líquidos.
            </p>
          </div>
        </div>
        <div class="owl-carousel owl-theme product-slider" v-if="productosRecomendados.length">
          <div class="product-slider-item" v-for="producto in productosRecomendados" :key="producto.id">
            <div class="product">
              <div class="product-image">
                <div class="ribbon ribbon-primary">Oferta</div>
                <img :src="`${$url}/obtener_portada_producto/${producto.portada}`" :alt="producto.titulo" />
              </div>
              <div class="py-2">
                <p class="text-muted text-sm mb-1">{{ producto.categoria }}</p>
                <h3 class="h6 text-uppercase mb-1">
                  <router-link :to="{ name: 'show-productos', params: { slug: producto.slug } }" class="text-dark">{{ producto.titulo }}</router-link>
                </h3>
                <span class="text-muted">{{ formatearMoneda(producto.precio) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import currencyFormatter from "currency-formatter";

export default {
  name: "HomeView",
  data() {
    return {
      nuevosProductos: [],
      productosRecomendados: [],
      cargandoNuevosProductos: true,
      cargandoProductosRecomendados: true,
    };
  },
  methods: {
    cargarNuevosProductos() {
      this.cargandoNuevosProductos = true;
      axios
        .get(`${this.$url}/obtener_nuevos_productos`)
        .then((response) => {
          this.nuevosProductos = response.data;
          this.cargandoNuevosProductos = false;
        })
        .catch(() => (this.cargandoNuevosProductos = false));
    },
    cargarProductosRecomendados() {
      this.cargandoProductosRecomendados = true;
      axios
        .get(`${this.$url}/obtener_productos_recomendados`)
        .then((response) => {
          this.productosRecomendados = response.data;
          this.cargandoProductosRecomendados = false;
        })
        .catch(() => (this.cargandoProductosRecomendados = false));
    },
    formatearMoneda(cantidad) {
      return currencyFormatter.format(cantidad, { code: "USD" });
    },
  },
  mounted() {
    this.cargarNuevosProductos();
    this.cargarProductosRecomendados();
  },
};
</script>

<style scoped>
.product-image {
  display: block !important;
  overflow: hidden !important;
  height: 320px !important;
  transition: transform 0.3s ease-in-out;
}

.product-image:hover {
  transform: scale(1.05);
}

.img-fluid {
  height: auto !important;
  display: block !important;
}

.card {
  border: none;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.btn-primary {
  background-color: #005f96;
  border: none;
  transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #004080;
}

.hero {
  background-color: #005f96;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin-bottom: 1rem;
}

.breadcrumb-item a {
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
}

.breadcrumb-item.active {
  color: rgba(255, 255, 255, 0.7);
}
</style>
