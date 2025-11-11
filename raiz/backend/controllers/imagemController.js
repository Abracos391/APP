const Usuario = require('../models/Usuario');
const Imagem = require('../models/Imagem');
const openaiService = require('../utils/openaiService');
const stabilityService = require('../utils/stabilityService');
const imageProcessingService = require('../utils/imageProcessingService');

/**
 * Gerar nova imagem
 */
exports.gerar = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const {
      categoria,
      background,
      cor_texto,
      tipo_mensagem,
      nome_destinatario,
      mensagem_adicional
    } = req.body;

    // Validações
    if (!categoria || !background || !cor_texto || !tipo_mensagem) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: categoria, background, cor_texto, tipo_mensagem'
      });
    }

    if (tipo_mensagem === 'personalizada' && !nome_destinatario) {
      return res.status(400).json({
        erro: 'Nome do destinatário é obrigatório para mensagens personalizadas'
      });
    }

    // Verificar créditos do usuário
    const usuario = await Usuario.buscarPorId(usuarioId);
    const totalCreditos = usuario.creditos_gratuitos + usuario.creditos_premium;

    if (totalCreditos <= 0) {
      return res.status(403).json({
        erro: 'Créditos insuficientes. Compre mais créditos para continuar.',
        creditos_gratuitos: usuario.creditos_gratuitos,
        creditos_premium: usuario.creditos_premium
      });
    }

    console.log(`\n🎨 Iniciando geração de imagem para usuário ${usuario.nome}`);
    console.log(`💳 Créditos disponíveis: ${usuario.creditos_gratuitos} gratuitos + ${usuario.creditos_premium} premium`);

    // ETAPA 1: Gerar prompt com ChatGPT
    console.log('\n📝 ETAPA 1: Gerando prompt com ChatGPT...');
    const prompt = await openaiService.gerarPrompt({
      categoria,
      background,
      cor_texto,
      tipo_mensagem,
      nome_destinatario,
      mensagem_adicional
    });

    // ETAPA 2: Gerar imagem com Stability AI
    console.log('\n🎨 ETAPA 2: Gerando imagem com Stability AI...');
    let nomeArquivo = await stabilityService.gerarImagem(prompt, {
      width: 1024,
      height: 1024,
      steps: 30
    });

    // ETAPA 3: Processar imagem (marca d'água + QR Code)
    console.log('\n💳 ETAPA 3: Debitando crédito...');
    const tipoCredito = await Usuario.usarCredito(usuarioId);
    console.log(`✅ Crédito ${tipoCredito} usado`);

    // ETAPA 4: Processar imagem (adicionar marca d'água se gratuito)
    console.log('\n🎨 ETAPA 4: Processando imagem...');
    nomeArquivo = await imageProcessingService.processarImagem(nomeArquivo, tipoCredito);

    // ETAPA 5: Salvar registro no banco
    console.log('\n💾 ETAPA 5: Salvando registro no banco...');
    const urlImagem = `/uploads/${nomeArquivo}`;
    
    const imagemCriada = await Imagem.criar({
      usuario_id: usuarioId,
      categoria,
      background,
      cor_texto,
      tipo_mensagem,
      nome_destinatario: nome_destinatario || null,
      mensagem_adicional: mensagem_adicional || null,
      url_imagem: urlImagem,
      tipo_credito: tipoCredito
    });

    // Buscar usuário atualizado
    const usuarioAtualizado = await Usuario.buscarPorId(usuarioId);

    console.log('\n✅ Imagem gerada com sucesso!\n');

    res.status(201).json({
      mensagem: 'Imagem gerada com sucesso!',
      imagem: {
        id: imagemCriada.id,
        url: urlImagem,
        categoria,
        tipo_credito: tipoCredito,
        tem_marca_dagua: tipoCredito === 'gratuito',
        data_criacao: new Date().toISOString()
      },
      creditos_restantes: {
        gratuitos: usuarioAtualizado.creditos_gratuitos,
        premium: usuarioAtualizado.creditos_premium,
        total: usuarioAtualizado.creditos_gratuitos + usuarioAtualizado.creditos_premium
      }
    });

  } catch (error) {
    console.error('\n❌ Erro ao gerar imagem:', error);
    res.status(500).json({
      erro: 'Erro ao gerar imagem.',
      detalhes: error.message
    });
  }
};

/**
 * Listar imagens do usuário
 */
exports.listar = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const limite = parseInt(req.query.limite) || 50;

    const imagens = await Imagem.buscarPorUsuario(usuarioId, limite);

    res.json({
      total: imagens.length,
      imagens: imagens.map(img => ({
        id: img.id,
        url: img.url_imagem,
        categoria: img.categoria,
        tipo_mensagem: img.tipo_mensagem,
        nome_destinatario: img.nome_destinatario,
        tipo_credito: img.tipo_credito,
        data_criacao: img.data_criacao
      }))
    });

  } catch (error) {
    console.error('Erro ao listar imagens:', error);
    res.status(500).json({
      erro: 'Erro ao listar imagens.',
      detalhes: error.message
    });
  }
};

/**
 * Buscar imagem específica
 */
exports.buscar = async (req, res) => {
  try {
    const imagemId = req.params.id;
    const usuarioId = req.usuario.id;

    const imagem = await Imagem.buscarPorId(imagemId);

    if (!imagem) {
      return res.status(404).json({
        erro: 'Imagem não encontrada'
      });
    }

    // Verificar se a imagem pertence ao usuário
    if (imagem.usuario_id !== usuarioId) {
      return res.status(403).json({
        erro: 'Você não tem permissão para acessar esta imagem'
      });
    }

    res.json({
      imagem: {
        id: imagem.id,
        url: imagem.url_imagem,
        categoria: imagem.categoria,
        background: imagem.background,
        cor_texto: imagem.cor_texto,
        tipo_mensagem: imagem.tipo_mensagem,
        nome_destinatario: imagem.nome_destinatario,
        mensagem_adicional: imagem.mensagem_adicional,
        tipo_credito: imagem.tipo_credito,
        data_criacao: imagem.data_criacao
      }
    });

  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    res.status(500).json({
      erro: 'Erro ao buscar imagem.',
      detalhes: error.message
    });
  }
};

/**
 * Deletar imagem
 */
exports.deletar = async (req, res) => {
  try {
    const imagemId = req.params.id;
    const usuarioId = req.usuario.id;

    const resultado = await Imagem.deletar(imagemId, usuarioId);

    if (resultado === 0) {
      return res.status(404).json({
        erro: 'Imagem não encontrada ou você não tem permissão para deletá-la'
      });
    }

    res.json({
      mensagem: 'Imagem deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({
      erro: 'Erro ao deletar imagem.',
      detalhes: error.message
    });
  }
};

/**
 * Estatísticas do usuário
 */
exports.estatisticas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const total = await Imagem.contarPorUsuario(usuarioId);
    const usuario = await Usuario.buscarPorId(usuarioId);

    res.json({
      total_imagens_criadas: total,
      creditos: {
        gratuitos: usuario.creditos_gratuitos,
        premium: usuario.creditos_premium,
        total: usuario.creditos_gratuitos + usuario.creditos_premium
      },
      membro_desde: usuario.data_cadastro
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      erro: 'Erro ao buscar estatísticas.',
      detalhes: error.message
    });
  }
};
