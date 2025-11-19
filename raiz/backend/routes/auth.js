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
    const { nome, email, senha, whatsapp } = req.body;
    
    if (!nome || !email || !senha || !whatsapp) {
        return res.status(400).json({ erro: 'Nome, email, senha e WhatsApp são obrigatórios' });
    }
    
    // 1. Verificar se o email já existe
    db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Erro ao verificar email:', err);
            return res.status(500).json({ erro: 'Erro interno ao verificar email' });
        }
        if (row) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        // 2. Inserir novo usuário
        const senhaHash = bcrypt.hashSync(senha, 10);
        const creditosIniciais = 5; // Pacote gratuito: 5 créditos
        const planoInicial = 'gratuito';
        
        db.run(
            'INSERT INTO usuarios (nome, email, senha, whatsapp, plano, creditos_disponiveis) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, email, senhaHash, whatsapp, planoInicial, creditosIniciais],
            function(err) {
                if (err) {
                    console.error('ERRO CRÍTICO NO CADASTRO:', err);
                    return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
                }
                
                const novoUsuarioId = this.lastID;
                
                // Simulação de Comunicação (Liberação do Pacote Gratuito)
                console.log(`[PACOTE GRATUITO LIBERADO] Usuário ID: ${novoUsuarioId}, Nome: ${nome}, WhatsApp: ${whatsapp}. Créditos: ${creditosIniciais}`);
                
                const token = jwt.sign({ id: novoUsuarioId }, JWT_SECRET, { expiresIn: '7d' });
                
                const usuario = {
                    id: novoUsuarioId,
                    nome: nome,
                    email: email,
                    whatsapp: whatsapp,
                    plano: planoInicial,
                    creditos_disponiveis: creditosIniciais
                };
                
                res.status(201).json({
                    mensagem: 'Usuário cadastrado com sucesso. Pacote gratuito liberado!',
                    usuario: usuario,
                    token
                });
            }
        );
    });
});



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
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                whatsapp: usuario.whatsapp,
                plano: usuario.plano,
                creditos_disponiveis: usuario.creditos_disponiveis
            },
            token
        });
    });
});

// GET /api/auth/perfil - Ver perfil do usuário autenticado
router.get('/perfil', autenticar, (req, res) => {
    db.get('SELECT id, nome, email, whatsapp, plano, creditos_disponiveis, criado_em FROM usuarios WHERE id = ?', [req.usuario_id], (err, usuario) => {
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
