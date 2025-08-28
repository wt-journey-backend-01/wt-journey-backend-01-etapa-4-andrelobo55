const usuariosRepository = require('../repositories/usuariosRepository');
const APIError = require('../utils/errorHandler');

async function getAll(req, res, next) {
    try {
        const users = await usuariosRepository.readAll();
        
        res.status(200).json(users);
    } catch (error) {
        return next(new APIError(500, 'Error in getAll users.'))
    }
}

async function getById(req, res, next) {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Usuário não encontrado"));
        }
        
        const user = await usuariosRepository.readById(id);

        if (!user) {
            return next(new APIError(404, 'User not found.'));
        }
        
        res.status(200).json(user);
    } catch (error) {
        return next(new APIError(500, 'Error in getById users.'))
    }
}

async function update(req, res, next) {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Usuário não encontrado"));
        }

        const user = await usuariosRepository.readById(id);

        if (!user) {
            return next(new APIError(404, 'User not found.'));
        }

        const { nome, email } = req.body;

        if (!nome) {
            return next(new APIError(400, 'Nome field could not be empty.'));
        }

        if (!email) {
            return next(new APIError(400, 'Email field could not be empty.'));
        }
        
        const userUpdated = await usuariosRepository.update(id, { nome, email });

        res.status(200).json(userUpdated);        
    } catch (error) {
        console.log(error);
        return next(new APIError(500, 'Error in updating user.'));
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Usuário não encontrado"));
        }

        const user = await usuariosRepository.readById(id);

        if (!user) {
            return next(new APIError(404, 'User not found.'));
        }

        await usuariosRepository.remove(id);

        res.status(204).send();
    } catch (error) {
        return next(new APIError(500, 'Error in remove user.'));
    }
}

module.exports = { getAll, getById, update, remove };