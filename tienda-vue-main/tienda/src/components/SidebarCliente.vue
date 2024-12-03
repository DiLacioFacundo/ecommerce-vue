<template>
    <div class="customer-sidebar card border-0 shadow-sm">
        <div class="customer-profile text-center py-4">
            <a href="#" class="d-inline-block mb-2">
                <img class="img-fluid rounded-circle customer-image shadow-lg" 
                    src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/photo/kyle-loftus-589739-unsplash-avatar.jpg" 
                    alt="Perfil de cliente">
            </a>
        </div>

        <nav class="list-group customer-nav">
            <router-link to="/cuenta/pedidos" class="list-group-item d-flex justify-content-between align-items-center text-decoration-none">
                <span>
                    <svg class="svg-icon svg-icon-heavy me-2" width="20" height="20" fill="currentColor">
                        <use xlink:href="#paper-bag-1"></use>
                    </svg>
                    Pedidos
                </span>
                <div class="badge rounded-pill bg-dark fw-normal px-3">5</div>
            </router-link>

            <router-link to="/cuenta/perfil" class="list-group-item d-flex justify-content-between align-items-center text-decoration-none">
                <span>
                    <svg class="svg-icon svg-icon-heavy me-2" width="20" height="20" fill="currentColor">
                        <use xlink:href="#male-user-1"></use>
                    </svg>
                    Perfil
                </span>
            </router-link>

            <router-link to="/cuenta/direcciones" class="list-group-item d-flex justify-content-between align-items-center text-decoration-none" active-class="active">
                <span>
                    <svg class="svg-icon svg-icon-heavy me-2" width="20" height="20" fill="currentColor">
                        <use xlink:href="#navigation-map-1"></use>
                    </svg>
                    Direcciones
                </span>
            </router-link>

            <router-link to="/login" class="list-group-item d-flex justify-content-between align-items-center text-decoration-none">
                <span>
                    <svg class="svg-icon svg-icon-heavy me-2" width="20" height="20" fill="currentColor">
                        <use xlink:href="#exit-1"></use>
                    </svg>
                    Cerrar sesión
                </span>
            </router-link>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'SidebarCliente'
}
</script>

<style scoped>
.customer-sidebar {
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
}

.customer-profile {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 1rem;
}

.customer-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.customer-nav .list-group-item {
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    color: #495057;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.customer-nav .list-group-item:hover {
    background-color: #f8f9fa;
    color: #007bff;
}

.customer-nav .list-group-item.active {
    background-color: #007bff;
    color: #ffffff;
}

.customer-nav .badge {
    background-color: #28a745;
}
</style>
