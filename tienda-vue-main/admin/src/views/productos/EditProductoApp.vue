<template>
  <div>
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <!-- Header -->
            <div class="header mt-md-5">
              <div class="header-body">
                <div class="header mt-md-5">
                  <div class="header-body text-center">
                    <div class="row align-items-center">
                      <div class="col">
                        <h6 class="header-pretitle">Productos</h6>
                        <h1 class="header-title">
                          <i class="fas fa-box-open me-2 text-primary"></i> Editar Productos
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <router-link to="/producto" class="nav-link">
                          <i class="fas fa-list-alt me-1"></i> Todos los
                          Productos
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">
                          <i class="fas fa-edit me-1"></i> Editar Producto
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario -->
            <div class="card shadow-sm mt-4">
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-auto">
                    <!-- Avatar -->
                    <div class="avatar">
                      <img
                        class="avatar-img rounded-circle shadow"
                        :src="str_image"
                        alt="Portada"
                      />
                    </div>
                  </div>
                  <div class="col ms-n2">
                    <h4 class="mb-1">Portada</h4>
                    <small class="text-muted">PNG o JPG no mayor a 1MB.</small>
                  </div>
                  <div class="col-auto">
                    <label for="file-upload" class="btn btn-sm btn-primary">
                      <i class="fas fa-upload me-1"></i> Cargar Imagen
                    </label>
                    <input
                      style="display: none"
                      id="file-upload"
                      type="file"
                      @change="uploadImage($event)"
                    />
                  </div>
                </div>

                <form @submit.prevent="validarCampos">
                  <div class="row">
                    <!-- Título -->
                    <div class="col-12 col-md-6 mb-3">
                      <label class="form-label">
                        <i class="fas fa-tag me-1"></i> Título del Producto
                      </label>
                      <small class="form-text text-muted"
                        >Debe ser único.</small
                      >
                      <input
                        type="text"
                        class="form-control shadow-sm"
                        placeholder="Título del producto"
                        v-model="producto.titulo"
                      />
                    </div>

                    <!-- Variedad -->
                    <div class="col-12 col-md-6 mb-3">
                      <label class="form-label">
                        <i class="fas fa-leaf me-1"></i> Variedad
                      </label>
                      <input
                        type="text"
                        class="form-control shadow-sm"
                        placeholder="Variedad del producto"
                        v-model="producto.str_variedad"
                      />
                    </div>

                    <!-- Precio -->
                    <div class="col-12 col-md-6 mb-3">
                      <label class="form-label">
                        <i class="fas fa-dollar-sign me-1"></i> Precio
                      </label>
                      <input
                        type="number"
                        class="form-control shadow-sm"
                        placeholder="Precio del producto"
                        v-model="producto.precio"
                        readonly
                      />
                    </div>

                    <!-- Extracto -->
                    <div class="col-12 mb-3">
                      <label class="form-label">
                        <i class="fas fa-align-left me-1"></i> Extracto
                      </label>
                      <textarea
                        class="form-control shadow-sm"
                        rows="3"
                        placeholder="Descripción breve del producto"
                        v-model="producto.extracto"
                      ></textarea>
                    </div>
                  </div>

                  <!-- Switches -->
                  <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                      <label class="form-label">
                        <i class="fas fa-bullhorn me-1"></i> Producto Publicado
                      </label>
                      <small class="form-text text-muted">
                        Selecciona el estado de publicación.
                      </small>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="switchPublicado"
                          v-model="producto.estado"
                        />
                        <label class="form-check-label" for="switchPublicado">
                          {{ producto.estado ? "Publicado" : "Borrador" }}
                        </label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <label class="form-label">
                        <i class="fas fa-percent me-1"></i> En Descuento
                      </label>
                      <small class="form-text text-muted">
                        Indica si tiene descuento.
                      </small>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="switchDescuento"
                          v-model="producto.descuento"
                        />
                        <label class="form-check-label" for="switchDescuento">
                          {{
                            producto.descuento
                              ? "Con Descuento"
                              : "Sin Descuento"
                          }}
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Botón -->
                  <div class="text-center">
                    <button class="btn btn-primary btn-hover" type="submit">
                      <i class="fas fa-save me-1"></i> Guardar Cambios
                    </button>
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
import { mapState } from "vuex";

