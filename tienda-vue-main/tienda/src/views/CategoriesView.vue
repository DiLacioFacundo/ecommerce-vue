<template>
    <div class="categories-page">
        <!-- Hero Section -->
        <section class="hero text-center text-white d-flex align-items-center justify-content-center"
            style="background-image: url('/assets/images/categories-hero.png'); background-size: cover; background-position: center; height: 400px; margin-top: 100px;">
            <div class="container">
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item"><router-link to="/" class="text-white">Inicio</router-link></li>
                    <li class="breadcrumb-item active text-white">Categorías</li>
                </ol>
                <h2 class="hero-heading" style="font-size: 3rem; font-weight: bold;">Categorías</h2>
                <p class="lead mt-3">Descubre todo lo que tenemos para ofrecerte, organizado en categorías especialmente pensadas para ti.</p>
            </div>
        </section>

        <!-- Categorías Section -->
        <section class="categories-section py-5">
            <div class="container">
                <div class="row">
                    <div v-for="category in categories" :key="category.id" class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img :src="category.image" class="card-img-top" :alt="category.name"
                                style="height: 200px; object-fit: cover;">
                            <div class="card-body text-center">
                                <h5 class="card-title text-uppercase">{{ category.name }}</h5>
                                <p class="card-text text-muted">{{ category.description }}</p>
                                <router-link :to="{ name: 'shop', query: { category: category.slug } }"
                                    class="btn btn-primary">
                                    Explorar
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categories: [
                {
                    id: 1,
                    name: "Vapes",
                    slug: "vapes",
                    image: "/assets/images/vapes-category.jpg",
                    description: "Explora nuestra selección de pods, mods y kits de inicio.",
                },
                {
                    id: 2,
                    name: "Líquidos",
                    slug: "liquidos",
                    image: "/assets/images/liquidos-category.jpg",
                    description: "Descubre una amplia variedad de líquidos con sabores increíbles.",
                },
                {
                    id: 3,
                    name: "Accesorios",
                    slug: "accesorios",
                    image: "/assets/images/accesorios-category.jpg",
                    description: "Encuentra resistencias, baterías y cargadores para tu vape.",
                },
            ],
        };
    },
    methods: {
        // Agregar aquí el código que maneja el cálculo de "envio" si es necesario
    }
};
</script>

<style scoped>
.hero {
    background-color: #005f96;
    color: white;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}

.breadcrumb {
    background-color: transparent;
    padding: 0;
    margin-bottom: 1rem;
}

.breadcrumb-item a {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
}

.breadcrumb-item.active {
    color: rgba(255, 255, 255, 0.7);
}

.card {
    border: none;
    border-radius: 10px;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card-title {
    font-size: 1.2rem;
    font-weight: bold;
}

.btn-primary {
    background-color: #005f96;
    border: none;
    transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
    background-color: #004080;
}
</style>
