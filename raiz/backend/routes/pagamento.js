const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { auth } = require('../middleware/auth');

// Rotas públicas
router.post('/webhook', pagamentoController.webhook);

// Rotas protegidas
router.use(auth);

// Listar pacotes disponíveis
router.get('/pacotes', pagamentoController.listarPacotes);

// Criar pedido
router.post('/pedido', pagamentoController.criarPedido);

// Confirmar pagamento (manual/teste)
router.post('/confirmar/:pacoteId', pagamentoController.confirmarPagamento);

// Gerar link de pagamento
router.get('/link/:pacoteId', pagamentoController.gerarLinkPagamento);

// Histórico de compras
router.get('/historico', pagamentoController.historico);

// Cancelar pedido
router.delete('/cancelar/:pacoteId', pagamentoController.cancelar);

module.exports = router;
