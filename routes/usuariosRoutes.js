const express = require('express');
const usuariosController = require('../controllers/usuariosController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get("/", authMiddleware, usuariosController.getAll);
router.get("/:id", authMiddleware, usuariosController.getById);
router.put("/:id", authMiddleware, usuariosController.update);
router.delete("/:id", authMiddleware, usuariosController.remove);

module.exports = router;