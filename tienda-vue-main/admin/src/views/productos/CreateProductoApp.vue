<template>
    <div>
        <!-- modulo importado -->
        <Sidebar />
        <!-- MAIN CONTENT -->
        <div class="main-content">
            <!-- modulo importado -->
            <TopNav />
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-10 col-xl-8">
                        <!-- Header -->
                        <div class="header mt-md-5">
                            <div class="header-body">
                                <div class="row align-items-center">
                                    <div class="col">

                                        <!-- Pretitle -->
                                        <h6 class="header-pretitle">
                                            Productos
                                        </h6>

                                        <!-- Title -->
                                        <h1 class="header-title">
                                            Nuevo Producto
                                        </h1>

                                    </div>
                                </div> <!-- / .row -->
                                <div class="row align-items-center">
                                    <div class="col">

                                        <!-- Nav -->
                                        <ul class="nav nav-tabs nav-overflow header-tabs">
                                            <li class="nav-item">
                                                <router-link to="/producto" class="nav-link">Todos los
                                                    Productos</router-link>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link active">
                                                    Nuevo Producto
                                                </a>
                                            </li>

                                        </ul>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-7">

                            <div class="row justify-content-between align-items-center">
                                <div class="col">
                                    <div class="row align-items-center">
                                        <div class="col-auto">

                                            <!-- Avatar -->
                                            <div class="avatar">
                                                <img class="avatar-img rounded-circle" :src="str_image" alt="...">
                                            </div>

                                        </div>
                                        <div class="col ms-n2">

                                            <!-- Heading -->
                                            <h4 class="mb-1">
                                                <b>Portada</b>
                                            </h4>

                                            <!-- Text -->
                                            <small class="text-muted">
                                                PNG o JPG no mayor a 1000px de ancho y alto.
                                            </small>

                                        </div>
                                    </div> <!-- / .row -->
                                </div>
                                <div class="col-auto">

                                    <!-- Button -->

                                    <label for="file-upload" class="btn btn-sm btn-primary">
                                        Cargar Imagen
                                    </label>
                                    <input style="display:none" id="file-upload" type="file"
                                        v-on:change="uploadImage($event)" />

                                </div>
                            </div> <!-- / .row -->

                            <!-- Divider -->
                            <hr class="my-5">


                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <!-- Email address -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="mb-1">
                                            Título del producto
                                        </label>

                                        <!-- Form text -->
                                        <small class="form-text text-muted">
                                            El titulo debe se único.
                                        </small>

                                        <!-- Input -->
                                        <input type="text" class="form-control" placeholder="Título del producto"
                                            v-model="producto.titulo">
                                    </div>

                                </div>

                                <div class="col-12 col-md-6">

                                    <!-- First name -->
                                    <div class="form-group">
                                        <!-- Label -->
                                        <label class="form-label">
                                            Categoria
                                        </label>
                                        <!-- Form text -->
                                        <small class="form-text text-muted">
                                            Escoja una categoria por favor.
                                        </small>

                                        <!-- Input -->
                                        <select name="" class="form-select" v-model="producto.categoria">
                                            <option value="" disabled selected>Seleccionar</option>
                                            <option value="Categoria 1">Categoria 1</option>
                                            <option value="Categoria 2">Categoria 2</option>
                                            <option value="Categoria 3">Categoria 3</option>
                                        </select>

                                    </div>

                                </div>
                                <div class="col-12 col-md-6">
                                    <!-- Last name -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="form-label">
                                            Variedad
                                        </label>

                                        <!-- Input -->
                                        <input type="text" class="form-control" placeholder="Titulo de la variedad"
                                            v-model="producto.str_variedad">

                                    </div>

                                </div>
                                <div class="col-12 col-md-6">

                                    <!-- Last name -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="form-label">
                                            Precio
                                        </label>

                                        <!-- Input -->
                                        <input type="number" class="form-control" placeholder="Precio"
                                            v-model="producto.precio">

                                    </div>

                                </div>

                                <div class="col-12 col-md-12">

                                    <!-- Phone -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="form-label">
                                            Extracto
                                        </label>

                                        <!-- Input -->
                                        <textarea class="form-control" id="" rows="3" placeholder="Extracto"
                                            v-model="producto.extracto"></textarea>

                                    </div>

                                </div>

                            </div> <!-- / .row -->



                            <div class="row">
                                <div class="col-12 col-md-6">

                                    <!-- Public profile -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="mb-1">
                                            Producto publicado
                                        </label>

                                        <!-- Form text -->
                                        <small class="form-text text-muted">
                                            Making your profile public means that anyone on the Dashkit network will be able
                                            to find you.
                                        </small>

                                        <div class="row">
                                            <div class="col-auto">

                                                <!-- Switch -->
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" type="checkbox" id="switchOne"
                                                        v-model="producto.estado" />
                                                    <label class="form-check-label" for="switchOne"></label>
                                                </div>

                                            </div>
                                            <div class="col ms-n2">

                                                <!-- Help text -->
                                                <small class="text-muted">
                                                    Borrador activado
                                                </small>

                                            </div>
                                        </div> <!-- / .row -->
                                    </div>

                                </div>
                                <div class="col-12 col-md-6">

                                    <!-- Allow for additional Bookings -->
                                    <div class="form-group">

                                        <!-- Label -->
                                        <label class="mb-1">
                                            En descuento
                                        </label>

                                        <!-- Form text -->
                                        <small class="form-text text-muted">
                                            If you are available for hire outside of the current situation, you can
                                            encourage others to hire you.
                                        </small>

                                        <div class="row">
                                            <div class="col-auto">

                                                <!-- Switch -->
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" type="checkbox" id="switchTwo"
                                                        v-model="producto.descuento" />
                                                    <label class="form-check-label" for="switchTwo"></label>
                                                </div>

                                            </div>
                                            <div class="col ms-n2">

                                                <!-- Help text -->
                                                <small class="text-muted">
                                                    Descuento desactivado
                                                </small>

                                            </div>
                                        </div> <!-- / .row -->
                                    </div>

                                </div>
                            </div> <!-- / .row -->

                            <!-- Divider -->
                            <hr class="mt-4 mb-5">

                            <!-- Button -->
                            <button class="btn btn-primary" v-on:click="validarCampos()">
                                Crear Producto
                            </button>


                        </div>
                    </div>
                </div> <!-- / .row -->
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
export default {
    name: 'CreateProductoApp',
    components: {
        Sidebar,
        TopNav
    },
    data() {
        return {
            str_image: '/assets/img/no_image.jpg',
            producto: {
                categoria: '',
                estado: true,
                descuento: false,
                portada: undefined
            },
            portada: undefined
        }
    },
    methods: {
        uploadImage($event) {
            // console.log($event);
            var image;
            if ($event.target.files.length >= 1) {
                image = $event.target.files[0];
            }
            if (image.size <= 1000000) {
                if (image.type == 'image/jpeg' || image.type == 'image/png' || image.type == 'image/webp' || image.type == 'image/jpg') {
                    this.str_image = URL.createObjectURL(image);
                    this.portada = image;
                    this.producto.portada = this.portada
                } else {
                    this.$notify({
                        group: 'foo',
                        title: 'ERROR',
                        text: 'El recurso debe ser extesion JPEG | PNG | WEBP | JPG',
                        type: 'error'
                    });
                    this.portada = undefined;
                }
            } else {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'La imagen debe pesar menos de 1MB',
                    type: 'error'
                });
                this.portada = undefined;
            }
            console.log(this.portada);
        },
        validarCampos() {
            if (!this.producto.titulo) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese el titulo del producto',
                    type: 'error'
                });
            } else if (!this.producto.categoria) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Escoja la categoria del producto',
                    type: 'error'
                });
            } else if (!this.producto.precio) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese el precio del producto',
                    type: 'error'
                });
            } else if (!this.producto.str_variedad) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese la variedad del producto',
                    type: 'error'
                });
            }
            else if (!this.producto.extracto) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese el extracto del producto',
                    type: 'error'
                });
            } else if (this.producto.portada == undefined) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Selecionne una imagen del producto',
                    type: 'error'
                });
            } else {
                // console.log(this.producto);
                this.registroProducto();
            }
        },
        registroProducto() {
            var fm = new FormData();
            fm.append('titulo', this.producto.titulo);
            fm.append('categoria', this.producto.categoria);
            fm.append('precio', this.producto.precio);
            fm.append('extracto', this.producto.extracto);
            fm.append('estado', this.producto.estado);
            fm.append('str_variedad', this.producto.str_variedad);
            fm.append('descuento', this.producto.descuento);
            fm.append('portada', this.producto.portada);//imagen

            axios.post(this.$url + '/registro_producto_admin', fm, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': this.$store.state.token }
            }).then((resp) => {
                console.log(resp);
                if (resp.data.data == undefined) {
                    this.$notify({
                        group: 'foo',
                        title: 'ERROR',
                        text: resp.data.message,
                        type: 'error'
                    });
                } else {
                    this.$notify({
                        group: 'foo',
                        title: 'SUCCESS',
                        text: 'Producto registrado Correctamente',
                        type: 'success'
                    });
                    this.$router.push({ name: 'producto-index' });
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>
