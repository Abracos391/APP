const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware de autenticação
const auth = async (req, res, next) => {
  try {
    // Pegar token do header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        erro: 'Acesso negado. Token não fornecido.' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_mude_em_producao');

    // Buscar usuário
    const usuario = await Usuario.buscarPorId(decoded.id);

    if (!usuario) {
      return res.status(401).json({ 
        erro: 'Token inválido. Usuário não encontrado.' 
      });
    }

    // Verificar reset mensal de créditos
    await Usuario.verificarResetMensal(usuario.id);

    // Adicionar usuário ao request
    req.usuario = usuario;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        erro: 'Token inválido.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        erro: 'Token expirado. Faça login novamente.' 
      });
    }

    res.status(500).json({ 
      erro: 'Erro ao autenticar.', 
      detalhes: error.message 
    });
  }
};

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.usuario.tipo_conta !== 'admin') {
    return res.status(403).json({ 
      erro: 'Acesso negado. Apenas administradores.' 
    });
  }
  next();
};

module.exports = { auth, isAdmin };
