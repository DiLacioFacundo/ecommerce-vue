var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'diego';

exports.decodeToken = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'NoHeadersErrors' });
    }

    var token = req.headers.authorization;

    // Verificar formato del token
    var segments = token.split('.');
    if (segments.length !== 3) {
        return res.status(403).send({ message: 'InvalidToken' });
    }

    try {
        // Decodificar el token
        var payload = jwt.decode(token, secret);

        // Verificar expiración
        if (payload.exp <= moment().unix()) {
            return res.status(403).send({ message: 'TokenExpired' });
        }

        req.user = payload; // Asignar el payload al objeto `req`
        next(); // Continuar con la siguiente función
    } catch (error) {
        console.log('Error decoding token:', error);
        return res.status(403).send({ message: 'ErrorToken' });
    }
};
