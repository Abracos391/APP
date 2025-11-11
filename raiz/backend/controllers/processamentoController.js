const imageProcessingService = require('../utils/imageProcessingService');
const Imagem = require('../models/Imagem');
const path = require('path');

/**
 * Reprocessar imagem (adicionar ou remover marca d'água)
 */
exports.reprocessar = async (req, res) => {
  try {
    const { imagemId } = req.params;
    const { tipoCredito } = req.body;
    const usuarioId = req.usuario.id;

    // Buscar imagem
    const imagem = await Imagem.buscarPorId(imagemId);

    if (!imagem) {
      return res.status(404).json({ erro: 'Imagem não encontrada' });
    }

    if (imagem.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Sem permissão para processar esta imagem' });
    }

    // Extrair nome do arquivo da URL
    const nomeArquivo = path.basename(imagem.url_imagem);

    // Reprocessar
    const novoNomeArquivo = await imageProcessingService.processarImagem(nomeArquivo, tipoCredito);

    res.json({
      mensagem: 'Imagem reprocessada com sucesso',
      url: `/uploads/${novoNomeArquivo}`
    });

  } catch (error) {
    console.error('Erro ao reprocessar imagem:', error);
    res.status(500).json({
      erro: 'Erro ao reprocessar imagem',
      detalhes: error.message
    });
  }
};

/**
 * Criar thumbnail de uma imagem
 */
exports.criarThumbnail = async (req, res) => {
  try {
    const { imagemId } = req.params;
    const { tamanho } = req.query;
    const usuarioId = req.usuario.id;

    const imagem = await Imagem.buscarPorId(imagemId);

    if (!imagem) {
      return res.status(404).json({ erro: 'Imagem não encontrada' });
    }

    if (imagem.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Sem permissão' });
    }

    const nomeArquivo = path.basename(imagem.url_imagem);
    const thumbnailNome = await imageProcessingService.criarThumbnail(
      nomeArquivo,
      parseInt(tamanho) || 300
    );

    res.json({
      mensagem: 'Thumbnail criado com sucesso',
      url: `/uploads/${thumbnailNome}`
    });

  } catch (error) {
    console.error('Erro ao criar thumbnail:', error);
    res.status(500).json({
      erro: 'Erro ao criar thumbnail',
      detalhes: error.message
    });
  }
};

/**
 * Redimensionar imagem
 */
exports.redimensionar = async (req, res) => {
  try {
    const { imagemId } = req.params;
    const { width, height } = req.body;
    const usuarioId = req.usuario.id;

    if (!width || !height) {
      return res.status(400).json({ erro: 'Largura e altura são obrigatórios' });
    }

    const imagem = await Imagem.buscarPorId(imagemId);

    if (!imagem) {
      return res.status(404).json({ erro: 'Imagem não encontrada' });
    }

    if (imagem.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Sem permissão' });
    }

    const nomeArquivo = path.basename(imagem.url_imagem);
    const novoNome = await imageProcessingService.redimensionarImagem(
      nomeArquivo,
      parseInt(width),
      parseInt(height)
    );

    res.json({
      mensagem: 'Imagem redimensionada com sucesso',
      url: `/uploads/${novoNome}`,
      dimensoes: {
        width: parseInt(width),
        height: parseInt(height)
      }
    });

  } catch (error) {
    console.error('Erro ao redimensionar imagem:', error);
    res.status(500).json({
      erro: 'Erro ao redimensionar imagem',
      detalhes: error.message
    });
  }
};

/**
 * Obter informações da imagem
 */
exports.informacoes = async (req, res) => {
  try {
    const { imagemId } = req.params;
    const usuarioId = req.usuario.id;

    const imagem = await Imagem.buscarPorId(imagemId);

    if (!imagem) {
      return res.status(404).json({ erro: 'Imagem não encontrada' });
    }

    if (imagem.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Sem permissão' });
    }

    const nomeArquivo = path.basename(imagem.url_imagem);
    const info = await imageProcessingService.getImageInfo(nomeArquivo);

    res.json({
      imagem: {
        id: imagem.id,
        url: imagem.url_imagem,
        categoria: imagem.categoria,
        tipo_credito: imagem.tipo_credito
      },
      metadata: info
    });

  } catch (error) {
    console.error('Erro ao obter informações:', error);
    res.status(500).json({
      erro: 'Erro ao obter informações da imagem',
      detalhes: error.message
    });
  }
};

/**
 * Gerar QR Code standalone
 */
exports.gerarQRCode = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ erro: 'URL é obrigatória' });
    }

    const qrCodeBuffer = await imageProcessingService.gerarQRCode(url);

    // Retornar como imagem
    res.set('Content-Type', 'image/png');
    res.send(qrCodeBuffer);

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({
      erro: 'Erro ao gerar QR Code',
      detalhes: error.message
    });
  }
};
