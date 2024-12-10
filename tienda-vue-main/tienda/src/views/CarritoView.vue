<template>
    <div style="background: #f3f3f3;" class="pb-5">
        <!-- Sección Hero -->
        <section class="hero text-center text-white" style="background-size: cover; background-position: center; padding: 4rem 0; margin-top: 100px;">
            <div class="container">
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item"><router-link to="/" class="text-white">Inicio</router-link></li>
                    <li class="breadcrumb-item active text-white">Carrito</li>
                </ol>
                <h2 class="hero-heading" style="font-size: 3rem; font-weight: bold;">Carrito de Compras</h2>
                <p class="lead mt-3">Revisa los productos seleccionados antes de proceder con tu compra.</p>
            </div>
        </section>

        <!-- Sección Carrito -->
        <section class="shopping-cart-section py-5">
            <div class="container">
                <div class="row">
                    <!-- Lista de Productos -->
                    <div class="col-lg-8">
                        <div class="block mb-5">
                            <div class="cart">
                                <div class="cart-header">
                                    <div class="row">
                                        <div class="col-6">Producto</div>
                                        <div class="col-2">Precio</div>
                                        <div class="col-2">Cantidad</div>
                                        <div class="col-2">Total</div>
                                    </div>
                                </div>
                                <div class="cart-body" style="background: white;" v-if="!load_data">
                                    <!-- Producto -->
                                    <div class="cart-item py-3" v-for="item in carrito" :key="item._id">
                                        <div class="row d-flex align-items-center text-center">
                                            <div class="col-5">
                                                <div class="d-flex align-items-center">
                                                    <router-link :to="{ name: 'show-productos', params: { slug: item.producto.slug } }">
                                                        <img class="cart-item-img" :src="$url + '/obtener_portada_producto/' + item.producto.portada" alt="Producto" style="width: 80px; border-radius: 8px;">
                                                    </router-link>
                                                    <div class="cart-title text-start ms-3">
                                                        <router-link class="text-uppercase text-dark" :to="{ name: 'show-productos', params: { slug: item.producto.slug } }">
                                                            <strong>{{ item.producto.titulo.substr(0, 20) }}...</strong>
                                                        </router-link>
                                                        <br>
                                                        <span class="text-muted text-sm">{{ item.producto.str_variedad }}: {{ item.variedad.variedad }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-2">{{ convertCurrency(item.producto.precio) }}</div>
                                            <div class="col-2">{{ item.cantidad }}</div>
                                            <div class="col-2">{{ convertCurrency(item.producto.precio * item.cantidad) }}</div>
                                            <div class="col-1">
                                                <a class="cart-remove" style="cursor: pointer;" @click="eliminar(item._id)">
                                                    <i class="fas fa-trash text-danger"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="cart-body" style="background: white;" v-if="load_data">
                                    <div class="row">
                                        <div class="col-12 text-center">
                                            <img src="/assets/media/loading.gif" style="width: 60px;" alt="Cargando">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="my-5 d-flex justify-content-between flex-column flex-lg-row">
                            <router-link class="btn btn-primary" to="/shop">Continuar comprando</router-link>
                            <a class="btn btn-primary" href="/checkout">Ir a Pagar <i class="fa fa-chevron-right"></i></a>
                        </div>
                    </div>

                    <!-- Resumen de Orden -->
                    <div class="col-lg-4">
                        <div class="block mb-5">
                            <div class="block-header">
                                <h6 class="text-uppercase mb-0">Detalle de Orden</h6>
                            </div>
                            <div class="block-body bg-light pt-1">
                                <p class="text-sm">El costo de envío se calcula según el total de tu compra.</p>
                                <ul class="order-summary mb-0 list-unstyled">
                                    <li class="order-summary-item"><span>Subtotal</span><span>{{ convertCurrency(total) }}</span></li>
                                    <li class="order-summary-item"><span>Envío</span><span>{{ convertCurrency(envio) }}</span></li>
                                    <li class="order-summary-item border-0"><span>Total</span><strong class="order-summary-total">{{ convertCurrency(total + envio) }}</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
import currency_formatter from 'currency-formatter';

export default {
    data() {
        return {
            total: 0,
            carrito: [],
            load_data: true,
            envio: 10, // Costo de envío fijo
        };
    },
    methods: {
        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'USD' });
        },
        init_carrito() {
            if (this.$store.state.token) {
                this.load_data = true;
                axios
                    .get(this.$url + '/obtener_carrito_cliente', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${this.$store.state.token}`,

                        },
                    })
                    .then((result) => {
                        this.total = result.data.carrito_general.reduce((acc, item) => {
                            return acc + item.producto.precio * item.cantidad;
                        }, 0);
                        this.carrito = result.data.carrito_general;
                        this.load_data = false;
                    });
            }
        },
        eliminar(id) {
            axios
                .delete(this.$url + '/eliminar_producto_carrito/' + id, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.$store.state.token}`
                    },
                })
                .then(() => {
                    this.init_carrito();
                    this.$socket.emit('send_cart', true);
                });
        },
    },
    beforeMount() {
        this.init_carrito();
    },
};
</script>

<style scoped>
.hero {
    background-color: #005f96;
    color: white;
    height: 400px;
    margin-top: 100px;
    padding: 2rem 0;
    position: relative;
    z-index: 1;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}

.cart-header {
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 10px;
}

.cart-item {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
}


.cart-remove:hover {
    color: #dc3545;
}

.block {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.block-header {
    background-color: #f8f9fa;
    padding: 1rem;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
}

.block-body {
    padding: 1rem;
}

.order-summary-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
}
.order-summary-total {
    font-size: 1.25rem;
    font-weight: bold;
}


.order-summary-item span {
    font-size: 14px;
}

.btn-primary {
    background-color: #005f96;
    border: none;
}

.btn-primary:hover {
    background-color: #004080;
}
</style>
