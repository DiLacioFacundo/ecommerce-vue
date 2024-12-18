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
        <!-- Breadcrumb -->
        <ol class="breadcrumb justify-content-center">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-white">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li class="breadcrumb-item active text-white">
            <i class="fas fa-shopping-cart"></i> Carrito
          </li>
        </ol>

        <!-- Encabezado y descripción -->
        <h2 class="hero-heading">Carrito de Compras</h2>
        <p class="lead mt-3">
          Revisa tus productos seleccionados antes de proceder con tu compra.
        </p>
      </div>
    </section>

    <!-- Sección Carrito -->
    <section class="shopping-cart-section py-5">
      <div class="container">
        <div class="row">
          <!-- Lista de Productos -->
          <div class="col-lg-8">
            <div class="block mb-5" v-if="carrito.length">
              <div class="cart-header mb-2">
                <div class="row fw-bold text-uppercase text-center">
                  <div class="col-5">Producto</div>
                  <div class="col-2">Precio</div>
                  <div class="col-2">Cantidad</div>
                  <div class="col-2">Total</div>
                  <div class="col-1"></div>
                </div>
              </div>

              <!-- Producto -->
              <div
                class="cart-item py-3"
                v-for="(item, index) in carrito"
                :key="index"
              >
                <div class="row align-items-center text-center">
                  <!-- Imagen y título -->
                  <div
                    class="col-5 d-flex align-items-center justify-content-start"
                  >
                    <img
                      :src="processImageUrl(item.producto?.imagen)"
                      alt="Producto"
                      class="cart-item-img me-2"
                    />
                    <div class="text-start">
                      <strong>{{
                        item.producto?.titulo || "Producto desconocido"
                      }}</strong>
                      <p class="text-muted small mb-0">
                        Variante seleccionada:
                        <span class="fw-bold text-success">{{
                          item.varianteSeleccionada || "Base"
                        }}</span>
                      </p>
                    </div>
                  </div>

                  <!-- Precio -->
                  <div class="col-2">
                    {{ convertCurrency(item.producto?.precio || 0) }}
                  </div>

                  <!-- Cantidad -->
                  <div class="col-2">
                    <div
                      class="input-group input-group-sm justify-content-center"
                    >
                      <button
                        class="btn btn-outline-secondary px-2 rounded-0"
                        @click="actualizarCantidad(item, -1)"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input
                        type="text"
                        v-model.number="item.cantidad"
                        class="form-control text-center"
                        style="height: 28px; width: 40px"
                        readonly
                      />
                      <button
                        class="btn btn-outline-secondary px-2 rounded-0"
                        @click="actualizarCantidad(item, 1)"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Total -->
                  <div class="col-2">
                    {{
                      convertCurrency(
                        (item.producto?.precio || 0) * item.cantidad
                      )
                    }}
                  </div>

                  <!-- Eliminar -->
                  <div class="col-1">
                    <button
                      class="btn btn-sm btn-danger"
                      @click="eliminar(index)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Botón Seguir Comprando -->
              <div class="text-end mt-4">
                <router-link class="btn btn-secondary" to="/shop">
                  <i class="fas fa-store me-2"></i> Seguir Comprando
                </router-link>
              </div>
            </div>

            <!-- Carrito vacío -->
            <div v-else class="text-center bg-white p-4 rounded shadow-sm">
              <p>No hay productos en el carrito.</p>
              <router-link class="btn btn-primary" to="/shop"
                >Continuar comprando</router-link
              >
            </div>
          </div>

          <!-- Resumen del Pedido -->
          <div class="col-lg-4">
            <div class="block">
              <h5 class="text-uppercase">Resumen del Pedido</h5>
              <ul class="list-unstyled">
                <li class="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>{{ convertCurrency(total) }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  <span>Envío:</span> <span>{{ convertCurrency(envio) }}</span>
                </li>
                <li
                  class="d-flex justify-content-between border-top mt-2 pt-2 fw-bold"
                >
                  <span>Total:</span>
                  <span>{{ convertCurrency(totalConEnvio) }}</span>
                </li>
              </ul>
              <button class="btn btn-primary w-100 mt-3" @click="irACheckout">
                Ir a Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import currency_formatter from "currency-formatter";
