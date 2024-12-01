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
                                            Editar Producto
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
                                                    Editar Producto
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
                                        <input type="number" readonly class="form-control" placeholder="Precio"
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
                                            Selecciona el publicado de este producto.
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
                                            Seleccione si el producto tiene descuento.
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
                            <!-- Button -->
                            <button class="btn btn-primary mt-5" v-on:click="validarCampos()">
                                Editar Producto
                            </button>
                            <!-- Divider -->
                            <hr class="mt-4 mb-5">



                            <!-- variedades productos -->
                            <div class="row justify-content-between align-items-center mb-5">
                                <div class="col-12">

                                    <!-- Heading -->
                                    <h2 class="mb-2">
                                        Variedades de producto
                                    </h2>

                                    <!-- Text -->
                                    <p class="text-muted mb-xl-0">
                                        Esta seccion es para selecionar o agregar las variedades de este producto.
                                    </p>
                                </div>

                            </div>

                            <div class="row mb-5">
                                <div class="col-lg-5">
                                    <small class="text-muted">
                                        Proveedor
                                    </small>
                                    <input type="text" class="form-control" placeholder="Empresa proveedora"
                                        v-model="variedad.proveedor">
                                </div>
                                <div class="col-lg-5">
                                    <small class="text-muted">
                                        Variedad
                                    </small>
                                    <input type="text" class="form-control" placeholder="Tipo, colores..."
                                        v-model="variedad.variedad">
                                </div>
                                <div class="col">
                                    <small class="text-muted">
                                        Acción*
                                    </small> <br>
                                    <button class="btn btn-primary btn-block" style="width: 100% !important;"
                                        v-on:click="validar_variedad()">Agregar</button>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-body">

                                    <!-- List group -->
                                    <div class="list-group list-group-flush my-n3">
                                        <div class="list-group-item" v-for="item in variedades">
                                            <div class="row align-items-center">
                                                <div class="col">

                                                    <!-- Heading -->
                                                    <h4 class="mb-1">
                                                        {{ item.variedad.toUpperCase() }}
                                                    </h4>

                                                    <!-- Text -->
                                                    <small class="text-muted">
                                                        <b>Sku:</b> {{ item.sku.toUpperCase() }}
                                                    </small>

                                                </div>
                                                <div class="col">
                                                    <!-- Heading -->
                                                    <h4 class="mb-1">
                                                        {{ item.stock }}
                                                    </h4>

                                                    <!-- Text -->
                                                    <small class="text-muted">
                                                        <b>Unidades</b>
                                                    </small>

                                                </div>
                                                <div class="col-auto">

                                                    <!-- Button -->
                                                    <!--  -->
                                                    <button v-if="item.stock ==0" class="btn btn-sm btn-danger" type="button"
                                                        v-b-modal="'delete-' + item._id">
                                                        Eliminar
                                                    </button>
                                                    <!-- Button -->
                                                    <button v-if="item.stock >=1" disabled class="btn btn-sm btn-danger" type="button">
                                                        Eliminar
                                                    </button>
                                                    <b-modal centered :id="'delete-' + item._id" title="BootstrapVue"
                                                        title-html="<h4 class='card-header-title'><b>Nombre de la variedad</b></h4>"
                                                        @ok="eliminar_variedad(item._id)">
                                                        <p class="my-4">{{ item.variedad }}</p>
                                                    </b-modal>

                                                </div>
                                            </div> <!-- / .row -->
                                        </div>
                                    </div>

                                </div>
                            </div>
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
    name: 'EditProductoApp',
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
            portada: undefined,
            variedad: {},
            variedades: []
        }
    },
    methods: {
        init_data() {
            axios.get(this.$url + '/obtener_producto_admin/' + this.$route.params.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token,
                }
            }).then((result => {
                // console.log(result);
                this.producto = result.data;
                this.str_image = this.$url + '/obtener_portada_producto/' + this.producto.portada;
            })).catch((error) => {
                console.log(error);
            })
        },
        uploadImage($event) {
            // console.log($event);
            var image;
            if ($event.target.files.length >= 1) {
                image = $event.target.files[0];
            }
            if (image.size <= 100000) {
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
            console.log(image);
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
            } else if (!this.producto.extracto) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese el extracto del producto',
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
            else if (this.producto.portada == undefined) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Selecionne una imagen del producto',
                    type: 'error'
                });
            } else {
                // console.log(this.producto);
                this.actualizarProducto();
            }
        },
        actualizarProducto() {
            var data;
            var content = '';
            if (this.portada != undefined) {
                content = 'multipart/form-data';
                data = new FormData();
                fm.append('titulo', this.producto.titulo);
                fm.append('categoria', this.producto.categoria);
                // fm.append('precio', this.producto.precio);
                fm.append('str_variedad', this.producto.str_variedad);
                fm.append('extracto', this.producto.extracto);
                fm.append('estado', this.producto.estado);
                fm.append('descuento', this.producto.descuento);
                fm.append('portada', this.producto.portada);//imagen
            } else {
                content = 'application/json';
                data = this.producto;
            }

            axios.put(this.$url + '/editar_producto_admin/' + this.$route.params.id, data, {
                headers: { 'Content-Type': content, 'Authorization': this.$store.state.token }
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
                        text: 'Producto modificado Correctamente',
                        type: 'success'
                    });
                    this.$router.push({ name: 'producto-index' });
                }
            }).catch((err) => {
                console.log(err);
            })
        },
        validar_variedad() {
            // console.log(this.variedad);
            if (!this.variedad.proveedor) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese el proveedor del producto',
                    type: 'error'
                });
            } else if (!this.variedad.variedad) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese la variedad del producto',
                    type: 'error'
                });
            } else {
                this.variedad.producto = this.$route.params.id;
                this.variedad.sku = this.generar_sku();
                // console.log(this.variedad);
                this.registro_variedad();
            }

        },
        registro_variedad() {
            axios.post(this.$url + '/registro_variedad_producto', this.variedad, {
                headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
            }).then((resp) => {
                console.log(resp);
                this.variedad = {};
                this.$notify({
                    group: 'foo',
                    title: 'SUCCESS',
                    text: 'Se agrego la variedad al producto',
                    type: 'success'
                });
                this.init_variedades();
            });
        },
        generar_sku() {
            // 3 primeros caracteres del producto
            let sku = this.producto.titulo.substr(0, 3) + '' + this.producto.str_variedad.substr(0, 3) + '' + this.variedad.variedad.substr(0, 3) + '' + this.variedad.proveedor.substr(0, 3);
            console.log(sku);
            return sku.toLocaleUpperCase();

        },
        init_variedades() {
            axios.get(this.$url + '/obtener_variedad_producto/' + this.$route.params.id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
            }).then((resp) => {
                // console.log(resp);
                this.variedades = resp.data.variedades;
            });
        },
        eliminar_variedad(id) {
            axios.delete(this.$url + '/eliminar_variedad_producto/' + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
            }).then((resp) => {
                // console.log(resp);
                if (resp.data.message) {
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
                        text: 'Se elimino la variedad',
                        type: 'success'
                    });
                    this.init_variedades();
                }
            });
        }
    },
    beforeMount() {
        this.init_data();
        this.init_variedades();
    }
}
</script>
