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
                                            Ingreso
                                        </h6>

                                        <!-- Title -->
                                        <h1 class="header-title">
                                            Nuevo Ingreso
                                        </h1>

                                    </div>
                                </div> <!-- / .row -->
                                <div class="row align-items-center">
                                    <div class="col">

                                        <!-- Nav -->
                                        <ul class="nav nav-tabs nav-overflow header-tabs">
                                            <li class="nav-item">
                                                <a class="nav-link">
                                                    Ingresos
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link active">Nuevo
                                                    Ingresos</a>
                                            </li>

                                        </ul>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- contenido principal -->
                        <div class="row">
                            <div class="col-12 col-md-6">

                                <!-- Last name -->
                                <div class="form-group">

                                    <!-- Label -->
                                    <label class="form-label">
                                        Proveedor
                                    </label>
                                    <small class="form-text text-muted">
                                        Proveedor encargado del ingreso.
                                    </small>
                                    <!-- Input -->
                                    <select class="form-select mb-3" v-model="ingreso.proveedor">
                                        <option value="" selected disabled>Seleccionar</option>
                                        <option>My first option</option>
                                        <option>Another option</option>
                                        <option>Third option is here</option>
                                    </select>

                                </div>

                            </div>

                            <div class="col-12 col-md-6">

                                <!-- Last name -->
                                <div class="form-group">

                                    <!-- Label -->
                                    <label class="form-label">
                                        N° comprobante
                                    </label>
                                    <small class="form-text text-muted">
                                        Número de la factura.
                                    </small>
                                    <!-- Input -->
                                    <input type="text" class="form-control" placeholder="5DSF-000154" v-model="ingreso.ncomprobante">

                                </div>

                            </div>

                            <div class="col-12 col-md-6">

                                <!-- Last name -->
                                <div class="form-group">

                                    <!-- Label -->
                                    <label class="form-label">
                                        Monto total
                                    </label>
                                    <small class="form-text text-muted">
                                        Monto total pagado al proveedor.
                                    </small>
                                    <!-- Input -->
                                    <input type="text" class="form-control" placeholder="546" v-model="ingreso.monto_total">

                                </div>

                            </div>

                            <div class="col-12 col-md-6">

                                <!-- Last name -->
                                <div class="form-group">

                                    <!-- Label -->
                                    <label class="form-label">
                                        Comprobante
                                    </label>
                                    <small class="form-text text-muted">
                                        Subir comprobante del ingreso.
                                    </small>
                                    <!-- Input -->
                                    <input type="file" class="form-control" v-on:change="uploadComprobante($event)">

                                </div>

                            </div>
                        </div>

                        <hr class="my-5">

                        <div class="row">

                            <div class="col-md-12 mb-4">
                                <h3><b>Productos del ingreso</b></h3>
                            </div>

                            <div class="col-12 col-md-4">

                                <!-- First name -->
                                <div class="form-group">

                                    <!-- Label -->
                                    <label class="form-label">
                                        Producto
                                    </label>
                                    <!-- Input -->
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" placeholder="Buscar producto">
                                        <button class="btn btn-primary">
                                            <i class="fe fe-search"></i>
                                        </button>
                                    </div>

                                </div>

                            </div>


                            <div class="col-12 col-md-3">

                                <!-- Phone -->
                                <div class="form-group">

                                    <!-- Label -->
                                    <label class="form-label">
                                        Precio unidad
                                    </label>
                                    <!-- Input -->
                                    <input type="text" class="form-control mb-3" placeholder="0.00">

                                </div>

                            </div>
                            <div class="col-12 col-md-3">

                                <!-- Birthday -->
                                <div class="form-group">

                                    <!-- Label -->
                                    <label class="form-label">
                                        Cantidad total
                                    </label>
                                    <!-- Input -->
                                    <input type="number" class="form-control mb-3" placeholder="0">

                                </div>

                            </div>

                            <div class="col-md-2">

                                <button class="btn btn-primary" style="margin-top: 1.8rem!important;">
                                    Agregar
                                </button>
                            </div>
                        </div> <!-- / .row -->

                        <!-- Button -->
                        <div class="card ">
                            <div class="table-responsive mb-0">
                                <table class="table table-sm table-nowrap card-table">
                                    <thead>
                                        <tr>
                                            <th>Invoice ID</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="fs-base">
                                        <tr>
                                            <td>
                                                <a href="invoice.html">Invoice #10395</a>
                                            </td>
                                            <td>
                                                <time datetime="2020-04-24">Apr. 24, 2020</time>
                                            </td>
                                            <td>
                                                $29.00
                                            </td>
                                            <td>
                                                <button class="btn btn-danger btn-sm">Quitar</button>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button class="btn btn-primary mb-7">
                            Ingresar datos
                        </button>
                    </div>
                </div> <!-- / .row -->
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import {ModelSelect} from "vue-search-select";

export default {
    name: 'CreateIngresoApp',
    data(){
        return {
            ingreso:{
                proveedor:''
            },
            comprobante: undefined
        }
    },
    components: {
        Sidebar,
        TopNav
    },
    methods:{
        uploadComprobante($event) {
            // console.log($event);
            var image;
            if ($event.target.files.length >= 1) {
                image = $event.target.files[0];
            }
            if (image.size <= 1000000) {
                if (image.type == 'image/jpeg' || image.type == 'image/png' || image.type == 'image/webp' || image.type == 'image/jpg' ||image.type == 'application/pdf') {
                    // this.str_image = URL.createObjectURL(image);
                    this.comprobante = image;
                    this.ingreso.documento = this.comprobante;
                } else {
                    this.$notify({
                        group: 'foo',
                        title: 'ERROR',
                        text: 'El recurso debe ser extesion JPEG | PNG | WEBP | JPG | PDF',
                        type: 'error'
                    });
                    this.comprobante = undefined;
                }
            } else {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'La imagen debe pesar menos de 1MB',
                    type: 'error'
                });
                this.comprobante = undefined;
            }
            console.log(this.comprobante);
        },
    }
}
</script>
