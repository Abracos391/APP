// ========================================
// ROTAS DE AUTENTICAÇÃO
// ========================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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

// POST /api/auth/cadastro - Cadastrar novo usuário
router.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }
    
    const senhaHash = bcrypt.hashSync(senha, 10);
    
    db.run(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senhaHash],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ erro: 'Email já cadastrado' });
                }
                return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
            }
            
            const token = jwt.sign({ id: this.lastID }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({
                mensagem: 'Usuário cadastrado com sucesso',
                usuario_id: this.lastID,
                token
            });
        }
    );
});

// POST /api/auth/login - Fazer login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }
    
    db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }
        
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            mensagem: 'Login realizado com sucesso',
            usuario_id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            plano: usuario.plano,
            token
        });
    });
});

// GET /api/auth/perfil - Ver perfil do usuário autenticado
router.get('/perfil', autenticar, (req, res) => {
    db.get('SELECT id, nome, email, plano, criado_em FROM usuarios WHERE id = ?', [req.usuario_id], (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao buscar perfil' });
        }
        
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        
        res.json(usuario);
    });
});

module.exports = router;
