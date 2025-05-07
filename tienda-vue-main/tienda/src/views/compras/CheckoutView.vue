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
                    <label class="form-label">Nombre</label>
                    <input
                      v-model="nuevaInformacion.nombre"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Nombre"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Apellido</label>
                    <input
                      v-model="nuevaInformacion.apellido"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Apellido"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">DNI</label>
                    <input
                      v-model="nuevaInformacion.dni"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Ej: 30123456 (sin puntos ni guiones)"
                      pattern="^\d{7,8}$"
                      title="Debe ser un número válido de 7 u 8 dígitos"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono</label>
                    <input
                      v-model="nuevaInformacion.telefono"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Número de teléfono"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Ciudad</label>
                    <input
                      v-model="nuevaInformacion.ciudad"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Ciudad"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">País</label>
                    <input
                      v-model="nuevaInformacion.pais"
                      type="text"
                      class="form-control input-animated"
                      placeholder="País"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Barrio</label>
                    <input
                      v-model="nuevaInformacion.barrio"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Barrio"
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Calle</label>
                    <input
                      v-model="nuevaInformacion.calle"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Ej: Av. Siempre Viva"
                      required
                    />
                  </div>

                  <div class="col-md-3 mb-3">
                    <label class="form-label">Número</label>
                    <input
                      v-model="nuevaInformacion.numero"
                      type="number"
                      class="form-control input-animated"
                      placeholder="1234"
                      required
                    />
                  </div>

                  <div class="col-md-3 mb-3">
                    <label class="form-label">Código Postal</label>
                    <input
                      v-model="nuevaInformacion.codigoPostal"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Código Postal"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Información Adicional</label>
                    <input
                      v-model="nuevaInformacion.informacionAdicional"
                      type="text"
                      class="form-control input-animated"
                      placeholder="Ej: Piso 2, Depto B, Casa fondo"
                    />
                  </div>

                  <!-- Botón de actualizar, solo visible si modoActualizarDireccion es true -->
                  <div v-if="modoActualizarDireccion" class="text-end">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="actualizarInformacionEnBrick"
                    >
                      Actualizar Información
                    </button>
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
            <!-- Tu resumen local solo se ve si mostrarResumenLocal es true -->
            <div v-if="mostrarResumenLocal" class="block p-4 shadow rounded">
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
                <i class="fas fa-credit-card me-2"></i> Confirmar Compra
              </button>
            </div>

            <!-- Este div aparece solo cuando mostrarResumenLocal es false -->
            <div v-else>
              <div id="brandBrick_container"></div>
              <div id="paymentBrick_container"></div>
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
      productos: [],
      total: 0,
      envio: 10,
      nuevaInformacion: {},
      mostrarResumenLocal: true,
      modoActualizarDireccion: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser || null;
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
      if (!imageUrl) return "/assets/images/no_image.png";
      return imageUrl.startsWith("http")
        ? imageUrl
        : `${this.$url.replace(/\/api$/, "")}${imageUrl}`;
    },
    validateDireccion(direccion) {
      const campos = [
        "nombre",
        "apellido",
        "dni",
        "telefono",
        "ciudad",
        "barrio",
        "pais",
        "calle",
        "numero",
        "codigoPostal",
      ];
      for (const campo of campos) {
        if (!direccion[campo]) {
          throw new Error(
            "Por favor, completa todos los campos de la dirección."
          );
        }
      }
    },
    initCarrito() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      this.productos = carrito.map((item) => {
        const producto = item.producto || {
          titulo: "Producto no disponible",
          precio: 0,
          variantes: [],
        };
        const variante =
          producto.variantes?.find(
            (v) => v.nombre === item.varianteSeleccionada
          ) || null;
        const image = this.processImageUrl(producto.imagen);

        return {
          producto,
          image,
          cantidad: item.cantidad || 1,
          variedad: variante
            ? {
                _id: variante._id,
                variedad: variante.nombre,
                precio: variante.precio,
              }
            : {
                _id: null,
                variedad: item.varianteSeleccionada || "Base",
                precio: producto.precio || 0,
              },
        };
      });
      this.total = this.productos.reduce(
        (acc, item) =>
          acc + (item.variedad.precio || item.producto.precio) * item.cantidad,
        0
      );
    },
    async onPagarClick() {
      try {
        this.validateDireccion(this.nuevaInformacion);
        this.mostrarResumenLocal = false;

        this.showNotification(
          "Dirección validada. Mostrando medios de pago...",
          "success"
        );

        // Esperá que el DOM actualice y muestre el contenedor
        this.$nextTick(() => {
          this.renderBrandBrick();
          this.renderPaymentBrick();
        });
      } catch (error) {
        this.showNotification(error.message, "error");
      }
    },

    async renderBrandBrick() {
      try {
        const mp = new window.MercadoPago(
          "APP_USR-28a3eae6-5e1e-493f-93f0-959729f573e9",
          { locale: "es-AR" }
        );

        const bricksBuilder = mp.bricks();

        await bricksBuilder.create("brand", "brandBrick_container", {
          customization: {
            texts: {
              valueProp: "payment_methods",
              align: "left",
              useCustomFont: false,
              size: "medium",
              fontWeight: "semibold",
              color: "secondary",
            },
            paymentMethods: {
              excludedPaymentMethods: [],
              excludedPaymentTypes: [],
              maxInstallments: 12,
              interestFreeInstallments: false,
            },
            visual: {
              backgroundColor: "white",
              hideMercadoPagoLogo: false,
              border: false,
              borderColor: "dark",
              contentAlign: "center",
              borderWidth: "1px",
              borderRadius: "0px",
              verticalPadding: "8px",
              horizontalPadding: "16px",
            },
          },
          callbacks: {
            onReady: () => {
              console.log("✅ Brand Brick listo");
            },
          },
        });
      } catch (error) {
        console.error("❌ Error al renderizar Brand Brick:", error);
      }
    },
    async renderPaymentBrick() {
      try {
        const mp = new window.MercadoPago(
          "APP_USR-28a3eae6-5e1e-493f-93f0-959729f573e9",
          {
            locale: "es-AR",
          }
        );

        const bricksBuilder = mp.bricks();

        this.paymentBrickController = await bricksBuilder.create(
          "payment",
          "paymentBrick_container",
          {
            initialization: {
              amount: Number(this.total + this.envio),
              items: {
                totalItemsAmount: Number(this.total),
                itemsList: this.productos.map((item) => ({
                  units: Number(item.cantidad || 1),
                  value: Number(
                    item.variedad.precio || item.producto.precio || 0
                  ),
                  name: String(item.producto.titulo || "Sin nombre"),
                  description: String(item.producto.descripcion || ""),
                  imageURL: String(item.image || ""),
                })),
              },
              billing: {
                firstName: String(this.nuevaInformacion.nombre || ""),
                lastName: String(this.nuevaInformacion.apellido || ""),
                taxIdentificationNumber: String(
                  this.nuevaInformacion.dni || ""
                ),
                identification: {
                  type: "DNI",
                  number: String(this.nuevaInformacion.dni || ""),
                },
                billingAddress: {
                  streetName: String(this.nuevaInformacion.calle || ""),
                  streetNumber: String(this.nuevaInformacion.numero || ""),
                  neighborhood: String(this.nuevaInformacion.barrio || ""),
                  city: String(this.nuevaInformacion.ciudad || ""),
                  federalUnit: String(this.nuevaInformacion.pais || ""),
                  zipCode: String(this.nuevaInformacion.codigoPostal || ""),
                },
              },
              payer: {
                entityType: "individual",
                email: String(
                  this.currentUser?.email || "test_user@example.com"
                ),
                firstName: String(this.nuevaInformacion.nombre || ""),
                lastName: String(this.nuevaInformacion.apellido || ""),
              },
            },
            customization: {
              enableReviewStep: true,
              reviewCardsOrder: ["payment_method", "billing"],
              paymentMethods: {
                creditCard: "all",
                debitCard: "all",
                ticket: "all",
                maxInstallments: 12,
              },
            },
            callbacks: {
              onReady: () => console.log("✅ Brick listo"),
              onReadyReview: () => console.log("📝 Paso de revisión listo"),
              onClickEditBillingData: async () => {
                const confirm = window.confirm(
                  "¿Querés modificar los datos de facturación?"
                );
                if (!confirm) return;
                this.modoActualizarDireccion = true;
                this.showNotification(
                  "Actualizá los datos y presioná 'Actualizar Información'.",
                  "info"
                );
              },
              onSubmit: async ({ selectedPaymentMethod, formData }) => {
                try {
                  const response = await axios.post(
                    `${this.$url}/pagos/procesar_pago`,
                    {
                      ...formData,
                      metodo: selectedPaymentMethod.type,
                    }
                  );

                  localStorage.removeItem("carrito");
                  this.productos = [];
                  this.total = 0;
                  setTimeout(() => this.$router.push("/gracias"), 5000);
                } catch (err) {
                  console.error("❌ Error al procesar el pago:", err);
                  this.showNotification("Error al procesar el pago", "error");
                }
              },
              onError: (error) => {
                console.error("❌ Error en Brick:", error);
                this.showNotification("Error en Brick", "error");
              },
            },
          }
        );
      } catch (err) {
        console.error("❌ Error al cargar el checkout:", err);
        this.showNotification(
          "No se pudo cargar el formulario de pago.",
          "error"
        );
      }
    },
    async actualizarInformacionEnBrick() {
      if (
        this.paymentBrickController &&
        typeof this.paymentBrickController.update === "function"
      ) {
        try {
          // Ejecuta update con los nuevos datos
          await this.paymentBrickController.update({
            billing: {
              firstName: this.nuevaInformacion.nombre,
              lastName: this.nuevaInformacion.apellido,
              taxIdentificationNumber: this.nuevaInformacion.dni,
              identification: {
                type: "DNI",
                number: this.nuevaInformacion.dni,
              },
              billingAddress: {
                streetName: this.nuevaInformacion.calle,
                streetNumber: this.nuevaInformacion.numero,
                neighborhood: this.nuevaInformacion.barrio,
                city: this.nuevaInformacion.ciudad,
                federalUnit: this.nuevaInformacion.pais,
                zipCode: this.nuevaInformacion.codigoPostal,
              },
            },
            payer: {
              firstName: this.nuevaInformacion.nombre,
              lastName: this.nuevaInformacion.apellido,
            },
          });

          this.showNotification("Datos de facturación actualizados", "success");
          this.modoActualizarDireccion = false;
        } catch (error) {
          console.error("❌ Error al actualizar los datos en el Brick:", error);
          this.showNotification("No se pudo actualizar el Brick", "error");
        }
      } else {
        console.warn("⚠️ El Brick aún no fue creado o no soporta 'update'");
        this.showNotification(
          "El formulario de pago aún no está listo para actualizarse.",
          "warning"
        );
      }
    },
    showNotification(message, type) {
      this.notificacion = { visible: true, message, type, duration: 3000 };
      setTimeout(() => (this.notificacion.visible = false), 3000);
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
