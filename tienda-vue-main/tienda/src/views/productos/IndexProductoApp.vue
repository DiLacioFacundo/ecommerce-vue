<template>
  <div style="background: #f3f3f3" class="pb-5">
    <!-- Notificación -->
    <Notificacion
      v-if="notificacion.visible"
      :message="notificacion.message"
      :type="notificacion.type"
      :duration="notificacion.duration"
      @close="notificacion.visible = false"
    />
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
            <router-link to="/" class="text-white">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li class="breadcrumb-item active text-white">
            <i class="fas fa-store"></i> Tienda
          </li>
        </ol>
        <h2 class="hero-heading">Tienda de Vapes</h2>
        <p class="lead mt-3">
          Encuentra una gran variedad de vapes, líquidos y accesorios de las
          mejores marcas.
        </p>
      </div>
    </section>

    <!-- Contenido Principal -->
    <div class="container">
      <div class="row">
        <!-- Sidebar de filtros -->
        <div class="sidebar col-xl-3 col-lg-4 order-lg-1 mt-5">
          <h5 class="text-primary"><i class="fas fa-filter"></i> Filtros</h5>

          <!-- Botón Quitar filtros -->
          <a href="#" class="nav-link" @click.prevent="resetCategoryFilter">
            <i class="fas fa-times"></i> Quitar Filtros
          </a>

          <!-- Categorías y Subcategorías -->
          <ul class="nav flex-column mt-3">
            <li
              v-for="categoria in categorias"
              :key="categoria._id"
              class="mb-3"
            >
              <h6 class="text-primary">
                <i class="fas fa-tags"></i> {{ categoria.titulo }}
              </h6>
              <ul class="list-unstyled ms-3">
                <li
                  v-for="subcategoria in categoria.subcategorias"
                  :key="subcategoria._id"
                >
                  <a
                    href="#"
                    class="nav-link"
                    @click.prevent="applySubcategoryFilter(subcategoria._id)"
                  >
                    <i class="fas fa-chevron-right"></i>
                    {{ subcategoria.titulo }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <!-- Rango de precios -->
          <div class="price-filter mt-4">
            <h6 class="text-primary">
              <i class="fas fa-dollar-sign"></i> Rango de Precios
            </h6>
            <div class="d-flex align-items-center">
              <input
                type="range"
                v-model="slider.min"
                :min="0"
                :max="2000"
                class="form-range me-2"
              />
              <input
                type="range"
                v-model="slider.max"
                :min="0"
                :max="2000"
                class="form-range"
              />
            </div>
            <div class="text-center mt-2">
              <span class="badge bg-primary">
                ${{ slider.min }} - ${{ slider.max }}
              </span>
            </div>
            <button
              class="btn btn-success btn-sm w-100 mt-2"
              @click="filterByPrice"
            >
              Aplicar
            </button>
          </div>
        </div>
        <!-- Productos -->
        <div class="products-grid col-xl-9 col-lg-8 order-lg-2 mt-5">
          <!-- Barra superior de búsqueda y ordenamiento -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <!-- Input de búsqueda -->
            <div class="input-group w-50">
              <span class="input-group-text bg-primary text-white">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                v-model="searchQuery"
                class="form-control"
                placeholder="Buscar productos..."
                @input="filterProductos"
              />
            </div>

            <!-- Dropdown de ordenamiento -->
            <div class="w-25">
              <select
                v-model="sortBy"
                class="form-select"
                @change="sortProducts"
                style="border-color: #007bff"
              >
                <option value="default" disabled>Ordenar Productos</option>
                <option value="priceAsc">Precio: Menor a Mayor</option>
                <option value="priceDesc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div
              v-for="item in filteredProductos"
              :key="item._id"
              class="col-md-6 col-lg-4 mb-4"
            >
              <div class="product-card shadow-sm h-100">
                <router-link
                  :to="{ name: 'show-productos', params: { slug: item.slug } }"
                >
                  <div class="product-image position-relative">
                    <img :src="item.image" alt="Producto" class="img-fluid" />
                    <!-- Botón Vista Rápida -->
                    <button
                      class="btn btn-primary btn-sm product-quick-view"
                      @click.prevent.stop="showQuickView(item)"
                    >
                      <i class="fas fa-eye"></i> Vista Rápida
                    </button>
                  </div>
                </router-link>

                <div class="product-info p-3 d-flex flex-column flex-grow-1">
                  <h6 class="product-title text-truncate mb-2 text-dark">
                    {{ item.titulo }}
                  </h6>
                  <!-- Sección de precios -->
                  <div class="price-section mb-3">
                    <span class="price text-success fs-5 fw-bold">
                      {{ convertCurrency(calcularPrecioConDescuento(item)) }}
                    </span>
                  </div>
                </div>
                <!-- Botón Añadir al carrito o Quitar -->
                <button
                  v-if="!isVariantInCart(item) && !showDropdown[item._id]"
                  class="btn btn-primary btn-sm mx-3 mb-3"
                  @click="toggleDropdown(item._id)"
                >
                  <i class="fas fa-cart-plus me-1"></i> Añadir al carrito
                </button>

                <!-- Dropdown de variantes y botón Confirmar -->
                <div v-if="showDropdown[item._id]" class="dropdown mx-3 mb-3">
                  <button
                    class="btn btn-outline-secondary dropdown-toggle w-100"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{
                      selectedVariant[item._id]
                        ? selectedVariant[item._id].nombre
                        : "Selecciona una variante"
                    }}
                  </button>
                  <ul class="dropdown-menu w-100">
                    <li
                      v-for="(variante, index) in item.variantes"
                      :key="index"
                      @click="selectVariant(item._id, variante)"
                      class="dropdown-item"
                    >
                      {{ variante.nombre }} -
                      {{ convertCurrency(variante.precio) }}
                    </li>
                  </ul>

                  <button
                    class="btn btn-success btn-sm w-100 mt-2"
                    @click="handleVariantAction(item)"
                  >
                    <i class="fas fa-check-circle me-1"></i> Confirmar
                  </button>
                </div>

                <!-- Botón Quitar del carrito -->
                <button
                  v-if="isVariantInCart(item)"
                  class="btn btn-danger btn-sm mx-3 mb-3"
                  @click="handleVariantAction(item)"
                >
                  <i class="fas fa-cart-arrow-down me-1"></i> Quitar del carrito
                </button>
              </div>
            </div>
          </div>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalProductos"
            :per-page="perPage"
            @change="onPageChange"
            class="mt-4"
          ></b-pagination>
        </div>
      </div>
    </div>

    <!-- Modal Vista Rápida -->
    <transition name="modal-fade" appear>
      <div
        v-if="showModal && selectedProduct"
        class="modal fade show"
        style="display: block"
        @click.self="closeQuickView"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-primary">
                <i class="fas fa-info-circle"></i> {{ selectedProduct.titulo }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeQuickView"
              ></button>
            </div>

            <div class="modal-body">
              <div class="row">
                <!-- Carousel con Transición -->
                <div class="col-md-6">
                  <div
                    id="productCarousel"
                    class="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div class="carousel-inner">
                      <div
                        class="carousel-item"
                        v-for="(image, index) in selectedProduct.imagenes"
                        :key="index"
                        :class="{ active: index === 0 }"
                      >
                        <img
                          :src="image"
                          class="d-block w-100 carousel-transition"
                          alt="Imagen del producto"
                        />
                      </div>
                    </div>
                    <button
                      class="carousel-control-prev"
                      type="button"
                      data-bs-target="#productCarousel"
                      data-bs-slide="prev"
                    >
                      <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="visually-hidden">Anterior</span>
                    </button>
                    <button
                      class="carousel-control-next"
                      type="button"
                      data-bs-target="#productCarousel"
                      data-bs-slide="next"
                    >
                      <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="visually-hidden">Siguiente</span>
                    </button>
                  </div>
                </div>
                <!-- Detalles del Producto -->
                <div class="col-md-6">
                  <h3 class="fw-bold text-primary">
                    {{ selectedProduct.titulo }}
                  </h3>
                  <p class="text-muted">{{ selectedProduct.extracto }}</p>

                  <!-- Selector de Variantes -->
                  <div class="mb-3">
                    <h6 class="fw-bold">Selecciona una variedad</h6>
                    <select
                      v-model="selectedVariant"
                      class="form-select"
                      @change="actualizarPrecioVariante"
                    >
                      <option value="" disabled>Selecciona una variedad</option>
                      <option
                        v-for="variante in selectedProduct.variantes"
                        :key="variante.nombre"
                        :value="variante"
                      >
                        {{ variante.nombre }} -
                        {{ convertCurrency(variante.precio) }}
                      </option>
                    </select>
                  </div>

                  <!-- Precio Actualizado -->
                  <div class="price-section mb-3">
                    <span class="price text-success fs-3 fw-bold me-2">
                      {{ convertCurrency(precioActual) }}
                    </span>
                  </div>

                  <!-- Botón Añadir/Quitar al carrito -->
                  <button
                    :class="[
                      isVariantInCart(selectedProduct)
                        ? 'btn btn-sm btn-danger mx-3'
                        : 'btn btn-primary mx-3',
                    ]"
                    @click="handleVariantCartAction(selectedProduct)"
                  >
                    <i
                      :class="[
                        isVariantInCart(selectedProduct)
                          ? 'fas fa-cart-arrow-down'
                          : 'fas fa-cart-plus',
                        'me-1',
                      ]"
                    ></i>
                    {{
                      isVariantInCart(selectedProduct)
                        ? "Quitar del carrito"
                        : "Añadir al carrito"
                    }}
                  </button>

                  <button
                    class="btn btn-secondary mx-3"
                    @click="closeQuickView"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>



