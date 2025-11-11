const Usuario = require('../models/Usuario');
const Imagem = require('../models/Imagem');
const Pacote = require('../models/Pacote');
const db = require('../config/database');

/**
 * Dashboard - Estatísticas gerais
 */
exports.dashboard = async (req, res) => {
  try {
    // Estatísticas de usuários
    const totalUsuarios = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM usuarios WHERE ativo = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });

    const novosUsuariosHoje = await new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as total FROM usuarios WHERE DATE(data_cadastro) = DATE("now")',
        (err, row) => {
          if (err) reject(err);
          else resolve(row.total);
        }
      );
    });

    // Estatísticas de imagens
    const totalImagens = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM imagens', (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });

    const imagensHoje = await new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as total FROM imagens WHERE DATE(data_criacao) = DATE("now")',
        (err, row) => {
          if (err) reject(err);
          else resolve(row.total);
        }
      );
    });

    // Estatísticas de vendas
    const estatisticasVendas = await Pacote.estatisticas();

    // Créditos em circulação
    const creditosCirculacao = await new Promise((resolve, reject) => {
      db.get(
        'SELECT SUM(creditos_gratuitos) as gratuitos, SUM(creditos_premium) as premium FROM usuarios',
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Imagens por categoria
    const imagensPorCategoria = await new Promise((resolve, reject) => {
      db.all(
        'SELECT categoria, COUNT(*) as total FROM imagens GROUP BY categoria ORDER BY total DESC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({
      usuarios: {
        total: totalUsuarios,
        novos_hoje: novosUsuariosHoje
      },
      imagens: {
        total: totalImagens,
        geradas_hoje: imagensHoje,
        por_categoria: imagensPorCategoria
      },
      vendas: {
        total: estatisticasVendas.total_vendas || 0,
        receita_total: estatisticasVendas.receita_total || 0,
        receita_confirmada: estatisticasVendas.receita_confirmada || 0,
        receita_pendente: estatisticasVendas.receita_pendente || 0
      },
      creditos: {
        gratuitos_circulacao: creditosCirculacao.gratuitos || 0,
        premium_circulacao: creditosCirculacao.premium || 0,
        total_circulacao: (creditosCirculacao.gratuitos || 0) + (creditosCirculacao.premium || 0)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({
      erro: 'Erro ao buscar estatísticas',
      detalhes: error.message
    });
  }
};

/**
 * Listar todos os usuários
 */
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.listarTodos();

    res.json({
      total: usuarios.length,
      usuarios: usuarios.map(u => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        whatsapp: u.whatsapp,
        tipo_conta: u.tipo_conta,
        creditos_gratuitos: u.creditos_gratuitos,
        creditos_premium: u.creditos_premium,
        data_cadastro: u.data_cadastro,
        ativo: u.ativo
      }))
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      erro: 'Erro ao listar usuários',
      detalhes: error.message
    });
  }
};

/**
 * Detalhes de um usuário específico
 */
exports.detalhesUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const usuario = await Usuario.buscarPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Buscar imagens do usuário
    const imagens = await Imagem.buscarPorUsuario(usuarioId, 10);

    // Buscar pacotes do usuário
    const pacotes = await Pacote.buscarPorUsuario(usuarioId);

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        whatsapp: usuario.whatsapp,
        tipo_conta: usuario.tipo_conta,
        creditos_gratuitos: usuario.creditos_gratuitos,
        creditos_premium: usuario.creditos_premium,
        data_cadastro: usuario.data_cadastro,
        ultimo_reset_gratuito: usuario.ultimo_reset_gratuito,
        ativo: usuario.ativo
      },
      estatisticas: {
        total_imagens: imagens.length,
        total_compras: pacotes.filter(p => p.status === 'confirmado').length,
        valor_gasto: pacotes
          .filter(p => p.status === 'confirmado')
          .reduce((sum, p) => sum + p.valor, 0)
      },
      ultimas_imagens: imagens.slice(0, 5),
      ultimas_compras: pacotes.slice(0, 5)
    });

  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    res.status(500).json({
      erro: 'Erro ao buscar detalhes do usuário',
      detalhes: error.message
    });
  }
};

/**
 * Adicionar créditos manualmente a um usuário
 */
