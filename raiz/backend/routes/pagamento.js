// ========================================
// ROTAS DE PAGAMENTO
// ========================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/pagamento/pacotes - Listar pacotes disponíveis
router.get('/pacotes', (req, res) => {
    const pacotes = [
        {
            id: 1,
            nome: 'Gratuito',
            descricao: 'Plano básico com funcionalidades essenciais',
            preco: 0,
            limite_imagens: 5,
            features: ['40+ temas', 'Texto personalizado', 'Download PNG']
        },
        {
            id: 2,
            nome: 'Premium',
            descricao: 'Plano premium com recursos avançados',
            preco: 9.99,
            limite_imagens: 100,
            features: ['Tudo do plano gratuito', 'Imagens ilimitadas', 'Prioridade no suporte']
        },
        {
            id: 3,
            nome: 'Profissional',
            descricao: 'Plano profissional para empresas',
            preco: 29.99,
            limite_imagens: 1000,
            features: ['Tudo do plano premium', 'API de integração', 'Suporte dedicado']
        }
    ];
    
    res.json(pacotes);
});

// POST /api/pagamento/pedido - Criar pedido de pagamento
router.post('/pedido', (req, res) => {
    const { usuario_id, plano_id } = req.body;
    
    if (!usuario_id || !plano_id) {
        return res.status(400).json({ erro: 'usuario_id e plano_id são obrigatórios' });
    }
    
    const pacotes = {
        1: { nome: 'Gratuito', valor: 0 },
        2: { nome: 'Premium', valor: 9.99 },
        3: { nome: 'Profissional', valor: 29.99 }
    };
    
    const pacote = pacotes[plano_id];
    if (!pacote) {
        return res.status(400).json({ erro: 'Plano não encontrado' });
    }
    
    const referencia = `PED_${Date.now()}`;
    
    db.run(
        'INSERT INTO pagamentos (usuario_id, plano, valor, referencia_externa) VALUES (?, ?, ?, ?)',
        [usuario_id, pacote.nome, pacote.valor, referencia],
        function(err) {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao criar pedido' });
            }
            
            res.status(201).json({
                pedido_id: this.lastID,
                referencia,
                plano: pacote.nome,
                valor: pacote.valor,
                status: 'pendente'
            });
        }
    );
});

// POST /api/pagamento/confirmar - Confirmar pagamento
router.post('/confirmar', (req, res) => {
    const { pedido_id } = req.body;
    
    if (!pedido_id) {
        return res.status(400).json({ erro: 'pedido_id é obrigatório' });
    }
    
    db.run(
        'UPDATE pagamentos SET status = ?, confirmado_em = CURRENT_TIMESTAMP WHERE id = ?',
        ['confirmado', pedido_id],
        function(err) {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao confirmar pagamento' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ erro: 'Pedido não encontrado' });
            }
            
            res.json({ mensagem: 'Pagamento confirmado com sucesso', pedido_id });
        }
    );
});

module.exports = router;
