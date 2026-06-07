const jwt = require('jsonwebtoken');
require('dotenv').config();

function gerarToken() {
    return jwt.sign(
        { usuario: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

function validarToken(token) {
    if (!token) throw new Error('TOKEN_OBRIGATORIO');

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw new Error('TOKEN_INVALIDO');
    }
}

module.exports = { gerarToken, validarToken };