<script>
import axios from "axios";
import currency_formatter from "currency-formatter";
import Notificacion from "@/components/Notificacion.vue";

export default {
  components: {
    Notificacion,
  },
  data() {
    return {
      slider: { min: 0, max: 2000 },
      minRange: 0,
      maxRange: 2000,
      categorias: [],
      productos: [],
      filteredProductos: [],
      cart: [],
      totalProductos: 0,
      currentPage: 1,
      perPage: 12,
      sortBy: "default",
      currentCategory: null,
      currentSubcategory: null,
      searchQuery: "",
      envio: 0,
      showModal: false,
      selectedProduct: null,
      showDropdown: {},
      selectedVariant: {},
      precioActual: 0,
      showAnimation: false,
      currentAddedItem: null,
      notificacion: {
        visible: false,
        message: "",
        type: "info",
        duration: 3000,
      },
    };
  },
  mounted() {

    const savedCart = JSON.parse(localStorage.getItem("carrito")) || [];

    this.cart = savedCart.map((item) => ({
      ...item,
      cantidad: item.cantidad || 1, // Asegurar que tenga la cantidad
    }));
    this.fetchCategorias();
    this.fetchProductos();
  },

  methods: {
    processImageUrl(imageUrl) {
      if (!imageUrl) {
        return "/assets/images/no_image.png";
      }
      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }
      // Combina this.$url y elimina "/api" si está presente
      return `${this.$url.replace(/\/api$/, "")}${imageUrl}`;
    },
    onPageChange(page) {
      this.currentPage = page;
      this.fetchProductos();
    },
    toggleDropdown(productId) {
      this.$set(this.showDropdown, productId, !this.showDropdown[productId]);
    },
    selectVariant(productId, variante) {
      this.$set(this.selectedVariant, productId, variante);
    },
    actualizarPrecioVariante() {
      if (this.selectedVariant) {
        this.precioActual = this.selectedVariant.precio;
      } else {
        this.precioActual = this.selectedProduct.precio_descuento;
      }
    },
    handleVariantCartAction(product) {
      const variant = this.selectedVariant;

      if (!variant) {
        this.showNotification(
          "Selecciona una variante antes de añadir al carrito",
          "error"
        );
        return;
      }

      // Generar un producto con un ID único basado en la variante
      const productWithVariant = {
        ...product,
        _id: `${product._id}-${variant.nombre}`, // ID único basado en producto y variante
        precio: variant.precio,
        varianteSeleccionada: variant.nombre,
      };

      // Buscar el producto en el carrito
      const existsInCart = this.cart.some(
        (p) => p._id === productWithVariant._id
      );

      if (existsInCart) {
        // Eliminar del carrito
        this.cart = this.cart.filter((p) => p._id !== productWithVariant._id);
        this.showNotification("Producto eliminado del carrito", "error");
      } else {
        // Añadir al carrito
        this.cart.push(productWithVariant);
        this.showNotification("Producto añadido al carrito", "success");
      }

      // Guardar el carrito actualizado en localStorage
      this.updateLocalStorage();
      this.closeQuickView();
    },

    isVariantInCart(product) {
      if (!product || !product._id) return false;

      const variant = this.selectedVariant[product._id];
      if (!variant) return false;

      const variantId = `${product._id}-${variant.nombre}`;
      return this.cart.some((p) => p._id === variantId);
    },

    handleVariantAction(item) {
      const variant = this.selectedVariant[item._id];

      if (!variant) {
        this.showNotification(
          "Por favor, selecciona una variante antes de confirmar",
          "error"
        );
        return;
      }

      const productWithVariant = {
        ...item,
        _id: `${item._id}-${variant.nombre}`, // ID único basado en la variante
        precio: variant.precio,
        varianteSeleccionada: variant.nombre,
      };

      if (this.isVariantInCart(item)) {
        // Quitar del carrito
        this.cart = this.cart.filter((p) => p._id !== productWithVariant._id);
        this.showNotification("Producto eliminado del carrito", "error");
        this.$set(this.showDropdown, item._id, false); // Ocultar dropdown
      } else {
        // Añadir al carrito
        this.cart.push(productWithVariant);
        this.showNotification("Producto añadido al carrito", "success");
        this.$set(this.showDropdown, item._id, false); // Ocultar dropdown después de confirmar
      }

      // Guardar carrito en localStorage
      this.updateLocalStorage();
    },
    removeFromCart(product) {
      // Elimina el producto del carrito
      this.cart = this.cart.filter((p) => p._id !== product._id);
      this.showNotification("Producto eliminado del carrito", "error");
      this.updateLocalStorage();
    },
    isInCart(product) {
      const variantId = this.selectedVariant[product._id]
        ? `${product._id}-${this.selectedVariant[product._id].nombre}`
        : product._id;

      return this.cart.some((p) => p._id === variantId);
    },
    updateLocalStorage() {
      localStorage.setItem("carrito", JSON.stringify(this.cart));
    },

    fetchCategorias() {
      axios
        .get(`${this.$url}/categorias`)
        .then((response) => {
          this.categorias = response.data.data.map((categoria) => ({
            ...categoria,
            subcategorias: categoria.subcategorias || [],
          }));
        })
        .catch((error) => {
          console.error("Error al cargar categorías:", error);
        });
    },
    fetchProductos() {
      const params = {
        page: this.currentPage,
        perPage: this.perPage,
      };

      if (this.currentSubcategory) {
        params.subcategoriaId = this.currentSubcategory; // Filtro por subcategoría
      }

      if (this.slider.min !== 0 || this.slider.max !== 2000) {
        params.minPrecio = this.slider.min; // Rango mínimo
        params.maxPrecio = this.slider.max; // Rango máximo
      }

      axios
        .get(`${this.$url}/productos`, { params })
        .then((response) => {
          const { data = [], pagination = {} } = response.data;

          this.productos = data.map((producto) => ({
            ...producto,
            image:
              Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                ? this.processImageUrl(producto.imagenes[0])
                : "/assets/images/no_image.png",
          }));

          this.filteredProductos = [...this.productos];
          this.totalProductos = pagination.total || 0;
        })
        .catch((error) => {
          console.error("Error al cargar productos:", error);
          this.productos = [];
          this.filteredProductos = [];
        });
    },
    convertCurrency(value) {
      return currency_formatter.format(value, { code: "USD" });
    },
    resetCategoryFilter() {
      // Reiniciar variables de filtros
      this.currentSubcategory = null;
      this.searchQuery = "";
      this.slider.min = 0;
      this.slider.max = 2000;
      this.sortBy = "default";

      // Reiniciar paginación
      this.currentPage = 1;

      // Recargar productos desde el backend
      this.fetchProductos();
    },
    getSortingFunction() {
      return (a, b) => {
        if (this.sortBy === "priceAsc") return a.precio - b.precio;
        if (this.sortBy === "priceDesc") return b.precio - a.precio;
        return 0; // Sin ordenamiento
      };
    },
    applyCategoryFilter(categoryId) {
      this.currentCategory = categoryId;
      this.currentSubcategory = null; // Restablecer subcategoría al cambiar de categoría
      this.fetchProductos(); // Recarga productos
    },
    applySubcategoryFilter(subcategoryId) {
      this.currentSubcategory = subcategoryId;
      this.currentPage = 1; // Reinicia la paginación
      this.fetchProductos();
    },
    filterByPrice() {
      this.filterProductos();
    },
    sortProducts() {
      this.filterProductos();
    },
    calcularPrecioConDescuento(producto) {
      if (!producto || !producto.precio) return 0; // Verificación de seguridad
      const descuento = producto.descuento || 0;
      const precioBase = producto.precio || 0;

      // Calcular precio con descuento si aplica
      if (descuento > 0) {
        return precioBase - (precioBase * descuento) / 100;
      }

      // Si no hay descuento, retornar el precio normal
      return precioBase;
    },
    filterProductos() {
      const query = this.searchQuery.toLowerCase();

      this.filteredProductos = this.productos
        .filter((producto) => producto.titulo.toLowerCase().includes(query)) // Filtro por nombre
        .filter((producto) =>
          this.currentSubcategory
            ? producto.subcategoria === this.currentSubcategory
            : true
        )
        .filter(
          (producto) =>
            producto.precio >= this.slider.min &&
            producto.precio <= this.slider.max
        )
        .sort(this.getSortingFunction());
    },
    showQuickView(product) {
      // Reinicia el modal y los valores previos
      this.selectedProduct = null;
      this.selectedVariant = null;
      this.precioActual = 0;

      // Realiza la petición
      axios
        .get(`${this.$url}/productos/${product.slug}`)
        .then((response) => {
          const producto = response.data;

          // Procesar imágenes: Completar URL o asignar una por defecto
          producto.imagenes = (producto.imagenes || []).map((img) =>
            this.processImageUrl(img)
          );
          if (producto.imagenes.length === 0) {
            producto.imagenes = ["/assets/images/no_image.png"];
          }

          // Asignar la variante por defecto si existe
          if (producto.variantes && producto.variantes.length > 0) {
            this.selectedVariant = producto.variantes[0];
            this.precioActual = this.selectedVariant.precio;
          } else {
            this.precioActual = producto.precio_descuento;
          }

          // Actualiza el producto seleccionado
          this.selectedProduct = producto;

          // Muestra el modal con un breve retraso
          setTimeout(() => {
            this.showModal = true;
          }, 10);
        })
        .catch((error) => {
          console.error("Error al cargar datos del producto:", error);
          this.showNotification("Error al cargar el producto", "error");
        });
    },
    closeQuickView() {
      this.showModal = false;
      setTimeout(() => {
        this.selectedProduct = null;
      }, 300);
    },
    handleCartAction(product) {
      if (this.isInCart(product)) {
        this.removeFromCart(product);
      } else {
        this.toggleDropdown(product._id);
      }
    },
    showNotification(message, type) {
      this.notificacion = {
        visible: true,
        message,
        type,
        duration: 3000,
      };
      setTimeout(() => (this.notificacion.visible = false), 3000);
    },
  },
};
</script>

