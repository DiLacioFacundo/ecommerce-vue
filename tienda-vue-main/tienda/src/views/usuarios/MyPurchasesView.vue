<template>
  <div v-if="isAuthenticated">
    <!-- Hero Section -->
    <section
      class="hero text-center text-white d-flex align-items-center justify-content-center"
    >
      <div class="container">
        <ol class="breadcrumb justify-content-center">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-white">Inicio</router-link>
          </li>
          <li class="breadcrumb-item active text-white">Mis Compras</li>
        </ol>
        <h2 class="hero-heading">Compras de {{ userProfile.nombres }}</h2>
      </div>
    </section>

    <!-- Notificación -->
    <Notificacion
      v-if="notificacion.visible"
      :message="notificacion.message"
      :type="notificacion.type"
      :duration="notificacion.duration"
      @close="notificacion.visible = false"
    />

    <!-- Purchase List -->
    <section>
      <div class="container py-5">
        <div v-if="purchases.length">
          <div
            v-for="(purchase, index) in purchases"
            :key="purchase._id"
            class="card mb-4 shadow-sm purchase-card"
          >
            <div
              class="card-header d-flex justify-content-between align-items-center bg-light"
            >
              <span class="fw-bold">Compra #{{ index + 1 }}</span>
              <span class="badge" :class="getStatusClass(purchase.estado)">
                {{ purchase.estado }}
              </span>
            </div>
            <div class="card-body">
              <!-- Productos Comprados -->
              <div class="row">
                <div
                  v-for="(product, idx) in purchase.detalles"
                  :key="idx"
                  class="col-md-4 col-sm-6 mb-3"
                >
                  <div class="product-card">
                    <img
                      :src="product.producto.imagenes[0]"
                      alt="Imagen del Producto"
                      class="product-image"
                    />
                    <div class="product-details">
                      <h6 class="product-title">
                        {{ product.producto.titulo }}
                      </h6>
                      <p class="product-price">
                        ${{ product.producto.precio.toFixed(2) }} x
                        {{ product.cantidad }}
                      </p>
                      <p class="product-subtotal">
                        Subtotal: ${{ product.subtotal.toFixed(2) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Información de la Compra -->
              <div class="purchase-info mt-4">
                <p>
                  <strong>Fecha de Compra:</strong>
                  {{ formatDate(purchase.venta.createdAt) }}
                </p>
                <p>
                  <strong>Total Pagado:</strong> ${{
                    purchase.venta.total.toFixed(2)
                  }}
                </p>
              </div>
            </div>
            <div class="card-footer text-center">
              <button
                class="btn btn-primary btn-sm"
                @click="viewPurchaseDetails(purchase.venta)"
              >
                Ver Detalles Completos
              </button>
            </div>
          </div>
        </div>
        <div
          v-else
          class="d-flex justify-content-center align-items-center text-center"
          style="height: 200px"
        >
          <p class="text-center-message">No tienes compras disponibles.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import Notificacion from "@/components/Notificacion.vue";

export default {
  components: {
    Notificacion,
  },
  data() {
    return {
      isAuthenticated: false, // Verificar si el usuario está autenticado
      userProfile: {}, // Información del cliente
      purchases: [], // Lista de compras
      notificacion: {
        visible: false,
        message: "",
        type: "",
        duration: 3000,
      },
    };
  },
  methods: {
    // Método para obtener los datos del cliente
    async fetchClientData() {
      try {
        console.log("Email enviado:", this.$store.getters.currentUser.email);

        const response = await axios.get(`${this.$url}/clientes`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
          params: {
            email: this.$store.getters.currentUser.email,
          },
        });

        console.log("Respuesta de la API:", response.data);

        if (response.data && response.data.cliente) {
          // Guardar la información del cliente
          this.userProfile = response.data.cliente;
          console.log("Usuario asignado a userProfile:", this.userProfile);
        } else {
          throw new Error("Datos del cliente no encontrados en la respuesta.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del cliente:", error);
        this.showNotification(
          "Error al obtener los datos del cliente.",
          "error"
        );
        this.$router.push({ name: "login" });
      }
    },
    // Método para obtener las compras del cliente
    async fetchPurchases() {
      if (!this.userProfile.id) {
        console.error("ID de cliente no definido.");
        return;
      }
      try {
        const response = await axios.get(
          `${this.$url}/compras/${this.userProfile.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );

        // Guardar la lista de compras
        this.purchases = response.data.compras;
      } catch (error) {
        console.error("Error al obtener las compras:", error);
        this.showNotification("Error al obtener las compras.", "error");
      }
    },

    // Método para redirigir a los detalles de una compra
    viewPurchaseDetails(purchase) {
      this.$router.push({
        name: "purchaseDetails",
        params: { id: purchase._id },
      });
    },

    // Formatear la fecha en un formato legible
    formatDate(date) {
      return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    // Obtener la clase CSS según el estado de la compra
    getStatusClass(status) {
      return {
        "badge bg-success": status === "Completada",
        "badge bg-warning": status === "Pendiente",
        "badge bg-danger": status === "Cancelada",
      }[true];
    },

    // Mostrar notificaciones al usuario
    showNotification(message, type) {
      this.notificacion = {
        visible: true,
        message,
        type,
        duration: 3000,
      };
      setTimeout(() => {
        this.notificacion.visible = false;
      }, this.notificacion.duration);
    },
  },

  // Ciclo de vida: se ejecuta cuando el componente se monta
  async mounted() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push({ name: "login" });
    } else {
      this.isAuthenticated = true;

      // Primero obtenemos los datos del cliente
      await this.fetchClientData();

      // Luego, obtenemos las compras del cliente
      this.fetchPurchases();
    }
  },
};
</script>

<style scoped>
.hero {
  background-color: #005f96;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  position: relative;
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

.card-header {
  font-size: 1rem;
  font-weight: bold;
}

.purchase-card {
  border-radius: 8px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.product-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.product-price {
  font-size: 0.9rem;
  color: #007bff;
}

.product-subtotal {
  font-size: 0.85rem;
  color: #555;
}

.text-center-message {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #95aac9;
  text-transform: uppercase;
  font-size: 14px;
  background-color: #f8f9fa;
  border: 2px dashed #cbd5e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
