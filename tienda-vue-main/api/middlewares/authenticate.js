const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'diego';

function decodeToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó el token de autorización.',
        });
    }

    const [scheme, token] = authHeader.split(' ');

    if (!token || scheme !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: 'El formato del token es incorrecto. Use "Bearer <token>".',
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            const errorMessages = {
                TokenExpiredError: 'El token ha expirado.',
                JsonWebTokenError: 'El token es inválido.',
                NotBeforeError: 'El token aún no es válido.',
            };
            return res.status(401).json({
                success: false,
                message: errorMessages[err.name] || 'Error al verificar el token.',
            });
        }

        // El token es válido
        req.user = decoded; // Decodifica el token y lo guarda en `req.user`
        next(); // Continúa con el siguiente middleware o controlador
    });
}

module.exports = { decodeToken };
