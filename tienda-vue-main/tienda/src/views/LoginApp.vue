<template>
  <div>
    <!-- Encabezado Hero -->
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
          <li class="breadcrumb-item active text-white">Zona de Clientes</li>
        </ol>
        <h2 class="hero-heading" style="font-size: 3rem; font-weight: bold">
          Zona de Clientes
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

    <!-- Sección de Login y Registro -->
    <section>
      <div class="container py-5">
        <div class="row justify-content-center">
          <!-- Iniciar Sesión -->
          <div class="col-lg-5">
            <div class="block">
              <div class="block-header">
                <h6 class="text-uppercase mb-0">Iniciar Sesión</h6>
              </div>
              <div class="block-body">
                <p class="text-muted">
                  Accede a tu cuenta para realizar pedidos y revisar tu
                  historial de compras.
                </p>
                <hr />
                <form @submit.prevent="login">
                  <div class="mb-4">
                    <label class="form-label" for="email-login"
                      >Correo Electrónico</label
                    >
                    <input
                      class="form-control"
                      id="email-login"
                      type="text"
                      placeholder="Ingresa tu correo electrónico"
                      autocomplete="off"
                      v-model="email"
                    />
                  </div>
                  <div class="mb-4">
                    <label class="form-label" for="password-login"
                      >Contraseña</label
                    >
                    <input
                      class="form-control"
                      id="password-login"
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      autocomplete="off"
                      v-model="password"
                    />
                  </div>

                  <div class="mb-4" v-if="msm_error_login">
                    <small class="text-danger">{{ msm_error_login }}</small>
                  </div>

                  <div class="mb-4 text-center">
                    <button class="btn btn-primary" type="submit">
                      Ingresar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Registro de Cliente -->
          <div class="col-lg-5">
            <div class="block">
              <div class="block-header">
                <h6 class="text-uppercase mb-0">Crear Nueva Cuenta</h6>
              </div>
              <div class="block-body">
                <p class="text-muted">
                  Regístrate para acceder a ofertas exclusivas y realizar
                  compras de forma rápida y segura.
                </p>
                <hr />
                <form @submit.prevent="validar_registro">
                  <div class="mb-4">
                    <label class="form-label" for="nombre"
                      >Nombre Completo</label
                    >
                    <input
                      class="form-control"
                      id="nombre"
                      type="text"
                      placeholder="Ingresa tu nombre completo"
                      v-model="cliente.nombres"
                    />
                  </div>
                  <div class="mb-4">
                    <label class="form-label" for="email-registro"
                      >Correo Electrónico</label
                    >
                    <input
                      class="form-control"
                      id="email-registro"
                      type="text"
                      placeholder="Ingresa tu correo electrónico"
                      v-model="cliente.email"
                    />
                  </div>
                  <div class="mb-4">
                    <label class="form-label" for="password-registro"
                      >Contraseña</label
                    >
                    <input
                      class="form-control"
                      id="password-registro"
                      type="password"
                      placeholder="Ingresa una contraseña"
                      v-model="cliente.password"
                    />
                  </div>
                  <div class="mb-4">
                    <label class="form-label" for="genero">Género</label>
                    <select
                      class="form-control"
                      id="genero"
                      v-model="cliente.genero"
                    >
                      <option value="" disabled selected>
                        Seleccione su género
                      </option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div class="mb-4">
                    <label class="form-label" for="pais">País</label>
                    <select
                      class="form-control"
                      id="pais"
                      v-model="cliente.pais"
                    >
                      <option value="" disabled selected>
                        Seleccione su país
                      </option>
                      <option v-for="pais in paises" :key="pais" :value="pais">
                        {{ pais }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4" v-if="msm_error">
                    <small class="text-danger">{{ msm_error }}</small>
                  </div>

                  <div class="mb-4 text-center">
                    <button class="btn btn-primary" type="submit">
                      Registrarse
                    </button>
                  </div>
                </form>
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
  name: "LoginApp",
  components: {
    Notificacion,
  },
  data() {
    return {
      cliente: {
        nombres: "",
        email: "",
        password: "",
        genero: "",
        pais: "",
        estado: true,
      },
      paises: [],
      email: "",
      password: "",
      msm_error: "",
      msm_error_login: "",
      notificacion: {
        visible: false,
        message: "",
        type: "",
        duration: 3000,
      },
    };
  },
  methods: {
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
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validar_registro() {
      if (!this.cliente.nombres) {
        this.msm_error = "Por favor, ingresa tu nombre completo.";
      } else if (!this.cliente.email) {
        this.msm_error = "Por favor, ingresa tu correo electrónico.";
      } else if (!this.cliente.password) {
        this.msm_error = "Por favor, ingresa una contraseña.";
      } else if (!this.cliente.genero) {
        this.msm_error = "Por favor, selecciona tu género.";
      } else if (!this.cliente.pais) {
        this.msm_error = "Por favor, selecciona tu país.";
      } else {
        this.msm_error = "";
        axios
          .post(`${this.$url}/registro_cliente_ecommerce`, this.cliente, {
            headers: { "Content-Type": "application/json" },
          })
          .then((result) => {
            if (result.data.message) {
              this.showNotification(result.data.message, "error");
            } else {
              this.$store.dispatch("saveToken", result.data.token);
              this.$store.dispatch("saveUser", result.data.cliente);
              this.$router.push({ name: "home" });
            }
          })
          .catch((error) => {
            console.error(error);
            this.showNotification(
              "Ocurrió un error. Inténtalo nuevamente.",
              "error"
            );
          });
      }
    },
    login() {
      if (!this.email) {
        this.msm_error_login = "Por favor, ingresa tu correo electrónico.";
      } else if (!this.validateEmail(this.email)) {
        this.msm_error_login = "Por favor, ingresa un correo válido.";
      } else if (!this.password) {
        this.msm_error_login = "Por favor, ingresa tu contraseña.";
      } else {
        this.msm_error_login = "";
        this.isLoading = true;
        const data = {
          email: this.email,
          password: this.password,
        };
        axios
          .post(`${this.$url}/login_cliente`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((result) => {
            this.isLoading = false;
            if (result.data.message) {
              this.showNotification(result.data.message, "error");
            } else {
              this.showNotification("Inicio de sesión exitoso.", "success");
              this.$store.dispatch("saveToken", result.data.token);
              this.$store.dispatch("saveUser", result.data.cliente);
              this.$router.push({ name: "home" });
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              this.showNotification(error.response.data.message, "error");
            } else {
              this.showNotification(
                "Error al iniciar sesión. Verifica tus credenciales.",
                "error"
              );
            }
          });
      }
    },
    cargarPaises() {
      this.paises = [
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
        "Bolivia",
        "Bosnia y Herzegovina",
        "Botsuana",
        "Brasil",
        "Brunéi",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Camboya",
        "Camerún",
        "Canadá",
        "Catar",
        "Chad",
        "Chile",
        "China",
        "Chipre",
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
        "Etiopía",
        "Filipinas",
        "Finlandia",
        "Francia",
        "Gabón",
        "Gambia",
        "Georgia",
        "Ghana",
        "Grecia",
        "Guatemala",
        "Guyana",
        "Haití",
        "Honduras",
        "Hungría",
        "India",
        "Indonesia",
        "Irak",
        "Irán",
        "Irlanda",
        "Islandia",
        "Israel",
        "Italia",
        "Jamaica",
        "Japón",
        "Jordania",
        "Kazajistán",
        "Kenia",
        "Kirguistán",
        "Kosovo",
        "Kuwait",
        "Laos",
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
        "Palestina",
        "Panamá",
        "Papúa Nueva Guinea",
        "Paraguay",
        "Perú",
        "Polonia",
        "Portugal",
        "Reino Unido",
        "República Centroafricana",
        "República Checa",
        "República Dominicana",
        "Ruanda",
        "Rumanía",
        "Rusia",
        "Samoa",
        "San Marino",
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
        "Ucrania",
        "Uganda",
        "Uruguay",
        "Uzbekistán",
        "Vanuatu",
        "Vaticano",
        "Venezuela",
        "Vietnam",
        "Yemen",
        "Yibuti",
        "Zambia",
        "Zimbabue",
      ];
    },
  },
  mounted() {
    this.cargarPaises();
  },
};
</script>

<style>
.hero {
  background-color: #005f96;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
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

.block {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.block-header {
  text-align: center;
  margin-bottom: 15px;
}

.block-body {
  text-align: left;
}

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

.text-uppercase {
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
