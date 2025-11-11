const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Rotas públicas
router.post('/cadastro', authController.cadastrar);
router.post('/login', authController.login);

// Rotas protegidas
router.get('/perfil', auth, authController.perfil);
router.get('/verificar', auth, authController.verificarToken);

module.exports = router;
