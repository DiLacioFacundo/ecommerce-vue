<template>
  <div v-if="orders.length" class="container py-5">
    <h2 class="text-center mb-4">Mis Compras</h2>
    <div class="row justify-content-center">
      <div v-for="order in orders" :key="order._id" class="col-md-8 mb-4">
        <div class="card shadow-sm">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between"
          >
            <span
              ><i class="fas fa-receipt me-2"></i> Orden #{{
                order.serie
              }}</span
            >
            <span
              class="badge"
              :class="
                order.estado === 'Completado' ? 'bg-success' : 'bg-warning'
              "
            >
              {{ order.estado }}
            </span>
          </div>
          <div class="card-body">
            <p><strong>Fecha:</strong> {{ formatDate(order.createdAt) }}</p>
            <p><strong>Total:</strong> ${{ order.total.toFixed(2) }}</p>
            <p><strong>Envío:</strong> ${{ order.envio.toFixed(2) }}</p>
            <p><strong>Dirección:</strong> {{ order.direccion.direccion }}</p>
            <h5 class="mt-3">Detalles:</h5>
            <ul class="list-group">
              <li
                v-for="detail in order.details"
                :key="detail._id"
                class="list-group-item"
              >
                <strong>{{ detail.producto.nombre }}</strong> x{{
                  detail.cantidad
                }}
                - ${{ detail.subtotal.toFixed(2) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-5">
    <h4>No tienes órdenes registradas.</h4>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex"; // Para integrar con Vuex

export default {
  data() {
    return {
      orders: [],
    };
  },
  computed: {

    currentUser() {
      return this.$store.getters.currentUser || {};
    },
  },
  methods: {
  async fetchOrders() {
   /*     try {
        const response = await axios.get(
        //`${this.$url}/orders/${this.currentUser.id}`, // Asegúrate de que this.$url esté definido
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          }
        );
        this.orders = response.data.orders;
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
        this.$toast.error("No se pudieron cargar las órdenes.");
      }*/
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.card {
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.badge {
  font-size: 0.9rem;
}

.bg-success {
  background-color: #28a745 !important;
  color: white !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: black !important;
}

h5 {
  color: #333;
}
</style>