export default {
  name: "EditProductoApp",
  components: {
    Sidebar,
    TopNav,
  },
  data() {
    return {
      str_image: "/assets/images/no_image.png",
      producto: {
        titulo: "",
        categoria: "",
        precio: 0,
        extracto: "",
        estado: true,
        descuento: false,
        portada: null,
        str_variedad: "",
      },
      portada: null,
      variedad: {
        proveedor: "",
        variedad: "",
        stock: 0,
      },
      variedades: [],
    };
  },
  computed: {
    ...mapState(["apiUrl"]),
  },
  methods: {
    async init_data() {
      try {
        const response = await axios.get(
          `${this.apiUrl}/obtener_producto_admin/${this.$route.params.id}`,
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          }
        );
        this.producto = response.data;
        this.str_image = `${this.apiUrl}/obtener_portada_producto/${this.producto.portada}`;
        this.init_variedades();
      } catch (error) {
        console.error("Error al cargar los datos del producto:", error);
        this.$notify({
          group: "foo",
          title: "Error",
          text: "Error al cargar el producto.",
          type: "error",
        });
      }
    },
    uploadImage(event) {
      const image = event.target.files[0];
      if (!image) return;

      if (image.size > 1024 * 1024) {
        this.$notify({
          group: "foo",
          title: "Error",
          text: "La imagen debe pesar menos de 1MB.",
          type: "error",
        });
        return;
      }

      const validFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!validFormats.includes(image.type)) {
        this.$notify({
          group: "foo",
          title: "Error",
          text: "Formato de imagen no válido. Use JPEG, PNG o WEBP.",
          type: "error",
        });
        return;
      }

      this.str_image = URL.createObjectURL(image);
      this.portada = image;
    },
    validarCampos() {
      const camposObligatorios = [
        "titulo",
        "categoria",
        "extracto",
        "str_variedad",
      ];
      const faltantes = camposObligatorios.filter(
        (campo) => !this.producto[campo]
      );
      if (faltantes.length) {
        this.$notify({
          group: "foo",
          title: "Error",
          text: `Por favor complete los campos: ${faltantes.join(", ")}.`,
          type: "error",
        });
        return;
      }
      this.actualizarProducto();
    },
    async actualizarProducto() {
      try {
        const formData = new FormData();
        Object.entries(this.producto).forEach(([key, value]) =>
          formData.append(key, value)
        );
        if (this.portada) formData.append("portada", this.portada);

        await axios.put(
          `${this.apiUrl}/editar_producto_admin/${this.$route.params.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.$notify({
          group: "foo",
          title: "Éxito",
          text: "Producto actualizado correctamente.",
          type: "success",
        });
        this.$router.push({ name: "producto-index" });
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        this.$notify({
          group: "foo",
          title: "Error",
          text: "Error al actualizar el producto.",
          type: "error",
        });
      }
    },
    async init_variedades() {
      try {
        const response = await axios.get(
          `${this.apiUrl}/obtener_variedad_producto/${this.$route.params.id}`,
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          }
        );
        this.variedades = response.data.variedades;
      } catch (error) {
        console.error("Error al cargar variedades:", error);
      }
    },
    async agregar_variedad() {
      if (!this.variedad.proveedor || !this.variedad.variedad) {
        this.$notify({
          group: "foo",
          title: "Error",
          text: "Complete los campos de variedad y proveedor.",
          type: "error",
        });
        return;
      }

      try {
        const response = await axios.post(
          `${this.apiUrl}/registro_variedad_producto`,
          { ...this.variedad, producto: this.$route.params.id },
          { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
        );
        this.variedades.push(response.data);
        this.variedad = { proveedor: "", variedad: "", stock: 0 };
        this.$notify({
          group: "foo",
          title: "Éxito",
          text: "Variedad agregada correctamente.",
          type: "success",
        });
      } catch (error) {
        console.error("Error al agregar variedad:", error);
        this.$notify({
          group: "foo",
          title: "Error",
          text: "Error al agregar la variedad.",
          type: "error",
        });
      }
    },
  },
  beforeMount() {
    this.init_data();
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

.card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-control {
  border: 1px solid #d1d3e2;
  border-radius: 8px;
  padding: 10px 15px;
  transition: box-shadow 0.3s ease-in-out;
}

.form-control:focus {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  border-color: #007bff;
}

.btn-hover {
  transition: all 0.3s ease-in-out;
}

.btn-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.5);
}

.avatar-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

textarea {
  resize: none;
}

.form-check-input:checked {
  background-color: #4caf50;
  border-color: #4caf50;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
