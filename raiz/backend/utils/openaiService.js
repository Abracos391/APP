const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  /**
   * Gerar prompt criativo para geração de imagem
   * @param {Object} dados - Dados da imagem (categoria, tipo_mensagem, nome_destinatario, etc)
   * @returns {Promise<string>} - Prompt otimizado para Stability AI
   */
  async gerarPrompt(dados) {
    try {
      const { categoria, tipo_mensagem, nome_destinatario, mensagem_adicional, cor_texto, background } = dados;

      // Construir contexto para o ChatGPT
      let contexto = `Você é um especialista em criar prompts para geração de imagens de saudações e mensagens especiais.

Crie um prompt detalhado em inglês para gerar uma imagem de ${this.getCategoriaDescricao(categoria)}.

Especificações:
- Tipo: ${tipo_mensagem === 'personalizada' ? `Mensagem personalizada para ${nome_destinatario}` : 'Mensagem genérica'}
- Estilo visual: ${this.getBackgroundDescricao(background)}
- Cor do texto: ${cor_texto}
${mensagem_adicional ? `- Mensagem adicional: ${mensagem_adicional}` : ''}

O prompt deve:
1. Descrever uma cena acolhedora e emotiva
2. Incluir elementos visuais relacionados à categoria
3. Especificar o estilo artístico (aquarela, digital art, etc)
4. Mencionar a paleta de cores
5. Incluir o texto principal da mensagem
6. Ser otimizado para Stability AI

Retorne APENAS o prompt em inglês, sem explicações adicionais.`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em criar prompts para geração de imagens. Sempre responda em inglês com prompts detalhados e otimizados.'
            },
            {
              role: 'user',
              content: contexto
            }
          ],
          temperature: 0.8,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const prompt = response.data.choices[0].message.content.trim();
      console.log('✅ Prompt gerado pelo ChatGPT:', prompt);
      
      return prompt;

    } catch (error) {
      console.error('❌ Erro ao gerar prompt com OpenAI:', error.response?.data || error.message);
      
      // Fallback: retornar prompt básico se a API falhar
      return this.gerarPromptFallback(dados);
    }
  }

  /**
   * Gerar prompt básico como fallback
   */
  gerarPromptFallback(dados) {
    const { categoria, tipo_mensagem, nome_destinatario, cor_texto } = dados;
    
    const templates = {
      bomdia: `Beautiful good morning greeting card with sunrise, flowers, warm colors, ${cor_texto} elegant text saying "Good Morning${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", watercolor style, soft lighting, peaceful atmosphere`,
      
      boatarde: `Warm good afternoon greeting card with sunset colors, gentle clouds, ${cor_texto} text saying "Good Afternoon${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", digital art, cozy feeling`,
      
      boanoite: `Peaceful good night greeting card with moon, stars, dreamy atmosphere, ${cor_texto} text saying "Good Night${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", soft colors, calming mood`,
      
      aniversario: `Festive birthday celebration card with balloons, confetti, cake, vibrant colors, ${cor_texto} text saying "Happy Birthday${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", joyful atmosphere, party decorations`,
      
      natal: `Christmas greeting card with decorated tree, snowflakes, presents, warm lights, ${cor_texto} text saying "Merry Christmas${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", festive red and green colors, cozy winter scene`,
      
      pascoa: `Easter greeting card with colorful eggs, spring flowers, bunny, pastel colors, ${cor_texto} text saying "Happy Easter${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", cheerful spring atmosphere`,
      
      diadasmaes: `Mother's Day card with beautiful flowers, hearts, warm pink tones, ${cor_texto} elegant text saying "Happy Mother's Day${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", loving atmosphere, delicate design`,
      
      diadospais: `Father's Day card with strong elegant design, blue tones, ${cor_texto} text saying "Happy Father's Day${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", respectful atmosphere`,
      
      anonovo: `New Year celebration card with fireworks, champagne, clock at midnight, golden colors, ${cor_texto} text saying "Happy New Year${tipo_mensagem === 'personalizada' ? ` ${nome_destinatario}` : ''}", festive atmosphere, celebration mood`,
      
      generica: `Beautiful greeting card with flowers, soft colors, elegant design, ${cor_texto} text with warm message${tipo_mensagem === 'personalizada' ? ` for ${nome_destinatario}` : ''}, peaceful atmosphere, artistic style`
    };

    return templates[categoria] || templates.generica;
  }

  /**
   * Obter descrição da categoria
   */
  getCategoriaDescricao(categoria) {
    const descricoes = {
      bomdia: 'bom dia',
      boatarde: 'boa tarde',
      boanoite: 'boa noite',
      aniversario: 'aniversário',
      natal: 'Natal',
      pascoa: 'Páscoa',
      diadasmaes: 'Dia das Mães',
      diadospais: 'Dia dos Pais',
      anonovo: 'Ano Novo',
      generica: 'mensagem genérica'
    };
    return descricoes[categoria] || 'saudação';
  }

  /**
   * Obter descrição do background
   */
  getBackgroundDescricao(background) {
    const descricoes = {
      carta1: 'carta postal vintage',
      carta2: 'carta elegante',
      postal1: 'cartão postal clássico',
      postal2: 'cartão postal moderno',
      natal1: 'cartão de Natal tradicional',
      natal2: 'cartão de Natal moderno',
      aniversario1: 'cartão de aniversário festivo',
      aniversario2: 'cartão de aniversário elegante'
    };
    return descricoes[background] || 'cartão especial';
  }
}

module.exports = new OpenAIService();
