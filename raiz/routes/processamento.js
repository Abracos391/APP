const express = require('express');
const router = express.Router();
const processamentoController = require('../controllers/processamentoController');
const { auth } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Reprocessar imagem
router.post('/:imagemId/reprocessar', processamentoController.reprocessar);

// Criar thumbnail
router.post('/:imagemId/thumbnail', processamentoController.criarThumbnail);

// Redimensionar imagem
router.post('/:imagemId/redimensionar', processamentoController.redimensionar);

// Obter informações da imagem
router.get('/:imagemId/info', processamentoController.informacoes);

// Gerar QR Code
router.post('/qrcode', processamentoController.gerarQRCode);

module.exports = router;
