<template>
  <div class="dashboard-app">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Navigation -->
      <TopNav />

      <!-- Spinner de Carga -->
      <div v-if="isLoading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="container-fluid">
        <!-- Header -->
        <div class="header mt-md-3">
          <div class="header-body text-center">
            <div class="row justify-content-center">
              <div class="col-12 col-lg-10 col-xl-8">
                <h6 class="header-pretitle">Panel Administrativo</h6>
                <h1 class="header-title">
                  <i class="fas fa-chart-line me-2 text-primary"></i> Dashboard
                </h1>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="row g-4 justify-content-center">
          <div class="col-lg-3 col-md-6">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="text-uppercase text-muted">Total Ventas</h5>
                <h3 class="text-primary">$ {{ totalSales }}</h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="text-uppercase text-muted">Usuarios Activos</h5>
                <h3 class="text-success">{{ activeUsers }}</h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="text-uppercase text-muted">Pedidos Pendientes</h5>
                <h3 class="text-warning">{{ pendingOrders }}</h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="text-uppercase text-muted">Ganancias</h5>
                <h3 class="text-danger">$ {{ earnings }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas adicionales -->
        <div class="row g-4 justify-content-center">
          <div class="col-lg-3 col-md-6">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="text-uppercase text-muted">Pedidos Cancelados</h5>
                <h3 class="text-danger">{{ canceledOrders }}</h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="text-uppercase text-muted">Tasa de Retención</h5>
                <h3 class="text-info">{{ customerRetentionRate }}%</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="row g-4 mt-4 justify-content-center">
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-header text-center">
                <h5 class="card-title">
                  <i class="fas fa-chart-bar text-primary me-2"></i> Ventas
                  Mensuales
                </h5>
              </div>
              <div class="card-body chart-container">
                <canvas id="monthlySalesChart"></canvas>
                <p
                  v-if="!monthlySalesData.length"
                  class="text-muted text-center mt-3"
                >
                  No hay datos disponibles para este gráfico.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-header text-center">
                <h5 class="card-title">
                  <i class="fas fa-chart-pie text-primary me-2"></i>
                  Distribución de Pedidos
                </h5>
              </div>
              <div class="card-body chart-container">
                <canvas id="ordersDistributionChart"></canvas>
                <p
                  v-if="!ordersDistribution.length"
                  class="text-muted text-center mt-3"
                >
                  No hay datos disponibles para este gráfico.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos más vendidos -->
        <div class="row g-4 mt-4 justify-content-center">
          <div class="col-md-12">
            <div class="card shadow-sm">
              <div class="card-body table-responsive">
                <h5 class="card-title text-center">
                  <i class="fas fa-star text-warning me-2"></i>
                  <span class="text-uppercase fw-bold">
                    Productos Más Vendidos
                  </span>
                </h5>
                <div class="card-body">
                  <div v-if="topSellingProducts.length">
                    <ul class="list-group">
                      <li
                        v-for="(product, index) in topSellingProducts"
                        :key="product.titulo"
                        class="list-group-item d-flex align-items-center p-3 mb-2 rounded shadow-sm"
                        :style="{
                          background: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                        }"
                      >
                        <!-- Imagen del producto -->
                        <img
                          :src="formatImageUrl(product.imagen)"
                          alt="Imagen del Producto"
                          class="rounded me-3"
                          style="
                            width: 80px;
                            height: 80px;
                            object-fit: cover;
                            border: 2px solid #007bff;
                          "
                        />
                        <!-- Detalles del producto -->
                        <div class="d-flex flex-column flex-grow-1">
                          <span class="fw-bold text-primary">
                            {{ index + 1 }}. {{ product.titulo }}
                          </span>
                          <small class="text-muted">
                            Ventas: {{ product.totalVentas }}
                          </small>
                        </div>
                        <!-- Botón de detalles -->
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="openProductDetails(product)"
                        >
                          <i class="fas fa-info-circle"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <p v-else class="text-muted text-center mt-3">
                    No hay productos disponibles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalles del Producto -->
        <div v-if="selectedProduct" class="row g-4 mt-4 justify-content-center">
          <div class="col-md-12">
            <div class="card shadow-sm">
              <div class="card-header text-center">
                <h5 class="card-title">
                  <i class="fas fa-info-circle text-primary me-2"></i> Detalles
                  del Producto
                </h5>
              </div>
              <div class="card-body table-responsive">
                <table class="table table-hover align-middle text-center">
                  <thead class="table-primary">
                    <tr>
                      <th scope="col">Imagen</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Precio</th>
                      <th scope="col">Stock</th>
                      <th scope="col">Ventas Totales</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          :src="formatImageUrl(selectedProduct.imagen)"
                          alt="Producto"
                          class="rounded"
                          style="width: 60px; height: 60px; object-fit: cover"
                        />
                      </td>
                      <td>
                        <h5
                          class="d-flex align-items-center justify-content-center"
                        >
                          <i class="fas fa-tag text-primary me-2"></i>
                          {{ selectedProduct.titulo }}
                        </h5>
                      </td>
                      <td class="text-dark">
                        {{ selectedProduct.descripcion || "Sin descripción" }}
                      </td>
                      <td>${{ selectedProduct.precio }}</td>
                      <td>
                        <span class="badge bg-success">
                          {{ selectedProduct.stock }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-info">
                          {{ selectedProduct.totalVentas }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="card-footer text-end">
                <button
                  class="btn btn-outline-secondary"
                  @click="clearProductDetails"
                >
                  <i class="fas fa-times me-1"></i> Cerrar Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";
import Chart from "chart.js/auto";
import axios from "axios";

export default {
  name: "Dashboard",
  components: {
    Sidebar,
    TopNav,
  },
  data() {
    return {
      isLoading: true,
      totalSales: 0,
      activeUsers: 0,
      pendingOrders: 0,
      earnings: 0,
      monthlySalesData: [],
      ordersDistribution: [],
      topSellingProducts: [],
      customerRetentionRate: 0,
      canceledOrders: 0,
      selectedProduct: null,
    };
  },
  async mounted() {
    await this.fetchDashboardData();
    this.$nextTick(() => {
      this.renderCharts();
    });
    this.isLoading = false;
  },
  methods: {
    formatImageUrl(imagePath) {
      if (!imagePath) {
        return "/assets/images/no_image.png";
      }

      let fullUrl = `${this.$url}${imagePath}`;

      // Corrige las URLs si incluyen "/api"
      fullUrl = fullUrl.includes("/api")
        ? fullUrl.replace("/api", "")
        : fullUrl;

      return fullUrl;
    },
    // Fetch de datos del backend
    async fetchDashboardData() {
      try {
        const response = await axios.get(`${this.$url}/get_dashboard_data`, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` },
        });

        const data = response.data;

        // Actualiza valores con los datos recibidos
        this.totalSales = data?.totalSales || 0;
        this.activeUsers = data?.activeUsers || 0;
        this.pendingOrders = data?.pendingOrders || 0;
        this.earnings = data?.totalEarnings || 0;
        this.monthlySalesData = data?.monthlyEarnings || [];
        this.ordersDistribution = data?.salesByStatus || [];
        this.topSellingProducts = data?.topSellingProducts || [];
        this.customerRetentionRate = data?.customerRetentionRate || 0;
        this.canceledOrders = data?.canceledOrders || 0;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },

    // Renderiza todos los gráficos
    renderCharts() {
      this.$nextTick(() => {
        this.renderMonthlySalesChart();
        this.renderOrdersDistributionChart();
      });
    },

    // Gráfico de Ventas Mensuales
    renderMonthlySalesChart() {
      const canvas = document.getElementById("monthlySalesChart");
      if (!canvas) {
        console.error(
          "No se encontró el elemento canvas con ID 'monthlySalesChart'"
        );
        return;
      }

      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.monthlySalesData.map(
            (month) => `${month.year}-${String(month.month).padStart(2, "0")}`
          ),
          datasets: [
            {
              label: "Ganancias ($)",
              data: this.monthlySalesData.map((month) => month.totalGanancias),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    // Gráfico de Distribución de Pedidos
    renderOrdersDistributionChart() {
      const canvas = document.getElementById("ordersDistributionChart");
      if (!canvas) {
        console.error(
          "No se encontró el elemento canvas con ID 'ordersDistributionChart'"
        );
        return;
      }

      // Validar si hay datos disponibles
      if (!this.ordersDistribution.length) {
        console.warn("No hay datos para el gráfico de distribución de pedidos");
        return;
      }

      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: this.ordersDistribution.map((status) => status.label),
          datasets: [
            {
              label: "Distribución de Pedidos",
              data: this.ordersDistribution.map((status) => status.value),
              backgroundColor: ["#ffc107", "#17a2b8", "#28a745", "#dc3545"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    openProductDetails(product) {
      this.selectedProduct = product;
    },
    clearProductDetails() {
      this.selectedProduct = null;
    },
  },
};
</script>

<style scoped>

/* Header Styles */
.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-pretitle {
  font-size: 14px;
  color: #6c757d;
}


.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* General Card Styles */
.card-title {  
  letter-spacing: 1px; 
  text-transform: uppercase; 
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.card {
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

/* Table Styles */
.table {
  border-collapse: separate;
  border-spacing: 0;
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
}

.table-primary th {
  background: #007bff;
  color: white;
  font-weight: bold;
  border: 1px solid #007bff;
  font-size: 16px;
  padding: 12px 16px;
}

.table th,
.table td {
  border: 1px solid #007bff;
  text-align: center;
  vertical-align: middle;
  font-size: 15px;
  padding: 10px 15px;
}

/* Table Responsive */
.table-responsive {
  max-height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 8px;
  display: block;
}

/* Estilo para la lista */
.list-group-item {
  display: flex;
  align-items: center;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
}

.list-group-item:hover {
  background-color: #f1f1f1;
  transform: translateY(-3px);
}

/* Imagen más visible */
.list-group-item img {
  border-radius: 8px;
  border: 2px solid #007bff;
  transition: all 0.2s ease;
}

.list-group-item img:hover {
  transform: scale(1.1);
  border-color: #0056b3;
}

/* Diferenciación de filas */
.list-group-item:nth-child(odd) {
  background-color: #f9f9f9;
}

.list-group-item:nth-child(even) {
  background-color: #ffffff;
}

/* Badge Styles */
.badge-custom {
  font-size: 16px;
  padding: 0.5em 1em;
}

/* Button Styles */
.btn {
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-group .btn {
  margin-right: 8px;
}

.btn:hover {
  transform: translateY(-2px);
}

/* Spinner Styles */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Centered Content */
.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}
</style>
