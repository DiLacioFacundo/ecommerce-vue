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
                    <h6 class="header-pretitle">Categorías</h6>
                    <h1 class="header-title">
                      <i class="fas fa-folder-open me-2 text-primary"></i>
                      Gestión de Categorías
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <!-- Crear Nueva Categoría -->
            <div class="card shadow-sm mb-4 category-card">
              <div class="card-body">
                <h5 class="card-title text-center">
                  <i class="fas fa-plus-circle text-success me-2"></i>
                  Crear Nueva Categoría
                </h5>
                <div
                  class="d-flex justify-content-center align-items-center gap-2"
                >
                  <input
                    type="text"
                    v-model="nueva_categoria"
                    class="form-control form-control-lg"
                    placeholder="Nombre de la nueva categoría"
                  />
                  <button
                    class="btn btn-primary btn-crear btn-lg"
                    @click="crearCategoria"
                  >
                    <i class="fas fa-check-circle me-2"></i> Crear
                  </button>
                </div>
                <small
                  v-if="nueva_categoria_error"
                  class="text-danger d-block text-center mt-2"
                >
                  {{ nueva_categoria_error }}
                </small>
              </div>
            </div>

            <!-- Tabla de Categorías -->
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title text-center">
                  <i class="fas fa-list-alt text-primary me-2"></i>
                  Listado de Categorías
                </h5>

                <!-- Buscador y Dropdown -->
                <div class="input-group mb-4 buscador-container">
                  <span
                    class="input-group-text bg-primary text-white buscador-icon"
                  >
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control buscador-input"
                    v-model="busqueda"
                    placeholder="Buscar categorías..."
                  />
                  <select
                    v-model="filtroCategoria"
                    class="form-select buscador-dropdown"
                  >
                    <option value="">Todas las categorías</option>
                    <option
                      v-for="categoria in categorias"
                      :key="categoria.categoria?._id"
                      :value="categoria.categoria?._id"
                    >
                      {{ categoria.categoria?.titulo || "" }}
                    </option>
                  </select>
                </div>
                <!-- Tabla -->
                <div class="table-responsive">
                  <table class="table table-hover text-center align-middle">
                    <thead class="table-primary">
                      <tr>
                        <th>#</th>
                        <th>Categoría</th>
                        <th>Subcategorías</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Mostrar mensaje de carga -->
                      <tr v-if="cargando">
                        <td colspan="4">
                          <div
                            class="spinner-border text-primary"
                            role="status"
                          >
                            <span class="visually-hidden">Cargando...</span>
                          </div>
                        </td>
                      </tr>

                      <!-- Mostrar mensaje de "No se encontraron categorías" -->
                      <tr v-else-if="categoriasFiltradas.length === 0">
                        <td colspan="4" class="text-center py-5">
                          <h6 class="text-uppercase text-muted">
                            No se encontraron categorías
                          </h6>
                        </td>
                      </tr>

                      <!-- Mostrar categorías si están disponibles -->
                      <template v-else>
                        <tr
                          v-for="(
                            categoria, index
                          ) in categoriasFiltradasPaginadas"
                          :key="categoria.categoria?._id || index"
                        >
                          <td>
                            {{ (currentPage - 1) * perPage + index + 1 }}
                          </td>
                          <td>
                            <input
                              v-if="categoria.editing"
                              v-model="categoria.categoria.titulo"
                              class="form-control form-control-sm"
                            />
                            <span v-else>{{
                              categoria.categoria?.titulo || ""
                            }}</span>
                          </td>
                          <td>
                            <!-- Subcategorías en lista -->
                            <div class="subcategory-container">
                              <!-- Buscador de subcategorías -->
                              <div class="input-group mb-2">
                                <input
                                  type="text"
                                  class="form-control form-control-sm"
                                  v-model="categoria.searchQuery"
                                  placeholder="Buscar subcategorías..."
                                />
                              </div>
                              <!-- Lista de subcategorías filtradas -->
                              <ul class="subcategory-list">
                                <li
                                  v-for="subcategoria in filtrarSubcategorias(
                                    categoria
                                  )"
                                  :key="subcategoria._id"
                                  class="subcategory-item"
                                >
                                  <span v-if="!subcategoria.editing">
                                    {{ subcategoria.titulo }}
                                  </span>
                                  <input
                                    v-else
                                    v-model="subcategoria.titulo"
                                    class="form-control form-control-sm"
                                  />
                                  <div class="subcategory-actions">
                                    <button
                                      class="btn btn-sm ms-2"
                                      :class="
                                        subcategoria.editing
                                          ? 'btn-primary'
                                          : 'btn-secondary'
                                      "
                                      @click="
                                        toggleEditSubcategoria(subcategoria)
                                      "
                                    >
                                      <i
                                        :class="
                                          subcategoria.editing
                                            ? 'fas fa-floppy-disk'
                                            : 'fas fa-edit'
                                        "
                                        title="Editar/Guardar"
                                      ></i>
                                    </button>
                                    <button
                                      class="btn btn-outline-danger btn-sm ms-2"
                                      @click="
                                        eliminarSubcategoria(
                                          subcategoria._id,
                                          categoria.categoria._id
                                        )
                                      "
                                    >
                                      <i
                                        class="fas fa-trash"
                                        title="Eliminar"
                                      ></i>
                                    </button>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <!-- Botón para agregar subcategorías -->
                            <button
                              class="btn btn-outline-success btn-sm mt-3 w-100"
                              @click="abrirModalSubcategoria(categoria)"
                            >
                              <i class="fas fa-plus-circle"></i> Agregar
                            </button>
                          </td>
                          <td>
                            <div class="d-flex justify-content-center gap-2">
                              <button
                                class="btn btn-outline-primary btn-sm d-flex align-items-center"
                                v-if="categoria.editing"
                                @click="
                                  guardarEdicion(
                                    categoria.categoria._id,
                                    categoria.categoria.titulo
                                  )
                                "
                              >
                                <i class="fas fa-floppy-disk me-1"></i> Guardar
                              </button>
                              <button
                                class="btn btn-outline-secondary btn-sm d-flex align-items-center"
                                v-else
                                @click="habilitarEdicion(categoria)"
                              >
                                <i class="fas fa-edit me-1"></i> Editar
                              </button>
                              <button
                                class="btn btn-outline-danger btn-sm d-flex align-items-center"
                                @click="
                                  eliminarCategoria(categoria.categoria._id)
                                "
                              >
                                <i class="fas fa-trash me-1"></i> Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                  <p
                    v-if="categorias.length === 0 && !cargando"
                    class="text-center text-muted mt-4"
                  >
                    No hay categorías disponibles.
                  </p>
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
                        :total-rows="categoriasFiltradas.length"
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
  </div>
