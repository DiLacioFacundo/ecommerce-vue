<template>
  <div
    class="d-flex align-items-center justify-content-center vh-100"
    style="
      background-image: url('/assets/images/background-vape.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    "
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8 col-xl-6">
          <h1 class="text-center mb-4">Iniciar Sesión</h1>
          <p class="text-muted text-center mb-4">Accede al Panel Administrador</p>

          <form @submit.prevent="validar">
            <div v-if="msm_error" class="alert alert-danger text-center" role="alert">
              {{ msm_error }}
            </div>

            <div class="form-group mb-4">
              <label class="form-label">Correo Electrónico</label>
              <input
                type="email"
                class="form-control form-control-xl"
                v-model="email"
                placeholder="nombre@correo.com"
                :class="{ 'is-invalid': !email && formSubmitted }"
              />
              <div v-if="!email && formSubmitted" class="invalid-feedback">
                Por favor, ingresa un correo electrónico.
              </div>
            </div>

            <div class="form-group mb-4">
              <label class="form-label">Contraseña</label>
              <div class="input-group">
                <input
                  class="form-control form-control-xl"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Ingresa tu contraseña"
                  :class="{ 'is-invalid': !password && formSubmitted }"
                />
                <span class="input-group-text password-toggle" @click="togglePasswordVisibility">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
                <div v-if="!password && formSubmitted" class="invalid-feedback">
                  Por favor, ingresa una contraseña.
                </div>
              </div>
            </div>

            <button
              class="btn btn-lg btn-primary w-100"
              type="button"
              :disabled="isLoading"
              @click="validar"
            >
              <span v-if="isLoading">Ingresando...</span>
              <span v-else>Ingresar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "LoginApp",
  data() {
    return {
      email: "",
      password: "",
      msm_error: "",
      showPassword: false,
      isLoading: false,
      formSubmitted: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validar() {
      this.formSubmitted = true;
      if (!this.email || !this.password) {
        return;
      }
      this.msm_error = "";
      this.login();
    },
    login() {
      this.isLoading = true;
      const data = { email: this.email, password: this.password };
      axios
        .post(`${this.$url}/login_usuario`, data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((result) => {
          if (!result.data.token) {
            this.msm_error = result.data.message || "Credenciales inválidas.";
          } else {
            this.$store.dispatch("saveToken", result.data.token);
            this.$router.push({ name: "dashboard" });
          }
        })
        .catch((error) => {
          console.error(error);
          this.msm_error = "Error de conexión, por favor intenta nuevamente.";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
/* Container adjustments */
.container {
  max-width: 600px;
  min-height: 650px; /* Ajusta la altura mínima */
  padding: 60px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco translúcido */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Form elements */
.form-label {
  font-weight: bold;
  color: #495057;
  font-size: 20px; /* Aumenta el tamaño de la etiqueta */
}

.form-control {
  border-radius: 12px;
  font-size: 18px; /* Aumenta el tamaño de la fuente */
  padding: 18px; /* Más espacio dentro del campo */
  min-height: 60px; /* Incrementa la altura mínima */
}

.input-group-text {
  background-color: #ffffff;
  border-left: none;
  cursor: pointer;
  font-size: 24px; /* Tamaño del ícono */
  padding: 18px;
}

.password-toggle i {
  color: #007bff;
}

/* Invalid Feedback */
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 16px;
}

/* Buttons */
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  font-size: 22px;
  font-weight: bold;
  padding: 18px;
  border-radius: 12px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: scale(1.02);
}

/* Alerts */
.alert {
  font-size: 18px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

/* Headings */
h1 {
  color: #212529;
  font-weight: bold;
  font-size: 36px; /* Tamaño del encabezado */
}

/* Responsive adjustments */
@media (min-width: 992px) {
  .container {
    max-width: 700px;
    min-height: 700px;
  }

  h1 {
    font-size: 38px;
  }

  .form-control {
    font-size: 20px;
    min-height: 65px;
  }

  .btn-primary {
    font-size: 24px;
    padding: 22px;
  }
}
</style>
