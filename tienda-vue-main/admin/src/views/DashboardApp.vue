<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <!-- MAIN CONTENT -->
    <div class="main-content">
      <!-- Top Navigation -->
      <TopNav />

      <!-- Dashboard Content -->
      <div class="container-fluid py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <!-- Header Section -->
            <div class="header">
              <div class="header-body">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <!-- Page Title -->
                    <h6 class="header-pretitle">Gestión de</h6>
                    <h1 class="header-title">Empleados</h1>
                  </div>
                  <!-- Add Employee Button -->
                  <router-link to="/colaborador/create" class="btn btn-primary">
                    <i class="fas fa-user-plus"></i> Nuevo Empleado
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Employees Table -->
            <div class="card mt-4">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h4 class="mb-0">Lista de Empleados</h4>
                <router-link to="/colaborador/create" class="btn btn-sm btn-secondary">
                  Agregar Nuevo
                </router-link>
              </div>
              <div class="card-body">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Departamento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <router-link
                          to="/colaborador/edit/1"
                          class="btn btn-sm btn-outline-primary"
                        >
                          Editar
                        </router-link>
                        <button class="btn btn-sm btn-outline-danger">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                    <!-- Más filas aquí -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <nav aria-label="Page navigation" class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item">
                  <a class="page-link" href="#">Anterior</a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">Siguiente</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";

export default {
  name: "DashboardApp",
  components: {
    Sidebar,
    TopNav,
  },
};
</script>

<style>
.dashboard-wrapper {
  display: flex;
}
.main-content {
  flex-grow: 1;
}
</style>
