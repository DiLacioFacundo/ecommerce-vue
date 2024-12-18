<template>
  <div
    class="success-page d-flex align-items-center justify-content-center vh-100"
  >
    <div class="text-center p-4 rounded shadow-lg">
      <h1 class="display-4 text-success mb-3">
        <i class="fas fa-check-circle"></i> ¡Gracias por tu compra!
      </h1>
      <p class="lead mb-4">
        Tu pedido ha sido procesado con éxito. En breve recibirás un correo con
        los detalles de tu compra.
      </p>
      <router-link to="/" class="btn btn-success btn-lg px-5">
        <i class="fas fa-home me-2"></i> Volver al inicio
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log("Pantalla de éxito cargada.");
  },
};
</script>

<style scoped>
.success-page {
  background: linear-gradient(120deg, #e0f7fa, #e8f5e9);
  color: #333;
  text-align: center;
  font-family: "Arial", sans-serif;
}

.text-success {
  color: #28a745 !important;
  font-size: 2.5rem;
}

p.lead {
  font-size: 1.2rem;
  color: #555;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  font-size: 1.2rem;
  transition: all 0.3s ease-in-out;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
  transform: scale(1.05);
}

.shadow-lg {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
}

.rounded {
  border-radius: 15px;
}

.vh-100 {
  height: 100vh;
}
</style>
