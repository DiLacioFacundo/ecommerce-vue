<template>
    <div style="background: #f3f3f3;" class="pb-5">
        <section class="hero" style="margin-top: 8rem !important;">
            <div class="container">
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item">
                        <router-link to="/">Inicio</router-link>
                    </li>
                    <li class="breadcrumb-item active">Tienda</li>
                </ol>
                <div class="hero-content pb-5 text-center">
                    <h1 class="hero-heading">Tienda de Vapes</h1>
                    <div class="row">
                        <div class="col-xl-8 offset-xl-2">
                            <p class="lead text-muted">Encuentra una gran variedad de vapes, líquidos y accesorios de
                                las mejores marcas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div class="container">
            <div class="row">
                <!-- Sidebar -->
                <div class="sidebar col-xl-3 col-lg-4 order-lg-1">
                    <!-- Categorías -->
                    <div class="sidebar-block">
                        <h6 class="sidebar-heading">Tipos de Vapes</h6>
                        <ul class="nav flex-column mt-3">
                            <li v-for="item in categorias" :key="item.categoria._id">
                                <a href="#" class="nav-link" @click="applyCategoryFilter(item.categoria._id)">
                                    {{ item.categoria.titulo }}
                                </a>
                                <ul v-if="item.subcategorias" class="list-unstyled ms-3">
                                    <li v-for="sub in item.subcategorias" :key="sub.titulo">
                                        <a href="#" @click="applySubcategoryFilter(sub.titulo)">
                                            {{ sub.titulo }}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <!-- Filtro de precios -->
                    <div class="sidebar-block mt-4">
                        <h6 class="sidebar-heading">Rango de precios</h6>
                        <div class="mt-3">
                            <input type="range" v-model="minRange" :min="slider.min || 0" :max="slider.max || 2000">
                            <span>{{ convertCurrency(minRange) }}</span> -
                            <input type="range" v-model="maxRange" :min="slider.min || 0" :max="slider.max || 2000">
                            <span>{{ convertCurrency(maxRange) }}</span>
                        </div>
                    </div>
                </div>
                <!-- Productos -->
                <div class="products-grid col-xl-9 col-lg-8 order-lg-2">
                    <header class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h2 class="section-title">Productos</h2>
                        <select v-model="sortBy" @change="sortProducts" class="form-select w-auto">
                            <option value="default">Ordenar por: Defecto</option>
                            <option value="priceAsc">Precio: Menor a Mayor</option>
                            <option value="priceDesc">Precio: Mayor a Menor</option>
                        </select>
                    </header>

                    <div class="row">
                        <div v-for="item in productos" :key="item._id" class="col-md-6 col-lg-4 mb-4">
                            <div class="product-card shadow-sm h-100 d-flex flex-column">
                                <div class="product-image position-relative overflow-hidden">
                                    <img :src="item.image" class="img-fluid rounded-top">
                                    <button class="btn btn-primary btn-sm product-quick-view"
                                        @click="showQuickView(item)">
                                        <i class="bi bi-eye"></i> Vista Rápida
                                    </button>
                                </div>
                                <div class="product-info p-3 d-flex flex-column flex-grow-1">
                                    <h6 class="product-title text-truncate mb-2">{{ item.titulo }}</h6>
                                    <span class="product-price text-primary fw-bold">{{ convertCurrency(item.precio)
                                        }}</span>
                                    <button class="btn btn-outline-primary btn-sm mt-auto" @click="addToCart(item)">
                                        <i class="bi bi-cart"></i> Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <b-pagination v-model="currentPage" :total-rows="totalProductos" :per-page="perPage" class="mt-4"
                        @change="fetchProductos">
                    </b-pagination>
                </div>

            </div>
        </div>
        <!-- Modal Vista Rápida -->
        <div v-if="showModal" class="modal fade show" style="display: block;" @click.self="closeQuickView">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>{{ selectedProduct.titulo }}</h5>
                        <button type="button" class="btn-close" @click="closeQuickView"></button>
                    </div>
                    <div class="modal-body">
                        <img :src="selectedProduct.image" class="img-fluid">
                        <p>{{ selectedProduct.descripcion }}</p>
                        <span>{{ convertCurrency(selectedProduct.precio) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import currency_formatter from 'currency-formatter';

export default {
    data() {
        return {
            slider: {
                min: 0,
                max: 2000,
            },
            minRange: 0,
            maxRange: 2000,
            categorias: [],
            productos: [],
            totalProductos: 0,
            currentPage: 1,
            perPage: 12,
            sortBy: 'default',
            showModal: false,
            selectedProduct: null,
        };
    },
    mounted() {
        // Cargar configuración inicial
        axios.get('/api/config')
            .then((response) => {
                this.slider.min = response.data.min || 0;
                this.slider.max = response.data.max || 2000;
            })
            .catch((error) => {
                console.error('Error al cargar la configuración:', error);
            });

        // Cargar categorías y productos iniciales
        this.fetchCategorias();
        this.fetchProductos();
    },
    methods: {
        fetchCategorias() {
            axios.get('/api/categorias')
                .then((response) => {
                    this.categorias = response.data;
                })
                .catch((error) => {
                    console.error('Error al cargar categorías:', error);
                });
        },
        fetchProductos() {
            axios
                .get('/api/productos', {
                    params: {
                        page: this.currentPage,
                        perPage: this.perPage,
                        minPrice: this.minRange,
                        maxPrice: this.maxRange,
                        sortBy: this.sortBy,
                    },
                })
                .then((response) => {
                    this.productos = response.data.items;
                    this.totalProductos = response.data.total;
                })
                .catch((error) => {
                    console.error('Error al cargar productos:', error);
                });
        },
        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'USD' });
        },
        sortProducts() {
            this.fetchProductos();
        },
        applyCategoryFilter(categoryId) {
            this.currentCategory = categoryId;
            this.fetchProductos();
        },
        applySubcategoryFilter(subcategoryTitle) {
            this.currentSubcategory = subcategoryTitle;
            this.fetchProductos();
        },
        showQuickView(product) {
            this.selectedProduct = product;
            this.showModal = true;
        },
        closeQuickView() {
            this.showModal = false;
        },
        addToCart(product) {
            console.log('Producto añadido al carrito:', product);
        },
    },
};
</script>


<style>
.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #343a40;
}

.product-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
    position: relative;
    background: #f8f9fa;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image img {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-image:hover img {
    transform: scale(1.1);
}

.product-quick-view {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 0.9rem;
    padding: 5px 10px;
    display: none;
    transition: all 0.3s ease;
}

.product-card:hover .product-quick-view {
    display: inline-block;
}

.product-info {
    background: #fff;
    display: flex;
    flex-direction: column;
}

.product-title {
    font-size: 1rem;
    color: #495057;
}

.product-price {
    font-size: 1.1rem;
    color: #007bff;
}

.product-info button {
    margin-top: auto;
}

.b-pagination {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.b-pagination .page-link {
    color: #007bff;
    border: none;
    background: #f8f9fa;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.b-pagination .page-link:hover {
    background: #007bff;
    color: #fff;
}
</style>
