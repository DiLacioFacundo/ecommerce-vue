<template>
  <nav class="navbar navbar-expand-md navbar-dark shadow-sm" id="navbar">
    <div class="container-fluid">
      <!-- Logo -->
      <a class="navbar-brand d-flex align-items-center" href="#">
        <span>Admin Panel</span>
      </a>

      <!-- Toggle button for mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarAdmin"
        aria-controls="navbarAdmin"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Right: User Menu -->
      <div class="navbar-user ms-auto d-flex align-items-center">
        <!-- User Name -->
        <span class="user-name me-3 text-light d-none d-md-block">
          {{ userName }}
        </span>

        <!-- User Dropdown -->
        <div class="dropdown">
          <a
            href="#"
            class="avatar avatar-sm dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="/assets/icons/user.png"
              class="avatar-img rounded-circle"
            />
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Mi Perfil</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item text-danger" href="#">Cerrar Sesion</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "TopNav",
  data() {
    return {
      userName: "Administrador", // Nombre del usuario (puedes obtenerlo dinámicamente desde tu sistema)
    };
  },
};
</script>

<style scoped>
/* General Navbar Styles */
.navbar {
  background-color: #343a40; /* Negro pastel */
  padding: 15px 20px;
  border-bottom: 1px solid #212529; /* Línea sutil más oscura */
}

.navbar-brand {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.navbar-brand .logo {
  width: 30px;
  height: 30px;
}

/* User Name */
.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  transition: color 0.3s ease;
}

.user-name:hover {
  color: #00b4d8;
}

/* Avatar Styles */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.avatar-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 2px solid #ffffff; /* Border around the avatar */
}

/* User Menu */
.dropdown-item {
  font-size: 14px;
  padding: 10px 20px;
}

.dropdown-item:hover {
  background-color: #495057; /* Hover más claro */
}

.dropdown-divider {
  margin: 0.5rem 0;
}

/* Navbar toggler */
.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.1);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba%280,0,0,0.25%29' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}
</style>
