<template>
  <div style="background: #f3f3f3" class="pb-5">
    <!-- Sección Hero -->
    <section
      class="hero text-center text-white d-flex align-items-center justify-content-center"
      style="
        background-size: cover;
        background-position: center;
        height: 400px;
        margin-top: 100px;
      "
    >
      <div class="container">
        <ol class="breadcrumb justify-content-center">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-white">Inicio</router-link>
          </li>
          <li class="breadcrumb-item active text-white">Tienda</li>
        </ol>
        <h2 class="hero-heading" style="font-size: 3rem; font-weight: bold">
          Tienda de Vapes
        </h2>
        <p class="lead mt-3">
          Encuentra una gran variedad de vapes, líquidos y accesorios de las
          mejores marcas.
        </p>
      </div>
    </section>

    <!-- Contenido Principal -->
    <div class="container">
      <div class="row">
        <!-- Sidebar -->
        <div class="sidebar col-xl-3 col-lg-4 order-lg-1 mt-5">
          <!-- Categorías -->
          <div class="sidebar-block">
            <h6 class="sidebar-heading">Tipos de Vapes</h6>
            <ul class="nav flex-column mt-3">
              <li v-for="item in categorias" :key="item.categoria._id">
                <a
                  href="#"
                  class="nav-link"
                  @click="applyCategoryFilter(item.categoria._id)"
                >
                  {{ item.categoria.titulo }}
                </a>
                <ul v-if="item.subcategorias" class="list-unstyled ms-3">
                  <li v-for="sub in item.subcategorias" :key="sub.titulo">
                    <a
                      href="#"
                      class="nav-link"
                      @click="applySubcategoryFilter(sub.titulo)"
                    >
                      {{ sub.titulo }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- Filtro de precios -->
          <div class="sidebar-block mt-4">
            <h6 class="sidebar-heading">Rango de precios</h6>
            <div class="mt-3">
              <input
                type="range"
                v-model="minRange"
                :min="slider.min || 0"
                :max="slider.max || 2000"
              />
              <span>{{ convertCurrency(minRange) }}</span> -
              <input
                type="range"
                v-model="maxRange"
                :min="slider.min || 0"
                :max="slider.max || 2000"
              />
              <span>{{ convertCurrency(maxRange) }}</span>
            </div>
          </div>
        </div>

        <!-- Productos -->
        <div class="products-grid col-xl-9 col-lg-8 order-lg-2 mt-5">
          <header
            class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3"
          >
            <h2 class="section-title">Productos</h2>
            <select
              v-model="sortBy"
              @change="sortProducts"
              class="form-select w-auto"
            >
              <option value="default">Ordenar por: Defecto</option>
              <option value="priceAsc">Precio: Menor a Mayor</option>
              <option value="priceDesc">Precio: Mayor a Menor</option>
            </select>
          </header>

          <div class="row">
            <div
              v-for="item in productos"
              :key="item._id"
              class="col-md-6 col-lg-4 mb-4"
            >
              <div class="product-card shadow-sm h-100 d-flex flex-column">
                <div class="product-image position-relative overflow-hidden">
                  <img :src="item.image" class="img-fluid rounded-top" />
                  <button
                    class="btn btn-primary btn-sm product-quick-view"
                    @click="showQuickView(item)"
                  >
                    <i class="bi bi-eye"></i> Vista Rápida
                  </button>
                </div>
                <div class="product-info p-3 d-flex flex-column flex-grow-1">
                  <h6 class="product-title text-truncate mb-2">
                    {{ item.titulo }}
                  </h6>
                  <span class="product-price text-primary fw-bold">{{
                    convertCurrency(item.precio)
                  }}</span>
                  <button
                    class="btn btn-outline-primary btn-sm mt-auto"
                    @click="addToCart(item)"
                  >
                    <i class="bi bi-cart"></i> Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>

          <b-pagination
            v-model="currentPage"
            :total-rows="totalProductos"
            :per-page="perPage"
            class="mt-4"
            @change="fetchProductos"
          >
          </b-pagination>
        </div>
      </div>
    </div>

    <!-- Modal Vista Rápida -->
    <div
      v-if="showModal"
      class="modal fade show"
      style="display: block"
      @click.self="closeQuickView"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5>{{ selectedProduct.titulo }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeQuickView"
            ></button>
          </div>
          <div class="modal-body">
            <img :src="selectedProduct.image" class="img-fluid" />
            <p>{{ selectedProduct.descripcion }}</p>
            <span>{{ convertCurrency(selectedProduct.precio) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import currency_formatter from "currency-formatter";

export default {
  data() {
    return {
      slider: {
        min: 0,
        max: 2000,
      },
      minRange: 0,
      maxRange: 2000,
      categorias: [],
      productos: [],
      totalProductos: 0,
      currentPage: 1,
      perPage: 12,
      sortBy: "default",
      envio: 0, // Valor del costo de envío
      showModal: false,
      selectedProduct: null,
    };
  },
  mounted() {
    this.fetchCategorias();
    this.fetchProductos();
  },
  methods: {
    fetchCategorias() {
      axios
        .get("/api/categorias")
        .then((response) => {
          this.categorias = response.data;
        })
        .catch((error) => {
          console.error("Error al cargar categorías:", error);
        });
    },
    fetchProductos() {
      axios
        .get(`${this.$url}/obtener_productos_shop`, {
          params: {
            page: this.currentPage,
            perPage: this.perPage,
            minPrice: this.minRange,
            maxPrice: this.maxRange,
            sortBy: this.sortBy,
          },
        })
        .then((response) => {
          this.productos = response.data.items; 
          this.totalProductos = response.data.total;
          this.calcularEnvio(); 
        })
        .catch((error) => {
          console.error("Error al cargar productos:", error);
        });
    },
    convertCurrency(number) {
      return currency_formatter.format(number, { code: "USD" });
    },
    sortProducts() {
      this.fetchProductos();
    },
    applyCategoryFilter(categoryId) {
      this.currentCategory = categoryId;
      this.fetchProductos();
    },
    applySubcategoryFilter(subcategoryTitle) {
      this.currentSubcategory = subcategoryTitle;
      this.fetchProductos();
    },
    showQuickView(product) {
      this.selectedProduct = product;
      this.showModal = true;
    },
    closeQuickView() {
      this.showModal = false;
    },
    addToCart(product) {
      console.log("Producto añadido al carrito:", product);
    },
    // Método para calcular el costo de envío
    calcularEnvio() {
      this.envio = 10; // Lógica simple, por ejemplo, asignamos un valor fijo para el envío
    },
  },
};
</script>

<style>
.hero {
  background-color: #005f96;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  padding: 2rem 0;
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

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  background: #f8f9fa;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-height: 100%;
  max-width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.1);
}

.product-quick-view {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.9rem;
  padding: 5px 10px;
  display: none;
  transition: all 0.3s ease;
}

.product-card:hover .product-quick-view {
  display: inline-block;
}

.product-title {
  font-size: 1rem;
  color: #495057;
}

.product-price {
  font-size: 1.1rem;
  color: #007bff;
}

.b-pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.b-pagination .page-link {
  color: #007bff;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.b-pagination .page-link:hover {
  background: #007bff;
  color: #fff;
}
</style>
