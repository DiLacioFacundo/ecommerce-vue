<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <!-- Notificación -->
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
                    <h6 class="header-pretitle">Empleados</h6>
                    <h1 class="header-title">
                      <i class="fas fa-user-plus me-2 text-primary"></i> Crear
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
                        <router-link
                          to="/usuario/create"
                          class="nav-link"
                          active-class="active-link"
                        >
                          <i class="fas fa-plus-circle me-1"></i> Crear Usuario
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
                <form
                  @submit.prevent="validarCampos"
                  enctype="multipart/form-data"
                >
                  <div class="d-flex flex-wrap align-items-start">
                    <!-- Imagen de Perfil -->
                    <div class="profile-section text-center me-4">
                      <h5 class="fw-semibold gallery-title">
                        <i class="fas fa-images me-2 text-primary"></i> Imagen
                        de Perfil
                      </h5>
                      <div class="image-placeholder">
                        <!-- Mostrar la previsualización si existe, o una imagen predeterminada -->
                        <img
                          :src="
                            empleado.preview || '/assets/images/no_image.png'
                          "
                          class="profile-image"
                          alt="Imagen de perfil"
                        />
                        <div class="image-actions mt-2">
                          <!-- Mostrar botón "Agregar Imagen" si no hay previsualización -->
                          <label
                            v-if="!empleado.preview"
                            for="upload-profile-image"
                            class="btn btn-primary btn-sm"
                          >
                            <i class="fas fa-upload"></i> Agregar Imagen
                          </label>
                          <!-- Mostrar botón "Eliminar Imagen" si hay previsualización -->
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
                      <div
                        v-if="validationErrors.imagen"
                        class="text-danger mt-2"
                      >
                        {{ validationErrors.imagen }}
                      </div>
                      <small class="text-muted d-block mt-2">
                        Formato soportado: JPEG, PNG. Tamaño máximo: 1MB.
                      </small>
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
                            :class="{ 'is-invalid': validationErrors.nombre }"
                          />
                          <div
                            v-if="validationErrors.nombre"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.nombre }}
                          </div>
                        </div>

                        <!-- Apellido -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Apellido</label>
                          <input
                            type="text"
                            class="form-control input-custom"
                            placeholder="Apellido del empleado"
                            v-model="empleado.apellido"
                            :class="{ 'is-invalid': validationErrors.apellido }"
                          />
                          <div
                            v-if="validationErrors.apellido"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.apellido }}
                          </div>
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
                            :class="{ 'is-invalid': validationErrors.email }"
                          />
                          <div
                            v-if="validationErrors.email"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.email }}
                          </div>
                        </div>

                        <!-- Teléfono -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Teléfono</label>
                          <input
                            type="text"
                            class="form-control input-custom"
                            placeholder="Teléfono del empleado"
                            v-model="empleado.telefono"
                            :class="{ 'is-invalid': validationErrors.telefono }"
                          />
                          <div
                            v-if="validationErrors.telefono"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.telefono }}
                          </div>
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
                            :class="{
                              'is-invalid': validationErrors.direccion,
                            }"
                          />
                          <div
                            v-if="validationErrors.direccion"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.direccion }}
                          </div>
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
                            :class="{
                              'is-invalid': validationErrors.fecha_nacimiento,
                            }"
                          />
                          <div
                            v-if="validationErrors.fecha_nacimiento"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.fecha_nacimiento }}
                          </div>
                        </div>

                        <!-- Género -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Género</label>
                          <select
                            class="form-select input-custom"
                            v-model="empleado.genero"
                            :class="{ 'is-invalid': validationErrors.genero }"
                          >
                            <option value="" disabled selected>
                              Seleccionar Género
                            </option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                          </select>
                          <div
                            v-if="validationErrors.genero"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.genero }}
                          </div>
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
                              placeholder="Contraseña"
                              v-model="empleado.password"
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
                          <div
                            v-if="validationErrors.password"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.password }}
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
                              placeholder="Confirme la contraseña"
                              v-model="empleado.confirmPassword"
                              :class="{
                                'is-invalid': validationErrors.confirmPassword,
                              }"
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
                          <div
                            v-if="validationErrors.confirmPassword"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.confirmPassword }}
                          </div>
                          <div v-if="passwordMismatch" class="text-danger mt-2">
                            <small>Las contraseñas no coinciden</small>
                          </div>
                        </div>

                        <!-- Rol -->
                        <div class="col-12 col-md-6 mb-4">
                          <label class="form-label fw-semibold">Rol</label>
                          <select
                            class="form-select input-custom"
                            v-model="empleado.rol"
                            :class="{ 'is-invalid': validationErrors.rol }"
                          >
                            <option value="" disabled selected>
                              Seleccionar Rol
                            </option>
                            <option value="admin">Administrador</option>
                            <option value="empleado">Empleado</option>
                          </select>
                          <div
                            v-if="validationErrors.rol"
                            class="invalid-feedback"
                          >
                            {{ validationErrors.rol }}
                          </div>
                        </div>

                        <!-- Botón -->
                        <div class="col-12 text-end mt-4">
                          <button
                            type="submit"
                            class="btn btn-primary btn-hover"
                          >
                            <i class="fas fa-check-circle me-2"></i> Crear
                            Usuario
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

