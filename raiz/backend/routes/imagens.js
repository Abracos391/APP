const express = require('express');
const router = express.Router();
const imagemController = require('../controllers/imagemController');
const { auth } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Gerar nova imagem
router.post('/gerar', imagemController.gerar);

// Listar imagens do usuário
router.get('/', imagemController.listar);

// Buscar imagem específica
router.get('/:id', imagemController.buscar);

// Deletar imagem
router.delete('/:id', imagemController.deletar);

// Estatísticas
router.get('/usuario/estatisticas', imagemController.estatisticas);

module.exports = router;
