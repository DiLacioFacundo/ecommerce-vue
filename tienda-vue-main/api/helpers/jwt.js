const jwt = require('jsonwebtoken');
const secret = 'diego'; 

exports.createToken = (user) => {
    const payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        iat: Math.floor(Date.now() / 1000), 
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), 
    };
    return jwt.sign(payload, secret);
};
