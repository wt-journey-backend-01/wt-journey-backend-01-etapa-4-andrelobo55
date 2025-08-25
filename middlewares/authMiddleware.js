const jwt = require('jsonwebtoken');
const APIError = require('../utils/errorHandler');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"]; // buscar o valor dentro do header do cabeçalho
    // da chave 'authorization'
    const token = authHeader && authHeader.split(" ")[1]; // o token não pode ser undefined. Então, se
    // o token existir e a remoção do espaço do valor do token ocorrer, a atribuição é feita
    if (!token) {
        return next(new APIError(401, "Token necessary."));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err) => {
        if (err) {
            return next(new APIError(400, "Invalid token."));
        }
        next();
    });
}

module.exports = authMiddleware;