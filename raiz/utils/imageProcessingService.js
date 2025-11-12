const sharp = require('sharp');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessingService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '..', 'uploads');
    this.watermarkText = 'Criado por: Gerador de Abraços';
    this.websiteUrl = process.env.FRONTEND_URL || 'https://geradordeabracos.com';
  }

  /**
   * Adicionar marca d'água e QR Code em imagens gratuitas
   * @param {string} imagePath - Caminho da imagem original
   * @param {string} tipoCredito - Tipo de crédito usado (gratuito/premium)
   * @returns {Promise<string>} - Caminho da imagem processada
   */
  async processarImagem(imagePath, tipoCredito) {
    try {
      const fullPath = path.join(this.uploadsDir, imagePath);

      // Se for premium, não adiciona marca d'água
      if (tipoCredito === 'premium') {
        console.log('✨ Imagem premium - sem marca d\'água');
        return imagePath;
      }

      console.log('🎨 Processando imagem gratuita - adicionando marca d\'água...');

      // Carregar imagem original
      const image = sharp(fullPath);
      const metadata = await image.metadata();
      const { width, height } = metadata;

      // Gerar QR Code
      const qrCodeBuffer = await this.gerarQRCode(this.websiteUrl);

      // Criar overlay com marca d'água
      const watermarkSvg = this.criarMarcaDagua(width, height);
      const watermarkBuffer = Buffer.from(watermarkSvg);

      // Redimensionar QR Code
      const qrCodeResized = await sharp(qrCodeBuffer)
        .resize(120, 120)
        .toBuffer();

      // Aplicar marca d'água e QR Code
      const processedImage = await image
        .composite([
          {
            input: watermarkBuffer,
            gravity: 'south'
          },
          {
            input: qrCodeResized,
            gravity: 'southeast',
            top: height - 140,
            left: width - 140
          }
        ])
        .toBuffer();

      // Salvar imagem processada
      const processedFilename = imagePath.replace('.png', '-processed.png');
      const processedPath = path.join(this.uploadsDir, processedFilename);
      
      await fs.writeFile(processedPath, processedImage);

      // Deletar imagem original
      await fs.unlink(fullPath);

      console.log('✅ Marca d\'água e QR Code adicionados');
      
      return processedFilename;

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      // Em caso de erro, retorna a imagem original
      return imagePath;
    }
  }

  /**
   * Criar SVG com marca d'água
   */
  criarMarcaDagua(width, height) {
    const fontSize = Math.max(16, Math.floor(width / 40));
    const padding = 20;
    const textY = height - padding;

    return `
      <svg width="${width}" height="${height}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="${width}" height="60" y="${height - 60}" fill="rgba(0,0,0,0.3)"/>
        <text 
          x="${width / 2}" 
          y="${textY}" 
          font-family="Arial, sans-serif" 
          font-size="${fontSize}" 
          font-weight="bold"
          fill="white" 
          text-anchor="middle"
          filter="url(#shadow)"
        >
          ${this.watermarkText}
        </text>
      </svg>
    `;
  }

  /**
   * Gerar QR Code
   */
  async gerarQRCode(url) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Converter data URL para buffer
      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
      return Buffer.from(base64Data, 'base64');

    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw error;
    }
  }

  /**
   * Otimizar imagem (comprimir)
   */
  async otimizarImagem(imagePath, qualidade = 85) {
    try {
      const fullPath = path.join(this.uploadsDir, imagePath);
      
      const optimizedBuffer = await sharp(fullPath)
        .png({ quality: qualidade, compressionLevel: 9 })
        .toBuffer();

      await fs.writeFile(fullPath, optimizedBuffer);
      
      console.log('✅ Imagem otimizada');
      
      return imagePath;

    } catch (error) {
      console.error('Erro ao otimizar imagem:', error);
      return imagePath;
    }
  }

  /**
   * Redimensionar imagem
   */
  async redimensionarImagem(imagePath, width, height) {
    try {
      const fullPath = path.join(this.uploadsDir, imagePath);
      
      const resizedBuffer = await sharp(fullPath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .toBuffer();

      const resizedFilename = imagePath.replace('.png', `-${width}x${height}.png`);
      const resizedPath = path.join(this.uploadsDir, resizedFilename);
      
      await fs.writeFile(resizedPath, resizedBuffer);
      
      return resizedFilename;

    } catch (error) {
      console.error('Erro ao redimensionar imagem:', error);
      throw error;
    }
  }

  /**
   * Obter informações da imagem
   */
  async getImageInfo(imagePath) {
    try {
      const fullPath = path.join(this.uploadsDir, imagePath);
      const metadata = await sharp(fullPath).metadata();
      
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha
      };

    } catch (error) {
      console.error('Erro ao obter info da imagem:', error);
      throw error;
    }
  }

  /**
   * Criar thumbnail
   */
  async criarThumbnail(imagePath, tamanho = 300) {
    try {
      const fullPath = path.join(this.uploadsDir, imagePath);
      
      const thumbnailBuffer = await sharp(fullPath)
        .resize(tamanho, tamanho, {
          fit: 'cover',
          position: 'center'
        })
        .toBuffer();

      const thumbnailFilename = imagePath.replace('.png', '-thumb.png');
      const thumbnailPath = path.join(this.uploadsDir, thumbnailFilename);
      
      await fs.writeFile(thumbnailPath, thumbnailBuffer);
      
      return thumbnailFilename;

    } catch (error) {
      console.error('Erro ao criar thumbnail:', error);
      throw error;
    }
  }
}

module.exports = new ImageProcessingService();
