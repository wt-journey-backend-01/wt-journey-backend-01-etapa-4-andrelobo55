const express = require('express');
const router = express.Router();
const agentesController = require("../controllers/agentesController");

/**
 * @swagger
 * tags:
 *   - name: Agentes
 *     description: Gerenciamento de agentes de Polícia
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Listar agentes
 *     tags: 
 *       - Agentes
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso
 *
 */
router.get("/", agentesController.getAllAgentes);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Listar um agente específico pelo id
 *     tags: [Agentes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agente retornado com sucesso
 *       404:
 *         description: Agente não encontrado
 */
router.get("/:id", agentesController.getAgenteById);

/** 
 * @swagger
 * /agentes:
 *   post:
 *     summary: Criar um agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, dataDeIncorporacao, cargo]
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *               cargo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *       400:
 *         description: Campo não preenchido ou vazio.
 */
router.post("/", agentesController.createAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualizar um agente específico pelo id
 *     tags: [Agentes]
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
 *             required: [nome, dataDeIncorporacao, cargo]
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       404:
 *         description: Agente não encontrado ou campo não preenchido
 */
router.put("/:id", agentesController.completeUpdateAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualizar cargo de um agente específico pelo id
 *     tags: [Agentes]
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
 *             required: [cargo]
 *             properties:
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cargo de agente atualizado com sucesso
 *       404:
 *         description: Agente não encontrado ou campo não preenchido
 */
router.patch("/:id", agentesController.updateCargoAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Deletar um agente específico pelo id
 *     tags: [Agentes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Agente deletado com sucesso
 *       404:
 *         description: Agente não encontrado
 */
router.delete("/:id", agentesController.deleteAgente);

module.exports = router;