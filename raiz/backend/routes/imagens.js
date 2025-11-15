// ========================================
// ROTAS DE IMAGENS
// ========================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_key_aqui_mude_em_producao';

// Middleware de autenticação
const autenticar = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario_id = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ erro: 'Token inválido' });
    }
};

// POST /api/imagens/gerar - Gerar nova imagem
router.post('/gerar', autenticar, (req, res) => {
    const { titulo, tema, texto_principal, dedicatoria, fonte, tamanho_fonte, cor_texto } = req.body;
    const usuario_id = req.usuario_id;
    
    // Validar dados
    if (!tema || !texto_principal) {
        return res.status(400).json({ erro: 'Tema e texto principal são obrigatórios' });
    }
    
    // Simular caminho do arquivo (em produção, seria gerado de verdade)
    const caminho_arquivo = `/uploads/imagem_${Date.now()}.png`;
    
    db.run(
        `INSERT INTO imagens (usuario_id, titulo, tema, texto_principal, dedicatoria, fonte, tamanho_fonte, cor_texto, caminho_arquivo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [usuario_id, titulo || 'Sem título', tema, texto_principal, dedicatoria || '', fonte || 'Arial', tamanho_fonte || 'medio', cor_texto || '#000000', caminho_arquivo],
        function(err) {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao salvar imagem' });
            }
            
            res.status(201).json({
                mensagem: 'Imagem gerada com sucesso',
                imagem_id: this.lastID,
                caminho: caminho_arquivo
            });
        }
    );
});

// GET /api/imagens - Listar imagens do usuário
router.get('/', autenticar, (req, res) => {
    const usuario_id = req.usuario_id;
    
    db.all(
        'SELECT id, titulo, tema, texto_principal, dedicatoria, caminho_arquivo, criado_em FROM imagens WHERE usuario_id = ? ORDER BY criado_em DESC',
        [usuario_id],
        (err, imagens) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao listar imagens' });
            }
            
            res.json({
                total: imagens.length,
                imagens: imagens
            });
        }
    );
});

// GET /api/imagens/:id - Buscar imagem específica
router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    db.get(
        'SELECT id, titulo, tema, texto_principal, dedicatoria, caminho_arquivo, criado_em FROM imagens WHERE id = ?',
        [id],
        (err, imagem) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao buscar imagem' });
            }
            
            if (!imagem) {
                return res.status(404).json({ erro: 'Imagem não encontrada' });
            }
            
            res.json(imagem);
        }
    );
});

// DELETE /api/imagens/:id - Deletar imagem
router.delete('/:id', autenticar, (req, res) => {
    const { id } = req.params;
    const usuario_id = req.usuario_id;
    
    db.run(
        'DELETE FROM imagens WHERE id = ? AND usuario_id = ?',
        [id, usuario_id],
        function(err) {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao deletar imagem' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ erro: 'Imagem não encontrada ou sem permissão' });
            }
            
            res.json({ mensagem: 'Imagem deletada com sucesso' });
        }
    );
});

module.exports = router;
