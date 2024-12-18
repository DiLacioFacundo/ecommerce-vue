<template>
  <div v-if="isAuthenticated">
    <!-- Hero Section -->
    <section
      class="hero text-center text-white d-flex align-items-center justify-content-center"
      style="
        background-size: cover;
        background-position: center;
        height: 400px;
        margin-top: 100px;
      "
    >
      <div class="container">
        <ol class="breadcrumb justify-content-center">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-white">Inicio</router-link>
          </li>
          <li class="breadcrumb-item active text-white">Mi Perfil</li>
        </ol>
        <h2 class="hero-heading" style="font-size: 3.5rem; font-weight: bold">
          Bienvenido, {{ userProfile.nombres }}
        </h2>
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

    <!-- Profile Details Section -->
    <section>
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow-sm">
              <div class="card-header text-center bg-primary text-white">
                <h4>
                  <i class="fas fa-user-circle me-2"></i> Información de tu
                  Cuenta
                </h4>
              </div>
              <div class="card-body">
                <template v-if="!editing">
                  <!-- Datos del perfil -->
                  <div
                    class="row align-items-center mb-3"
                    v-for="(value, key) in displayedData"
                    :key="key"
                  >
                    <div class="col-4 text-end">
                      <i :class="icons[key] + ' fa-lg me-2 text-primary'"></i>
                      <strong>{{ labels[key] }}:</strong>
                    </div>
                    <div class="col-8">
                      <span>{{ value }}</span>
                    </div>
                  </div>
                  <div class="text-center mt-4">
                    <button class="btn btn-primary" @click="enableEditing">
                      <i class="fas fa-edit me-2"></i> Editar Perfil
                    </button>
                    <button
                      class="btn btn-secondary ms-3"
                      @click="toggleChangePassword"
                    >
                      <i class="fas fa-edit me-2"></i> Cambiar Contraseña
                    </button>
                    <button class="btn btn-outline-danger ms-3" @click="logout">
                      <i class="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                    </button>
                  </div>
                </template>

                <template v-else>
                  <!-- Formulario de edición -->
                  <form @submit.prevent="updateClientData">
                    <div class="mb-3" v-for="key in editableFields" :key="key">
                      <label :for="key" class="form-label"
                        >{{ labels[key] }}:</label
                      >
                      <template v-if="key === 'estado'">
                        <select
                          id="estado"
                          class="form-control"
                          v-model="editedData.estado"
                        >
                          <option :value="true">Activo</option>
                          <option :value="false">Inactivo</option>
                        </select>
                      </template>
                      <template v-else-if="key === 'pais'">
                        <select
                          id="pais"
                          class="form-control"
                          v-model="editedData.pais"
                        >
                          <option
                            v-for="pais in paises"
                            :key="pais"
                            :value="pais"
                          >
                            {{ pais }}
                          </option>
                        </select>
                      </template>
                      <template v-else-if="key === 'genero'">
                        <select
                          id="genero"
                          class="form-control"
                          v-model="editedData.genero"
                        >
                          <option value="Masculino">Masculino</option>
                          <option value="Femenino">Femenino</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </template>
                      <template v-else>
                        <input
                          :type="key === 'email' ? 'email' : 'text'"
                          :id="key"
                          class="form-control"
                          v-model="editedData[key]"
                        />
                      </template>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-success">
                        Guardar Cambios
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary ms-3"
                        @click="cancelEdit"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </template>

                <!-- Formulario para cambiar contraseña -->
                <template v-if="changingPassword">
                  <form @submit.prevent="changePassword">
                    <div class="mb-3">
                      <label for="currentPassword" class="form-label"
                        >Contraseña Actual:</label
                      >
                      <input
                        type="password"
                        id="currentPassword"
                        class="form-control"
                        v-model="passwordData.currentPassword"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="newPassword" class="form-label"
                        >Nueva Contraseña:</label
                      >
                      <input
                        type="password"
                        id="newPassword"
                        class="form-control"
                        v-model="passwordData.newPassword"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="confirmPassword" class="form-label"
                        >Confirmar Nueva Contraseña:</label
                      >
                      <input
                        type="password"
                        id="confirmPassword"
                        class="form-control"
                        v-model="passwordData.confirmPassword"
                        required
                      />
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-success">
                        Guardar Contraseña
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary ms-3"
                        @click="toggleChangePassword"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </template>
              </div>
            </div>
          </div>
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
      userProfile: {}, // Datos del cliente
      editedData: {}, // Datos para editar
      passwordData: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      isAuthenticated: false,
      editing: false, // Modo edición
      changingPassword: false, // Modo cambio de contraseña
      notificacion: {
        visible: false,
        message: "",
        type: "",
        duration: 3000,
      },
      labels: {
        nombres: "Nombre",
        email: "Email",
        pais: "País",
        genero: "Género",
        estado: "Estado",
      },
      icons: {
        nombres: "fas fa-user",
        email: "fas fa-envelope",
        pais: "fas fa-map-marker-alt",
        genero: "fas fa-venus-mars",
        estado: "fas fa-user-check",
      },
      editableFields: ["nombres", "email", "genero", "pais", "estado"],
      paises: [
        "Argentina",
        "Brasil",
        "Chile",
        "Colombia",
        "Perú",
        "México",
        "Estados Unidos",
        "España",
      ],
    };
  },
  computed: {

    currentUser() {
      return this.$store.getters.currentUser || {};
    },
    displayedData() {
      return {
        nombres: this.userProfile.nombres,
        email: this.userProfile.email,
        pais: this.userProfile.pais,
        genero: this.userProfile.genero,
        estado: this.userProfile.estado ? "Activo" : "Inactivo",
      };
    },
  },
  methods: {
    async getClientData() {
      try {
        const response = await axios.get(
          `${this.$url}/clientes/${this.currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.userProfile = response.data.cliente;
        this.editedData = { ...response.data.cliente }; // Copia de datos para editar
      } catch (error) {
        console.error("Error al obtener cliente:", error);
        this.showNotification(
          "Error al obtener los datos del cliente.",
          "error"
        );
        this.$router.push({ name: "login" });
      }
    },
    async updateClientData() {
      try {
        const response = await axios.put(
          `${this.$url}/actualizar_cliente/${this.currentUser.id}`,
          this.editedData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.userProfile = response.data.cliente;
        this.editing = false;
        this.showNotification("Perfil actualizado correctamente.", "success");
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        this.showNotification("Error al actualizar el perfil.", "error");
      }
    },
    async changePassword() {
      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.showNotification("Las contraseñas no coinciden.", "error");
        return;
      }
      try {
        await axios.put(
          `${this.$url}/clientes/cambiar_password/${this.currentUser.id}`,
          {
            currentPassword: this.passwordData.currentPassword,
            newPassword: this.passwordData.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.passwordData = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
        this.changingPassword = false;
        this.showNotification(
          "Contraseña actualizada correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        this.showNotification("Error al cambiar la contraseña.", "error");
      }
    },
    cancelEdit() {
      this.editedData = { ...this.userProfile }; // Restablece los datos originales
      this.editing = false;
    },
    toggleChangePassword() {
      if (!this.changingPassword) {
        this.editing = false; // Asegura que se desactiva la edición
      }
      this.changingPassword = !this.changingPassword; // Alterna la contraseña
    },
    enableEditing() {
      if (!this.editing) {
        this.changingPassword = false; // Asegura que se desactiva el cambio de contraseña
      }
      this.editing = true; // Activa la edición
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "login" });
    },
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
  mounted() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push({ name: "login" });
    } else {
      this.isAuthenticated = true;
      this.getClientData();
    }
  },
};
</script>

<style scoped>
/* Hero Section */
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

/* Card Section */
.card-header {
  border-radius: 8px 8px 0 0;
  font-size: 1.5rem;
}

.card {
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  margin-top: -100px;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

/* Buttons */
.btn-primary {
  border-radius: 30px;
  padding: 10px 20px;
  background-color: #005f96;
  border: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #004080;
}

.btn-outline-danger {
  border-radius: 30px;
  border: 2px solid #dc3545;
  color: #dc3545;
  background: transparent;
  transition: all 0.3s;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

/* Text Alignments */
.row .col-4 {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 1.2rem;
  color: #333;
}

.row .col-8 {
  font-size: 1.1rem;
  color: #555;
}

.text-center {
  text-align: center !important;
}
/* Form elements */
.form-label {
  font-weight: bold;
  color: #495057;
  padding: 5px;
}

/* Icon Styles */
i {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
