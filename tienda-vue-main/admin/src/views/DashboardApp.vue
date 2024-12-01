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
                                         Colaboradores
                                     </h6>
  
                                     <!-- Title -->
                                     <h1 class="header-title">
                                         Nuevo colaborador
                                     </h1>
  
                                 </div>
                             </div> <!-- / .row -->
                             <div class="row align-items-center">
                                 <div class="col">
  
                                     <!-- Nav -->
                                     <ul class="nav nav-tabs nav-overflow header-tabs">
                                         <li class="nav-item">
                                             <a class="nav-link active">
                                                 Todos los colaboradores
                                             </a>
                                         </li>
                                         <li class="nav-item">
                                             <router-link to="/colaborador/create" class="nav-link">Nuevo
                                                 colaborador</router-link>
                                         </li>
  
                                     </ul>
  
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
  import Sidebar from '@/components/Sidebar.vue';
  import TopNav from '@/components/TopNav.vue';
  export default {
  name: 'DashboardApp',
  components: {
  Sidebar,
  TopNav
  }
  }
  </script>
  