</template>


<script>
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";
import axios from "axios";
import Notificacion from "@/components/Notificacion.vue";

export default {
  components: {
    Sidebar,
    TopNav,
    Notificacion,
  },
  data() {
    return {
      categorias: [],
      nueva_categoria: "",
      nueva_categoria_error: "",
      cargando: true,
      mostrarModalSubcategoria: false,
      categoriaSeleccionada: null,
      nuevaSubcategoriaTitulo: "",
      busqueda: "",
      filtroCategoria: "",
      perPage: 5,
      currentPage: 1,
      modalSubcategoriaVisible: false,
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "info",
    };
  },
  computed: {
    categoriasFiltradas() {
      let categoriasFiltradas = this.categorias;

      // Filtro por categoría específica
      if (this.filtroCategoria) {
        categoriasFiltradas = categoriasFiltradas.filter(
          (categoria) => categoria.categoria?._id === this.filtroCategoria
        );
      }

      // Búsqueda por texto
      if (this.busqueda.trim()) {
        categoriasFiltradas = categoriasFiltradas.filter((categoria) =>
          categoria.categoria?.titulo
            ?.toLowerCase()
            .includes(this.busqueda.toLowerCase())
        );
      }

      return categoriasFiltradas;
    },
    categoriasFiltradasPaginadas() {
      const inicio = (this.currentPage - 1) * this.perPage;
      const fin = inicio + this.perPage;
      return this.categoriasFiltradas.slice(inicio, fin);
    },
    totalPaginas() {
      return Math.ceil(this.categoriasFiltradas.length / this.perPage);
    },
  },
  methods: {
    cambiarPagina(nuevaPagina) {
      this.currentPage = nuevaPagina;
    },
    // Método para mostrar notificaciones
    showNotification(message, type) {
      this.notificationMessage = message;
      this.notificationType = type;
      this.notificationVisible = true;

      // Oculta la notificación después de 3 segundos
      setTimeout(() => {
        this.notificationVisible = false;
      }, 3000);
    },

    // Filtrar subcategorías
    filtrarSubcategorias(categoria) {
      if (!categoria.searchQuery) return categoria.subcategorias;
      return categoria.subcategorias.filter((subcategoria) =>
        subcategoria.titulo
          .toLowerCase()
          .includes(categoria.searchQuery.toLowerCase())
      );
    },
    async toggleEditSubcategoria(subcategoria) {
      if (typeof subcategoria.editing === "undefined") {
        this.$set(subcategoria, "editing", false);
      }

      subcategoria.editing = !subcategoria.editing;

      if (!subcategoria.editing) {
        this.guardarSubcategoria(subcategoria);
      } else {
        this.showNotification("Editando subcategoría...", "info");
      }
    },
    // Guardar cambios en una subcategoría
    async guardarSubcategoria(subcategoria) {
      try {
        await axios.put(
          `${this.$url}/actualizar_subcategoria_admin/${subcategoria._id}`,
          { titulo: subcategoria.titulo },
          { Authorization: `Bearer ${localStorage.getItem("token")}` }
        );
        this.showNotification("Subcategoría guardada con éxito.", "success");

        // Actualiza las categorías después de guardar
        this.cargarCategorias();
      } catch (error) {
        // Verificar si hay un mensaje de error del servidor
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al guardar la subcategoria. Intente nuevamente.";

        // Mostrar el mensaje del servidor como notificación
        this.showNotification(errorMessage, "error");
      }
    },

    // Eliminar una subcategoría
    async eliminarSubcategoria(subcategoriaId, categoriaId) {
      if (!confirm("¿Estás seguro de que deseas eliminar esta subcategoría?"))
        return;

      try {
        await axios.delete(
          `${this.$url}/eliminar_subcategoria_admin/${subcategoriaId}?categoriaId=${categoriaId}`,
          { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
        );
        this.showNotification(
          "Subcategoría eliminada correctamente.",
          "success"
        );
        this.cargarCategorias();
      } catch (error) {
        // Verificar si hay un mensaje de error del servidor
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al eliminar la subcategoria. Intente nuevamente.";

        // Mostrar el mensaje del servidor como notificación
        this.showNotification(errorMessage, "error");
      }
    },
    async cargarCategorias() {
      this.cargando = true;
      try {
        const response = await axios.get(
          this.$url + "/listar_categorias_admin",
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          }
        );
        this.categorias = response.data.categorias
          .filter((categoria) => categoria.categoria.titulo !== "Sin Categoría")
          .map((categoria) => ({
            ...categoria,
            searchQuery: "",
            editing: false,
          }));
      } catch (error) {
        // Verificar si hay un mensaje de error del servidor
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al cargar la categoria. Intente nuevamente.";

        // Mostrar el mensaje del servidor como notificación
        this.showNotification(errorMessage, "error");
      } finally {
        this.cargando = false;
      }
    },
    // Crear una nueva categoría
    async crearCategoria() {
      if (!this.nueva_categoria.trim()) {
        this.mostrarNotificacion(
          "El nombre de la categoría no puede estar vacío.",
          "warning"
        );
        return;
      }
      try {
        await axios.post(
          `${this.$url}/registrar_categoria_admin`,
          { titulo: this.nueva_categoria },
          { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
        );
        this.nueva_categoria = "";
        this.mostrarNotificacion("Categoría creada exitosamente.", "success");
        this.cargarCategorias();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.mostrarNotificacion(
            "La categoría ya existe. Elige otro nombre.",
            "warning"
          );
        } else if (error.response && error.response.status === 500) {
          this.mostrarNotificacion(
            "Hubo un problema en el servidor. Intenta más tarde.",
            "error"
          );
        } else {
          this.mostrarNotificacion(
            "Error de conexión. Verifica tu internet.",
            "error"
          );
        }
      }
      this.cargarCategorias();
    },
    // Guardar edición de una categoría
    async guardarEdicion(id, titulo) {
      try {
        await axios.put(
          this.$url + `/actualizar_categoria_admin/${id}`,
          { titulo },
          { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
        );
        this.cargarCategorias();
        this.showNotification("Categoría guardada con éxito.", "success");
      } catch (error) {
        // Verificar si hay un mensaje de error del servidor
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al guardar la categoria. Intente nuevamente.";

        // Mostrar el mensaje del servidor como notificación
        this.showNotification(errorMessage, "error");
      }
    },

    // Eliminar una categoría
    async eliminarCategoria(id) {
      if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?"))
        return;

      try {
        await axios.delete(this.$url + `/eliminar_categoria_admin/${id}`, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` },
        });
        this.cargarCategorias();
        this.showNotification("Categoría eliminada correctamente.", "success");
      } catch (error) {
        // Verificar si hay un mensaje de error del servidor
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al eliminar la categoria. Intente nuevamente.";

        // Mostrar el mensaje del servidor como notificación
        this.showNotification(errorMessage, "error");
      }
    },
    // Habilitar edición para una categoría
    async habilitarEdicion(categoria) {
      this.categorias.forEach((cat) => (cat.editing = false));
      categoria.editing = true;
      this.showNotification("Editando categoría...", "info");
    },

    async abrirModalSubcategoria(categoria) {
      this.$router.push({
        name: "subcategoria-create",
        params: { categoriaId: categoria.categoria._id },
        query: { categoriaNombre: categoria.categoria.titulo },
      });
    },
  },
  mounted() {
    this.cargarCategorias();
  },
};
</script>



<style scoped>
.header-pretitle {
  font-size: 14px;
  color: #6c757d;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
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

.table {
  border-collapse: separate;
  border-spacing: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}
.table-primary th {
  background: #007bff;
  color: white;
  font-weight: bold;
  border: 1px solid #007bff;
}

/* Centrado de columnas */
.table th,
.table td {
  border: 1px solid #007bff;
  text-align: center;
  vertical-align: middle;
  font-size: 15px;
  padding: 10px 15px;
}

/* Subcategorías */
.subcategory-container {
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.subcategory-list {
    max-height: 150px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.subcategory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
}

.subcategory-item:last-child {
  border-bottom: none;
}

.subcategory-actions i {
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.2s;
}

.subcategory-actions i:hover {
  color: #007bff;
}

/* Spinner */
.spinner-border {
  width: 2rem;
  height: 2rem;
}

/* Botones */
.btn {
  border-radius: 6px;
  font-size: 14px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.btn-crear {
  width: 120px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-sm {
  padding: 6px 12px;
}
.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
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
