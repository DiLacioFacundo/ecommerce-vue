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
                    <h6 class="header-pretitle">Clientes</h6>
                    <h1 class="header-title">
                      <i class="fas fa-users me-2 text-primary"></i> Gestión de
                      Clientes
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
                        v-model="filtro"
                        class="form-control"
                        type="search"
                        placeholder="Buscar clientes"
                      />
                    </div>
                  </div>
                  <div class="col-md-3">
                    <select
                      v-model="columnaFiltro"
                      class="form-select custom-dropdown"
                    >
                      <option value="nombres">Buscar por Nombre</option>
                      <option value="email">Buscar por Correo</option>
                      <option value="genero">Buscar por Género</option>
                      <option value="pais">Buscar por País</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <select
                      v-model="filtroEstado"
                      class="form-select custom-dropdown"
                    >
                      <option value="">Filtrar por Estado</option>
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <select
                      v-model="filtroGenero"
                      class="form-select custom-dropdown"
                    >
                      <option value="">Filtrar por Género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Clientes -->
            <div class="card shadow-sm">
              <div class="card-body table-responsive">
                <h5 class="card-title text-center">
                  <i class="fas fa-list-alt text-primary me-2"></i> Listado de
                  Clientes
                </h5>
                <template v-if="!loading">
                  <table class="table table-hover align-middle text-center">
                    <thead class="table-primary">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Género</th>
                        <th scope="col">País</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="filteredClientes.length > 0">
                        <tr
                          v-for="(cliente, index) in paginatedClientes"
                          :key="cliente._id"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ cliente.nombres }}</td>
                          <td>{{ cliente.email }}</td>
                          <td>{{ cliente.genero || "N/A" }}</td>
                          <td>{{ cliente.pais || "N/A" }}</td>
                          <td>
                            <span
                              class="badge"
                              :class="
                                cliente.estado ? 'bg-success' : 'bg-danger'
                              "
                            >
                              {{ cliente.estado ? "Activo" : "Inactivo" }}
                            </span>
                          </td>
                          <td>
                            <div class="btn-group">
                              <button
                                class="btn btn-sm btn-outline-primary btn-hover"
                                @click="editCliente(cliente)"
                              >
                                <i class="fas fa-edit"></i>
                              </button>
                              <button
                                class="btn btn-sm btn-outline-danger btn-hover"
                                @click="deleteCliente(cliente._id)"
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
                              No se encontraron clientes
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
                        :total-rows="filteredClientes.length"
                        :per-page="perPage"
                        align="center"
                        aria-controls="my-table"
                      ></b-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Editar Cliente -->
            <div v-if="selectedCliente" class="card shadow-sm mb-4">
              <div class="card-header text-center bg-primary text-white">
                <h5 class="card-title text-center text-white">
                  <i class="fas fa-user-edit me-2"></i>
                  Editar Cliente
                </h5>
              </div>
              <form @submit.prevent="validarCampos">
                <div class="card-body">
                  <div class="row g-3">
                    <!-- Nombres -->
                    <div class="col-md-6">
                      <label for="nombreCliente" class="form-label fw-semibold"
                        >Nombres</label
                      >
                      <input
                        id="nombreCliente"
                        v-model="selectedCliente.nombres"
                        type="text"
                        class="form-control input-custom"
                        placeholder="Ingresa los nombres"
                        required
                      />
                    </div>
                    <!-- Email -->
                    <div class="col-md-6">
                      <label for="emailCliente" class="form-label fw-semibold"
                        >Correo Electrónico</label
                      >
                      <input
                        id="emailCliente"
                        v-model="selectedCliente.email"
                        type="email"
                        class="form-control input-custom"
                        placeholder="Ingresa el correo electrónico"
                        required
                      />
                    </div>
                    <!-- Género -->
                    <div class="col-md-6">
                      <label for="generoCliente" class="form-label fw-semibold"
                        >Género</label
                      >
                      <input
                        id="generoCliente"
                        v-model="selectedCliente.genero"
                        type="text"
                        class="form-control input-custom"
                        placeholder="Ingresa el género"
                      />
                    </div>
                    <!-- País -->
                    <div class="col-md-6">
                      <label for="paisCliente" class="form-label fw-semibold"
                        >País</label
                      >
                      <select
                        id="paisCliente"
                        v-model="selectedCliente.pais"
                        class="form-select custom-dropdown"
                      >
                        <option value="" disabled>Seleccionar País</option>
                        <option
                          v-for="pais in paises"
                          :key="pais"
                          :value="pais"
                        >
                          {{ pais }}
                        </option>
                      </select>
                    </div>
                    <!-- Estado -->
                    <div class="col-md-6">
                      <label for="estadoCliente" class="form-label fw-semibold"
                        >Estado</label
                      >
                      <select
                        id="estadoCliente"
                        v-model="selectedCliente.estado"
                        class="form-select custom-dropdown"
                      >
                        <option :value="true">Activo</option>
                        <option :value="false">Inactivo</option>
                      </select>
                    </div>
                    <!-- Botones -->
                    <div
                      class="col-md-6"
                      style="
                        display: flex;
                        align-items: flex-end;
                        justify-content: flex-end;
                      "
                    >
                      <button type="submit" class="btn btn-success btn-lg me-2">
                        <i class="fas fa-save"></i> Guardar Cambios
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary btn-lg"
                        @click="cancelEdit"
                      >
                        <i class="fas fa-times"></i> Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
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
      clientes: [],
      selectedCliente: {
        nombres: "",
        email: "",
        genero: "",
        pais: "",
        estado: true,
        confirmPassword: "",
      },
      paises: [
        "Afganistán",
        "Albania",
        "Alemania",
        "Andorra",
        "Angola",
        "Antigua y Barbuda",
        "Arabia Saudita",
        "Argelia",
        "Argentina",
        "Armenia",
        "Australia",
        "Austria",
        "Azerbaiyán",
        "Bahamas",
        "Bangladés",
        "Barbados",
        "Baréin",
        "Bélgica",
        "Belice",
        "Benín",
        "Bielorrusia",
        "Birmania",
        "Bolivia",
        "Bosnia y Herzegovina",
        "Botsuana",
        "Brasil",
        "Brunéi",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Bután",
        "Cabo Verde",
        "Camboya",
        "Camerún",
        "Canadá",
        "Catar",
        "Chad",
        "Chile",
        "China",
        "Chipre",
        "Ciudad del Vaticano",
        "Colombia",
        "Comoras",
        "Corea del Norte",
        "Corea del Sur",
        "Costa de Marfil",
        "Costa Rica",
        "Croacia",
        "Cuba",
        "Dinamarca",
        "Dominica",
        "Ecuador",
        "Egipto",
        "El Salvador",
        "Emiratos Árabes Unidos",
        "Eritrea",
        "Eslovaquia",
        "Eslovenia",
        "España",
        "Estados Unidos",
        "Estonia",
        "Esuatini",
        "Etiopía",
        "Filipinas",
        "Finlandia",
        "Fiyi",
        "Francia",
        "Gabón",
        "Gambia",
        "Georgia",
        "Ghana",
        "Granada",
        "Grecia",
        "Guatemala",
        "Guyana",
        "Guinea",
        "Guinea ecuatorial",
        "Guinea-Bisáu",
        "Haití",
        "Honduras",
        "Hungría",
        "India",
        "Indonesia",
        "Irak",
        "Irán",
        "Irlanda",
        "Islandia",
        "Islas Marshall",
        "Islas Salomón",
        "Israel",
        "Italia",
        "Jamaica",
        "Japón",
        "Jordania",
        "Kazajistán",
        "Kenia",
        "Kirguistán",
        "Kiribati",
        "Kuwait",
        "Laos",
        "Lesoto",
        "Letonia",
        "Líbano",
        "Liberia",
        "Libia",
        "Liechtenstein",
        "Lituania",
        "Luxemburgo",
        "Madagascar",
        "Malasia",
        "Malaui",
        "Maldivas",
        "Malí",
        "Malta",
        "Marruecos",
        "Mauricio",
        "Mauritania",
        "México",
        "Micronesia",
        "Moldavia",
        "Mónaco",
        "Mongolia",
        "Montenegro",
        "Mozambique",
        "Namibia",
        "Nauru",
        "Nepal",
        "Nicaragua",
        "Níger",
        "Nigeria",
        "Noruega",
        "Nueva Zelanda",
        "Omán",
        "Países Bajos",
        "Pakistán",
        "Palaos",
        "Panamá",
        "Papúa Nueva Guinea",
        "Paraguay",
        "Perú",
        "Polonia",
        "Portugal",
        "Reino Unido",
        "República Centroafricana",
        "República Checa",
        "República del Congo",
        "República Democrática del Congo",
        "República Dominicana",
        "Ruanda",
        "Rumanía",
        "Rusia",
        "Samoa",
        "San Cristóbal y Nieves",
        "San Marino",
        "San Vicente y las Granadinas",
        "Santa Lucía",
        "Santo Tomé y Príncipe",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leona",
        "Singapur",
        "Siria",
        "Somalia",
        "Sri Lanka",
        "Suazilandia",
        "Sudáfrica",
        "Sudán",
        "Sudán del Sur",
        "Suecia",
        "Suiza",
        "Surinam",
        "Tailandia",
        "Tanzania",
        "Tayikistán",
        "Timor Oriental",
        "Togo",
        "Tonga",
        "Trinidad y Tobago",
        "Túnez",
        "Turkmenistán",
        "Turquía",
        "Tuvalu",
        "Ucrania",
        "Uganda",
        "Uruguay",
        "Uzbekistán",
        "Vanuatu",
        "Venezuela",
        "Vietnam",
        "Yemen",
        "Yibuti",
        "Zambia",
        "Zimbabue",
      ],
      showPassword: false,
      showConfirmPassword: false,
      filtro: "",
      columnaFiltro: "nombres",
      filtroEstado: "",
      filtroGenero: "",
      loading: false,
      currentPage: 1,
      perPage: 5,
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "info",
    };
  },
  computed: {
    filteredClientes() {
      return this.clientes
        .filter((cliente) => {
          if (this.filtro.trim()) {
            return (
              cliente[this.columnaFiltro]
                ?.toString()
                .toLowerCase()
                .includes(this.filtro.toLowerCase()) || false
            );
          }
          return true;
        })
        .filter((cliente) => {
          if (this.filtroEstado) {
            return cliente.estado === (this.filtroEstado === "true");
          }
          return true;
        })
        .filter((cliente) => {
          if (this.filtroGenero) {
            return cliente.genero === this.filtroGenero;
          }
          return true;
        });
    },
    paginatedClientes() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredClientes.slice(start, end);
    },
  },
  methods: {
    validarCampos() {
      const { nombres, email, genero, pais } = this.selectedCliente;

      // Inicializar errores
      const errores = {
        nombres: !nombres ? "El nombre es obligatorio." : null,
        email: !email
          ? "El correo es obligatorio."
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "El correo no es válido."
          : null,
        genero: !genero ? "El género es obligatorio." : null,
        pais: !pais ? "El país es obligatorio." : null,
      };

      // Verificar si hay errores
      const hayErrores = Object.values(errores).some((error) => error);

      if (hayErrores) {
        for (const mensaje of Object.values(errores)) {
          if (mensaje) {
            this.showNotification(mensaje, "error");
            break;
          }
        }
        return false;
      }

      this.updateCliente();
    },
    async updateCliente() {
      if (this.passwordMismatch) {
        this.showNotification(
          "Las contraseñas no coinciden. Por favor, corrige el error.",
          "error"
        );
        return;
      }
      try {
        await axios.put(
          `${this.$url}/actualizar_cliente/${this.selectedCliente._id}`,
          this.selectedCliente,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.showNotification("Cliente actualizado correctamente.", "success");
        setTimeout(() => {
          this.fetchClientes();
          this.cancelEdit();
        }, 3000);
      } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al actualizar el cliente.";
        this.showNotification(errorMessage, "error");
      }
    },
    async fetchClientes() {
      this.loading = true;
      try {
        const response = await axios.get(`${this.$url}/listar_clientes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.clientes = response.data;
        this.selectedCliente = null;
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al cargar los clientes.";
        this.showNotification(errorMessage, "error");
      } finally {
        this.loading = false;
      }
    },
    editCliente(cliente) {
      this.selectedCliente = { ...cliente };
    },
    cancelEdit() {
      this.selectedCliente = null;
      this.showNotification("Edición cancelada.", "info");
    },
    async updateCliente() {
      if (this.passwordMismatch) {
        this.showNotification(
          "Las contraseñas no coinciden. Por favor, corrige el error.",
          "danger"
        );
        return;
      }
      try {
        await axios.put(
          `${this.$url}/actualizar_cliente/${this.selectedCliente._id}`,
          this.selectedCliente,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.fetchClientes();
        this.showNotification("Cliente actualizado exitosamente.", "success");
        this.selectedCliente = null;
      } catch (error) {
        this.showNotification("Error al actualizar cliente.", "danger");
      }
    },
    async deleteCliente(id) {
      if (confirm("¿Seguro que quieres eliminar este cliente?")) {
        try {
          await axios.delete(`${this.$url}/eliminar_cliente/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.showNotification("Cliente eliminado correctamente.", "success");
          setTimeout(() => {
            this.fetchClientes();
          }, 3000);
        } catch (error) {
          console.error("Error al eliminar el cliente:", error);
          const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : "Error al eliminar el cliente.";
          this.showNotification(errorMessage, "error");
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
    this.fetchClientes();
  },
  components: {
    Sidebar,
    TopNav,
    Notificacion,
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

.input-custom {
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ced4da;
  transition: all 0.3s ease-in-out;
}

.input-custom:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
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


/* Badge Styles */
.badge {
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 5px;
}

.badge-success {
  background-color: #28a745;
  color: #ffffff;
}

.badge-danger {
  background-color: #dc3545;
  color: #ffffff;
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
/* Responsiveness */
@media (max-width: 768px) {
  .table {
    font-size: 14px;
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
