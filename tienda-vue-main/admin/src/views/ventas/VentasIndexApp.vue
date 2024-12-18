<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <notificacion
        v-if="notificationVisible"
        :message="notificationMessage"
        :type="notificationType"
        @close="notificationVisible = false"
      />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <!-- Dashboard Header -->
          <div class="col-12 col-lg-10 col-xl-8" style="width: 100%">
            <div class="header mt-md-3">
              <div class="header-body text-center">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">VENTAS</h6>
                    <h1 class="header-title">
                      <i class="fas fa-chart-bar me-2 text-primary"></i> Gestión
                      de Ventas
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtros Avanzados -->
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <div class="row g-3 align-items-center">
                  <div class="col-md-3">
                    <div class="input-group">
                      <span class="input-group-text bg-primary text-white">
                        <i class="fas fa-search"></i>
                      </span>
                      <input
                        v-model="searchQuery"
                        class="form-control"
                        type="search"
                        placeholder="Buscar clientes, email o transacciones"
                      />
                    </div>
                  </div>
                  <div class="col-md-3">
                    <select
                      v-model="filterByDateRange"
                      class="form-select custom-dropdown"
                    >
                      <option value="today">Hoy</option>
                      <option value="week">Última Semana</option>
                      <option value="month">Último Mes</option>
                      <option value="all">Todo</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <select
                      v-model="filterByState"
                      class="form-select custom-dropdown"
                    >
                      <option value="">Filtrar por Estado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div class="col-md-3 text-center">
                    <button
                      class="btn btn-primary me-2"
                      @click="loadSales"
                      :disabled="loading"
                    >
                      <i class="fas fa-sync-alt"></i> Traer
                    </button>
                    <button
                      @click="clearFilters"
                      class="btn btn-sm btn-outline-secondary"
                    >
                      <i class="fas fa-broom"></i> Limpiar Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resumen de Ventas -->
            <div class="row mb-4">
              <div class="col-12 col-md-4">
                <div class="card text-center shadow-sm">
                  <div class="card-body">
                    <h6>Total Ventas</h6>
                    <h2 class="text-primary">{{ totalSales }}</h2>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="card text-center shadow-sm">
                  <div class="card-body">
                    <h6>Ingresos Totales</h6>
                    <h2 class="text-success">$ {{ totalRevenue }}</h2>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="card text-center shadow-sm">
                  <div class="card-body">
                    <h6>Ventas Pendientes</h6>
                    <h2 class="text-danger">{{ pendingSales }}</h2>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Ventas -->
            <div class="card shadow-sm">
              <div class="card-body table-responsive">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <h5 class="card-title">
                    <i class="fas fa-list-alt text-primary me-2"></i> Listado de
                    Ventas
                  </h5>
                  <!-- Dropdown para ordenar -->
                  <div
                    class="input-group w-auto align-items-center custom-dropdown-container"
                  >
                    <div class="input-group">
                      <select
                        v-model="sortOrder"
                        id="sortDropdown"
                        class="form-select custom-dropdown compact-dropdown"
                        @change="sortByDate"
                      >
                        <option value="asc">Fecha (Menor a Mayor)</option>
                        <option value="desc">Fecha (Mayor a Menor)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <template v-if="!loading">
                  <table class="table table-hover align-middle text-center">
                    <thead class="table-primary">
                      <tr>
                        <th>#</th>
                        <th>Transacción</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Envío</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Ventas disponibles -->
                      <template v-if="filteredSales.length > 0">
                        <tr
                          v-for="(sale, index) in paginatedSales"
                          :key="sale._id"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ sale.transaccion }}</td>
                          <td>{{ sale.cliente.nombres }}</td>
                          <td>{{ sale.cliente.email }}</td>
                          <td>
                            {{
                              sale.createdAt
                                ? new Date(sale.createdAt).toLocaleDateString(
                                    "es-ES",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "Sin fecha"
                            }}
                          </td>
                          <td>$ {{ sale.total }}</td>
                          <td>$ {{ sale.envio }}</td>
                          <td>
                            <span
                              class="badge"
                              :class="getBadgeClass(sale.estado)"
                            >
                              {{ sale.estado }}
                            </span>
                          </td>
                          <td>
                            <div class="btn-group">
                              <button
                                class="btn btn-sm btn-outline-info"
                                @click="viewDetails(sale)"
                              >
                                <i class="fas fa-eye"></i>
                              </button>
                              <button
                                class="btn btn-sm btn-outline-danger"
                                @click="confirmCancelSale(sale._id)"
                                v-if="sale.estado !== 'Cancelada'"
                              >
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </template>

                      <!-- No se encontraron ventas -->
                      <template v-else>
                        <tr>
                          <td colspan="9" class="text-center py-5">
                            <h6 class="text-uppercase text-muted">
                              No se encontraron ventas
                            </h6>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </template>
                <template v-else>
                  <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                </template>
                <div class="card-footer text-center">
                  <div
                    class="d-flex justify-content-center align-items-center gap-3"
                  >
                    <select
                      v-model="perPage"
                      class="form-select custom-dropdown w-auto paginator-dropdown"
                    >
                      <option :value="5">5 registros por pagina</option>
                      <option :value="10">10 registros por pagina</option>
                      <option :value="20">20 registros por pagina</option>
                    </select>
                    <div class="paginator-container">
                      <b-pagination
                        v-model="currentPage"
                        :total-rows="filteredSales.length"
                        :per-page="perPage"
                        align="center"
                        aria-controls="sales-table"
                      ></b-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Tabla de Detalles de Venta -->
            <div v-if="selectedSale" class="card shadow-sm mb-4">
              <div class="card-body table-responsive">
                <h5 class="card-title text-center">
                  <i class="fas fa-list-alt text-primary me-2"></i> Detalles de
                  la Venta
                </h5>
                <table class="table table-hover align-middle text-center">
                  <thead class="table-primary">
                    <tr>
                      <th>#</th>
                      <th></th>
                      <th>Producto</th>
                      <th>Variedad</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in selectedSaleDetails"
                      :key="index"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>
                        <img
                          :src="item.imagen"
                          alt="Imagen del producto"
                          style="width: 50px; height: auto; border-radius: 5px"
                        />
                      </td>
                      <td>{{ item.producto }}</td>
                      <td>{{ item.variedad }}</td>
                      <td>{{ item.cantidad }}</td>
                      <td>$ {{ item.precio_unidad }}</td>
                      <td>$ {{ item.subtotal }}</td>
                    </tr>
                  </tbody>
                </table>
                <!-- No se encontraron detalles -->
                <template v-if="selectedSaleDetails.length === 0">
                  <div class="text-center py-5">
                    <h6 class="text-uppercase text-muted">
                      No se encontraron detalles
                    </h6>
                  </div>
                </template>
                <div class="card-footer text-center">
                  <div
                    class="d-flex justify-content-center align-items-center gap-3"
                  >
                    <select
                      v-model="detailsPerPage"
                      class="form-select custom-dropdown w-auto paginator-dropdown"
                    >
                      <option :value="5">5 registros por pagina</option>
                      <option :value="10">10 registros por pagina</option>
                      <option :value="20">20 registros por pagina</option>
                    </select>
                    <div class="paginator-container">
                      <b-pagination
                        v-model="currentDetailsPage"
                        :total-rows="selectedSaleDetails.length"
                        :per-page="detailsPerPage"
                        align="center"
                        aria-controls="details-table"
                      ></b-pagination>
                    </div>
                  </div>
                </div>
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
import Notificacion from "@/components/Notificacion.vue";
import axios from "axios";

export default {
  data() {
    return {
      allSales: [], // Lista de ventas
      filteredSales: [], // Ventas filtradas según los filtros
      selectedSale: null, // Venta seleccionada
      selectedSaleDetails: [], // Detalles de la venta seleccionada
      currentPage: 1,
      perPage: 5,
      currentDetailsPage: 1,
      detailsPerPage: 5,
      searchQuery: "",
      filterByDateRange: "all",
      filterByState: "",
      totalSales: 0,
      totalRevenue: 0,
      pendingSales: 0,
      loading: false,
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "success",
      sortBy: "createdAt", // Criterio de ordenación inicial
      sortOrder: "asc", // Orden inicial
    };
  },
  components: {
    Sidebar,
    TopNav,
    Notificacion,
  },
  computed: {
    // Ventas filtradas y ordenadas según los criterios
    filteredSales() {
      let filtered = this.sales;

      // Filtro por búsqueda
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (sale) =>
            sale.cliente.nombres.toLowerCase().includes(query) ||
            sale.cliente.email.toLowerCase().includes(query) ||
            sale.transaccion.toLowerCase().includes(query)
        );
      }

      // Filtro por estado
      if (this.filterByState !== "") {
        filtered = filtered.filter(
          (sale) => sale.estado === this.filterByState
        );
      }

      // Filtro por rango de fechas
      if (this.filterByDateRange !== "all") {
        const now = new Date();
        filtered = filtered.filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          switch (this.filterByDateRange) {
            case "today":
              return saleDate.toDateString() === now.toDateString();
            case "week":
              const lastWeek = new Date();
              lastWeek.setDate(now.getDate() - 7);
              return saleDate >= lastWeek;
            case "month":
              return (
                saleDate.getMonth() === now.getMonth() &&
                saleDate.getFullYear() === now.getFullYear()
              );
            default:
              return true;
          }
        });
      }

      // Ordenar las ventas por el criterio seleccionado
      filtered = filtered.sort((a, b) => {
        const valueA = this.getValueForSorting(a, this.sortBy);
        const valueB = this.getValueForSorting(b, this.sortBy);

        if (this.sortOrder === "asc") {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      });

      return filtered;
    },
    paginatedDetails() {
      const start = (this.currentDetailsPage - 1) * this.detailsPerPage;
      const end = start + this.detailsPerPage;
      return this.selectedSaleDetails.slice(start, end);
    },
    // Paginación de las ventas filtradas
    paginatedSales() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredSales.slice(start, end);
    },
  },
  watch: {
    filteredSales(newSales) {
      this.calculateStatistics(newSales);
    },
  },
  methods: {
    sortByDate() {
      this.filteredSales = this.filteredSales.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return this.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    },
    // Cambiar el criterio de ordenación
    sort(criterion) {
      if (this.sortBy === criterion) {
        // Si el criterio ya es el mismo, solo cambia el orden
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        // Si es un nuevo criterio, cambia el criterio y orden ascendente por defecto
        this.sortBy = criterion;
        this.sortOrder = "asc";
      }
    },
    // Obtener el valor para ordenamiento
    getValueForSorting(item, criterion) {
      return criterion.includes(".")
        ? criterion.split(".").reduce((obj, key) => obj?.[key], item)
        : item[criterion];
    },
    async confirmCancelSale(id) {
      const confirmation = confirm(
        "¿Estás seguro de que deseas cancelar esta venta?"
      );
      if (confirmation) {
        this.cancelSale(id);
      }
    },
    async cancelSale(id) {
      try {
        // Actualización optimista: Cambia el estado de la venta en el frontend
        const saleIndex = this.sales.findIndex((sale) => sale._id === id);
        if (saleIndex !== -1) {
          this.sales[saleIndex].estado = "Cancelada";
        }

        // Llamada a la API para cancelar la venta en el backend
        await axios.put(
          `${this.$url}/ventas/estado`,
          { id, estado: "Cancelada" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.showNotification("Venta cancelada correctamente.", "success");
        this.loadSales(); // Recargar ventas
      } catch (error) {
        console.error("Error al cancelar la venta:", error);
        this.showNotification(
          "No se pudo cancelar la venta. Intenta nuevamente.",
          "error"
        );
      }
    },
    async loadSales() {
      this.loading = true;
      this.notificationVisible = false; // Ocultar cualquier notificación anterior
      try {
        const response = await axios.get(`${this.$url}/ventas/admin`, {
          params: {
            filtro: this.filterByDateRange,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        this.sales = response.data;
        this.filteredSales = this.sales;
        this.showNotification("Ventas cargadas correctamente.", "success");
      } catch (error) {
        console.error("Error al cargar las ventas:", error);
        this.showNotification(
          "Error al cargar las ventas. Intenta nuevamente.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
    async viewDetails(sale) {
      if (this.loading) return; // Evita llamadas simultáneas

      try {
        this.loading = true; // Indica que los datos están cargando
        const response = await axios.get(
          `${this.$url}/ventas/admin/${sale._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Asigna los datos directamente
        this.selectedSale = response.data.venta;

        // Procesa los detalles
        this.selectedSaleDetails = response.data.detalles.map((detalle) => {
          const formattedImage = this.formatImageUrl(detalle.producto.imagen); // Usa la función para formatear la URL

          return {
            ...detalle,
            producto: detalle.producto.titulo, // Asigna el nombre del producto
            variedad: detalle.variedad ? detalle.variedad.nombre : "", // Asigna el nombre de la variedad
            imagen: formattedImage, // Agrega la URL formateada de la imagen
          };
        });

        this.showDetailsModal = true; // Abre el modal
      } catch (error) {
        console.error("Error al obtener detalles de la venta:", error);
        this.showNotification(
          "No se pudieron cargar los detalles de la venta.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
    formatImageUrl(imagePath) {
      if (!imagePath) {
        return "/assets/icons/user.png";
      }

      let fullUrl = `${this.$url}${imagePath}`;

      fullUrl = fullUrl.includes("/api")
        ? fullUrl.replace("/api", "")
        : fullUrl;

      return fullUrl;
    },
    clearFilters() {
      this.searchQuery = "";
      this.filterByDateRange = "all";
      this.filterByState = "";
      this.currentPage = 1;
      this.sales = [];
    },
    getBadgeClass(status) {
      switch (status) {
        case "Pendiente":
          return "badge-warning";
        case "Completada":
          return "badge-success";
        case "Cancelada":
          return "badge-danger";
        default:
          return "badge-secondary";
      }
    },
    calculateStatistics(sales) {
      this.totalSales = sales.length;
      this.totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      this.pendingSales = sales.filter(
        (sale) => sale.estado === "Pendiente"
      ).length;
    },
    showNotification(message, type) {
      this.notificationMessage = message;
      this.notificationType = type;
      this.notificationVisible = true;
      setTimeout(() => {
        this.notificationVisible = false;
      }, 3000);
    },
  },
};
</script>


<style scoped>
.card.shadow-sm.mt-2 {
  width: 100%;
  margin: 0 auto; /* Centrar horizontalmente */
}
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

/* General Card Styles */
.card-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.card {
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

/* Enhanced Header Styles */
.card-header {
  background-color: #007bff;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border-radius: 10px 10px 0 0;
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
/* Input Fields */

.input-group-text {
  border-radius: 8px 0 0 8px;
  color: #ffffff;
  background-color: #007bff;
}

.form-label {
  font-weight: 600;
  font-size: 16px;
  color: #343a40;
  margin-bottom: 8px;
}
/* Buttons */
.btn {
  border-radius: 8px;
  font-size: 15px;
  padding: 10px 16px;
  transition: all 0.2s ease-in-out;
}

.btn-success {
  background-color: #28a745;
  color: #ffffff;
  border: none;
}

.btn-success:hover {
  background-color: #218838;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.5);
}

.btn-secondary {
  background-color: #6c757d;
  color: #ffffff;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.5);
}

/* Dropdown Styles */
.custom-dropdown {
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-dropdown:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
}

.custom-dropdown:hover {
  background-color: #f9f9f9;
}

.custom-dropdown option {
  padding: 10px;
  font-size: 16px;
}

.form-control {
  border-radius: 0 8px 8px 0;
  border: 2px solid #ddd;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
}
/* Badge Styles */
.badge {
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 5px;
}
.badge-warning {
  background-color: #ffc107;
}

.badge-success {
  background-color: #28a745;
  color: #ffffff;
}

.badge-danger {
  background-color: #dc3545;
  color: #ffffff;
}

.badge-secondary {
  background-color: #6c757d;
}
/* Hover Effects */
.btn:hover,
.input-custom:hover,
.custom-dropdown:hover {
  transform: translateY(-2px);
}

/* Spinner Styles */
.spinner-border {
  width: 2.5rem;
  height: 2.5rem;
  border-width: 0.2em;
  color: #007bff;
}
.paginator-dropdown {
  min-width: 200px;
}

.paginator-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.paginator-container .pagination {
  margin: 0;
}

.text-muted {
  font-size: 16px;
  color: #6c757d; /* Gris claro */
}

@media (max-width: 768px) {
  .table {
    font-size: 14px;
  }
  .table th,
  .table td {
    padding: 8px;
  }

  .input-custom {
    font-size: 14px;
    padding: 10px;
  }

  .btn {
    padding: 8px 12px;
  }
}
</style>