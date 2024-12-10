<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <!-- Header -->
            <div class="header mt-md-5">
              <div class="header-body text-center">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">Productos</h6>
                    <h1 class="header-title">
                      <i class="fas fa-boxes me-2 text-primary"></i> Crear
                      Producto
                    </h1>
                  </div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col">
                    <ul
                      class="nav nav-tabs nav-overflow header-tabs justify-content-center"
                    >
                      <li class="nav-item">
                        <router-link to="/producto" class="nav-link">
                          <i class="fas fa-list-alt me-1"></i> Listar Productos
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link
                          to="/producto/create"
                          class="nav-link"
                          active-class="active-link"
                        >
                          <i class="fas fa-plus-circle me-1"></i> Crear Producto
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario -->
            <div class="card shadow-sm grow-on-hover">
              <div class="card-body">
                <div class="text-center mb-4">
                  <div class="avatar">
                    <img class="avatar-img" :src="str_image" alt="Portada" />
                  </div>
                  <label for="file-upload" class="btn btn-primary mt-3">
                    Cargar Imagen
                  </label>
                  <input
                    style="display: none"
                    id="file-upload"
                    type="file"
                    @change="uploadImage"
                  />
                  <div
                    v-if="validationErrors.portada"
                    class="invalid-feedback d-block"
                  >
                    {{ validationErrors.portada }}
                  </div>
                </div>

                <form @submit.prevent="validarCampos">
                  <div class="row">
                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label">Título del Producto</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Título del producto"
                        v-model="producto.titulo"
                        :class="{ 'is-invalid': validationErrors.titulo }"
                      />
                      <div
                        v-if="validationErrors.titulo"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.titulo }}
                      </div>
                    </div>

                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label">Categoría</label>
                      <select
                        class="form-select"
                        v-model="producto.categoria"
                        :class="{ 'is-invalid': validationErrors.categoria }"
                      >
                        <option value="" disabled selected>
                          Seleccionar Categoría
                        </option>
                        <option
                          v-for="cat in categorias"
                          :key="cat.id"
                          :value="cat.id"
                        >
                          {{ cat.titulo }}
                        </option>
                      </select>
                      <div
                        v-if="validationErrors.categoria"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.categoria }}
                      </div>
                    </div>

                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label">Precio</label>
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Precio"
                        v-model="producto.precio"
                        :class="{ 'is-invalid': validationErrors.precio }"
                      />
                      <div
                        v-if="validationErrors.precio"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.precio }}
                      </div>
                    </div>

                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label">Stock</label>
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Stock disponible"
                        v-model="producto.stock"
                        :class="{ 'is-invalid': validationErrors.stock }"
                      />
                      <div
                        v-if="validationErrors.stock"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.stock }}
                      </div>
                    </div>

                    <div class="col-12 mb-4">
                      <label class="form-label">Descripción</label>
                      <textarea
                        class="form-control"
                        rows="4"
                        placeholder="Descripción del producto"
                        v-model="producto.extracto"
                        :class="{ 'is-invalid': validationErrors.extracto }"
                      ></textarea>
                      <div
                        v-if="validationErrors.extracto"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.extracto }}
                      </div>
                    </div>
                  </div>

                  <div class="text-center">
                    <button type="submit" class="btn btn-primary">
                      Crear Producto
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

export default {
  name: "CreateProductoApp",
  components: {
    Sidebar,
    TopNav,
  },
  data() {
    return {
      str_image: "/assets/images/no_image.png",
      producto: {
        categoria: "",
        subcategoria: "",
        estado: true,
        descuento: 0,
        stock: 0,
        portada: undefined,
        titulo: "",
        precio: null,
        extracto: "",
      },
      categorias: [],
      validationErrors: {},
      isCategoriasLoaded: false, // Nueva variable de estado
    };
  },
  async fetchCategorias() {
    try {
      const response = await axios.get(this.$url + "/listar_categorias_admin", {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });

      if (Array.isArray(response.data.data)) {
        this.categorias = response.data.data.map((cat) => ({
          id: cat.categoria._id,
          titulo: cat.categoria.titulo,
        }));
        this.isCategoriasLoaded = true;
      } else {
        console.error(
          "La respuesta no contiene un array bajo 'data':",
          response.data
        );
      }
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
    }
  },
  uploadImage(event) {
    const image = event.target.files[0];
    if (!image) {
      this.validationErrors.portada = "Debe cargar una imagen.";
      return;
    }
    if (image.size > 1000000) {
      this.validationErrors.portada = "La imagen debe pesar menos de 1MB.";
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        image.type
      )
    ) {
      this.validationErrors.portada = "El archivo debe ser una imagen válida.";
      return;
    }
    this.validationErrors.portada = null;
    this.str_image = URL.createObjectURL(image);
    this.producto.portada = image;
  },
  validarCampos() {
    const { titulo, categoria, precio, extracto, portada, stock, descuento } =
      this.producto;
    this.validationErrors = {
      titulo: !titulo ? "El título es obligatorio." : null,
      categoria: !categoria ? "La categoría es obligatoria." : null,
      precio: !precio || precio <= 0 ? "El precio debe ser positivo." : null,
      extracto: !extracto ? "La descripción es obligatoria." : null,
      portada: !portada ? "Debe cargar una imagen de portada." : null,
      stock: stock < 0 ? "El stock no puede ser negativo." : null,
      descuento:
        descuento < 0 || descuento > 100
          ? "El descuento debe estar entre 0 y 100%."
          : null,
    };

    if (Object.values(this.validationErrors).some((error) => error)) {
      return;
    }

    this.registroProducto();
  },
  async registroProducto() {
    const formData = new FormData();
    Object.keys(this.producto).forEach((key) => {
      formData.append(key, this.producto[key]);
    });

    try {
      await axios.post(this.$url + "/registrar_producto_admin", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });
      alert("Producto creado exitosamente");
      this.$router.push({ name: "producto-index" });
    } catch (error) {
      console.error("Error al registrar el producto:", error);
    }
  },
  mounted() {
    this.fetchCategorias();
  },
};
</script>

<style scoped>
.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.card {
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.nav-link {
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 500;
  color: #007bff; /* Texto normal */
  background-color: transparent; /* Fondo normal */
  text-align: center; /* Centrar texto */
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
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 12px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #ddd;
  margin: auto;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

textarea {
  resize: none;
}
</style>
