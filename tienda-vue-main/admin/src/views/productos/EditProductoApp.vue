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
                    <h6 class="header-pretitle">Productos</h6>
                    <h1 class="header-title">
                      <i class="fas fa-boxes me-2 text-primary"></i> Editar
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
                        <router-link to="#" class="nav-link active">
                          <i class="fas fa-edit me-1"></i> Editar Producto
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
                <!-- Galería de Imágenes -->
                <div class="gallery-container mb-4">
                  <h5 class="fw-semibold text-center gallery-title">
                    <i class="fas fa-images me-2 text-primary"></i> Galería de
                    Imágenes
                  </h5>
                  <div class="image-gallery">
                    <!-- Imágenes existentes -->
                    <div
                      class="image-placeholder"
                      v-for="(imagen, index) in producto.imagenes"
                      :key="'existente-' + index"
                    >
                      <img
                        :src="imagen"
                        class="img-thumbnail"
                        alt="Imagen existente"
                      />
                      <button
                        type="button"
                        class="btn btn-danger btn-sm mt-2"
                        @click="eliminarImagenExistente(index)"
                      >
                        <i class="fas fa-trash-alt"></i> Eliminar
                      </button>
                    </div>

                    <!-- Nuevas imágenes -->
                    <div
                      class="image-placeholder"
                      v-for="(imagen, index) in nuevasImagenes"
                      :key="'nueva-' + index"
                    >
                      <img
                        :src="imagen.preview"
                        class="img-thumbnail"
                        alt="Imagen nueva"
                      />
                      <button
                        type="button"
                        class="btn btn-danger btn-sm mt-2"
                        @click="eliminarImagenNueva(index)"
                      >
                        <i class="fas fa-trash-alt"></i> Eliminar
                      </button>
                    </div>
                    <!-- Espacios para agregar más imágenes -->
                    <div
                      class="image-placeholder"
                      v-for="index in espaciosRestantes"
                      :key="'espacio-' + index"
                    >
                      <img
                        src="/assets/images/no_image.png"
                        class="img-thumbnail"
                        alt="Sin imagen"
                      />
                      <label
                        :for="'upload-image-' + index"
                        class="btn btn-primary btn-sm mt-2"
                      >
                        <i class="fas fa-upload"></i> Agregar
                      </label>
                      <input
                        :id="'upload-image-' + index"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="uploadNuevaImagen($event)"
                      />
                    </div>
                  </div>
                  <small class="text-muted d-block text-center mt-3">
                    Máximo de 5 imágenes. Formatos soportados: JPEG, PNG. Tamaño
                    máximo por imagen: 1MB.
                  </small>
                </div>

                <!-- Campos del Formulario -->
                <form @submit.prevent="validarCampos">
                  <div class="row">
                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label fw-semibold">Título</label>
                      <input
                        type="text"
                        class="form-control input-custom"
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
                      <label class="form-label fw-semibold">Categoría</label>
                      <select
                        class="form-select input-custom"
                        v-model="producto.categoria"
                        @change="fetchSubcategorias(producto.categoria)"
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
                      <label class="form-label fw-semibold">Subcategoría</label>
                      <select
                        class="form-select input-custom"
                        v-model="producto.subcategoria"
                        :class="{ 'is-invalid': validationErrors.subcategoria }"
                      >
                        <option value="" disabled selected>
                          Seleccionar Subcategoría
                        </option>
                        <option
                          v-for="subcat in subcategorias"
                          :key="subcat.id"
                          :value="subcat.id"
                        >
                          {{ subcat.titulo }}
                        </option>
                      </select>
                      <div
                        v-if="validationErrors.subcategoria"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.subcategoria }}
                      </div>
                    </div>

                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label fw-semibold">Precio</label>
                      <input
                        type="number"
                        class="form-control input-custom"
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
                      <label class="form-label fw-semibold">Stock</label>
                      <input
                        type="number"
                        class="form-control input-custom"
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

                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label fw-semibold">Variedad</label>
                      <input
                        type="text"
                        class="form-control input-custom"
                        placeholder="Variedad del producto"
                        v-model="producto.str_variedad"
                        :class="{ 'is-invalid': validationErrors.str_variedad }"
                      />
                      <div
                        v-if="validationErrors.str_variedad"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.str_variedad }}
                      </div>
                    </div>

                    <div class="col-12 col-md-6 mb-4">
                      <label class="form-label fw-semibold"
                        >Descuento (%)</label
                      >
                      <input
                        type="number"
                        class="form-control input-custom"
                        placeholder="Descuento en porcentaje"
                        v-model="producto.descuento"
                        :class="{ 'is-invalid': validationErrors.descuento }"
                      />
                      <div
                        v-if="validationErrors.descuento"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.descuento }}
                      </div>
                    </div>
                    <div class="col-12 mb-4">
                      <label class="form-label fw-semibold">Descripcion</label>
                      <textarea
                        class="form-control input-custom"
                        rows="4"
                        placeholder="Descripcion del producto"
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
                    <button type="submit" class="btn btn-success btn-hover">
                      <i class="fas fa-save me-2"></i> Guardar Cambios
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
import Notificacion from "@/components/Notificacion.vue";

