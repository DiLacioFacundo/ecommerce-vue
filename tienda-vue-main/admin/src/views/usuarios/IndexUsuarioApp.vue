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
                    <h6 class="header-pretitle">Usuarios</h6>
                    <h1 class="header-title">
                      <i class="fas fa-users me-2 text-primary"></i> Gestión de
                      Usuarios
                    </h1>
                  </div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col">
                    <ul
                      class="nav nav-tabs nav-overflow header-tabs justify-content-center"
                    >
                      <li class="nav-item">
                        <router-link to="/usuario" class="nav-link active">
                          <i class="fas fa-list-alt me-1"></i> Listar Usuarios
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/usuario/create" class="nav-link">
                          <i class="fas fa-plus-circle me-1"></i> Crear Usuario
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
                        placeholder="Buscar usuarios"
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <select
                      v-model="columnaFiltro"
                      class="form-select custom-dropdown"
                    >
                      <option value="nombre" selected>Buscar por Nombre</option>
                      <option value="email">Buscar por Correo</option>
                      <option value="telefono">Buscar por Teléfono</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <select
                      v-model="filtroRol"
                      class="form-select custom-dropdown"
                    >
                      <option value="" selected>Filtrar por Rol</option>
                      <option value="admin">Administrador</option>
                      <option value="empleado">Empleado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Usuarios -->
            <div class="card shadow-sm">
              <div class="card-body table-responsive">
                <h5 class="card-title text-center">
                  <i class="fas fa-list-alt text-primary me-2"></i> Listado de
                  Usuarios
                </h5>
                <template v-if="!loading">
                  <table class="table table-hover align-middle text-center">
                    <thead class="table-primary">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Foto</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="filteredUsuarios.length > 0">
                        <tr
                          v-for="(usuario, index) in paginatedUsuarios"
                          :key="usuario._id"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>
                            <img
                              :src="
                                usuario.imagen
                                  ? usuario.imagen
                                  : '/assets/images/no_image.png'
                              "
                              alt="Imagen de usuario"
                              class="rounded-circle"
                              style="
                                width: 60px;
                                height: 60px;
                                object-fit: cover;
                              "
                            />
                          </td>

                          <td>{{ `${usuario.nombre} ${usuario.apellido}` }}</td>
                          <td>{{ usuario.email }}</td>
                          <td>{{ usuario.telefono || "N/A" }}</td>
                          <td>
                            <span
                              class="badge"
                              :class="
                                usuario.rol === 'admin'
                                  ? 'bg-info'
                                  : 'bg-secondary'
                              "
                            >
                              {{ usuario.rol }}
                            </span>
                          </td>
                          <td>
                            <span
                              class="badge"
                              :class="
                                usuario.estado ? 'bg-success' : 'bg-danger'
                              "
                            >
                              {{ usuario.estado ? "Activo" : "Inactivo" }}
                            </span>
                          </td>
                          <td>
                            <div class="btn-group">
                              <button
                                class="btn btn-sm btn-outline-primary btn-hover"
                                @click="editUsuario(usuario._id)"
                              >
                                <i class="fas fa-edit"></i>
                              </button>
                              <button
                                class="btn btn-sm btn-outline-danger btn-hover"
                                @click="deleteUsuario(usuario._id)"
                              >
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td colspan="8" class="text-center py-5">
                            <h6 class="text-uppercase text-muted">
                              No se encontraron usuarios
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
                      :total-rows="filteredUsuarios.length"
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

export default {
  name: "IndexUsuarioApp",
  data() {
    return {
      usuarios: [],
      filtro: "",
      columnaFiltro: "nombre", // Por defecto, se busca en la columna "nombre"
      filtroRol: "",
      loading: false,
      currentPage: 1,
      perPage: 5,
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "info",
    };
  },
  computed: {
    filteredUsuarios() {
      return this.usuarios
        .filter((usuario) => {
          if (this.filtro.trim()) {
            return (
              usuario[this.columnaFiltro]
                ?.toString()
                .toLowerCase()
                .includes(this.filtro.toLowerCase()) || false
            );
          }
          return true;
        })
        .filter((usuario) => {
          if (this.filtroRol) {
            return usuario.rol === this.filtroRol;
          }
          return true;
        });
    },
    paginatedUsuarios() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredUsuarios.slice(start, end);
    },
  },
  methods: {
    async fetchUsuarios() {
      this.loading = true;
      try {
        const response = await axios.get(`${this.$url}/listar_usuarios_admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Mapear usuarios y ajustar URL de la imagen
        this.usuarios = response.data.map((usuario) => {
          let imagen = usuario.imagen
            ? usuario.imagen.startsWith("http")
              ? usuario.imagen
              : `${this.$url.replace(/\/api$/, "")}${usuario.imagen}`
            : "/assets/images/no_image.png";

          return {
            ...usuario,
            imagen,
          };
        });
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        this.showNotification("Error al cargar usuarios.", "danger");
      } finally {
        this.loading = false;
      }
    },
    editUsuario(id) {
      if (!id) {
        console.error("ID inválido para la edición del usuario.");
        return;
      }
      this.$router.push({ name: "usuario-edit", params: { id } });
    },
    async deleteUsuario(id) {
      if (confirm("¿Seguro que quieres eliminar este usuario?")) {
        try {
          await axios.delete(`${this.$url}/eliminar_usuario_admin/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.usuarios = this.usuarios.filter((usuario) => usuario._id !== id);
          this.showNotification("Usuario eliminado exitosamente.", "success");
        } catch (error) {
          this.showNotification("Error al eliminar el usuario.", "danger");
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
    this.fetchUsuarios();
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
  font-size: 18px;
  font-weight: 500;
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


.btn-group .btn {
  margin-right: 8px;
}

.btn:hover {
  transform: translateY(-2px);
}
/* Input Fields */

.input-group-text {
  border-radius: 8px 0 0 8px;
  color: #ffffff;
  background-color: #007bff;
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
  max-height: 500px;
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

@media (max-width: 768px) {
  .table {
    font-size: 14px;
  }
  .table th,
  .table td {
    padding: 8px;
  }
}
</style>
