<template>
  <footer class="main-footer">
    <!-- Bloque de servicios -->
    <div class="text-dark-700 py-6">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 service-column">
            <img class="svg-icon service-icon" src="/assets/media/camion.gif" alt="Envío gratis">
            <div class="service-text">
              <h6 class="text-uppercase">Envío y devoluciones gratis</h6>
              <p class="text-muted fw-light text-sm mb-0">Envío gratis en compras mayores a $300</p>
            </div>
          </div>
          <div class="col-lg-4 service-column">
            <img class="svg-icon service-icon" src="/assets/media/euro.gif" alt="Garantía de dinero">
            <div class="service-text">
              <h6 class="text-uppercase">Garantía de devolución</h6>
              <p class="text-muted fw-light text-sm mb-0">Garantía de devolución en 30 días</p>
            </div>
          </div>
          <div class="col-lg-4 service-column">
            <img class="svg-icon service-icon" src="/assets/media/tailandes.gif" alt="Soporte">
            <div class="service-text">
              <h6 class="text-uppercase">020-800-456-747</h6>
              <p class="text-muted fw-light text-sm mb-0">Soporte disponible 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Bloque principal - menús, formulario de suscripción -->
    <div class="py-6 text-muted" style="background-color: #005f96 !important;">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 mb-5 mb-lg-0">
            <div class="fw-bold text-uppercase text-lg text-white mb-3">Mi Tienda<span style="color:white">.</span></div>
            <p class="text-white">Tu mejor opción para compras en línea.</p>
            <ul class="list-inline">
              <li class="list-inline-item">
                <a class="text-muted text-primary-hover" href="#" target="_blank" title="Facebook">
                  <img src="/assets/media/facebook.png" style="width:20px">
                </a>
              </li>
              <li class="list-inline-item">
                <a class="text-muted text-primary-hover" href="#" target="_blank" title="Twitter">
                  <img src="/assets/media/twitter.png" style="width:20px">
                </a>
              </li>
              <li class="list-inline-item">
                <a class="text-muted text-primary-hover" href="#" target="_blank" title="Instagram">
                  <img src="/assets/media/instagram.png" style="width:20px">
                </a>
              </li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6 mb-5 mb-lg-0">
            <h6 class="text-uppercase text-white mb-3">Categorías</h6>
            <ul class="list-unstyled">
              <li><a class="text-white" href="#">Para Mujeres</a></li>
              <li><a class="text-white" href="#">Para Hombres</a></li>
              <li><a class="text-white" href="#">Tiendas</a></li>
              <li><a class="text-white" href="#">Nuestro Blog</a></li>
              <li><a class="text-white" href="#">Tienda</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6 mb-5 mb-lg-0">
            <h6 class="text-uppercase text-white mb-3">Soporte</h6>
            <ul class="list-unstyled">
              <li><a class="text-white" href="#">Iniciar Sesión</a></li>
              <li><a class="text-white" href="#">Registrarse</a></li>
              <li><a class="text-white" href="#">Lista de Deseos</a></li>
              <li><a class="text-white" href="#">Nuestros Productos</a></li>
              <li><a class="text-white" href="#">Pagos</a></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <h6 class="text-uppercase text-white mb-3">Boletín Informativo</h6>
            <p class="mb-3 text-white">Suscríbete para recibir las últimas novedades y ofertas.</p>
            <form action="#" id="newsletter-form">
              <div class="input-group mb-3">
                <input class="form-control bg-transparent border-secondary border-end-0" type="email" placeholder="Tu Correo Electrónico" aria-label="Tu Correo Electrónico" style="border-color: #ffffff !important;color:white !important">
                <div class="input-group-append">
                  <button class="btn border-start-0" type="submit" style="border-color: #ffffff !important;">
                    <img src="/assets/media/search.png" style="width: 18px" alt="Enviar">
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Sección de derechos reservados -->
    <div class="py-4 fw-light text-gray-300" style="background-color: #1e1e1e !important;">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start">
            <p class="mb-md-0">&copy; {{year}} Mi tienda. Todos los derechos reservados.</p>
          </div>
          <div class="col-md-6">
            <ul class="list-inline mb-0 mt-2 mt-md-0 text-center text-md-end">
              <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/visa.svg" alt="Visa"></li>
              <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/mastercard.svg" alt="MasterCard"></li>
              <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/paypal.svg" alt="PayPal"></li>
              <li class="list-inline-item"><img class="w-2rem" src="https://d19m59y37dris4.cloudfront.net/sell/2-0/img/western-union.svg" alt="Western Union"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};
</script>