export default {
  name: "CreateEmpleadoApp",
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
        password: "",
        confirmPassword: "",
        telefono: "",
        direccion: "",
        fecha_nacimiento: "",
        genero: "",
        rol: "",
        imagen: "",
        preview: "",
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
  },
  methods: {
    validarCampos() {
      const {
        nombre,
        apellido,
        email,
        password,
        confirmPassword,
        telefono,
        rol,
      } = this.empleado;

      this.validationErrors = {
        nombre: !nombre ? "El nombre es obligatorio." : null,
        apellido: !apellido ? "El apellido es obligatorio." : null,
        email: !email ? "El correo electrónico es obligatorio." : null,
        direccion: !this.empleado.direccion
          ? "La dirección es obligatoria."
          : null,
        fecha_nacimiento: !this.empleado.fecha_nacimiento
          ? "La fecha de nacimiento es obligatoria."
          : null,
        genero: !this.empleado.genero ? "El género es obligatorio." : null,
        password: !password ? "La contraseña es obligatoria." : null,
        confirmPassword:
          password !== confirmPassword ? "Las contraseñas no coinciden." : null,
        telefono: !telefono ? "El teléfono es obligatorio." : null,
        rol: !rol ? "El rol es obligatorio." : null,
        imagen: !this.empleado.preview
          ? "Debe subir una imagen de perfil."
          : null,
      };

      if (Object.values(this.validationErrors).some((error) => error)) {
        this.showNotification(
          "Por favor, corrija los errores antes de continuar.",
          "warning"
        );
        return;
      }

      this.registrarEmpleado();
    },
    togglePasswordVisibility() {
      console.log("Toggle Password Visibility");
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    uploadImage(event) {
      const image = event.target.files[0];

      if (!image) {
        this.validationErrors.imagen = "Debe cargar una imagen.";
        return;
      }

      // Validar tamaño y tipo
      if (image.size > 1000000) {
        this.validationErrors.imagen = "La imagen debe pesar menos de 1MB.";
        return;
      }

      if (!["image/jpeg", "image/png"].includes(image.type)) {
        this.validationErrors.imagen =
          "Formato de imagen no válido. Use JPEG o PNG.";
        return;
      }
      // Crear una URL temporal para previsualización
      this.empleado.preview = URL.createObjectURL(image); // Previsualización local
      this.empleado.imagenFile = image; // Asigna el archivo al estado

      this.validationErrors.imagen = null;
    },
    removeImage() {
      this.empleado.preview = "";
      this.empleado.imagenFile = null;
      this.empleado.imagen = "";
    },
    async registrarEmpleado() {
      try {
        // Crear un objeto FormData
        const formData = new FormData();

        // Agregar datos del empleado a FormData
        formData.append("nombre", this.empleado.nombre);
        formData.append("apellido", this.empleado.apellido);
        formData.append("email", this.empleado.email);
        formData.append("password", this.empleado.password);
        formData.append("confirmPassword", this.empleado.confirmPassword);
        formData.append("telefono", this.empleado.telefono);
        formData.append("direccion", this.empleado.direccion);
        formData.append("fecha_nacimiento", this.empleado.fecha_nacimiento);
        formData.append("genero", this.empleado.genero);
        formData.append("rol", this.empleado.rol);

        // Agregar la imagen solo si existe
        if (this.empleado.imagenFile) {
          formData.append("imagen", this.empleado.imagenFile);
        }

        // Enviar los datos al backend
        const response = await axios.post(
          this.$url + "/crear_usuario_admin", // Cambia a la URL de tu API
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );

        // Notificar éxito
        this.showNotification("Usuario creado correctamente.", "success");

        // Redirigir después de unos segundos
        setTimeout(() => {
          this.$router.push({ name: "usuario-index" });
        }, 3000);
      } catch (error) {
        console.error("Error al registrar empleado:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Error al crear el usuario. Intente nuevamente.";
        this.showNotification(errorMessage, "error");
      }
    },
    showNotification(message, type) {
      clearTimeout(this.notificationTimeout);
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
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: uppercase;
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
