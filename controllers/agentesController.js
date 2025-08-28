const agentesRepository = require("../repositories/agentesRepository");
const isValidDate = require("../utils/validDate");
const APIError = require("../utils/errorHandler");

const getAllAgentes = async (req, res, next) => {
    const agentes = await agentesRepository.readAll();

    return res.status(200).json(agentes);
}

const getAgenteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Agente não encontrado."));
        }

        const agente = await agentesRepository.readById(id);

        if (!agente) {
            return next(new APIError(404, "Agente não encontrado."));
        }

        return res.status(200).json(agente);
    }
    catch (error) {
        next(error);
    }
}

const createAgente = async (req, res, next) => {
    try {
        const allowedFields = ['nome', 'dataDeIncorporacao', 'cargo'];
        const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            return next(new APIError(400, `Campos não permitidos: ${extraFields.join(', ')}`));
        }

        const { nome, dataDeIncorporacao, cargo } = req.body;

        if (!nome) {
            return next(new APIError(400, "Campo 'nome' deve ser preenchido"));
        }

        if (!dataDeIncorporacao) {
            return next(new APIError(400, "Campo 'dataDeIncorporacao' deve ser preenchido"));
        }

        if (!isValidDate(dataDeIncorporacao)) {
            return next(new APIError(400, "Campo 'dataDeIncorporacao' inválido ou no futuro"));
        }

        if (!cargo) {
            return next(new APIError(400, "Campo 'cargo' deve ser preenchido"));
        }

        const agente = await agentesRepository.create({ nome, dataDeIncorporacao, cargo });

        res.status(201).json(agente);
    }
    catch (error) {
        next(error);
    }
}

const completeUpdateAgente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Agente não encontrado."));
        }

        const agente = await agentesRepository.readById(id);

        if (!agente) {
            return next(new APIError(404, "Agente não encontrado"));
        }

        const allowedFields = ['nome', 'dataDeIncorporacao', 'cargo'];
        const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            return next(new APIError(400, `Campos não permitidos: ${extraFields.join(', ')}`));
        }
        
        const { id: idBody, nome, dataDeIncorporacao, cargo } = req.body;

        if (idBody && idBody !== id) {
            return next(new APIError(400, "Não é permitido alterar o campo 'id'"));
        }

        if (!nome) {
            return next(new APIError(400, "Campo 'nome' deve ser preenchido"));
        }

        if (!dataDeIncorporacao) {
            return next(new APIError(400, "Campo 'dataDeIncorporacao' deve ser preenchido"));
        }

        if (!isValidDate(dataDeIncorporacao)) {
            return next(new APIError(400, "Campo 'dataDeIncorporacao' inválido ou no futuro."));
        }

        if (!cargo) {
            return next(new APIError(400, "Campo 'cargo' deve ser preenchido"));
        }

        const agenteAtualizado = await agentesRepository.update(id, { nome, dataDeIncorporacao, cargo });

        return res.status(200).json(agenteAtualizado);
    }
    catch (error) {
        next(error);
    }
}

const updateCargoAgente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Agente não encontrado."));
        }

        const agente = await agentesRepository.readById(id);

        if (!agente) {
            return next(new APIError(404, "Agente não encontrado"));
        }

        const { cargo } = req.body;

        if (!cargo) {
            return next(new APIError(400, "Campo 'cargo' deve ser preenchido"));
        }

        const agenteAtualizado = await agentesRepository.update(id, { cargo });

        return res.status(200).json(agenteAtualizado);
    }
    catch (error) {
        next(error);
    }
}

const deleteAgente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Agente não encontrado."));
        }
        
        const agenteId = await agentesRepository.readById(id);

        if (!agenteId) {
            return next(new APIError(404, "Agente não encontrado"));
        }

        await agentesRepository.remove(id);

        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    completeUpdateAgente,
    updateCargoAgente,
    deleteAgente
}