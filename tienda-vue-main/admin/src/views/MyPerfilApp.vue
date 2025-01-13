<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <notificacion
        v-if="notification.visible"
        :message="notification.message"
        :type="notification.type"
        @close="notification.visible = false"
      ></notificacion>
      <div class="container mt-4">
        <div class="card shadow-sm">
          <div class="card-header text-center bg-primary text-white">
            <h5 class="card-title mb-0">
              <i class="fas fa-user-circle me-2" style="font-size: 18px"></i> Mi
              Perfil
            </h5>
          </div>
          <div class="card-body">
            <!-- Foto de Perfil -->
            <div class="text-center mb-4">
              <img
                :src="formatImageUrl(user.photo)"
                alt="Foto de Perfil"
                class="rounded-circle profile-img"
              />
            </div>
            <!-- Información del Usuario -->
            <div class="row mb-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nombre:</label>
                <div class="input-wrapper">
                  <input
                    type="text"
                    class="form-control input-custom"
                    :value="user.name"
                    disabled
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  >Correo Electrónico:</label
                >
                <div class="input-wrapper">
                  <input
                    type="email"
                    class="form-control input-custom"
                    :value="user.email"
                    disabled
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Rol:</label>
                <div class="input-wrapper">
                  <input
                    type="text"
                    class="form-control input-custom"
                    :value="user.role"
                    disabled
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Estado:</label>
                <div class="input-wrapper">
                  <input
                    type="text"
                    class="form-control input-custom"
                    :value="user.active ? 'Activo' : 'Inactivo'"
                    disabled
                  />
                </div>
              </div>
            </div>

            <!-- Cambiar Contraseña -->
            <div class="text-primary mb-3 change-password-trigger mb-4">
              <i class="fas fa-key me-2" style="font-size: 18px"></i>
              <a
                href="#"
                @click.prevent="toggleChangePassword"
                class="link-primary"
              >
                Cambiar Contraseña
              </a>
            </div>
            <form v-if="showChangePassword" @submit.prevent="changePassword">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="newPassword" class="form-label fw-semibold"
                    >Nueva Contraseña:</label
                  >
                  <div class="password-container input-wrapper">
                    <input
                      type="password"
                      id="newPassword"
                      v-model="password.newPassword"
                      class="form-control input-custom"
                      placeholder="Ingresa tu nueva contraseña"
                      required
                    />
                    <span
                      class="toggle-password"
                      @click="togglePasswordVisibility('new')"
                    >
                      <i
                        :class="
                          showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="confirmPassword" class="form-label fw-semibold"
                    >Confirmar Contraseña:</label
                  >
                  <div class="password-container input-wrapper">
                    <input
                      type="password"
                      id="confirmPassword"
                      v-model="password.confirmPassword"
                      class="form-control input-custom"
                      placeholder="Confirma tu nueva contraseña"
                      required
                    />
                    <span
                      class="toggle-password"
                      @click="togglePasswordVisibility('confirm')"
                    >
                      <i
                        :class="
                          showConfirmPassword
                            ? 'fas fa-eye-slash'
                            : 'fas fa-eye'
                        "
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-center mt-4">
                <button type="submit" class="btn btn-success btn-lg me-2">
                  <i class="fas fa-save"></i> Guardar Cambios
                </button>
                <button
                  type="button"
                  class="btn btn-secondary btn-lg"
                  @click="cancelChangePassword"
                >
                  <i class="fas fa-times"></i> Cancelar
                </button>
              </div>
            </form>
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
  components: {
    Sidebar,
    TopNav,
    Notificacion,
  },
  data() {
    return {
      user: {
        name: "",
        email: "",
        role: "",
        active: true,
        photo: "",
      },
      password: {
        newPassword: "",
        confirmPassword: "",
      },
      notification: {
        visible: false,
        message: "",
        type: "success",
      },
      showChangePassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
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
    showNotification(message, type) {
      this.notification = { visible: true, message, type };
      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    },
    async fetchUserProfile() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : null;
        if (!userId) {
          this.showNotification("Usuario no encontrado.", "error");
          return;
        }
        const response = await axios.get(
          `${this.$url}/obtener_usuario_admin/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token
            },
          }
        );
        this.user = {
          name: `${response.data.nombre} ${response.data.apellido}`,
          email: response.data.email,
          role: response.data.rol,
          active: response.data.estado,
          photo: response.data.imagen,
        };
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al cargar el perfil del usuario.";
        this.showNotification(errorMessage, "error");
      }
    },
    toggleChangePassword() {
      this.showChangePassword = !this.showChangePassword;
    },
    cancelChangePassword() {
      this.showChangePassword = false;
      this.password.newPassword = "";
      this.password.confirmPassword = "";
    },
    togglePasswordVisibility(type) {
      if (type === "new") {
        this.showNewPassword = !this.showNewPassword;
      } else if (type === "confirm") {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    },
    async changePassword() {
      const { newPassword, confirmPassword } = this.password;

      // Verificar que las contraseñas coincidan
      if (newPassword !== confirmPassword) {
        this.showNotification("Las contraseñas no coinciden.", "error");
        return;
      }

      // Verificar longitud de la contraseña
      if (newPassword.length < 6) {
        this.showNotification(
          "La contraseña debe tener al menos 6 caracteres.",
          "error"
        );
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : null;

        if (!userId) {
          this.showNotification("Usuario no encontrado.", "error");
          return;
        }

        // Realizar la petición al backend con el userId y newPassword
        const response = await axios.post(
          `${this.$url}/cambiar_password_usuario`,
          { userId, newPassword }, // Enviar el userId y la nueva contraseña como payload
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token necesario para autenticación
            },
          }
        );

        // Mostrar notificación de éxito
        this.showNotification(
          response.data.message || "Contraseña actualizada correctamente.",
          "success"
        );

        // Reiniciar el formulario
        this.cancelChangePassword();
      } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al cambiar la contraseña.";
        this.showNotification(errorMessage, "error");
      }
    },
  },
  mounted() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
.card-title {  
  letter-spacing: 1px; 
  text-transform: uppercase; 
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.profile-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid #007bff;
  padding: 3px;
  background-color: white;
}
.card {
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0;
}

.password-container {
  position: relative;
}

.password-container input {
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #6c757d;
  transition: color 0.3s ease;
}
.toggle-password:hover {
  color: #007bff;
}

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

.link-primary {
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}
.link-primary:hover {
  color: #0056b3;
  border-bottom: 1px solid #0056b3;
  text-decoration: none;
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

/* Hover Effects */
.btn:hover,
.input-custom:hover {
  transform: translateY(-2px);
}

.change-password-trigger {
  justify-content: center;
  display: flex;
  align-items: center;
}

.form-label {
  font-weight: 600;
  font-size: 16px;
  color: #343a40;
  margin-bottom: 8px;
}
</style>