const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Gerar token JWT
const gerarToken = (usuarioId) => {
  return jwt.sign(
    { id: usuarioId }, 
    process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_mude_em_producao',
    { expiresIn: '7d' }
  );
};

// Cadastro de usuário
exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, whatsapp, senha } = req.body;

    // Validações básicas
    if (!nome || !email || !whatsapp || !senha) {
      return res.status(400).json({ 
        erro: 'Todos os campos são obrigatórios.' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        erro: 'E-mail inválido.' 
      });
    }

    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      return res.status(400).json({ 
        erro: 'A senha deve ter no mínimo 6 caracteres.' 
      });
    }

    // Verificar se email já existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ 
        erro: 'Este e-mail já está cadastrado.' 
      });
    }

    // Criar usuário
    const novoUsuario = await Usuario.criar(nome, email, whatsapp, senha);

    // Gerar token
    const token = gerarToken(novoUsuario.id);

    res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso!',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        creditos_gratuitos: novoUsuario.creditos_gratuitos,
        creditos_premium: novoUsuario.creditos_premium
      },
      token
    });

  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ 
      erro: 'Erro ao realizar cadastro.', 
      detalhes: error.message 
    });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ 
        erro: 'E-mail e senha são obrigatórios.' 
      });
    }

    // Buscar usuário
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ 
        erro: 'E-mail ou senha incorretos.' 
      });
    }

    // Verificar senha
    const senhaValida = await Usuario.verificarSenha(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ 
        erro: 'E-mail ou senha incorretos.' 
      });
    }

    // Verificar reset mensal
    await Usuario.verificarResetMensal(usuario.id);

    // Buscar usuário atualizado
    const usuarioAtualizado = await Usuario.buscarPorId(usuario.id);

    // Gerar token
    const token = gerarToken(usuario.id);

    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        creditos_gratuitos: usuarioAtualizado.creditos_gratuitos,
        creditos_premium: usuarioAtualizado.creditos_premium,
        tipo_conta: usuarioAtualizado.tipo_conta
      },
      token
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ 
      erro: 'Erro ao fazer login.', 
      detalhes: error.message 
    });
  }
};

// Obter dados do usuário logado
exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(req.usuario.id);

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        whatsapp: usuario.whatsapp,
        creditos_gratuitos: usuario.creditos_gratuitos,
        creditos_premium: usuario.creditos_premium,
        tipo_conta: usuario.tipo_conta,
        data_cadastro: usuario.data_cadastro
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ 
      erro: 'Erro ao buscar perfil.', 
      detalhes: error.message 
    });
  }
};

// Verificar token
exports.verificarToken = async (req, res) => {
  res.json({ 
    valido: true,
    usuario: {
      id: req.usuario.id,
      nome: req.usuario.nome,
      email: req.usuario.email
    }
  });
};
