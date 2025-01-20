<template>
  <div class="home" style="background: rgb(243, 243, 243)">
    <!-- Sección de cabecera -->
    <section>
      <div class="container-fluid">
        <div class="row">
          <!-- Primera Categoría -->
          <div
            class="col-lg-6 dark-overlay split-screen-column align-items-center align-items-lg-end"
            :style="getBackgroundStyle('sabores-intensos')"
          >
            <div class="overlay-content py-6 px-lg-5">
              <h1 class="display-3 mb-4 text-white fw-bold letter-spacing-1">
                Vapes de Sabores Intensos
              </h1>
              <p class="lead mb-4">
                Experimenta una explosión de sabores con nuestros vapes más
                intensos.
              </p>
              <router-link to="/shop" class="btn btn-primary btn-lg me-2"
                >Explorar más</router-link
              >
            </div>
          </div>
          <!-- Segunda Categoría -->
          <div
            class="col-lg-6 split-screen-column align-items-center align-items-lg-end"
            :style="getBackgroundStyle('frescos-ligeros')"
          >
            <div class="py-6 px-lg-5">
              <h1 class="display-3 mb-4 text-white fw-bold letter-spacing-1">
                Vapes Ligeros y Frescos
              </h1>
              <p class="lead mb-4">
                Descubre los sabores más refrescantes y ligeros para disfrutar
                en cualquier momento.
              </p>
              <router-link to="/shop" class="btn btn-primary btn-lg me-2"
                >Explorar más</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de nuevos productos -->
    <section class="pt-6 pb-5">
      <div class="container">
        <!-- Contenedor del Título -->
        <div class="row">
          <div class="col-xl-8 mx-auto text-center mb-5">
            <h2 class="text-uppercase">Nuevos Productos</h2>
            <p class="lead text-muted">
              Descubre los últimos modelos y sabores de nuestra tienda.
            </p>
          </div>
        </div>

        <!-- Carrusel de Nuevos Productos -->
        <div
          id="nuevosProductosCarousel"
          class="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div class="carousel-inner">
            <div
              class="carousel-item"
              v-for="(chunk, index) in chunkArray(nuevosProductos, 4)"
              :class="{ active: index === 0 }"
              :key="index"
            >
              <div class="row g-4">
                <div
                  class="col-lg-3 col-md-4 col-6"
                  v-for="producto in chunk"
                  :key="producto._id"
                >
                  <router-link
                    :to="{
                      name: 'show-productos',
                      params: { slug: producto.slug },
                    }"
                    class="text-decoration-none"
                  >
                    <div class="product text-center shadow-sm p-3 rounded">
                      <img
                        class="img-fluid mb-3 rounded"
                        :src="
                          producto.imagenes?.[0] ||
                          '/assets/images/no_image.png'
                        "
                        alt="Producto"
                      />
                      <h6 class="text-truncate text-dark">
                        {{ producto.titulo }}
                      </h6>
                      <p class="text-muted mb-0">
                        {{ formatearMoneda(producto.precio) }}
                      </p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <!-- Controles de Carrusel -->
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#nuevosProductosCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Atras</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#nuevosProductosCarousel"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Sección de productos recomendados -->
    <section class="pt-6 pb-5">
      <div class="container">
        <!-- Contenedor del Título -->
        <div class="row">
          <div class="col-xl-8 mx-auto text-center mb-5">
            <h2 class="text-uppercase">Productos Recomendados</h2>
            <p class="lead text-muted">
              Basado en tus preferencias, te sugerimos estos productos.
            </p>
          </div>
        </div>

        <!-- Carrusel de Productos Recomendados -->
        <div
          id="recomendadosCarousel"
          class="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3500"
        >
          <div class="carousel-inner">
            <div
              class="carousel-item"
              v-for="(chunk, index) in chunkArray(productosRecomendados, 4)"
              :class="{ active: index === 0 }"
              :key="index"
            >
              <div class="row g-4">
                <div
                  class="col-lg-3 col-md-4 col-6"
                  v-for="producto in chunk"
                  :key="producto._id"
                >
                  <router-link
                    :to="{
                      name: 'show-productos',
                      params: { slug: producto.slug },
                    }"
                    class="text-decoration-none"
                  >
                    <div class="product text-center shadow-sm p-3 rounded">
                      <img
                        class="img-fluid mb-3 rounded"
                        :src="
                          producto.imagenes?.[0] ||
                          '/assets/images/no_image.png'
                        "
                        alt="Producto"
                      />
                      <h6 class="text-truncate text-dark">
                        {{ producto.titulo }}
                      </h6>
                      <p class="text-muted mb-0">
                        {{ formatearMoneda(producto.precio) }}
                      </p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <!-- Controles de Carrusel -->
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#recomendadosCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Atras</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#recomendadosCarousel"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import currencyFormatter from "currency-formatter";

