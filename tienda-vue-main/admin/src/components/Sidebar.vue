<template>
  <nav class="navbar navbar-vertical fixed-start navbar-expand-md" id="sidebar">
    <div class="container-fluid">
      <!-- Brand -->
      <div class="navbar-brand d-flex flex-column align-items-center py-3">
        <img class="navbar-brand-img" src="/assets/logo.png" alt="Logo" />
      </div>

      <!-- Navigation -->
      <ul class="navbar-nav mt-4">
        <li class="nav-item">
          <!-- Abrir "E-commerce" en una nueva pestaña -->
          <a @click="openEcommerce" class="nav-link">
            <i class="fe fe-globe"></i>
            <span>E-commerce</span>
          </a>
        </li>
        <li class="nav-item">
          <router-link to="/producto" class="nav-link" active-class="active">
            <i class="fe fe-shopping-cart"></i>
            <span>Productos</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/categorias" class="nav-link" active-class="active">
            <i class="fe fe-layers"></i>
            <span>Categorías</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/ventas" class="nav-link" active-class="active">
            <i class="fe fe-shopping-bag"></i>
            <span>Ventas</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/usuario" class="nav-link" active-class="active">
            <i class="fe fe-user"></i>
            <span>Usuarios</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/cliente" class="nav-link" active-class="active">
            <i class="fe fe-user"></i>
            <span>Clientes</span>
          </router-link>
        </li>
      </ul>

      <!-- Divider -->
      <hr class="navbar-divider my-4" />
    </div>
  </nav>
</template>

<script>
export default {
  name: "Sidebar",
  methods: {
    // Método para abrir E-commerce en una nueva pestaña
    openEcommerce() {
      window.open("http://localhost:8086/", "_blank");
    },
  },
};
</script>

<style scoped>
/* Sidebar Styles */
#sidebar {
  background-color: #343a40; /* Darker background */
  border-right: 1px solid #e9ecef;
  width: 250px;
  transition: width 0.3s ease;
  height: 100vh;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1); /* Add shadow */
}

.navbar-brand-img {
  width: 100%; /* Responsive logo width */
  max-width: 150px; /* Max width for larger screens */
  height: auto;
}

/* Navigation */
.nav-link {
  font-size: 16px;
  padding: 12px 20px;
  color: #adb5bd; /* Light gray for text */
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.nav-link i {
  margin-right: 12px;
  font-size: 20px; /* Increase icon size */
  transition: transform 0.3s ease;
}

.nav-link:hover {
  background-color: #495057; /* Darker background on hover */
  color: #fff; /* White text on hover */
}

.nav-link:hover i {
  transform: scale(1.2); /* Grow icon on hover */
}

.nav-link.active {
  background-color: #007bff; /* Blue background for active links */
  color: #fff;
}

.navbar-divider {
  border-top: 1px solid #dee2e6;
}

.btn {
  font-size: 16px;
}

.btn i {
  font-size: 18px;
}

/* Scalable Sidebar for Larger Screens */
@media (min-width: 1200px) {
  #sidebar {
    width: 300px; /* Increased width for large desktops */
  }

  .nav-link {
    font-size: 18px; /* Slightly larger font size for readability */
  }
}

/* Responsive Adjustments for Small Screens */
@media (max-width: 768px) {
  #sidebar {
    width: 200px; /* Reduced width for smaller screens */
  }

  .navbar-brand-img {
    max-width: 120px; /* Adjust logo size */
  }

  .nav-link {
    font-size: 14px; /* Smaller font size */
    padding: 8px 10px;
  }
}

@media (min-width: 768px) {
  .navbar-vertical.navbar-expand-md > [class*="container"] {
    min-height: 0% !important;
  }
}
</style>
