const Usuario = require('../models/Usuario');
const Pacote = require('../models/Pacote');

/**
 * Criar pedido de compra de pacote
 */
exports.criarPedido = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { tipo_pacote, metodo_pagamento } = req.body;

    // Validar tipo de pacote
    const pacotesDisponiveis = {
      'premium_20': {
        creditos: 20,
        valor: 25.00,
        descricao: 'Pacote Premium - 20 imagens'
      }
    };

    if (!pacotesDisponiveis[tipo_pacote]) {
      return res.status(400).json({
        erro: 'Tipo de pacote inválido',
        pacotes_disponiveis: Object.keys(pacotesDisponiveis)
      });
    }

    const pacote = pacotesDisponiveis[tipo_pacote];

    // Criar registro do pacote
    const novoPacote = await Pacote.criar(
      usuarioId,
      tipo_pacote,
      pacote.creditos,
      pacote.valor,
      metodo_pagamento
    );

    // Retornar informações do pedido
    res.status(201).json({
      mensagem: 'Pedido criado com sucesso',
      pedido: {
        id: novoPacote.id,
        tipo: tipo_pacote,
        descricao: pacote.descricao,
        creditos: pacote.creditos,
        valor: pacote.valor,
        status: 'pendente',
        metodo_pagamento: metodo_pagamento
      },
      proximos_passos: {
        mensagem: 'Complete o pagamento usando o método escolhido',
        webhook_url: `${process.env.BACKEND_URL}/api/pagamento/webhook`,
        confirmation_url: `${process.env.BACKEND_URL}/api/pagamento/confirmar/${novoPacote.id}`
      }
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      erro: 'Erro ao criar pedido',
      detalhes: error.message
    });
  }
};

/**
 * Confirmar pagamento manualmente (para testes)
 */
exports.confirmarPagamento = async (req, res) => {
  try {
    const { pacoteId } = req.params;
    const { transaction_id } = req.body;

    // Buscar pacote
    const pacote = await Pacote.buscarPorId(pacoteId);

    if (!pacote) {
      return res.status(404).json({ erro: 'Pacote não encontrado' });
    }

    if (pacote.status === 'confirmado') {
      return res.status(400).json({ erro: 'Pagamento já foi confirmado' });
    }

    // Confirmar pagamento
    await Pacote.confirmarPagamento(pacoteId, transaction_id || `manual-${Date.now()}`);

    // Adicionar créditos ao usuário
    await Usuario.atualizarCreditos(pacote.usuario_id, 'premium', pacote.quantidade_creditos);

    // Buscar usuário atualizado
    const usuario = await Usuario.buscarPorId(pacote.usuario_id);

    res.json({
      mensagem: 'Pagamento confirmado com sucesso!',
      pacote: {
        id: pacote.id,
        tipo: pacote.tipo,
        creditos_adicionados: pacote.quantidade_creditos,
        valor_pago: pacote.valor
      },
      creditos_atuais: {
        gratuitos: usuario.creditos_gratuitos,
        premium: usuario.creditos_premium,
        total: usuario.creditos_gratuitos + usuario.creditos_premium
      }
    });

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({
      erro: 'Erro ao confirmar pagamento',
      detalhes: error.message
    });
  }
};

/**
 * Webhook para receber notificações de pagamento
 * (Mercado Pago, Stripe, etc)
 */
exports.webhook = async (req, res) => {
  try {
    console.log('📨 Webhook recebido:', req.body);

    // Aqui você implementaria a lógica específica do gateway de pagamento
    // Exemplo para Mercado Pago:
    /*
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentId = data.id;
      // Buscar informações do pagamento na API do Mercado Pago
      // Confirmar pagamento no sistema
    }
    */

    // Por enquanto, apenas confirma recebimento
    res.status(200).json({ mensagem: 'Webhook recebido' });

  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ erro: 'Erro ao processar webhook' });
  }
};

/**
 * Listar pacotes disponíveis
 */
exports.listarPacotes = async (req, res) => {
  try {
    const pacotes = [
      {
        id: 'premium_20',
        nome: 'Pacote Premium',
        descricao: '20 imagens personalizadas sem marca d\'água',
        creditos: 20,
        valor: 25.00,
        beneficios: [
          'Sem marca d\'água',
          'Qualidade premium',
          'Download ilimitado',
          'Suporte prioritário'
        ]
      }
    ];

    res.json({
      pacotes,
      metodos_pagamento: [
        'pix',
        'cartao_credito',
        'cartao_debito',
        'boleto'
      ]
    });

  } catch (error) {
    console.error('Erro ao listar pacotes:', error);
    res.status(500).json({
      erro: 'Erro ao listar pacotes',
      detalhes: error.message
    });
  }
};

/**
 * Histórico de compras do usuário
 */
exports.historico = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const pacotes = await Pacote.buscarPorUsuario(usuarioId);

    res.json({
      total_compras: pacotes.length,
      valor_total_gasto: pacotes
        .filter(p => p.status === 'confirmado')
        .reduce((sum, p) => sum + p.valor, 0),
      compras: pacotes.map(p => ({
        id: p.id,
        tipo: p.tipo,
        creditos: p.quantidade_creditos,
        valor: p.valor,
        status: p.status,
        metodo_pagamento: p.metodo_pagamento,
        data_compra: p.data_compra,
        data_confirmacao: p.data_confirmacao
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      erro: 'Erro ao buscar histórico',
      detalhes: error.message
    });
  }
};

/**
 * Cancelar pedido pendente
 */
exports.cancelar = async (req, res) => {
  try {
    const { pacoteId } = req.params;
    const usuarioId = req.usuario.id;

    const pacote = await Pacote.buscarPorId(pacoteId);

    if (!pacote) {
      return res.status(404).json({ erro: 'Pacote não encontrado' });
    }

    if (pacote.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Sem permissão para cancelar este pedido' });
    }

    if (pacote.status !== 'pendente') {
      return res.status(400).json({ 
        erro: 'Apenas pedidos pendentes podem ser cancelados',
        status_atual: pacote.status
      });
    }

    await Pacote.cancelar(pacoteId);

    res.json({
      mensagem: 'Pedido cancelado com sucesso',
      pacote_id: pacoteId
    });

  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({
      erro: 'Erro ao cancelar pedido',
      detalhes: error.message
    });
  }
};

/**
 * Gerar link de pagamento (simulado)
 */
exports.gerarLinkPagamento = async (req, res) => {
  try {
    const { pacoteId } = req.params;
    const usuarioId = req.usuario.id;

    const pacote = await Pacote.buscarPorId(pacoteId);

    if (!pacote) {
      return res.status(404).json({ erro: 'Pacote não encontrado' });
    }

    if (pacote.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Sem permissão' });
    }

    // Aqui você geraria o link real do gateway de pagamento
    // Exemplo: Mercado Pago, Stripe, etc.

    const linkSimulado = `${process.env.FRONTEND_URL}/pagamento/${pacoteId}`;

    res.json({
      mensagem: 'Link de pagamento gerado',
      link: linkSimulado,
      pacote: {
        id: pacote.id,
        valor: pacote.valor,
        creditos: pacote.quantidade_creditos
      },
      expiracao: '24 horas'
    });

  } catch (error) {
    console.error('Erro ao gerar link:', error);
    res.status(500).json({
      erro: 'Erro ao gerar link de pagamento',
      detalhes: error.message
    });
  }
};
