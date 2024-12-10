<template>
    <div style="background: #f3f3f3;" class="pb-5">
        <!-- Sección Hero -->
        <section class="hero text-center text-white" style="background-size: cover; background-position: center; padding: 4rem 0; margin-top: 100px;">
            <div class="container">
                <!-- Breadcrumbs -->
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item"><router-link to="/" class="text-white">Inicio</router-link></li>
                    <!-- En carrito solo tienes dos enlaces, pero en checkout tres -->
                    <li class="breadcrumb-item"><router-link to="/cart" class="text-white">Carrito</router-link></li>
                    <li class="breadcrumb-item active" v-if="!$route.path.includes('checkout')">Carrito</li>
                    <li class="breadcrumb-item active" v-if="$route.path.includes('checkout')">Checkout</li>
                </ol>
                <!-- Hero Content -->
                    <h2 class="hero-heading" style="font-size: 3rem; font-weight: bold;">Checkout</h2>
                    <p class="lead mt-3">Por favor revisa tu orden antes de realizar el pago.</p>
            </div>
        </section>

        <!-- Checkout Section -->
        <section class="contact-details py-5">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <!-- Dirección de Entrega -->
                        <div class="block mb-5 border-custom">
                            <div class="block-header">
                                <h6 class="text-uppercase mb-0">Dirección de entrega</h6>
                            </div>
                            <div class="block-body">
                                <div class="row">
                                    <div v-for="item in direcciones" :key="item._id" class="mb-4 col-md-6">
                                        <input type="radio" name="shipping" :id="'option' + item._id" :value="item._id"
                                            v-on:change="selected_direccion($event)"
                                            :checked="venta.direccion === item._id">
                                        <label class="ms-3" :for="'option' + item._id"
                                            :class="{ 'selected': venta.direccion === item._id }">
                                            <strong class="d-block text-uppercase mb-2">{{ item.pais }}, {{ item.ciudad
                                                }}</strong>
                                            <span class="text-muted text-sm">{{ item.direccion }}</span><br>
                                            <span class="text-muted text-sm">{{ item.nombre }} {{ item.apellidos }}, {{
                                                item.telefono }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cart Section -->
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
                                <div class="cart-body">
                                    <div v-for="item in productos" :key="item.producto._id" class="cart-item">
                                        <div class="row d-flex align-items-center text-center">
                                            <div class="col-6">
                                                <div class="d-flex align-items-center">
                                                    <a :href="'/productos/' + item.producto.slug">
                                                        <img class="cart-item-img"
                                                            :src="$url + '/obtener_portada_producto/' + item.producto.portada"
                                                            alt="Producto">
                                                    </a>
                                                    <div class="cart-title text-start">
                                                        <a class="text-uppercase text-dark"
                                                            :href="'/productos/' + item.producto.slug">
                                                            <strong>{{ item.producto.titulo.substr(0, 20) }}...</strong>
                                                        </a>
                                                        <br>
                                                        <span class="text-muted text-sm">{{ item.producto.str_variedad
                                                            }}: {{ item.variedad.variedad }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-2">{{ convertCurrency(item.producto.precio) }}</div>
                                            <div class="col-2">{{ item.cantidad }}</div>
                                            <div class="col-2 text-center">{{ convertCurrency(item.producto.precio *
                                                item.cantidad) }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Checkout Actions -->
                        <div class="mb-5 d-flex justify-content-between flex-column flex-lg-row">
                            <router-link to="/shop" class="btn btn-link text-muted">Regresar a tienda</router-link>
                        </div>
                    </div>

                    <!-- Resumen de la Orden -->
                    <div class="col-lg-4">
                        <div class="block mb-5 border-custom">
                            <div class="block-header">
                                <h6 class="text-uppercase mb-0">Resumen del pedido</h6>
                            </div>
                            <div class="block-body pt-1">
                                <ul class="order-summary mb-0 list-unstyled">
                                    <li class="order-summary-item"><span>Subtotal</span><span>{{ convertCurrency(total)
                                            }}</span></li>
                                    <li class="order-summary-item"><span>Envío</span><span>{{ convertCurrency(envio)
                                            }}</span></li>
                                    <li class="order-summary-item border-0">
                                        <span>Total</span><strong class="order-summary-total">{{ convertCurrency(total +
                                            envio) }}</strong>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Método de Pago -->
                        <div class="block mb-5 border-custom">
                            <div class="block-header">
                                <h6 class="text-uppercase mb-0">Método de pago</h6>
                            </div>
                            <div class="block-body pt-1 mb-3">
                                <div class="col-md-12 mb-2">
                                    <span class="d-block mb-2">Tarjeta de crédito o débito</span>
                                    <div class="row">
                                        <div class="col-12 mb-2">
                                            <img src="/assets/media/payments.png" style="width: 180px;">
                                        </div>
                                        <div class="col-12">
                                            <p class="text-muted" style="font-size: 13px">(Luego de hacer clic en
                                                "PAGAR", serás redirigido de forma segura a Mercado Pago para completar
                                                tu compra).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="block-footer text-center">
                                <a class="btn btn-primary" id="btnBuy" v-on:click="crearPreferencia()">PAGAR</a>
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
    name: 'CheckoutView',
    data() {
        return {
            direcciones: [],
            venta: {},
            envio: 10, // Costo de envío fijo
            productos: [],
            total: 0,
            load_data: true,
            items: []
        };
    },
    beforeMount() {
        this.init_direcciones();
        this.init_carrito();
    },
    methods: {
        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'USD' });
        },
        init_direcciones() {
            axios.get(this.$url + '/obtener_direcciones_cliente', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token
                }
            }).then((result) => {
                this.direcciones = result.data;
            }).catch((error) => {
                console.error("Error al obtener direcciones:", error);
            });
        },
        selected_direccion(event) {
            this.venta.direccion = event.target.value;
        },
        init_carrito() {
            if (this.$store.state.token != null) {
                this.load_data = true;
                axios.get(this.$url + '/obtener_carrito_cliente', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.$store.state.token}`,

                    }
                }).then((result) => {
                    this.total = 0;
                    for (let item of result.data.carrito_general) {
                        let subtotal = item.producto.precio * item.cantidad;
                        this.total += subtotal;

                        this.items.push({
                            title: item.producto.titulo,
                            quantity: item.cantidad,
                            unit_price: item.producto.precio,
                            currency_id: 'USD'
                        });
                    }
                    this.productos = result.data.carrito_general;
                    this.load_data = false;
                }).catch((error) => {
                    console.error(error);
                });
            }
        },
        crearPreferencia() {
            // Crear preferencia en Mercado Pago
            axios.post(this.$url + '/crear_preferencia', {
                items: this.items,
                total: this.total + this.envio,
                direccion: this.venta.direccion
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token
                }
            }).then(response => {
                if (response.data.init_point) {
                    window.location.href = response.data.init_point; // Redirigir a Mercado Pago
                } else {
                    console.error("No se pudo crear la preferencia.");
                }
            }).catch(error => {
                console.error("Error creando preferencia:", error);
            });
        }
    }
};
</script>


<style>
/* Estilos mejorados para la sección de checkout */
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

.block {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.block-header {
    background-color: #f4f4f4;
    padding: 1rem;
    font-weight: bold;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.block-footer {
    padding: 1rem;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.cart-header {
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 10px;
}

.cart-item {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
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

/* Estilo mejorado para el botón PAGAR */
.btn-primary {
    background-color: #005f96;
    border: none;
}

.btn-primary:hover {
    background-color: #004080;
}
</style>
