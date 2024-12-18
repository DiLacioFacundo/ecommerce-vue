<template>
  <div class="modal-wrapper" v-if="isVisible">
    <!-- Notificación -->
    <notificacion
      v-if="notificationVisible"
      :message="notificationMessage"
      :type="notificationType"
      @close="notificationVisible = false"
    />
    <!-- Modal -->
    <div class="modal-card" :class="{ 'fade-out': isClosing }">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-folder-plus text-primary me-2"></i> Crear
          Subcategoría
        </h5>
        <button class="btn-close" @click="iniciarCierre">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-subtitle text-muted">
          <i class="fas fa-folder-open text-info me-2"></i>
          <strong>Categoría Seleccionada:</strong> {{ categoriaNombre }}
        </p>
        <form @submit.prevent="crearSubcategoria">
          <div class="form-group">
            <label for="titulo">
              <i class="fas fa-pen text-success me-2"></i> Título de la
              Subcategoría
            </label>
            <input
              id="titulo"
              v-model="titulo"
              type="text"
              class="form-control"
              placeholder="Escribe el título de la subcategoría"
            />
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-check-circle me-2"></i> Crear
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="iniciarCierre"
            >
              <i class="fas fa-times-circle me-2"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Notificacion from "@/components/Notificacion.vue";

export default {
  components: { Notificacion },
  data() {
    return {
      titulo: "",
      categoriaNombre: "",
      isVisible: true,
      isClosing: false,
      notificationVisible: false,
      notificationMessage: "",
      notificationType: "info",
    };
  },
  computed: {
    categoriaId() {
      return this.$route.params.categoriaId;
    },
  },
  methods: {
    handleSubcategoriaCreada(message) {
      this.showNotification(message, "success");
      this.cargarCategorias();
      this.cerrarModalSubcategoria();
    },
    handleError(errorMessage) {
      this.showNotification(errorMessage, "error");
    },
    cerrarModalSubcategoria() {
      this.modalSubcategoriaVisible = false;
    },
    showNotification(message, type) {
      this.notificationMessage = message;
      this.notificationType = type;
      this.notificationVisible = true;

      setTimeout(() => {
        this.notificationVisible = false;
      }, 3000);
    },
    async cargarCategoria() {
      try {
        const response = await axios.get(
          `${this.$url}/obtener_categoria_admin/${this.categoriaId}`,
          { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
        );
        this.categoriaNombre = response.data.data.titulo;
      } catch (error) {
        // Verificar si hay un mensaje de error del servidor
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "No se pudo cargar la información de la categoría. Intenta nuevamente.";
        // Mostrar el mensaje del servidor como notificación
        this.showNotification(errorMessage, "error");
      }
    },
    async crearSubcategoria() {
      try {
        await axios.post(
          `${this.$url}/registrar_subcategoria_admin`,
          {
            categoria: this.categoriaId,
            titulo: this.titulo,
          },
          { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
        );
        this.showNotification("Subcategoría creada exitosamente.", "success");

        // Cierra el modal después de la creación exitosa
        this.iniciarCierre();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.showNotification(
            error.response.data.message || "Solicitud inválida.",
            "error"
          );
        } else if (error.response && error.response.status === 500) {
          this.showNotification(
            "Error del servidor. Inténtalo más tarde.",
            "error"
          );
        } else {
          this.showNotification("Error de conexión. Verifica tu red.", "error");
        }
      }
    },
    iniciarCierre() {
      this.isClosing = true;
      setTimeout(() => {
        this.isVisible = false;
        this.$router.push("/categorias");
      }, 500);
    },
  },
  mounted() {
    this.cargarCategoria();
  },
};
</script>

<style scoped>
/* Fondo con transparencia más clara */
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9); /* Fondo claro */
  backdrop-filter: blur(10px);
  z-index: 1050;
}

/* Tarjeta del modal */
.modal-card {
  background: #ffffff;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  padding: 25px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
  transition: transform 0.3s, opacity 0.3s;
  transform: translateY(0);
}

/* Animación de cierre */
.modal-card.fade-out {
  animation: fadeOut 0.3s ease;
  transform: translateY(-20px);
  opacity: 0;
}

/* Encabezado */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #333;
}

/* Cuerpo */
.modal-body {
  padding: 20px 0;
}

.modal-subtitle {
  font-size: 16px;
  margin-bottom: 15px;
  color: #555;
}

/* Pie */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
}

/* Estilos de botones */
.form-group {
  margin-bottom: 20px;
}

input.form-control {
  padding: 10px 15px;
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.25);
}

button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
