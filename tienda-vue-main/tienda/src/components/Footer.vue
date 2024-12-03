<template>
  <footer class="main-footer">
    <!-- Bloque de servicios -->
    <div class="services py-6">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 service-column">
            <img class="service-icon" src="/assets/media/camion.gif" alt="Envío gratis">
            <div class="service-text">
              <h6 class="service-title">Envío y devoluciones gratis</h6>
              <p class="service-description">Envío gratis en compras mayores a $300</p>
            </div>
          </div>
          <div class="col-lg-4 service-column">
            <img class="service-icon" src="/assets/media/euro.gif" alt="Garantía de dinero">
            <div class="service-text">
              <h6 class="service-title">Garantía de devolución</h6>
              <p class="service-description">Garantía de devolución en 30 días</p>
            </div>
          </div>
          <div class="col-lg-4 service-column">
            <img class="service-icon" src="/assets/media/tailandes.gif" alt="Soporte">
            <div class="service-text">
              <h6 class="service-title">020-800-456-747</h6>
              <p class="service-description">Soporte disponible 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bloque principal - menús, formulario de suscripción -->
    <div class="footer-main py-6 text-muted" style="background-color: #1f2a38;">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 mb-5 mb-lg-0">
            <div class="footer-logo text-lg text-white mb-3">VapeShop<span class="highlight">.</span></div>
            <p class="text-white">Tu mejor tienda online de vapes y accesorios.</p>
            <ul class="social-icons list-inline">
              <li class="list-inline-item">
                <a class="text-muted text-primary-hover" href="https://www.facebook.com/TuTienda" target="_blank" title="Facebook">
                  <img src="/assets/media/facebook.png" class="social-icon" alt="Facebook">
                </a>
              </li>
              <li class="list-inline-item">
                <a class="text-muted text-primary-hover" href="https://twitter.com/TuTienda" target="_blank" title="Twitter">
                  <img src="/assets/media/twitter.png" class="social-icon" alt="Twitter">
                </a>
              </li>
              <li class="list-inline-item">
                <a class="text-muted text-primary-hover" href="https://www.instagram.com/TuTienda" target="_blank" title="Instagram">
                  <img src="/assets/media/instagram.png" class="social-icon" alt="Instagram">
                </a>
              </li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6 mb-5 mb-lg-0">
            <h6 class="footer-heading text-white mb-3">Categorías</h6>
            <ul class="list-unstyled">
              <li><router-link class="text-white" :to="{ name: 'shop' }">Vapes para principiantes</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'shop' }">Vapes de lujo</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'shop' }">Accesorios</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'shop' }">Líquidos</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'shop' }">Ofertas especiales</router-link></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6 mb-5 mb-lg-0">
            <h6 class="footer-heading text-white mb-3">Soporte</h6>
            <ul class="list-unstyled">
              <li><router-link class="text-white" :to="{ name: 'login' }">Iniciar Sesión</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'login' }">Registrarse</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'contact' }">Preguntas frecuentes</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'contact' }">Política de privacidad</router-link></li>
              <li><router-link class="text-white" :to="{ name: 'contact' }">Contáctanos</router-link></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <h6 class="footer-heading text-white mb-3">Boletín Informativo</h6>
            <p class="text-white mb-3">Suscríbete y recibe las últimas novedades sobre vapes y ofertas exclusivas.</p>
            <form action="#" id="newsletter-form">
              <div class="input-group mb-3">
                <input class="form-control bg-transparent text-white border-secondary border-end-0" type="email" name="email" placeholder="Tu Correo Electrónico" aria-label="Tu Correo Electrónico" required style="border-color: #ffffff;">
                  <button class="btn text-white" type="submit" style="background-color: #32a9e5;">
                    <img src="/assets/media/search.png" style="width: 18px" alt="Enviar">
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sección de derechos reservados -->
    <div class="py-4 text-center text-gray-300" style="background-color: #2e3a47;">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-md-0">&copy; {{ year }} VapeShop. Todos los derechos reservados.</p>
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

<style>
/* Main footer styles */
.main-footer {
  font-family: 'Roboto', sans-serif;
  color: #fff;
  background-color: #1f2a38;
}

.services {
  background-color: #2d3e4f;
  border-top: 1px solid #3a4d62;
}

.service-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.service-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.service-icon:hover {
  transform: scale(1.1);
}

.service-title {
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.service-description {
  font-size: 0.9rem;
  color: #ccc;
}

.footer-logo {
  font-size: 2rem;
  font-weight: bold;
  color: #32a9e5;
}

.footer-logo .highlight {
  color: #ff7b00;
}

.social-icons img {
  width: 20px;
  margin-right: 15px;
}

.social-icons .social-icon:hover {
  transform: scale(1.1);
  transition: transform 0.3s;
}

.footer-heading {
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 15px;
}

input.form-control {
  border-radius: 20px;
  padding: 10px;
}

input.form-control::placeholder {
  color: #fff;
}

.btn {
  border-radius: 30px;
  padding: 10px 20px;
  background-color: #005f96;
  border: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #004080;
}


.text-white {
  color: #fff;
}

.text-muted {
  color: #b0b0b0;
}

.text-primary-hover:hover {
  color: #32a9e5;
}

.text-gray-300 {
  color: #b0b0b0;
}

.footer-main {
  background-color: #1f2a38;
}

ul.list-inline {
  margin-bottom: 0;
}

ul.list-inline li {
  display: inline-block;
}

ul.list-inline li img {
  width: 24px;
  margin: 0 8px;
}
</style>