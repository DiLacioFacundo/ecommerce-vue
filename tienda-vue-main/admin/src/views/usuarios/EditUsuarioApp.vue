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
          <div class="col-12 col-lg-10 col-xl-8" style="width: 100%">
            <!-- Header -->
            <div class="header mt-md-3">
              <div class="header-body text-center">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">Empleados</h6>
                    <h1 class="header-title">
                      <i class="fas fa-user-edit me-2 text-primary"></i> Editar
                      Usuario
                    </h1>
                  </div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col">
                    <ul
                      class="nav nav-tabs nav-overflow header-tabs justify-content-center"
                    >
                      <li class="nav-item">
                        <router-link to="/usuario" class="nav-link">
                          <i class="fas fa-list-alt me-1"></i> Listar Usuarios
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="#" class="nav-link active">
                          <i class="fas fa-plus-circle me-1"></i> Editar Usuario
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario -->
            <div class="card shadow-sm">
              <div class="card-body">
                <form @submit.prevent="validarCampos">
                  <div class="d-flex flex-wrap align-items-start">
                    <!-- Imagen de Perfil -->
                    <div class="profile-section text-center me-4">
                      <h5 class="fw-semibold gallery-title">
                        <i class="fas fa-images me-2 text-primary"></i> Imagen
                        de Perfil
                      </h5>
                      <div class="image-placeholder">
                        <img
                          :src="empleado.preview || imagenCompleta"
                          class="profile-image"
                          alt="Imagen de perfil"
                        />
                        <div class="image-actions mt-2">
                          <label
                            v-if="!empleado.preview && !empleado.imagen"
                            for="upload-profile-image"
                            class="btn btn-primary btn-sm"
                          >
                            <i class="fas fa-upload"></i> Agregar Imagen
                          </label>
                          <button
                            v-else
                            type="button"
                            class="btn btn-danger btn-sm"
                            @click="removeImage"
                          >
                            <i class="fas fa-trash-alt"></i> Eliminar Imagen
                          </button>
                        </div>
                        <input
                          id="upload-profile-image"
                          type="file"
                          accept="image/*"
                          style="display: none"
                          @change="uploadImage($event)"
                        />
                      </div>
                    </div>
                    <!-- Form Inputs -->
                    <div class="form-section flex-grow-1">
                      <div class="row">
                        <!-- Nombre -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Nombre</label>
                          <input
                            type="text"
                            class="form-control input-custom"
                            placeholder="Nombre del empleado"
                            v-model="empleado.nombre"
                          />
                        </div>

                        <!-- Apellido -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Apellido</label>
                          <input
                            type="text"
                            class="form-control input-custom"
                            placeholder="Apellido del empleado"
                            v-model="empleado.apellido"
                          />
                        </div>

                        <!-- Correo Electrónico -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold"
                            >Correo Electrónico</label
                          >
                          <input
                            type="email"
                            class="form-control input-custom"
                            placeholder="Correo del empleado"
                            v-model="empleado.email"
                          />
                        </div>

                        <!-- Teléfono -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Teléfono</label>
                          <input
                            type="text"
                            class="form-control input-custom"
                            placeholder="Teléfono del empleado"
                            v-model="empleado.telefono"
                          />
                        </div>

                        <!-- Dirección -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold"
                            >Dirección</label
                          >
                          <input
                            type="text"
                            class="form-control input-custom"
                            placeholder="Dirección del empleado"
                            v-model="empleado.direccion"
                          />
                        </div>

                        <!-- Fecha de Nacimiento -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold"
                            >Fecha de Nacimiento</label
                          >
                          <input
                            type="date"
                            class="form-control input-custom"
                            v-model="empleado.fecha_nacimiento"
                          />
                        </div>

                        <!-- Género -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Género</label>
                          <select
                            class="form-select input-custom"
                            v-model="empleado.genero"
                          >
                            <option value="" disabled>
                              Seleccionar Género
                            </option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>

                        <!-- Rol -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Rol</label>
                          <select
                            class="form-select input-custom"
                            v-model="empleado.rol"
                            :disabled="isEmpleado"
                          >
                            <option value="" disabled>Seleccionar Rol</option>
                            <option value="admin">Administrador</option>
                            <option value="empleado">Empleado</option>
                          </select>
                        </div>

                        <!-- Estado -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Estado</label>
                          <select
                            class="form-select input-custom"
                            v-model="empleado.estado"
                            :disabled="isEmpleado"
                          >
                            <option :value="true">Activo</option>
                            <option :value="false">Inactivo</option>
                          </select>
                        </div>

                        <!-- Contraseña -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold"
                            >Contraseña</label
                          >
                          <div class="password-container">
                            <input
                              :type="showPassword ? 'text' : 'password'"
                              class="form-control input-custom"
                              placeholder="Nueva contraseña (opcional)"
                              v-model="empleado.password"
                              :disabled="isEmpleado"
                            />
                            <span
                              class="toggle-password"
                              @click="togglePasswordVisibility"
                            >
                              <i
                                :class="
                                  showPassword
                                    ? 'fas fa-eye-slash'
                                    : 'fas fa-eye'
                                "
                              ></i>
                            </span>
                          </div>
                        </div>

                        <!-- Confirmar Contraseña -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold"
                            >Confirmar Contraseña</label
                          >
                          <div class="password-container">
                            <input
                              :type="showConfirmPassword ? 'text' : 'password'"
                              class="form-control input-custom"
                              placeholder="Confirme la nueva contraseña"
                              v-model="empleado.confirmPassword"
                              :disabled="isEmpleado"
                            />
                            <span
                              class="toggle-password"
                              @click="toggleConfirmPasswordVisibility"
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
                          <div v-if="passwordMismatch" class="text-danger mt-2">
                            <small>Las contraseñas no coinciden</small>
                          </div>
                        </div>

                        <!-- Botón -->
                        <div class="col-12 text-end mt-4">
                          <button
                            type="submit"
                            class="btn btn-primary btn-hover"
                          >
                            <i class="fas fa-check-circle me-2"></i> Guardar
                            Cambios
                          </button>
                        </div>
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
  </div>