import Notificacion from "@/components/Notificacion.vue";
import { EventBus } from "@/utils/eventBus";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      carrito: [], // Carrito almacenado
      envio: 0,
      notificacion: {
        visible: false,
        message: "",
        type: "info",
        duration: 3000,
      },
    };
  },
  components: {
    Notificacion,
  },
  computed: {
    ...mapGetters(["isLoggedIn", "currentUser", "cartLength"]),

    total() {
      return this.carrito.reduce(
        (acc, item) => acc + item.producto.precio * item.cantidad,
        0
      );
    },
    totalConEnvio() {
      return this.total + this.envio;
    },
  },
  mounted() {
    this.initCarrito();
  },
  methods: {
    irACheckout() {
      if (!this.isLoggedIn) {
        this.showNotification(
          "Por favor, inicia sesión para continuar con tu compra.",
          "error"
        );
      } else {
        this.$router.push("/checkout");
      }
    },
    convertCurrency(value) {
      return currency_formatter.format(value, { code: "ARS" });
    },

    processImageUrl(imageUrl) {
      if (!imageUrl) {
        return "/assets/images/no_image.png"; // Imagen por defecto si no existe
      }
      if (imageUrl.startsWith("http")) {
        return imageUrl; // Si la URL ya es completa
      }
      // Combina la URL base con la imagen, eliminando "/api" si está presente
      return `${this.$url.replace(/\/api$/, "")}${imageUrl}`;
    },

    // Inicializa el carrito
    initCarrito() {
      const storedCart = JSON.parse(localStorage.getItem("carrito")) || [];

      const combinedCart = {};

      storedCart.forEach((item) => {
        // Manejo de ambas estructuras: nueva y existente
        const key = `${item.producto?._id || item.producto || item._id}-${
          item.variedad || item.varianteSeleccionada || "Base"
        }`;

        if (!combinedCart[key]) {
          combinedCart[key] = {
            producto: item.producto?._id
              ? item.producto // Estructura existente
              : {
                  _id: item.producto || item._id, // Estructura nueva
                  titulo:
                    item.titulo ||
                    item.producto?.titulo ||
                    "Producto desconocido",
                  precio: item.precio || item.producto?.precio || 0,
                  imagen:
                    item.imagen ||
                    item.producto?.imagen ||
                    "/assets/images/no_image.png",
                },
            varianteSeleccionada:
              item.variedad || item.varianteSeleccionada || "Base",
            cantidad: item.cantidad || 1,
          };
        } else {
          combinedCart[key].cantidad += item.cantidad || 1; // Combina cantidades si ya existe
        }
      });

      this.carrito = Object.values(combinedCart);
      this.envio = this.carrito.length > 0 ? 10 : 0;

      this.actualizarCarrito();
    },
    actualizarCantidad(item, delta) {
      try {
        const newCantidad = item.cantidad + delta;
        if (newCantidad >= 1) {
          item.cantidad = newCantidad;
          this.showNotification("Cantidad actualizada", "success");
          this.actualizarCarrito();
        } else {
          throw new Error("La cantidad mínima es 1");
        }
      } catch (error) {
        this.showNotification(error.message, "error");
      }
    },
    eliminar(index) {
      try {
        if (confirm("¿Seguro que quieres eliminar este producto?")) {
          this.carrito.splice(index, 1);
          this.showNotification("Producto eliminado del carrito", "success");
          this.actualizarCarrito();
        }
      } catch (error) {
        this.showNotification(
          error.message || "Error al eliminar el producto",
          "error"
        );
      }
    },
    actualizarCarrito() {
      const totalItems = this.carrito.reduce(
        (acc, item) => acc + item.cantidad,
        0
      );
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      EventBus.$emit("carrito-actualizado", totalItems); // Emite el evento
    },
    showNotification(message, type) {
      this.notificacion = {
        visible: true,
        message,
        type,
        duration: type === "error" ? 5000 : 3000,
      };
      setTimeout(
        () => (this.notificacion.visible = false),
        this.notificacion.duration
      );
    },
  },
};
</script>


<style scoped>
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
.input-group {
  display: flex;
  align-items: center;
}

.btn-outline-secondary {
  font-size: 0.8rem; /* Tamaño más pequeño */
  padding: 0.25rem 0.5rem; /* Padding reducido */
  transition: all 0.2s ease-in-out;
}

.btn-outline-secondary:hover {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

/* Centra el contenido de las columnas */
.cart-header .col,
.cart-item .col {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Ajusta el tamaño de la imagen */
.cart-item-img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
}

/* Ajuste del input cantidad */
.input-group .form-control {
  font-size: 0.9rem;
  padding: 0.25rem;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
.block {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  align-items: center;
}

.btn-outline-secondary {
  font-size: 0.8rem; /* Tamaño más pequeño */
  padding: 0.25rem 0.5rem; /* Padding reducido */
  transition: all 0.2s ease-in-out;
}

.form-control.text-center {
  font-size: 0.9rem; /* Tamaño del texto */
  height: 32px; /* Altura ajustada */
  padding: 0.2rem;
}

.cart-item-img {
  width: 70px;
  height: 70px;
  border-radius: 5px;
  object-fit: cover;
}

.btn-danger {
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(255, 0, 0, 0.5);
}

.list-unstyled li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>
