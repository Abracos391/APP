// ========================================
// ROTAS DE PROCESSAMENTO
// ========================================

const express = require('express');
const router = express.Router();

// POST /api/processamento/validar - Validar dados
router.post('/validar', (req, res) => {
    const { texto_principal, dedicatoria } = req.body;
    
    const erros = [];
    
    if (!texto_principal) {
        erros.push('Texto principal é obrigatório');
    } else if (texto_principal.length > 150) {
        erros.push('Texto principal não pode ter mais de 150 caracteres');
    }
    
    if (dedicatoria && dedicatoria.length > 100) {
        erros.push('Dedicatória não pode ter mais de 100 caracteres');
    }
    
    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }
    
    res.json({ valido: true, mensagem: 'Dados válidos' });
});

// POST /api/processamento/preview - Gerar preview da imagem
router.post('/preview', (req, res) => {
    const { tema, texto_principal, dedicatoria, fonte, tamanho_fonte, cor_texto } = req.body;
    
    // Validar dados básicos
    if (!tema || !texto_principal) {
        return res.status(400).json({ erro: 'Tema e texto principal são obrigatórios' });
    }
    
    // Retornar informações do preview
    res.json({
        preview: true,
        tema,
        texto_principal,
        dedicatoria: dedicatoria || '',
        fonte: fonte || 'Arial',
        tamanho_fonte: tamanho_fonte || 'medio',
        cor_texto: cor_texto || '#000000',
        mensagem: 'Preview gerado com sucesso'
    });
});

module.exports = router;
