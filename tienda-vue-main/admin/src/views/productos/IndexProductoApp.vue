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
          <div class="col-12 col-lg-10 col-xl-8" style="width: 100%">
            <!-- Header -->
            <div class="header mt-md-3">
              <div class="header-body text-center">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">Productos</h6>
                    <h1 class="header-title">
                      <i class="fas fa-boxes me-2 text-primary"></i> Gestión de
                      Productos
                    </h1>
                  </div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col">
                    <ul
                      class="nav nav-tabs nav-overflow header-tabs justify-content-center"
                    >
                      <li class="nav-item">
                        <router-link to="/producto" class="nav-link active">
                          <i class="fas fa-list-alt me-1"></i> Listar Productos
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/producto/create" class="nav-link">
                          <i class="fas fa-plus-circle me-1"></i> Crear Producto
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtros -->
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <div class="row g-3 align-items-center">
                  <div class="col-md-4">
                    <div class="input-group">
                      <span class="input-group-text bg-primary text-white">
                        <i class="fas fa-search"></i>
                      </span>
                      <input
                        v-model="filtro"
                        class="form-control"
                        type="search"
                        placeholder="Busca tu producto"
                      />
                    </div>
                  </div>
                  <div class="col-md-3">
                    <select
                      v-model="filtroCategoria"
                      @change="fetchSubcategorias(filtroCategoria)"
                      class="form-select custom-dropdown"
                    >
                      <option value="" selected>Filtrar por Categoría</option>
                      <option
                        v-for="categoria in categorias"
                        :key="categoria.id"
                        :value="categoria.id"
                      >
                        {{ categoria.titulo }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <select
                      v-model="filtroSubcategoria"
                      class="form-select custom-dropdown"
                    >
                      <option value="" selected>
                        Filtrar por Subcategoría
                      </option>
                      <option
                        v-for="subcategoria in subcategorias"
                        :key="subcategoria.id"
                        :value="subcategoria.id"
                      >
                        {{ subcategoria.titulo }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <select
                      v-model="filtroEstado"
                      class="form-select custom-dropdown"
                    >
                      <option value="" selected>Estado</option>
                      <option value="Publicado">Publicado</option>
                      <option value="Desactivado">Desactivado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Productos -->
            <div class="card shadow-sm">
              <div class="card-body table-responsive">
                <h5 class="card-title text-center">
                  <i class="fas fa-list-alt text-primary me-2"></i> Listado de
                  Productos
                </h5>
                <template v-if="!load_data">
                  <table class="table table-hover align-middle text-center">
                    <thead class="table-primary">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Imagen</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Subcategoría</th>
                        <th scope="col">Variedad</th>
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
                              :src="
                                item.imagenes.length > 0
                                  ? item.imagenes[0]
                                  : '/assets/images/no_image.png'
                              "
                              @error="setDefaultImage($event)"
                              alt="Producto"
                              class="rounded"
                              style="
                                width: 60px;
                                height: 60px;
                                object-fit: cover;
                              "/>
                          </td>

                          <td>
                            <h5>
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
                            <span class="badge bg-secondary badge-custom">
                              <i class="fas fa-folder-open me-1"></i>
                              {{
                                item.subcategoria?.titulo || "Sin subcategoría"
                              }}
                            </span>
                          </td>
                          <td>{{ item.str_variedad || "N/A" }}</td>
                          <td>
                            <span
                              class="badge"
                              :class="
                                item.estado
                                  ? 'bg-success badge-custom'
                                  : 'bg-danger badge-custom'
                              "
                            >
                              {{ item.estado ? "Publicado" : "Desactivado" }}
                            </span>
                          </td>
                          <td>{{ convertDate(item.createdAt) }}</td>
                          <td>
                            <div class="btn-group">
                              <button
                                class="btn btn-sm btn-outline-primary btn-hover"
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
                          <td colspan="9" class="text-center py-5">
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
      filtroCategoria: "",
      filtroSubcategoria: "",
      filtroEstado: "",
      categorias: [],
      subcategorias: [],
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
      return this.productos
        .filter((item) => {
          if (this.filtro.trim()) {
            return item.titulo
              .toLowerCase()
              .includes(this.filtro.toLowerCase());
          }
          return true;
        })
        .filter((item) => {
          if (this.filtroCategoria) {
            return item.categoria?._id === this.filtroCategoria;
          }
          return true;
        })
        .filter((item) => {
          if (this.filtroSubcategoria) {
            return item.subcategoria?._id === this.filtroSubcategoria;
          }
          return true;
        })
        .filter((item) => {
          if (this.filtroEstado) {
            return item.estado === (this.filtroEstado === "Publicado");
          }
          return true;
        });
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
        const [productosResponse, categoriasResponse] = await Promise.all([
          axios.get(`${this.$url}/listar_productos_admin`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${this.$url}/listar_categorias_admin`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        this.productos = productosResponse.data.map((producto) => {
          return {
            ...producto,
            imagenes: producto.imagenes.map((img) =>
              img.startsWith("http")
                ? img
                : `${this.$url}/uploads/productos/${img}`
            ),
          };
        });

        // Filtrar categorías que tienen subcategorías
        if (
          categoriasResponse.data.categorias &&
          Array.isArray(categoriasResponse.data.categorias)
        ) {
          this.categorias = categoriasResponse.data.categorias
            .filter(
              (item) => item.subcategorias && item.subcategorias.length > 0
            ) // Solo categorías con subcategorías
            .map((item) => ({
              id: item.categoria._id,
              titulo: item.categoria.titulo,
            }));
        } else {
          console.error("Estructura de datos inesperada para categorías.");
          this.categorias = [];
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        this.showNotification("Error al cargar los datos.", "error");
      } finally {
        this.load_data = false;
      }
    },
    async fetchSubcategorias(categoriaId) {
      if (!categoriaId) {
        this.subcategorias = [];
        return;
      }
      try {
        const response = await axios.get(
          `${this.$url}/listar_subcategorias_por_categoria_admin/${categoriaId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.subcategorias = response.data.data.map((subcat) => ({
          id: subcat._id,
          titulo: subcat.titulo,
        }));
      } catch (error) {
        console.error("Error cargando subcategorías:", error);
        this.showNotification("Error al cargar subcategorías.", "error");
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
          await axios.delete(`${this.$url}/eliminar_producto_admin/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.productos = this.productos.filter(
            (producto) => producto._id !== id
          );
          this.showNotification("Producto eliminado exitosamente.", "success");
        } catch (error) {
          this.showNotification("Error al eliminar el producto.", "error");
        }
      }
    },
    setDefaultImage(event) {
      event.target.src = "/assets/images/no_image.png"; // Imagen por defecto
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
  watch: {
    filtroCategoria(newVal) {
      this.fetchSubcategorias(newVal);
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

/* Badge Styles */
.badge-custom {
  font-size: 16px;
  padding: 0.5em 1em;
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

/* Navigation Link Styles */
.nav-link {
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 500;
  color: #007bff;
  background-color: transparent;
  text-align: center;
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


.input-group-text {
  border-radius: 8px 0 0 8px;
  color: #ffffff;
  background-color: #007bff;

}
.input-group .btn-primary {
  border-radius: 0 8px 8px 0;
  padding: 12px;
  font-size: 16px;
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

/* Spinner Styles */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Card Footer */
.card-footer {
  text-align: center;
  padding-top: 15px;
}

/* Table Responsive */
.table-responsive {
  max-height: 600px;
  overflow-y: auto;
  border-radius: 8px;
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

.vh-100 {
  height: 100vh;
}

.text-center {
  text-align: center;
}

.form-control {
  border-radius: 0 8px 8px 0;
  border: 2px solid #ddd;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
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
</style>
