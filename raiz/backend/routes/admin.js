const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// Todas as rotas requerem autenticação E permissão de admin
router.use(auth);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Usuários
router.get('/usuarios', adminController.listarUsuarios);
router.get('/usuarios/:usuarioId', adminController.detalhesUsuario);
router.post('/usuarios/:usuarioId/creditos', adminController.adicionarCreditos);
router.patch('/usuarios/:usuarioId/toggle', adminController.toggleUsuario);

// Vendas
router.get('/vendas', adminController.listarVendas);

// Relatórios
router.get('/relatorio/atividades', adminController.relatorioAtividades);

module.exports = router;
