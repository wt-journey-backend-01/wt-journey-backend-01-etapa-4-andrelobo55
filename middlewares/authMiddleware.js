const jwt = require('jsonwebtoken');
const APIError = require('../utils/errorHandler');

const authMiddleware = (req, res, next) => {
    let token = null;
    const authHeader = req.headers["authorization"]; // buscar o valor dentro do header do cabeçalho
    // da chave 'authorization'
    const cookieToken = req.cookies?.token;

    if(authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    else if(cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        return next(new APIError(401, "Token necessary."));
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) {
            return next(new APIError(401, "Invalid token."));
        }
        req.user = decoded; // importante para acessar dados do usuário em rotas protegidas
        next();
    });
}

module.exports = authMiddleware;