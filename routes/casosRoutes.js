const express = require('express');
const casosController = require("../controllers/casosController");
const router = express.Router();

/** 
 * @swagger
 * tags:
 *   - name: Casos
 *     description: Gerenciamento de casos de Polícia
*/

/** 
 * @swagger
 * /casos:
 *   get:
 *     summary: Listar todos casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Listar todos os casos
*/
router.get("/", casosController.getAllCasos);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Listar um caso específico pelo id
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso retornado com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.get("/:id", casosController.getCasoById);

/** 
 * @swagger
 * /casos:
 *   post:
 *     summary: Criar um caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, descricao, status, agente_id]
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *               agente_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Campo não preenchido ou vazio.
 */
router.post("/", casosController.createCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualizar um caso específico pelo id
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, descricao, status, agente_id]
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *               agente_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.put("/:id", casosController.completeUpdateCaso);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualizar parcialmente um caso específico pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Novo título do caso
 *               descricao:
 *                 type: string
 *                 description: Nova descrição do caso
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *                 description: Novo status do caso
 *             example:
 *               titulo: Novo título atualizado
 *               descricao: Atualização parcial da descrição
 *               status: solucionado
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: "Requisição inválida (ex: tentativa de alterar o campo 'id' ou 'agente_id')"
 *       404:
 *         description: Caso não encontrado
 */
router.patch("/:id", casosController.updatePartialCaso);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Deletar um caso específico pelo id
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Caso deletado com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.delete("/:id", casosController.deleteCaso);

module.exports = router;