</template>


<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";
import Notificacion from "@/components/Notificacion.vue";
import moment from "moment";

export default {
  name: "EditUsuarioApp",
  components: {
    Sidebar,
    TopNav,
    Notificacion,
  },
  data() {
    return {
      empleado: {
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        fecha_nacimiento: "",
        genero: "",
        rol: "",
        estado: "",
        confirmPassword: "",
        imagen: "",
        estado: true,
        imagenFile: null,
      },
      validationErrors: {},
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "info",
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  computed: {
    passwordMismatch() {
      return (
        this.empleado.password &&
        this.empleado.confirmPassword &&
        this.empleado.password !== this.empleado.confirmPassword
      );
    },
    imagenCompleta() {
      if (this.empleado.imagen) {
        return `${this.$url.replace(/\/api$/, "")}${this.empleado.imagen}`;
      }
      return "/assets/images/no_image.png";
    },
    isEmpleado() {
      return (
        this.$store.state.user && this.$store.state.user.rol === "empleado"
      );
      s;
    },
  },
  methods: {
    validarCampos() {
      if (this.empleado.fecha_nacimiento) {
        const [day, month, year] = this.empleado.fecha_nacimiento.split("/");
        this.empleado.fecha_nacimiento = `${year}-${month}-${day}`;
      }
      const {
        nombre,
        apellido,
        email,
        password,
        telefono,
        direccion,
        fecha_nacimiento,
        genero,
        rol,
        estado,
      } = this.empleado;

      // Validar los campos obligatorios
      this.validationErrors = {
        nombre: !nombre ? "El nombre es obligatorio." : null,
        apellido: !apellido ? "El apellido es obligatorio." : null,
        email: !email
          ? "El correo electrónico es obligatorio."
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Ingrese un correo electrónico válido."
          : null,
        telefono: !telefono
          ? "El teléfono es obligatorio."
          : !/^\d+$/.test(telefono)
          ? "El teléfono solo puede contener números."
          : null,
        direccion: !direccion ? "La dirección es obligatoria." : null,
        fecha_nacimiento: !fecha_nacimiento
          ? "La fecha de nacimiento es obligatoria."
          : null,
        genero: !genero ? "El género es obligatorio." : null,
        rol: !rol ? "El rol es obligatorio." : null,
        estado: estado === null ? "El estado es obligatorio." : null,
        imagen:
          !this.empleado.imagen && !this.empleado.preview
            ? "Debes cargar una nueva imagen antes de guardar los cambios."
            : null,
        password:
          this.empleado.password && this.empleado.password.length < 6
            ? "La contraseña debe tener al menos 6 caracteres."
            : null,
        confirmPassword:
          this.empleado.password &&
          this.empleado.password !== this.empleado.confirmPassword
            ? "Las contraseñas no coinciden."
            : null,
      };

      // Si hay errores, mostrar notificación y detener ejecución
      if (Object.values(this.validationErrors).some((error) => error)) {
        this.showNotification(
          "Por favor, corrija los errores antes de continuar.",
          "warning"
        );
        return false;
      }

      this.editarEmpleado();
    },
    async fetchEmpleado() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(
          `${this.$url}/obtener_usuario_admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        const data = response.data;

        if (data.fecha_nacimiento) {
          data.fecha_nacimiento = moment(data.fecha_nacimiento).format(
            "YYYY-MM-DD"
          );
        }

        this.empleado = { ...data, preview: "" };
      } catch (error) {
        this.showNotification("Error al cargar el usuario.", "error");
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async editarEmpleado() {
      if (this.isEmpleado) {
        this.showNotification(
          "No tienes permisos para modificar este usuario.",
          "error"
        );
        return;
      }

      const id = this.$route.params.id;

      try {
        const formData = new FormData();

        // Agregar los campos al FormData
        formData.append("nombre", this.empleado.nombre);
        formData.append("apellido", this.empleado.apellido);
        formData.append("rol", this.empleado.rol);
        formData.append("estado", this.empleado.estado);
        formData.append("email", this.empleado.email);
        formData.append("telefono", this.empleado.telefono);
        formData.append("direccion", this.empleado.direccion);
        formData.append("genero", this.empleado.genero);
        formData.append("password", this.empleado.password);

        if (this.empleado.fecha_nacimiento) {
          const [day, month, year] = this.empleado.fecha_nacimiento.split("/");
          formData.append("fecha_nacimiento", `${year}-${month}-${day}`);
        }
        // Agregar la nueva imagen seleccionada al FormData
        if (this.empleado.imagenFile) {
          formData.append("imagen", this.empleado.imagenFile);
          console.log("Imagen añadida al FormData:", this.empleado.imagenFile);
        }

        // Indicar si la imagen existente fue eliminada
        if (!this.empleado.imagen && !this.empleado.preview) {
          formData.append("eliminar_imagen_usuario", true); // Campo adicional para borrar imagen en backend
          console.log("Campo para eliminar imagen existente añadido.");
        }

        // Verificar contenido del FormData
        for (let [key, value] of formData.entries()) {
          console.log(`FormData - ${key}:`, value);
        }

        // Realizar la solicitud al backend
        const response = await axios.put(
          `${this.$url}/actualizar_usuario_admin/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Respuesta del servidor:", response.data);

        this.showNotification("Usuario actualizado correctamente.", "success");
        setTimeout(() => {
          this.$router.push({ name: "usuario-index" });
        }, 3000);
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al actualizar el usuario.";
        this.showNotification(errorMessage, "error");
      }
    },
    uploadImage(event) {
      const image = event.target.files[0];

      console.log("Archivo seleccionado:", image);

      // Validaciones iniciales
      if (!image) {
        this.showNotification("No se seleccionó ninguna imagen.", "warning");
        return;
      }

      if (image.size > 1000000) {
        this.showNotification(
          "La imagen debe pesar menos de 1MB. Seleccione otra imagen.",
          "error"
        );
        return;
      }

      if (!["image/jpeg", "image/png"].includes(image.type)) {
        this.showNotification(
          "Formato de imagen no válido. Use imágenes JPEG o PNG.",
          "error"
        );
        return;
      }

      // Actualiza los datos del empleado con la nueva imagen
      this.empleado.preview = URL.createObjectURL(image); // Previsualización local
      this.empleado.imagenFile = image; // Asigna el archivo al estado

      console.log("Preview generado:", this.empleado.preview);
      console.log("Estado de imagenFile:", this.empleado.imagenFile);

      // Limpia cualquier error de validación
      this.validationErrors.imagen = null;

      // Notifica que la imagen fue cargada correctamente
      this.showNotification("Imagen cargada para previsualización.", "success");

      // Fuerza actualización del DOM si es necesario
      this.$forceUpdate();
    },
    removeImage() {
      this.empleado.preview = "";
      this.empleado.imagenFile = null;
      this.empleado.imagen = "";
    },

    showNotification(message, type) {
      clearTimeout(this.notificationTimeout);
      this.notificationMessage = message;
      this.notificationType = type;
      this.notificationVisible = true;
      this.notificationTimeout = setTimeout(() => {
        this.notificationVisible = false;
      }, 3000);
    },
  },
  mounted() {
    this.fetchEmpleado();
  },
};
</script>


<style scoped>
/* Estilos generales */
.d-flex {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.profile-section {
  flex: 0 0 250px;
  margin-right: 30px;
  text-align: center;
}

.form-section {
  flex: 1;
}

.image-placeholder {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.image-placeholder:hover {
  background-color: #f1f8ff;
  transform: scale(1.05);
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.image-actions {
  margin-top: 10px;
}

.image-actions .btn {
  font-size: 14px;
  padding: 8px 12px;
}

/* Inputs */
.input-custom {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-custom:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Botones */
.btn {
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-group .btn {
  margin-right: 8px;
}

/* Text Alignment */
.text-end {
  text-align: right;
}

/* Encabezado */
.header {
  margin-bottom: 20px;
}

.header-pretitle {
  font-size: 14px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.header-title {
  font-size: 28px;
  font-weight: bold;
  color: #343a40;
  margin-top: 5px;
}

.header-title i {
  font-size: 24px;
  margin-right: 10px;
  color: #007bff;
}

/* Sección de títulos */
.gallery-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #343a40;
}

.form-label {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
}

/* Feedback de validación */
.invalid-feedback {
  font-size: 14px;
  color: #dc3545;
  margin-top: 5px;
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

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
  }
  .profile-section {
    margin-right: 0;
    margin-bottom: 20px;
  }
  .text-end {
    text-align: center;
  }
}
</style>
