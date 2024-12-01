<template>
    <div  style="background: #f3f3f3;" class="pb-5">
        <!-- Hero Section-->
        <section class="hero" style="margin-top: 8rem !important;">
        <div class="container">
            <!-- Breadcrumbs -->
            <ol class="breadcrumb justify-content-center">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item active">Direcciones        </li>
            </ol>
            <!-- Hero Content-->
            <div class="hero-content pb-5 text-center">
                <h1 class="hero-heading">Direcciones</h1>
            </div>
        </div>
        </section>
        <section>
        <div class="container">
            <div class="row mb-5">
            <div class="col-lg-8 col-xl-9">
                <div class="block">
                    <!-- Invoice Address-->
                    <div class="block-header" style="background: #005f96;">
                    <h6 class="text-uppercase mb-0 text-white">Nueva direcciones                 </h6>
                    </div>
                    <div class="block-body">
                    <div class="row">
                        <div class="form-group col-md-6 mb-3">
                            <label class="form-label" for="fullname_invoice"><b>Nombres</b></label>
                            <input class="form-control" type="text" name="fullname_invoice" placeholder="Joe" id="fullname_invoice">
                        </div>
                        <div class="form-group col-md-6 mb-3" >
                            <label class="form-label" for="emailaddress_invoice"><b>Apellidos</b></label>
                            <input class="form-control" type="text" name="emailaddress_invoice" placeholder="Black" id="emailaddress_invoice">
                        </div>
                        <div class="form-group col-md-6 mb-3">
                            <label class="form-label" for="street_invoice"><b>Documento</b></label>
                            <input class="form-control" type="text" name="street_invoice" placeholder="123456789" id="street_invoice">
                        </div>
                        <div class="form-group col-md-6 mb-3">
                            <label class="form-label" for="city_invoice"><b>Telefono</b></label>
                            <input class="form-control" type="text" name="city_invoice" placeholder="(+51)987456132" id="city_invoice">
                        </div>
                        <div class="form-group col-md-6 mb-3">
                            <label class="form-label" for="zip_invoice"><b>País</b></label>
                            <select name="" class="form-control" id="">
                                <option value="" disabled selected>Seleccionar</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6 mb-3">
                            <label class="form-label" for="state_invoice"><b>Region/Ciudad</b></label>
                            <input class="form-control" type="text" name="state_invoice" placeholder="Lima/Miraflores" id="state_invoice">
                        </div>
                        <div class="form-group col-md-6 mb-3">
                            <label class="form-label" for="phonenumber_invoice"><b>ZIP</b></label>
                            <input class="form-control" type="text" name="phonenumber_invoice" placeholder="1234567" id="phonenumber_invoice">
                        </div>
                         <div class="form-group col-md-6 mb-3">
                            <label class="form-label" for="phonenumber_invoice"><b>Dirección</b></label>
                            <input class="form-control" type="text" name="phonenumber_invoice" placeholder="Miraflores #123" id="phonenumber_invoice">
                        </div>
                        
                    </div>
                    <!-- /Invoice Address-->
                    </div>
              
                </div>
                <div class="mb-4 mt-3 text-center mg-5">
                    <button class="btn btn-dark" type="submit"><i class="far fa-save me-2"></i>Crear dirección</button>
                </div>



                <table class="table table-bordered table-striped" style="margin-top: 5rem !important;background: white !important;">
                    <thead class="table-dark">
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td colspan="2">Larry the Bird</td>
                        <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Customer Sidebar-->
            <div class="col-xl-3 col-lg-4 mb-5">
                <div class="customer-sidebar card border-0"> 
                <div class="customer-profile"><a class="d-inline-block" href="#"><img class="img-fluid rounded-circle customer-image shadow" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/photo/kyle-loftus-589739-unsplash-avatar.jpg" alt=""></a>
                    <h5>Julie Trnka</h5>
                    <p class="text-muted text-sm mb-0">Ostrava, Czech Republic</p>
                </div>
                <nav class="list-group customer-nav"><a class="list-group-item d-flex justify-content-between align-items-center text-decoration-none" href="customer-orders.html"><span>
                        <svg class="svg-icon svg-icon-heavy me-2">
                        <use xlink:href="#paper-bag-1"> </use>
                        </svg>Orders</span>
                    <div class="badge rounded-pill bg-dark fw-normal px-3">5</div></a><a class="list-group-item d-flex justify-content-between align-items-center text-decoration-none" href="customer-account.html"><span>
                        <svg class="svg-icon svg-icon-heavy me-2">
                        <use xlink:href="#male-user-1"> </use>
                        </svg>Profile</span></a><a class="active list-group-item d-flex justify-content-between align-items-center text-decoration-none" href="customer-addresses.html"><span>
                        <svg class="svg-icon svg-icon-heavy me-2">
                        <use xlink:href="#navigation-map-1"> </use>
                        </svg>Addresses</span></a><a class="list-group-item d-flex justify-content-between align-items-center text-decoration-none" href="customer-login.html"><span>
                        <svg class="svg-icon svg-icon-heavy me-2">
                        <use xlink:href="#exit-1"> </use>
                        </svg>Log out</span></a>
                </nav>
                </div>
            </div>
            <!-- /Customer Sidebar-->
            </div>
        </div>
        </section>
        <!-- Footer-->
    </div>
</template>