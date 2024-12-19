<template>
  <div class="dashboard-app">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Navigation -->
      <TopNav />

      <!-- Dashboard Content -->
      <div class="container-fluid mt-4">
        <div class="row">
          <!-- Resumen -->
          <div class="col-md-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted">Total Ventas</h6>
                <h3 class="text-primary">$ {{ totalSales }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted">Usuarios Activos</h6>
                <h3 class="text-success">{{ activeUsers }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted">Pedidos Pendientes</h6>
                <h3 class="text-warning">{{ pendingOrders }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted">Ganancias</h6>
                <h3 class="text-danger">$ {{ earnings }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">Ventas Mensuales</h5>
              </div>
              <div class="card-body">
                <canvas id="monthlySalesChart"></canvas>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">Distribución de Pedidos</h5>
              </div>
              <div class="card-body">
                <canvas id="ordersDistributionChart"></canvas>
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
      totalSales: 0,
      activeUsers: 0,
      pendingOrders: 0,
      earnings: 0,
      monthlySalesData: [],
      ordersDistribution: [],
    };
  },
  async mounted() {
    await this.fetchDashboardData();
    this.renderMonthlySalesChart();
    this.renderOrdersDistributionChart();
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await axios.get(
          `${this.$url}/dashboard/get_dashboard_data`,
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          }
        );
        const data = response.data;

        this.totalSales = data.totalSales || 0;
        this.activeUsers = data.activeUsers || 0;
        this.pendingOrders = data.pendingOrders || 0;
        this.earnings = data.totalEarnings || 0;
        this.monthlySalesData = data.monthlySales || [];
        this.ordersDistribution = data.ordersDistribution || [];
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },
    renderMonthlySalesChart() {
      const ctx = document.getElementById("monthlySalesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.monthlySalesData.map((month) => month.label),
          datasets: [
            {
              label: "Ventas ($)",
              data: this.monthlySalesData.map((month) => month.value),
              backgroundColor: "rgba(0, 123, 255, 0.5)",
            },
            {
              label: "Ganancias ($)",
              data: this.monthlySalesData.map((month) => month.earnings),
              backgroundColor: "rgba(40, 167, 69, 0.5)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    renderOrdersDistributionChart() {
      const ctx = document
        .getElementById("ordersDistributionChart")
        .getContext("2d");
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
  },
};
</script>

<style scoped>
.dashboard-app {
  display: flex;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  background-color: #f8f9fa;
  overflow-y: auto;
  padding: 20px;
}

.card {
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  font-size: 16px;
}

.card-body {
  height: 300px;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