exports.adicionarCreditos = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { tipo, quantidade, motivo } = req.body;

    if (!tipo || !quantidade) {
      return res.status(400).json({
        erro: 'Tipo e quantidade são obrigatórios'
      });
    }

    if (tipo !== 'gratuito' && tipo !== 'premium') {
      return res.status(400).json({
        erro: 'Tipo deve ser "gratuito" ou "premium"'
      });
    }

    const usuario = await Usuario.buscarPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await Usuario.atualizarCreditos(usuarioId, tipo, quantidade);

    const usuarioAtualizado = await Usuario.buscarPorId(usuarioId);

    console.log(`✅ Admin adicionou ${quantidade} créditos ${tipo} para ${usuario.nome} (${motivo || 'sem motivo'})`);

    res.json({
      mensagem: 'Créditos adicionados com sucesso',
      usuario: {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        creditos_gratuitos: usuarioAtualizado.creditos_gratuitos,
        creditos_premium: usuarioAtualizado.creditos_premium
      },
      operacao: {
        tipo,
        quantidade,
        motivo: motivo || 'Adicionado manualmente pelo admin'
      }
    });

  } catch (error) {
    console.error('Erro ao adicionar créditos:', error);
    res.status(500).json({
      erro: 'Erro ao adicionar créditos',
      detalhes: error.message
    });
  }
};

/**
 * Desativar/Ativar usuário
 */
exports.toggleUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const usuario = await Usuario.buscarPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const novoStatus = usuario.ativo === 1 ? 0 : 1;

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE usuarios SET ativo = ? WHERE id = ?',
        [novoStatus, usuarioId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      mensagem: `Usuário ${novoStatus === 1 ? 'ativado' : 'desativado'} com sucesso`,
      usuario: {
        id: usuarioId,
        nome: usuario.nome,
        ativo: novoStatus
      }
    });

  } catch (error) {
    console.error('Erro ao alterar status:', error);
    res.status(500).json({
      erro: 'Erro ao alterar status do usuário',
      detalhes: error.message
    });
  }
};

/**
 * Listar todas as vendas
 */
exports.listarVendas = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 100;
    const vendas = await Pacote.listarTodos(limite);

    res.json({
      total: vendas.length,
      vendas: vendas.map(v => ({
        id: v.id,
        usuario: {
          id: v.usuario_id,
          nome: v.nome,
          email: v.email
        },
        tipo: v.tipo,
        creditos: v.quantidade_creditos,
        valor: v.valor,
        status: v.status,
        metodo_pagamento: v.metodo_pagamento,
        data_compra: v.data_compra,
        data_confirmacao: v.data_confirmacao,
        transaction_id: v.transaction_id
      }))
    });

  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({
      erro: 'Erro ao listar vendas',
      detalhes: error.message
    });
  }
};

/**
 * Relatório de atividades
 */
exports.relatorioAtividades = async (req, res) => {
  try {
    const { periodo } = req.query; // 'dia', 'semana', 'mes'

    let filtroData = '';
    switch (periodo) {
      case 'dia':
        filtroData = 'DATE(data_criacao) = DATE("now")';
        break;
      case 'semana':
        filtroData = 'DATE(data_criacao) >= DATE("now", "-7 days")';
        break;
      case 'mes':
        filtroData = 'DATE(data_criacao) >= DATE("now", "-30 days")';
        break;
      default:
        filtroData = '1=1'; // Todos
    }

    // Imagens por dia
    const imagensPorDia = await new Promise((resolve, reject) => {
      db.all(
        `SELECT DATE(data_criacao) as data, COUNT(*) as total 
         FROM imagens 
         WHERE ${filtroData}
         GROUP BY DATE(data_criacao) 
         ORDER BY data DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Cadastros por dia
    const cadastrosPorDia = await new Promise((resolve, reject) => {
      db.all(
        `SELECT DATE(data_cadastro) as data, COUNT(*) as total 
         FROM usuarios 
         WHERE ${filtroData.replace('data_criacao', 'data_cadastro')}
         GROUP BY DATE(data_cadastro) 
         ORDER BY data DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Vendas por dia
    const vendasPorDia = await new Promise((resolve, reject) => {
      db.all(
        `SELECT DATE(data_compra) as data, COUNT(*) as total, SUM(valor) as receita 
         FROM pacotes 
         WHERE status = 'confirmado' AND ${filtroData.replace('data_criacao', 'data_compra')}
         GROUP BY DATE(data_compra) 
         ORDER BY data DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({
      periodo: periodo || 'todos',
      imagens_por_dia: imagensPorDia,
      cadastros_por_dia: cadastrosPorDia,
      vendas_por_dia: vendasPorDia
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      erro: 'Erro ao gerar relatório',
      detalhes: error.message
    });
  }
};
