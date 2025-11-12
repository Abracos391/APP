const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class StabilityService {
  constructor() {
    this.apiKey = process.env.STABILITY_API_KEY;
    this.baseURL = 'https://api.stability.ai/v1';
    this.engineId = 'stable-diffusion-xl-1024-v1-0';
  }

  /**
   * Gerar imagem usando Stability AI
   * @param {string} prompt - Prompt para geração da imagem
   * @param {Object} opcoes - Opções adicionais
   * @returns {Promise<string>} - Caminho do arquivo da imagem gerada
   */
  async gerarImagem(prompt, opcoes = {}) {
    try {
      const {
        width = 1024,
        height = 1024,
        steps = 30,
        cfg_scale = 7,
        samples = 1
      } = opcoes;

      console.log('🎨 Gerando imagem com Stability AI...');
      console.log('📝 Prompt:', prompt);

      const response = await axios.post(
        `${this.baseURL}/generation/${this.engineId}/text-to-image`,
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            {
              text: 'blurry, bad quality, distorted, ugly, low resolution, watermark',
              weight: -1
            }
          ],
          cfg_scale,
          height,
          width,
          steps,
          samples
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      if (response.data.artifacts && response.data.artifacts.length > 0) {
        const imageData = response.data.artifacts[0].base64;
        
        // Salvar imagem
        const filename = `imagem-${Date.now()}.png`;
        const filepath = path.join(__dirname, '..', 'uploads', filename);
        
        await fs.writeFile(filepath, Buffer.from(imageData, 'base64'));
        
        console.log('✅ Imagem gerada com sucesso:', filename);
        
        return filename;
      } else {
        throw new Error('Nenhuma imagem foi gerada pela API');
      }

    } catch (error) {
      console.error('❌ Erro ao gerar imagem com Stability AI:', error.response?.data || error.message);
      throw new Error('Falha ao gerar imagem: ' + (error.response?.data?.message || error.message));
    }
  }

  /**
   * Gerar imagem com fallback (imagem placeholder se API falhar)
   */
  async gerarImagemComFallback(prompt, opcoes = {}) {
    try {
      return await this.gerarImagem(prompt, opcoes);
    } catch (error) {
      console.log('⚠️ Usando imagem placeholder devido a erro na API');
      
      // Retornar URL de placeholder
      return `placeholder-${Date.now()}.png`;
    }
  }

  /**
   * Verificar status da API
   */
  async verificarStatus() {
    try {
      const response = await axios.get(`${this.baseURL}/user/balance`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        status: 'online',
        creditos: response.data.credits
      };
    } catch (error) {
      return {
        status: 'offline',
        erro: error.message
      };
    }
  }

  /**
   * Listar engines disponíveis
   */
  async listarEngines() {
    try {
      const response = await axios.get(`${this.baseURL}/engines/list`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao listar engines:', error.message);
      return [];
    }
  }
}

module.exports = new StabilityService();
