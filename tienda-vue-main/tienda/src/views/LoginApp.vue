<template>
    <div>
        <!-- Encabezado -->
        <section class="hero" style="margin-top: 11rem;">
            <div class="container">
                <div class="hero-content pb-5 text-center">
                    <h1 class="hero-heading mb-0">Zona de Clientes</h1>
                </div>
            </div>
        </section>

        <!-- Sección de Login y Registro -->
        <section>
            <div class="container">
                <div class="row justify-content-center">
                    <!-- Iniciar Sesión -->
                    <div class="col-lg-5">
                        <div class="block">
                            <div class="block-header">
                                <h6 class="text-uppercase mb-0">Iniciar Sesión</h6>
                            </div>
                            <div class="block-body">
                                <p class="text-muted">Accede a tu cuenta para realizar pedidos y revisar tu historial de
                                    compras.</p>
                                <hr>
                                <form @submit.prevent="login">
                                    <div class="mb-4">
                                        <label class="form-label" for="email-login">Correo Electrónico</label>
                                        <input class="form-control" id="email-login" type="text"
                                            placeholder="Ingresa tu correo electrónico" autocomplete="off"
                                            v-model="email">
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label" for="password-login">Contraseña</label>
                                        <input class="form-control" id="password-login" type="password"
                                            placeholder="Ingresa tu contraseña" autocomplete="off" v-model="password">
                                    </div>

                                    <div class="mb-4" v-if="msm_error_login">
                                        <small class="text-danger">{{ msm_error_login }}</small>
                                    </div>

                                    <div class="mb-4 text-center">
                                        <button class="btn btn-outline-dark" type="submit">Ingresar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Registro de Cliente -->
                    <div class="col-lg-5">
                        <div class="block">
                            <div class="block-header">
                                <h6 class="text-uppercase mb-0">Crear Nueva Cuenta</h6>
                            </div>
                            <div class="block-body">
                                <p class="text-muted">Regístrate para acceder a ofertas exclusivas y realizar compras de
                                    forma rápida y segura.</p>
                                <hr>
                                <form @submit.prevent="validar_registro">
                                    <div class="mb-4">
                                        <label class="form-label" for="nombre">Nombre Completo</label>
                                        <input class="form-control" id="nombre" type="text"
                                            placeholder="Ingresa tu nombre completo" v-model="cliente.nombres">
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label" for="email-registro">Correo Electrónico</label>
                                        <input class="form-control" id="email-registro" type="text"
                                            placeholder="Ingresa tu correo electrónico" v-model="cliente.email">
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label" for="password-registro">Contraseña</label>
                                        <input class="form-control" id="password-registro" type="password"
                                            placeholder="Ingresa una contraseña" v-model="cliente.password">
                                    </div>

                                    <div class="mb-4" v-if="msm_error">
                                        <small class="text-danger">{{ msm_error }}</small>
                                    </div>

                                    <div class="mb-4 text-center">
                                        <button class="btn btn-outline-dark" type="submit">Registrarse
                                        </button>
                                    </div>
                                </form>
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

export default {
    name: 'LoginApp',
    data() {
        return {
            cliente: {
                nombres: '',
                email: '',
                password: '',
            },
            email: '',
            password: '',
            msm_error: '',
            msm_error_login: '',
        };
    },
    methods: {
        validar_registro() {
            if (!this.cliente.nombres) {
                this.msm_error = 'Por favor, ingresa tu nombre completo.';
            } else if (!this.cliente.email) {
                this.msm_error = 'Por favor, ingresa tu correo electrónico.';
            } else if (!this.cliente.password) {
                this.msm_error = 'Por favor, ingresa una contraseña.';
            } else {
                this.msm_error = '';
                axios
                    .post(`${this.$url}/registro_cliente_ecommerce`, this.cliente, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((result) => {
                        if (result.data.message) {
                            this.msm_error = result.data.message;
                        } else {
                            this.msm_error = '';
                            this.$router.push({ name: 'home' });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.msm_error = 'Ocurrió un error. Inténtalo nuevamente.';
                    });
            }
        },
        login() {
            if (!this.email) {
                this.msm_error_login = 'Por favor, ingresa tu correo electrónico.';
            } else if (!this.password) {
                this.msm_error_login = 'Por favor, ingresa tu contraseña.';
            } else {
                this.msm_error_login = '';
                const data = {
                    email: this.email,
                    password: this.password,
                };
                axios
                    .post(`${this.$url}/login_cliente`, data, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((result) => {
                        if (result.data.message) {
                            this.msm_error_login = result.data.message;
                        } else {
                            this.$store.dispatch('saveToken', result.data.token);
                            this.$router.push({ name: 'home' });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.msm_error_login = 'Error al iniciar sesión. Verifica tus credenciales.';
                    });
            }
        },
    },
};
</script>

<style>
.block {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.block-header {
    text-align: center;
    margin-bottom: 15px;
}

.block-body {
    text-align: left;
}

.btn-outline-dark {
    border-radius: 30px;
    padding: 10px 20px;
}

.text-uppercase {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1px;
}
</style>