export default {
  name: "EditProductoApp",
  components: {
    Sidebar,
    TopNav,
    Notificacion,
  },
  data() {
    return {
      producto: {
        titulo: "",
        categoria: "",
        subcategoria: "",
        precio: null,
        stock: null,
        extracto: "",
        estado: null,
        descuento: 0,
        str_variedad: "",
        imagenes: [], // Imágenes existentes
      },
      nuevasImagenes: [], // Imágenes nuevas agregadas
      categorias: [],
      subcategorias: [],
      validationErrors: {},
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "info",
      maxImages: 5,
    };
  },
  methods: {
    // Mostrar notificaciones
    showNotification(message, type, duration = 3000) {
      this.notificationMessage = message;
      this.notificationType = type;
      this.notificationVisible = true;

      setTimeout(() => {
        this.notificationVisible = false;
      }, duration);
    },
    // Inicializar datos
    async init_data() {
      try {
        const response = await axios.get(
          `${this.$url}/obtener_producto_admin/${this.$route.params.id}`,
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          }
        );

        if (response.data && response.data.data) {
          this.producto = response.data.data;

          // Normalizar las rutas de las imágenes
          this.producto.imagenes = this.producto.imagenes.map((img) => {
            if (!img.startsWith("http")) {
              return `${this.$url}${img}`; // Añade la base URL si falta
            }
            return img; // Mantén las rutas completas tal cual están
          });

          await this.fetchCategorias();
          if (this.producto.categoria) {
            await this.fetchSubcategorias(this.producto.categoria);
          }
        } else {
          throw new Error("Producto no encontrado.");
        }
      } catch (error) {
        this.showNotification(
          "Error al cargar los datos del producto.",
          "error"
        );
        this.$router.push({ name: "producto-index" });
      }
    },
    // Cargar categorías
    async fetchCategorias() {
      try {
        const response = await axios.get(
          `${this.$url}/listar_categorias_admin`,
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          }
        );

        if (Array.isArray(response.data.categorias)) {
          this.categorias = response.data.categorias.map((cat) => ({
            id: cat.categoria._id,
            titulo: cat.categoria.titulo,
          }));
        }
      } catch (error) {
        this.showNotification("Error al cargar las categorías.", "error");
      }
    },
    // Cargar subcategorías basadas en categoría
    async fetchSubcategorias(categoriaId) {
      try {
        const response = await axios.get(
          `${this.$url}/listar_subcategorias_por_categoria_admin/${categoriaId}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );

        if (Array.isArray(response.data.data)) {
          this.subcategorias = response.data.data.map((subcat) => ({
            id: subcat._id,
            titulo: subcat.titulo,
          }));
        } else {
          this.subcategorias = [];
        }
      } catch (error) {
        this.showNotification("Error al cargar subcategorías.", "error");
      }
    },
    // Subir nueva imagen
    uploadNuevaImagen(event) {
      const image = event.target.files[0];

      if (!image) return;

      if (
        this.nuevasImagenes.length + this.producto.imagenes.length >=
        this.maxImages
      ) {
        this.validationErrors.imagenes = `Solo puedes cargar un máximo de ${this.maxImages} imágenes.`;
        return;
      }

      if (image.size > 1024 * 1024) {
        this.validationErrors.imagenes = "Cada imagen debe pesar menos de 1MB.";
        return;
      }

      if (!["image/jpeg", "image/png"].includes(image.type)) {
        this.validationErrors.imagenes =
          "Formato de imagen no válido. Use JPEG o PNG.";
        return;
      }

      const preview = URL.createObjectURL(image);
      this.nuevasImagenes.push({ file: image, preview });
      this.validationErrors.imagenes = null;
    },
    // Eliminar imagen existente
    eliminarImagenExistente(index) {
      this.producto.imagenes.splice(index, 1);
      this.showNotification("Imagen eliminada correctamente.", "info");
    },
    // Eliminar imagen nueva
    eliminarImagenNueva(index) {
      this.nuevasImagenes.splice(index, 1);
      this.showNotification("Imagen eliminada correctamente.", "info");
    },
    // Validar campos del formulario
    validarCampos() {
      const {
        titulo,
        categoria,
        subcategoria,
        precio,
        stock,
        extracto,
        descuento,
      } = this.producto;

      this.validationErrors = {
        titulo: !titulo ? "El título es obligatorio." : null,
        categoria: !categoria ? "La categoría es obligatoria." : null,
        subcategoria: !subcategoria
          ? "Debe seleccionar una subcategoría."
          : null,
        precio: !precio || precio <= 0 ? "El precio debe ser positivo." : null,
        stock:
          stock === null || stock < 0
            ? "El stock debe ser mayor o igual a 0."
            : null,
        extracto: !extracto ? "La descripción es obligatoria." : null,
        imagenes:
          this.nuevasImagenes.length + this.producto.imagenes.length === 0
            ? "Debe cargar al menos una imagen."
            : null,
        descuento:
          descuento < 0 || descuento > 100
            ? "El descuento debe estar entre 0 y 100%."
            : null,
      };

      if (Object.values(this.validationErrors).some((error) => error)) {
        this.showNotification(
          "Por favor, corrija los errores antes de continuar.",
          "warning"
        );
        return false;
      }

      this.actualizarProducto();
    },
    async actualizarProducto() {
      try {
        const formData = new FormData();

        // Agregar datos básicos del producto
        Object.entries(this.producto).forEach(([key, value]) => {
          if (key !== "imagenes") {
            formData.append(key, value);
          }
        });

        // Agregar imágenes existentes (como JSON para identificar cuáles mantener)
        if (this.producto.imagenes && this.producto.imagenes.length > 0) {
          formData.append(
            "imagenes_actuales",
            JSON.stringify(this.producto.imagenes)
          );
        }

        // Agregar nuevas imágenes (archivos)
        this.nuevasImagenes.forEach((image) => {
          formData.append("imagenes", image.file); // Agregar las imágenes nuevas al FormData
        });

        // Enviar solicitud al servidor
        const response = await axios.put(
          `${this.$url}/actualizar_producto_admin/${this.$route.params.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Manejo de respuesta exitosa
        this.showNotification("Producto actualizado correctamente.", "success");

        // Actualizar las imágenes locales después de la respuesta
        this.producto.imagenes = response.data.data.imagenes;
        this.nuevasImagenes = []; // Limpiar las nuevas imágenes

        // Redirigir a la lista de productos
        setTimeout(() => this.$router.push({ name: "producto-index" }), 1000);
      } catch (error) {
        // Verificar si hay un mensaje de error del servidor
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al editar el producto. Intente nuevamente.";

        // Mostrar el mensaje del servidor como notificación
        this.showNotification(errorMessage, "error");
      }
    },
  },
  computed: {
    // Espacios restantes para imágenes
    espaciosRestantes() {
      return (
        this.maxImages -
        this.producto.imagenes.length -
        this.nuevasImagenes.length
      );
    },
  },
  mounted() {
    this.init_data();
  },
};
</script>


<style scoped>
/* General card styles */
.card {
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-pretitle {
  font-size: 14px;
  color: #6c757d;
}

.form-label {
  font-weight: 600;
  font-size: 16px;
  color: #343a40;
  margin-bottom: 8px;
}

.input-custom {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-custom:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

/* Gallery styles */
.gallery-container {
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
}

.gallery-title {
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
}

.image-placeholder {
  width: 120px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background-color: #ffffff;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.image-placeholder:hover {
  background-color: #eaf4ff;
  transform: scale(1.05);
}

.img-thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.image-placeholder .btn {
  font-size: 12px;
  margin-top: 10px;
  padding: 5px 10px;
}

/* Textarea styles */
textarea {
  resize: none;
}

/* Button styles */
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

.invalid-feedback {
  font-size: 14px;
  color: #dc3545;
  margin-top: 4px;
}

/* Navbar styles */
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

/* Muted text */
.text-muted {
  font-size: 14px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-img-top {
    height: 120px;
  }

  .card {
    margin: 0 auto 10px;
  }

  .gallery-container {
    padding: 15px;
  }

  .gallery-title {
    font-size: 12px;
  }
}
</style>
