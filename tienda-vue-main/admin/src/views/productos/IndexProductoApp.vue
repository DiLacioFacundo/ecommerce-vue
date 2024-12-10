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
      ></notificacion>
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <!-- Header -->
            <div class="header mt-md-3">
              <div class="header-body text-center">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">Productos</h6>
                    <h1 class="header-title">
                      <i class="fas fa-boxes me-2 text-primary"></i> Gestion de
                      Productos
                    </h1>
                  </div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col">
                    <!-- Nav -->
                    <ul
                      class="nav nav-tabs nav-overflow header-tabs justify-content-center"
                    >
                      <li class="nav-item">
                        <router-link
                          to="/producto"
                          class="nav-link"
                          active-class="active-link"
                        >
                          <i class="fas fa-list-alt me-1"></i> Listar Productos
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/producto/create" class="nav-link">
                          <i class="fas fa-plus-circle me-1"></i> Crear Producto
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/producto/edit/:id" class="nav-link">
                          <i class="fas fa-edit me-1"></i> Editar Producto
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- Buscador -->
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <div class="input-group">
                  <input
                    v-model="filtro"
                    class="form-control form-control-lg"
                    type="search"
                    placeholder="Busca tu producto..."
                  />
                  <button class="btn btn-primary">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tabla de Productos -->
            <div class="card shadow-sm">
              <div class="card-body table-responsive">
                <h5 class="card-title text-center">
                  <i class="fas fa-list-alt text-primary me-2"></i>
                  Listado de Productos
                </h5>
                <template v-if="!load_data">
                  <table class="table table-hover align-middle text-center">
                    <thead class="table-primary">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Portada</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Creado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="filteredProductos.length > 0">
                        <tr
                          v-for="(item, index) in paginatedProductos"
                          :key="item._id"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>
                            <img
                              :src="`${$url}/obtener_portada_producto/${item.portada}`"
                              alt="Producto"
                              class="rounded"
                              style="
                                width: 60px;
                                height: 60px;
                                object-fit: cover;
                              "
                            />
                          </td>
                          <td>
                            <h5
                              class="mb-0 text-truncate"
                              style="max-width: 150px"
                            >
                              <i class="fas fa-tag text-primary me-1"></i>
                              {{ item.titulo }}
                            </h5>
                          </td>
                          <td>
                            <span class="badge bg-info badge-custom">
                              <i class="fas fa-folder me-1"></i>
                              {{ item.categoria?.titulo || "Sin categoría" }}
                            </span>
                          </td>
                          <td>
                            <span
                              class="badge"
                              :class="
                                item.estado
                                  ? 'bg-success badge-custom'
                                  : 'bg-danger badge-custom'
                              "
                            >
                              {{ item.estado ? "Publicado" : "Borrador" }}
                            </span>
                          </td>
                          <td>{{ convertDate(item.createdAt) }}</td>
                          <td>
                            <div class="btn-group">
                              <button
                                class="btn btn-sm btn-outline-secondary btn-hover"
                                @click="editProduct(item._id)"
                              >
                                <i class="fas fa-edit"></i>
                              </button>
                              <button
                                class="btn btn-sm btn-outline-danger btn-hover"
                                @click="deleteProduct(item._id)"
                              >
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td colspan="7" class="text-center py-5">
                            <h6 class="text-uppercase text-muted">
                              No se encontraron productos
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
              </div>
              <div class="card-footer text-center">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="filteredProductos.length"
                  :per-page="perPage"
                  align="center"
                  aria-controls="my-table"
                ></b-pagination>
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
import moment from "moment";

export default {
  name: "IndexProductoApp",
  data() {
    return {
      productos: [],
      filtro: "",
      load_data: false,
      currentPage: 1,
      perPage: 5,
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "info",
    };
  },
  computed: {
    filteredProductos() {
      if (!this.filtro.trim()) {
        return this.productos;
      }
      return this.productos.filter((item) =>
        item.titulo.toLowerCase().includes(this.filtro.toLowerCase())
      );
    },
    paginatedProductos() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredProductos.slice(start, end);
    },
  },
  methods: {
    async init_data() {
      this.load_data = true;
      try {
        const response = await axios.get(
          this.$url + "/listar_productos_admin",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.productos = response.data;
      } catch (error) {
        console.error("Error cargando productos:", error);
        this.showNotification("Error al cargar los productos.", "danger");
      } finally {
        this.load_data = false;
      }
    },
    convertDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    editProduct(id) {
      if (!id) {
        console.error("ID inválido para la edición del producto.");
        return;
      }
      this.$router.push({ name: "producto-edit", params: { id } });
    },
    async deleteProduct(id) {
      if (confirm("¿Seguro que quieres eliminar este producto?")) {
        try {
          await axios.delete(`${this.$url}/eliminar_producto/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.productos = this.productos.filter(
            (producto) => producto._id !== id
          );
          this.showNotification("Producto eliminado exitosamente.", "success");
        } catch (error) {
          console.error("Error eliminando producto:", error);
          this.showNotification("Error al eliminar el producto.", "danger");
        }
      }
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
  mounted() {
    this.init_data();
  },
  components: {
    Sidebar,
    TopNav,
    Notificacion,
  },
};
</script>

<style scoped>
.card-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.card {
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
}

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

.badge-custom {
  font-size: 16px;
  padding: 0.5em 1em;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-pretitle {
  font-size: 14px;
  color: #6c757d;
}

.nav-link {
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 500;
  color: #007bff; /* Texto normal */
  background-color: transparent; /* Fondo normal */
  text-align: center; /* Centrar texto */
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: white !important;
  background-color: #007bff;
}

.active-link {
  color: white !important;
  background-color: #007bff !important;
  font-weight: 600;
}

.nav-link.active {
  color: white !important;
  background-color: #007bff !important;
  font-weight: 600;
}

.nav-tabs {
  display: flex;
  justify-content: center;
}

.nav-item {
  margin: 0 10px;
}

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

.input-group .form-control {
  border-radius: 8px 0 0 8px;
  padding: 12px;
  font-size: 16px;
}

.input-group .btn-primary {
  border-radius: 0 8px 8px 0;
  padding: 12px;
  font-size: 16px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.card-footer {
  text-align: center;
  padding-top: 15px;
}

.grow-on-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grow-on-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.table-responsive {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 8px;
}

/* Centrado de contenido */
.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.vh-100 {
  height: 100vh;
}

.text-center {
  text-align: center;
}
</style>
