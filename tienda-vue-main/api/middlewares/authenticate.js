const jwt = require('jsonwebtoken');
const secret = 'diego'; 
function decodeToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.error('No se proporcionó el encabezado de autorización');
        return res.status(401).json({ message: 'No se proporcionó un token de autorización' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no válido' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido' });
            } else {
                return res.status(500).json({ message: 'Error al verificar el token' });
            }
        }
        req.user = decoded;
        next();
    });
}


module.exports = { decodeToken };
