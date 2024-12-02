var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'diego';

exports.createToken = function(usuario) {
    var payload = {
        sub: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(), // Fecha de emisión
        exp: moment().add(1, 'minute').unix() // Fecha de expiración
    };

    return jwt.encode(payload, secret);
};