<style>
.form-control {
  color: #495057;
  background-color: #fff;
}

/* Header Styles */
.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex-grow: 1;
}

.product-image {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  display: none;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.product-card:hover .product-quick-view {
  display: block;
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
.page-item.active .page-link {
  z-index: 3;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.b-pagination .page-link:hover {
  background: #007bff;
  color: #fff;
}

.price-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-range {
  flex-grow: 1;
  margin: 0 5px;
}

::placeholder {
  color: #6c757d !important;
  opacity: 1;
}

/* Inputs */
input::placeholder {
  color: #6c757d !important;
  opacity: 1;
}
.buscador-input::placeholder {
  color: #495057;
  font-style: italic;
  opacity: 1;
}

.input-group-text {
  border-radius: 8px 0 0 8px;
  color: #ffffff;
  background-color: #007bff;
}

.modal-body img {
  display: block;
  margin: 0 auto;
  max-height: 300px;
  object-fit: contain;
}

.badge.bg-success {
  font-size: 0.9rem;
}

ul.list-unstyled {
  padding-left: 0;
}

ul.list-unstyled li {
  list-style: none;
}

.carousel-transition {
  transition: transform 0.5s ease-in-out;
}

.carousel-inner .carousel-item img {
  object-fit: cover;
  max-height: 550px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.carousel-control-prev,
.carousel-control-next {
  opacity: 0.8; /* Reducir opacidad de las flechas */
  transition: opacity 0.3s ease;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 1; /* Aumentar opacidad al pasar el cursor */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/* Entrada del modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px); /* Modal entra desde arriba */
}

.modal-fade-enter-to {
  opacity: 1;
  transform: translateY(0); /* Posición final */
}

.modal-fade-leave-from {
  opacity: 1;
  transform: translateY(0); /* Posición inicial al salir */
}

.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px); /* Modal desaparece hacia arriba */
}

.dropdown-item {
  cursor: pointer;
}
</style>
