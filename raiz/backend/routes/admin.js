// ========================================
// ROTAS ADMINISTRATIVAS
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

// Middleware de verificação de admin (simplificado)
const verificarAdmin = (req, res, next) => {
    // Em produção, você verificaria se o usuário é admin no banco de dados
    const adminIds = process.env.ADMIN_IDS?.split(',') || ['1'];
    
    if (!adminIds.includes(String(req.usuario_id))) {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
    }
    
    next();
};

// GET /api/admin/dashboard - Dashboard de administração
router.get('/dashboard', autenticar, verificarAdmin, (req, res) => {
    db.get('SELECT COUNT(*) as total_usuarios FROM usuarios', (err, usuarios) => {
        if (err) return res.status(500).json({ erro: 'Erro ao contar usuários' });
        
        db.get('SELECT COUNT(*) as total_imagens FROM imagens', (err, imagens) => {
            if (err) return res.status(500).json({ erro: 'Erro ao contar imagens' });
            
            db.get('SELECT SUM(valor) as receita_total FROM pagamentos WHERE status = ?', ['confirmado'], (err, receita) => {
                if (err) return res.status(500).json({ erro: 'Erro ao calcular receita' });
                
                res.json({
                    total_usuarios: usuarios.total_usuarios,
                    total_imagens: imagens.total_imagens,
                    receita_total: receita.receita_total || 0,
                    data_atualizacao: new Date().toISOString()
                });
            });
        });
    });
});

// GET /api/admin/usuarios - Listar usuários
router.get('/usuarios', autenticar, verificarAdmin, (req, res) => {
    db.all(
        'SELECT id, nome, email, plano, criado_em FROM usuarios ORDER BY criado_em DESC LIMIT 100',
        (err, usuarios) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao listar usuários' });
            }
            
            res.json({
                total: usuarios.length,
                usuarios
            });
        }
    );
});

// GET /api/admin/imagens - Listar todas as imagens
router.get('/imagens', autenticar, verificarAdmin, (req, res) => {
    db.all(
        'SELECT id, usuario_id, titulo, tema, criado_em FROM imagens ORDER BY criado_em DESC LIMIT 100',
        (err, imagens) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao listar imagens' });
            }
            
            res.json({
                total: imagens.length,
                imagens
            });
        }
    );
});

// GET /api/admin/pagamentos - Listar pagamentos
router.get('/pagamentos', autenticar, verificarAdmin, (req, res) => {
    db.all(
        'SELECT id, usuario_id, plano, valor, status, criado_em FROM pagamentos ORDER BY criado_em DESC LIMIT 100',
        (err, pagamentos) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao listar pagamentos' });
            }
            
            res.json({
                total: pagamentos.length,
                pagamentos
            });
        }
    );
});

module.exports = router;
