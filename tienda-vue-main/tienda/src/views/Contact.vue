<template>
    <div class="contact-page">
        <!-- Sección Hero -->
        <section class="hero text-center text-white d-flex align-items-center justify-content-center"
            style="background-image: url('/assets/images/contacto.png'); background-size: cover; background-position: center; height: 400px; margin-top: 100px;">
            <div class="container">
                <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item">
                        <router-link to="/" class="text-white">Inicio</router-link>
                    </li>
                    <li class="breadcrumb-item active text-white">Contáctanos</li>
                </ol>
                <h2 class="hero-heading" style="font-size: 3rem; font-weight: bold;">Contáctanos</h2>
                <p class="lead mt-3">Estamos aquí para ayudarte con cualquier consulta o información que necesites.</p>
            </div>
        </section>

        <section class="contact-details py-5">
            <div class="container">
                <div class="row">
                    <!-- Información de Contacto -->
                    <div class="col-lg-4 mb-4">
                        <h4 class="text-uppercase">Información de Contacto</h4>
                        <p>
                            <strong>Dirección:</strong> Calle Falsa 123, Ciudad, País <br>
                            <strong>Teléfono:</strong> +123 456 789 <br>
                            <strong>Email:</strong> contacto@tiendadevapes.com
                        </p>
                        <div class="social-links mt-3">
                            <a href="#" class="me-2 text-dark"><i class="fab fa-facebook fa-2x"></i></a>
                            <a href="#" class="me-2 text-dark"><i class="fab fa-instagram fa-2x"></i></a>
                            <a href="#" class="me-2 text-dark"><i class="fab fa-twitter fa-2x"></i></a>
                        </div>
                    </div>

                    <!-- Formulario de Contacto -->
                    <div class="col-lg-8">
                        <h4 class="text-uppercase">Envíanos un mensaje</h4>
                        <form @submit.prevent="submitForm">
                            <div class="mb-3">
                                <label for="name" class="form-label">Nombre</label>
                                <input type="text" id="name" class="form-control" v-model="formData.name" required />
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Correo Electrónico</label>
                                <input type="email" id="email" class="form-control" v-model="formData.email" required />
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label">Mensaje</label>
                                <textarea id="message" class="form-control" rows="5" v-model="formData.message"
                                    required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <section class="map-section">
            <div class="container-fluid">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8488928955784!2d90.39621931504556!3d23.750885394648755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c77f0b6f2d29%3A0xb6d20dc1a9a27254!2sStreet%20123!5e0!3m2!1sen!2sbd!4v1633535083792!5m2!1sen!2sbd"
                    width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                name: "",
                email: "",
                message: "",
            },
        };
    },
    methods: {
        submitForm() {
            if (!this.formData.name || !this.formData.email || !this.formData.message) {
                alert("Por favor completa todos los campos.");
                return;
            }
            alert(`Gracias, ${this.formData.name}, tu mensaje ha sido enviado.`);
            this.formData = {
                name: "",
                email: "",
                message: "",
            };
        },
    },
};
</script>

<style scoped>
.hero {
    background-color: #005f96;
    color: white;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}

.breadcrumb {
    background-color: transparent;
    padding: 0;
    margin-bottom: 1rem;
}

.breadcrumb-item a {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
}

.breadcrumb-item.active {
    color: rgba(255, 255, 255, 0.7);
}

.contact-details h4,
.contact-details p {
    margin-bottom: 1rem;
}

.social-links a {
    color: #2c3e50;
    transition: color 0.3s;
}

.social-links a:hover {
    color: #f39c12;
}

.map-section iframe {
    border: none;
}
</style>
