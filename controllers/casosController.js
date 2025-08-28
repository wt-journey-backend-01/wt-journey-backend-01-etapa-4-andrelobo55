const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const APIError = require("../utils/errorHandler");

const getAllCasos = async (req, res, next) => {
    const casos = await casosRepository.readAll();

    return res.status(200).json(casos);
}

const getCasoById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return next(new APIError(404, "Caso não encontrado."))
        }

        const caso = await casosRepository.readById(id);

        if (!caso) {
            return next(new APIError(404, "Caso não encontrado"));
        }

        return res.status(200).json(caso);
    } catch (error) {
        next(error);
    }
}

const createCaso = async (req, res, next) => {
    try {
        const allowedFields = ['titulo', 'descricao', 'status', 'agente_id'];
        const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            return next(new APIError(400, `Campos não permitidos: ${extraFields.join(', ')}`));
        }

        const { titulo, descricao, status, agente_id } = req.body;

        if (!titulo) {
            return next(new APIError(400, "Campo 'titulo' deve ser preenchido"));
        }

        if (!descricao) {
            return next(new APIError(400, "Campo 'descricao' deve ser preenchido"));
        }

        if (!['aberto', 'solucionado'].includes(status)) {
            return next(new APIError(400, "Campo 'status' deve ser 'aberto' ou 'solucionado'"));
        }

        if (!agente_id) {
            return next(new APIError(400, "Campo 'agente_id' deve ser preenchido"));
        }

        const agenteId = await agentesRepository.readById(agente_id);

        if (!agenteId) {
            return next(new APIError(404, "Agente não encontrado"));
        }

        const caso = await casosRepository.create({ titulo, descricao, status, agente_id });

        return res.status(201).json(caso);
    } catch (error) {
        next(error);
    }
}

const completeUpdateCaso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Caso não encontrado."));
        }

        const caso = await casosRepository.readById(id);

        if (!caso) {
            return next(new APIError(404, "Caso não encontrado"));
        }

        const allowedFields = ['titulo', 'descricao', 'status', 'agente_id'];
        const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            return next(new APIError(400, `Campos não permitidos: ${extraFields.join(', ')}`));
        }

        const { id: idBody, titulo, descricao, status, agente_id } = req.body;

        if (idBody && idBody !== id) {
            return next(new APIError(400, "Não é permitido alterar o campo 'id'"));
        }

        if (!titulo) {
            return next(new APIError(400, "Campo 'titulo' deve ser preenchido"));
        }

        if (!descricao) {
            return next(new APIError(400, "Campo 'descricao' deve ser preenchido"));
        }

        if (!['aberto', 'solucionado'].includes(status)) {
            return next(new APIError(400, "Campo 'status' deve ser 'aberto' ou 'solucionado'"));
        }

        if (!agente_id) return next(new APIError(400, "Campo 'agente_id' deve ser preenchido"));

        const agenteExists = await agentesRepository.readById(agente_id);
        if (!agenteExists) return next(new APIError(404, "agente_id não encontrado"));

        if (isNaN(Number(agente_id)) || Number(agente_id) <= 0) {
            return next(new APIError(404, "agente_id não encontrado"));
        }

        if (agente_id !== undefined && agente_id !== caso.agente_id) {
            return next(new APIError(400, "Campo 'agente_id' não deve ser alterado."));
        }

        const casoAtualizado = await casosRepository.update(id, { titulo, descricao, status, agente_id });

        return res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
}

const updatePartialCaso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Caso não encontrado."));
        }

        const caso = await casosRepository.readById(id);

        if (!caso) {
            return next(new APIError(404, "Caso não encontrado"));
        }

        const campos = req.body;

        if (campos.id && campos.id !== id) {
            return next(new APIError(400, "Não é permitido alterar o campo 'id'"));
        }

        if (campos.status && !['aberto', 'solucionado'].includes(campos.status)) {
            return next(new APIError(400, "Campo 'status' deve ser 'aberto' ou 'solucionado'"));
        }

        if (campos.descricao !== undefined && campos.descricao.trim() === '') {
            return next(new APIError(400, "Campo 'descricao' não pode estar vazio"));
        }

        if (campos.titulo !== undefined && campos.titulo.trim() === '') {
            return next(new APIError(400, "Campo 'titulo' não pode estar vazio"));
        }

        if (campos.agente_id !== undefined && campos.agente_id !== caso.agente_id) {
            return next(new APIError(400, "Campo 'agente_id' não deve ser alterado."));
        }

        const casoAtualizado = await casosRepository.update(id, campos);

        return res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
}

const deleteCaso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        if (isNaN(idNum) || idNum <= 0) {
            return next(new APIError(404, "Caso não encontrado."));
        }

        const caso = await casosRepository.readById(id);

        if (!caso) {
            return next(new APIError(404, "Caso não encontrado"));
        }

        await casosRepository.remove(id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    completeUpdateCaso,
    updatePartialCaso,
    deleteCaso
}