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
    <!-- Producto -->
    <section class="product-details" style="margin-top: 8rem !important">
      <div class="container">
        <div class="row">
          <!-- Galería -->
          <div class="col-lg-7 pt-4 order-2 order-lg-1 d-flex">
            <div class="d-none d-md-block col-md-2 pe-0 miniaturas">
              <div class="miniaturas-list">
                <button
                  v-for="(image, index) in imagenes"
                  :key="index"
                  :class="[
                    'miniatura-item shadow-sm mb-3 rounded',
                    { active: mainImage === image },
                  ]"
                  @click="setMainImage(image)"
                >
                  <img
                    class="img-fluid rounded"
                    :src="image"
                    alt="Producto Miniatura"
                  />
                </button>
              </div>
            </div>
            <div
              class="col-12 col-md-10 main-image-container shadow-sm rounded overflow-hidden"
            >
              <img
                class="img-fluid main-image"
                :src="mainImage"
                alt="Producto Imagen Principal"
              />
            </div>
          </div>
          <!-- Detalles del Producto -->
          <div
            class="col-lg-5 ps-lg-4 order-1 order-lg-2"
            style="padding-top: 20px"
          >
            <h4 class="mb-4">{{ producto.titulo }}</h4>
            <p class="mb-4 text-muted">{{ producto.extracto }}</p>
            <div class="mb-3">
              <h6 class="fw-bold">Selecciona una variedad</h6>
              <select
                v-model="obj_carrito.variedad"
                class="form-select"
                @change="actualizarPrecioVariante"
              >
                <option value="" disabled>Selecciona una variedad</option>
                <option
                  v-for="variedad in variedades"
                  :key="variedad._id"
                  :value="variedad._id"
                >
                  {{ variedad.nombre }} - {{ convertCurrency(variedad.precio) }}
                </option>
              </select>
            </div>

            <!-- Precio dinámico -->
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <!-- Precio con descuento si aplica -->
                <span class="h4 text-success fw-bold">
                  {{ convertCurrency(calcularPrecioConDescuento()) }}
                </span>
                <!-- Precio original tachado si hay descuento -->
                <span
                  v-if="producto.descuento > 0"
                  class="text-muted text-decoration-line-through ms-2"
                >
                  {{ convertCurrency(producto.precio) }}
                </span>
              </div>
            </div>

            <div class="mb-3">
              <label class="fw-bold">Cantidad</label>
              <input
                type="number"
                class="form-control"
                v-model="obj_carrito.cantidad"
                min="1"
              />
            </div>
            <!-- Botón para añadir o eliminar del carrito -->
            <button
              class="btn"
              :class="isInCart ? 'btn-danger' : 'btn-primary'"
              @click="isInCart ? removeFromCart() : addToCart()"
            >
              <i
                class="fas"
                :class="isInCart ? 'fa-trash-alt' : 'fa-cart-plus'"
              ></i>
              {{ isInCart ? "Eliminar del carrito" : "Añadir al carrito" }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Productos Relacionados (sin cambios) -->
    <section class="mt-5">
      <div class="container">
        <div class="row">
          <div class="col-xl-8 mx-auto text-center mb-5">
            <h2 class="text-uppercase">También te podría interesar</h2>
          </div>
        </div>
        <!-- Carrusel de Productos Relacionados -->
        <div
          id="relacionadosCarousel"
          class="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div class="carousel-inner">
            <div
              class="carousel-item"
              v-for="(chunk, index) in chunkArray(productosRelacionados, 4)"
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
                        :src="producto.imagenes"
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
            data-bs-target="#relacionadosCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Atras</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#relacionadosCarousel"
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
import Notificacion from "@/components/Notificacion.vue";
import { EventBus } from "@/utils/eventBus";

export default {
  components: {
    Notificacion,
  },
  data() {
    return {
      producto: {},
      imagenes: [],
      variedades: [], // Lista de variantes
      productosRelacionados: [],
      obj_carrito: { producto: null, variedad: null, cantidad: 1 },
      mainImage: null,
      precioActual: 0, // Precio actual según la variante seleccionada
      notificationMessage: "", // Mensaje de la notificación
      isInCart: false, // Verifica si el producto ya está en el carrito
      notificacion: {
        visible: false,
        message: "",
        type: "info",
        duration: 3000,
      },
    };
  },
  watch: {
    "$route.params.slug": {
      handler() {
        this.fetchProducto();
      },
      immediate: true,
    },
  },
  mounted() {
    this.fetchProducto();
  },
  methods: {
    processImageUrl(imageUrl) {
      if (!imageUrl) {
        return "/assets/images/no_image.png";
      }
      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }
      return `${this.$url.replace(/\/api$/, "")}${imageUrl}`;
    },
    setMainImage(image) {
      this.mainImage = image;
      const mainImageContainer = document.querySelector(
        ".main-image-container"
      );
      mainImageContainer.classList.add("product-selected");
      setTimeout(() => {
        mainImageContainer.classList.remove("product-selected");
      }, 500);
    },
    calcularPrecioConDescuento() {
      const descuento = this.producto.descuento || 0;
      const precioBase = this.producto.precio || 0;

      // Calcular precio con descuento si aplica
      if (descuento > 0) {
        return precioBase - (precioBase * descuento) / 100;
      }

      // Si no hay descuento, retornar el precio normal
      return precioBase;
    },
    convertCurrency(value) {
      return currencyFormatter.format(value, { code: "USD" });
    },
    fetchProducto() {
      const slug = this.$route.params.slug;
      axios
        .get(`${this.$url}/productos/${slug}`)
        .then((response) => {
          const producto = response.data;
          this.producto = producto || {};
          this.imagenes = (producto.imagenes || []).map(this.processImageUrl);
          this.mainImage = this.imagenes[0] || "/assets/images/no_image.png";
          this.variedades = producto.variantes || [];
          this.obj_carrito.producto = producto._id;

          // Establecer la primera variedad por defecto
          if (this.variedades.length > 0) {
            this.obj_carrito.variedad = this.variedades[0]._id;
            this.precioActual = this.variedades[0].precio;
          }

          // Verificar si el producto ya está en el carrito
          this.checkIfInCart();
          this.fetchProductosRelacionados(producto.categoria);
        })
        .catch((error) => console.error("Error al cargar el producto:", error));
    },
    actualizarPrecioVariante() {
      const varianteSeleccionada = this.variedades.find(
        (v) => v._id === this.obj_carrito.variedad
      );
      if (varianteSeleccionada) {
        this.precioActual = varianteSeleccionada.precio;
      }
    },
    fetchProductosRelacionados(categoriaId) {
      axios
        .get(`${this.$url}/productos/categoria/${categoriaId}`)
        .then((response) => {
          this.productosRelacionados = (response.data.data || []).map(
            (producto) => ({
              ...producto,
              // Procesa la primera imagen si está disponible, o asigna una por defecto
              imagenes:
                Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                  ? this.processImageUrl(producto.imagenes[0])
                  : this.processImageUrl(null), // Imagen por defecto
            })
          );
        })
        .catch((error) =>
          console.error("Error al cargar productos relacionados:", error)
        );
    },
    addToCart() {
      try {
        // Verificar si se ha seleccionado una variedad
        if (!this.obj_carrito.variedad) {
          this.showNotification(
            "Selecciona una variedad antes de agregar al carrito.",
            "error"
          );
          return;
        }

        // Verificar si la cantidad es válida
        if (this.obj_carrito.cantidad < 1) {
          this.showNotification("La cantidad debe ser al menos 1.", "error");
          return;
        }

        // Obtener la variante seleccionada
        const varianteSeleccionada = this.variedades.find(
          (v) => v._id === this.obj_carrito.variedad
        );

        if (!varianteSeleccionada) {
          this.showNotification(
            "La variedad seleccionada no es válida.",
            "error"
          );
          return;
        }

        // Crear el objeto del producto para agregar al carrito
        const itemCarrito = {
          producto: this.producto._id, // ID del producto
          titulo: this.producto.titulo || "Producto desconocido", // Título del producto
          variedadId: varianteSeleccionada._id, // ID de la variante seleccionada
          variedad: varianteSeleccionada.nombre, // Nombre de la variedad seleccionada
          cantidad: Number(this.obj_carrito.cantidad), // Cantidad seleccionada
          precio: varianteSeleccionada.precio, // Precio de la variante seleccionada
          imagen: this.mainImage || "/assets/images/no_image.png", // Imagen principal del producto
        };

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        // Crear un identificador único para el producto combinado (producto + variante)
        const itemKey = `${itemCarrito.producto}-${itemCarrito.variedad}`;

        const productoExistente = carrito.find((item) => {
          // Extraer el _id del producto en el carrito
          const itemProductoId = item.producto._id;

          const itemExistenteKey = `${itemProductoId}`;

          return itemExistenteKey === itemKey;
        });

        if (productoExistente) {
          // Si ya existe, actualizar la cantidad
          productoExistente.cantidad += itemCarrito.cantidad;
          this.showNotification(
            "Cantidad actualizada en el carrito.",
            "success"
          );
        } else {
          // Si no existe, agregar el nuevo producto al carrito
          carrito.push(itemCarrito);
          this.showNotification("Producto añadido al carrito.", "success");
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));

        // Llamar a la función para actualizar el estado del carrito
        this.actualizarCarrito();
      } catch (error) {
        console.error("Error al agregar al carrito:", error);
        this.showNotification("Error al agregar al carrito.", "error");
      }
    },

    removeFromCart() {
      try {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        carrito = carrito.filter(
          (item) =>
            item.producto !== this.obj_carrito.producto ||
            item.variedad !== this.obj_carrito.variedad
        );

        localStorage.setItem("carrito", JSON.stringify(carrito));

        this.showNotification("Producto eliminado del carrito.", "success");

        // Recalcular el estado del botón
        this.checkIfInCart();
      } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        this.showNotification("Error al eliminar el producto.", "error");
      }
    },
    actualizarCarrito() {
      // Asegúrate de que carrito sea un arreglo válido antes de usar reduce
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      // Si el carrito está vacío, simplemente no intentamos usar reduce
      if (Array.isArray(carrito)) {
        const totalItems = carrito.reduce(
          (acc, item) => acc + item.cantidad,
          0
        );
        localStorage.setItem("carrito", JSON.stringify(carrito));
        EventBus.$emit("carrito-actualizado", totalItems); // Emite el evento
      } else {
        console.error("Carrito no válido:", carrito);
      }
    },
    checkIfInCart() {
      // Verificar si el producto ya está en el carrito
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      this.isInCart = carrito.some(
        (item) =>
          item.producto === this.obj_carrito.producto &&
          item.variedad === this.obj_carrito.variedad
      );
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
/* Estilo para el contenedor de imágenes principales */
.main-image-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

/* Estilo para miniaturas */
.miniaturas-list {
  display: flex;
  flex-direction: column;
}

.miniatura-item {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100px;
  width: 100px;
}

.miniatura-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.miniatura-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: #007bff; /* Cambio de borde al pasar el cursor */
}

.miniatura-item.active {
  border: 2px solid #007bff; /* Resaltar la miniatura activa */
}

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
