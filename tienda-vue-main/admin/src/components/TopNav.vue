<template>
  <nav class="navbar navbar-expand-md navbar-light shadow-sm" id="navbar">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <span>Admin Panel</span>
      </a>
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
      <div class="navbar-user ms-auto d-flex align-items-center">
        <span class="user-name me-3 d-none d-md-block">
          {{ userName }}
        </span>
        <div class="dropdown">
          <a
            href="#"
            class="avatar avatar-sm dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              :src="formatImageUrl(userPhoto)"
              alt="User Avatar"
              class="avatar-img rounded-circle"
            />
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="goToProfile">
                Mi Perfil
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a
                class="dropdown-item text-danger"
                href="#"
                @click.prevent="logout"
              >
                Cerrar Sesión
              </a>
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
      userName: "",
      userPhoto: "",
    };
  },
  methods: {
    goToProfile() {
      this.$router.push({ name: "perfil" });
    },
    logout() {
      localStorage.clear(); // Limpia el almacenamiento local
      if (this.$store) {
        this.$store.commit("resetUserState"); // Si usas Vuex, resetea el estado
      }
      this.$router.push({ name: "login" }); // Redirige al login
    },
    formatImageUrl(imagePath) {
      if (!imagePath) {
        return "/assets/icons/user.png";
      }


      let fullUrl = `${this.$url}${imagePath}`;

      fullUrl = fullUrl.includes("/api")
        ? fullUrl.replace("/api", "")
        : fullUrl;


      return fullUrl;
    },
    fetchUserData() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.userName = `${user.nombre} ${user.apellido}`;
        this.userPhoto = user.imagen;
      }
    },
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>

<style scoped>
/* General Navbar Styles */
.navbar {
  background-color: #f8f9fa; /* Gris claro */
  padding: 15px 20px;
  border-bottom: 1px solid #ced4da; /* Línea de separación */
}

/* Navbar Brand */
.navbar-brand {
  font-size: 20px;
  font-weight: 600;
  color: #495057; /* Gris oscuro */
}

.navbar-brand:hover {
  color: #0056b3; /* Azul más oscuro */
}

/* User Name */
.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #495057; /* Gris oscuro */
  transition: color 0.3s ease;
}

.user-name:hover {
  color: #343a40; /* Más oscuro */
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
  border: 2px solid #ced4da; /* Borde sutil */
}

/* User Menu */
.dropdown-item {
  font-size: 14px;
  padding: 10px 20px;
}

.dropdown-item:hover {
  background-color: #e9ecef; /* Hover más claro */
}

.dropdown-divider {
  margin: 0.5rem 0;
}

/* Navbar toggler */
.navbar-toggler {
  border-color: rgba(0, 0, 0, 0.1);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba%280,0,0,0.5%29' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}
</style>
