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
            <router-link to="/" class="text-white"
              ><i class="fas fa-home"></i> Inicio</router-link
            >
          </li>
          <li class="breadcrumb-item">
            <router-link to="/cart" class="text-white">Carrito</router-link>
          </li>
          <li class="breadcrumb-item active text-white">Checkout</li>
        </ol>
        <h2 class="hero-heading">Checkout</h2>
        <p class="lead mt-3">Revisa tu orden y selecciona el método de pago.</p>
      </div>
    </section>

    <!-- Contenido Checkout -->
    <section class="py-5">
      <div class="container checkout-container p-4 bg-white shadow rounded">
        <div class="row g-4">
          <!-- Columna Izquierda -->
          <div class="col-lg-8">
            <!-- Formulario Dirección -->
            <div class="block p-4 shadow rounded">
              <h5 class="text-uppercase mb-4">Dirección de Entrega</h5>
              <form @submit.prevent="guardarInformacion">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre Completo</label>
                    <input
                      v-model="nuevaDireccion.nombreCompleto"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Ingresa tu nombre y apellido"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono</label>
                    <input
                      v-model="nuevaDireccion.telefono"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Número de teléfono"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Ciudad</label>
                    <input
                      v-model="nuevaDireccion.ciudad"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Ciudad"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">País</label>
                    <input
                      v-model="nuevaDireccion.pais"
                      type="text"
                      class="form-control input-animated"
                      placeholder="País"
                      required
                    />
                  </div>
                  <div class="col-md-9 mb-3">
                    <label class="form-label">Dirección</label>
                    <input
                      v-model="nuevaDireccion.direccion"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Dirección completa"
                      required
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label class="form-label">Codigo Postal</label>
                    <input
                      v-model="nuevaDireccion.codigoPostal"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Codigo Postal"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <!-- Productos -->
            <div class="block mt-4 p-4 shadow rounded">
              <h5 class="text-uppercase mb-4">Productos en tu Orden</h5>
              <div v-if="productos.length > 0">
                <div
                  v-for="item in productos"
                  :key="item.producto._id"
                  class="cart-item mb-3 d-flex align-items-center rounded shadow-sm p-3"
                >
                  <div class="product-image-wrapper">
                    <img
                      :src="item.image"
                      alt="Producto"
                      class="cart-item-img rounded"
                    />
                  </div>

                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-1 fw-bold">
                      {{ item.producto.titulo || "Producto no disponible" }}
                    </h6>
                    <p class="text-muted small mb-1">
                      Variedad Seleccionada:
                      <span class="fw-semibold text-primary">{{
                        item.variedad?.variedad || "Base"
                      }}</span>
                    </p>
                    <p class="small mb-0">
                      Cantidad:
                      <span class="fw-semibold">{{ item.cantidad }}</span>
                    </p>
                  </div>

                  <div class="text-end">
                    <span class="price-tag">{{
                      convertCurrency(item.producto.precio * item.cantidad)
                    }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-muted">
                <p>No hay productos en tu carrito.</p>
              </div>
            </div>
          </div>

          <!-- Columna Derecha -->
          <div class="col-lg-4">
            <div class="block p-4 shadow rounded">
              <h5 class="text-uppercase mb-4">Resumen del Pedido</h5>
              <ul class="list-unstyled mb-4">
                <li class="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>{{ convertCurrency(total) }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  <span>Envío</span> <span>{{ convertCurrency(envio) }}</span>
                </li>
                <li
                  class="d-flex justify-content-between fw-bold border-top pt-2"
                >
                  <span>Total</span>
                  <span>{{ convertCurrency(total + envio) }}</span>
                </li>
              </ul>
              <button class="btn btn-secondary w-100" @click="onPagarClick">
                <i class="fas fa-credit-card me-2"></i> Pagar con Mercado Pago
              </button>
              <!-- Contenedor del Brick -->
              <div id="paymentBrick_container" class="mt-4"></div>
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

export default {
  components: { Notificacion },
  data() {
    return {
      notificacion: { visible: false, message: "", type: "", duration: 3000 },
      paymentBrickController: null,
      direcciones: [],
      productos: [],
      total: 0,
      envio: 10,
      nuevaDireccion: {},
      venta: { direccion: null },
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser || null; // Acceder al getter de Vuex
    },
  },
  mounted() {
    this.initCarrito();
  },
  methods: {
    convertCurrency(value) {
      return currency_formatter.format(value, { code: "USD" });
    },
    processImageUrl(imageUrl) {
      if (!imageUrl) {
        return "/assets/images/no_image.png";
      }

      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }

      return `${this.$url.replace(/\/api$/, "")}${imageUrl}`;
    },
    validateDireccion(direccion) {
      if (
        !direccion.nombreCompleto ||
        !direccion.telefono ||
        !direccion.ciudad ||
        !direccion.pais ||
        !direccion.direccion ||
        !direccion.codigoPostal
      ) {
        throw new Error(
          "Por favor, completa todos los campos de la dirección."
        );
      }
    },
    initCarrito() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      console.log("Carrito recuperado:", carrito);

      if (carrito.length > 0) {
        this.productos = carrito.map((item) => {
          const producto = item.producto || {
            titulo: "Producto no disponible",
            precio: 0,
            variantes: [],
          };

          // Verifica si el producto tiene variantes antes de intentar acceder a ellas
          let varianteSeleccionada = null;
          if (producto.variantes && producto.variantes.length > 0) {
            varianteSeleccionada = producto.variantes.find(
              (v) => v.nombre === item.varianteSeleccionada
            );
          }

          // Procesar imagen utilizando la función processImageUrl
          const image =
            this.processImageUrl(producto.imagen) ||
            "/assets/images/no_image.png";

          return {
            producto: producto,
            image: image, // Aquí asignamos la imagen procesada
            cantidad: item.cantidad || 1,
            variedad: varianteSeleccionada
              ? {
                  _id: varianteSeleccionada._id,
                  variedad: varianteSeleccionada.nombre,
                  precio: varianteSeleccionada.precio,
                }
              : {
                  _id: null,
                  variedad: item.varianteSeleccionada || "Base",
                  precio: producto.precio || 0,
                },
          };
        });

        // Calcular el total sumando el precio de la variante o del producto base
        this.total = this.productos.reduce(
          (acc, item) =>
            acc +
            (item.variedad.precio || item.producto.precio || 0) * item.cantidad,
          0
        );

        this.showNotification("Carrito cargado correctamente.", "info");
      } else {
        this.productos = [];
        this.total = 0;
        this.showNotification("El carrito está vacío.", "warning");
      }

      console.log("Productos procesados con variantes:", this.productos);
    },
    async loadMercadoPagoSdk() {
      if (!window.MercadoPago) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://sdk.mercadopago.com/js/v2";
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    },

    async onPagarClick() {
      try {
        this.validateDireccion(this.nuevaDireccion);
        this.venta.direccion = this.nuevaDireccion;
        this.showNotification(
          "Dirección validada. Mostrando medios de pago...",
          "success"
        );
        await this.renderPaymentBrick();
      } catch (error) {
        this.showNotification(error.message, "error");
      }
    },
    async renderPaymentBrick() {
      try {
        await this.loadMercadoPagoSdk();

        const mp = new window.MercadoPago(
          "TEST-ea30bf4a-b65c-4d1f-b2c9-b76067e9230a",
          {
            locale: "es-AR",
          }
        );

        const bricksBuilder = mp.bricks();

        if (this.paymentBrickController) {
          await this.paymentBrickController.destroy(); // ✅ evita múltiples renders
        }

        this.paymentBrickController = await bricksBuilder.create(
          "payment",
          "paymentBrick_container",
          {
            initialization: {
              amount: Number(this.total) + Number(this.envio),
              payer: {
                email: "test_user_1023024555@testuser.com",
                firstName: "Test",
                lastName: "User",
                entityType: "individual",
              },
            },
            customization: {
              visual: { style: { theme: "default" } },
              paymentMethods: {
                creditCard: "all",
                debitCard: "all",
                ticket: "all",
                bankTransfer: "all",
                atm: "all",
                wallet_purchase: "all",
                maxInstallments: 12,
              },
            },
            callbacks: {
              onReady: () => console.log("✅ Brick listo"),
              onSubmit: async ({ selectedPaymentMethod, formData }) => {
                // tu lógica de pago
              },
              onError: (error) => {
                console.error("❌ Brick error:", error);
                this.showNotification("Error en el Brick", "error");
              },
            },
          }
        );
      } catch (err) {
        console.error("❌ Error al cargar el Brick:", err);
        this.showNotification(
          "No se pudo cargar el formulario de pago.",
          "error"
        );
      }
    },
    showNotification(message, type) {
      this.notificacion = { visible: true, message, type, duration: 3000 };
      setTimeout(() => {
        this.notificacion.visible = false;
      }, 3000);
    },
    handleValidationError(error) {
      console.error("Validation Error:", error.message || error);
      this.showNotification(
        error.message || "Ocurrió un error al validar los datos.",
        "error"
      );
    },
    handleBackendError(error) {
      const message =
        (error.response && error.response.data.message) ||
        "Error al procesar la solicitud. Inténtalo de nuevo.";
      console.error("Backend Error:", message);
      this.showNotification(message, "error");
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

.checkout-container {
  background-color: #ffffff;
}
.cart-item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
.block {
  border-radius: 8px;
}
.input-animated {
  transition: all 0.3s ease;
}
.input-animated:focus {
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.8);
  border-color: #007bff;
}
.btn-primary {
  background-color: #007bff;
}

.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.cart-item-img:hover {
  transform: scale(1.1);
}

.product-image-wrapper {
  flex-shrink: 0;
}

.price-tag {
  font-size: 1rem;
  font-weight: bold;
  color: #007bff;
  display: inline-block;
  background: #f3f7ff;
  padding: 5px 10px;
  border-radius: 5px;
}

.flex-grow-1 h6 {
  color: #333;
}

.flex-grow-1 p {
  margin-bottom: 0.25rem;
}
</style>