export default {
  data() {
    return {
      nuevosProductos: [],
      productosRecomendados: [],
    };
  },
  methods: {
    getBackgroundStyle(category) {
      const backgrounds = {
        "sabores-intensos":
          "background-image: url('assets/images/sabores-intensos.png');",
        "frescos-ligeros":
          "background-image: url('assets/images/frescos-ligeros.png');",
      };
      return backgrounds[category] || "";
    },
    chunkArray(array, chunkSize) {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    },
    formatearMoneda(cantidad) {
      return currencyFormatter.format(cantidad, { code: "USD" });
    },
    cargarNuevosProductos() {
      axios
        .get(`${this.$url}/productos/nuevos`)
        .then((response) => {
          this.nuevosProductos = response.data.data.map((producto) => ({
            ...producto,
            imagenes: producto.imagenes.map(this.processImageUrl), // Aplicar a todas las imágenes
          }));
        })
        .catch((error) =>
          console.error("Error cargando nuevos productos:", error)
        );
    },
    cargarProductosRecomendados() {
      axios
        .get(`${this.$url}/productos/recomendados`)
        .then((response) => {
          this.productosRecomendados = response.data.data.map((producto) => ({
            ...producto,
            imagenes: producto.imagenes.map(this.processImageUrl), // Aplicar a todas las imágenes
          }));
        })
        .catch((error) =>
          console.error("Error cargando productos recomendados:", error)
        );
    },
    processImageUrl(imageUrl) {
      if (!imageUrl) return "/assets/images/no_image.png"; // Imagen por defecto si no hay URL
      return imageUrl.startsWith("http")
        ? imageUrl
        : `${this.$url.replace(/\/api$/, "")}${imageUrl}`; // Ajuste para URLs relativas
    },
  },
  mounted() {
    this.cargarNuevosProductos();
    this.cargarProductosRecomendados();
  },
};
</script>

<style scoped>
/* General */
.carousel {
  position: relative;
}

.carousel-inner {
  position: relative;
}

.carousel-item {
  opacity: 0;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.carousel-item.active {
  opacity: 1;
  transform: translateX(0);
}

/* Transición suave para los items */
.carousel-item-next {
  transform: translateX(100%);
}

.carousel-item-prev {
  transform: translateX(-100%);
}

/* Botones del carrusel */
.carousel-control-prev,
.carousel-control-next {
  width: 5%;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.5);
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.carousel-control-prev-icon:hover,
.carousel-control-next-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Estilo del producto */
.product {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.product:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Imagen del producto */
.product img {
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 15px;
  border-radius: 8px;
}

.product h6 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-width: 100%;
}

.product h6,
.product p {
  text-align: center;
  margin: 0;
  padding: 0;
}
.product {
  animation: fadeInUp 0.6s ease;
}

/* Opcional: Cambiar el color de los botones de navegación al hover */
.carousel-control-prev:hover .carousel-control-prev-icon,
.carousel-control-next:hover .carousel-control-next-icon {
  background-color: rgba(30, 29, 29, 0.8);
}

/* Ajuste de márgenes */
.carousel .row.g-4 {
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .carousel .col-lg-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 576px) {
  .carousel .col-lg-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Animación adicional */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
