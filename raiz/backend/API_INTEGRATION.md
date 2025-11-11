# 🔌 Integração com APIs - Gerador de Abraços

Documentação completa da integração com OpenAI (ChatGPT) e Stability AI para geração de imagens personalizadas.

## 🎯 Fluxo de Geração de Imagens

O processo de geração de imagens segue 4 etapas:

```
1. ChatGPT gera prompt otimizado
   ↓
2. Stability AI gera a imagem
   ↓
3. Sistema debita crédito do usuário
   ↓
4. Imagem é salva e registro criado no banco
```

## 🤖 OpenAI (ChatGPT)

### Configuração

Adicione sua chave API no arquivo `.env`:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Funcionalidades

O serviço OpenAI (`utils/openaiService.js`) é responsável por:

- Gerar prompts criativos e otimizados para Stability AI
- Adaptar o prompt baseado na categoria escolhida
- Incluir detalhes sobre cores, estilo e mensagem
- Fornecer fallback com prompts pré-definidos se a API falhar

### Exemplo de Uso

```javascript
const openaiService = require('./utils/openaiService');

const prompt = await openaiService.gerarPrompt({
  categoria: 'aniversario',
  tipo_mensagem: 'personalizada',
  nome_destinatario: 'Maria',
  cor_texto: 'gold',
  background: 'aniversario1',
  mensagem_adicional: 'Que seu dia seja especial'
});

// Retorna algo como:
// "Festive birthday celebration card with balloons, confetti, birthday cake, 
//  vibrant colors, golden elegant text saying 'Happy Birthday Maria', 
//  joyful atmosphere, party decorations, watercolor style, warm lighting"
```

### Categorias Suportadas

- `bomdia` - Bom dia
- `boatarde` - Boa tarde
- `boanoite` - Boa noite
- `aniversario` - Aniversário
- `natal` - Natal
- `pascoa` - Páscoa
- `diadasmaes` - Dia das Mães
- `diadospais` - Dia dos Pais
- `anonovo` - Ano Novo
- `generica` - Mensagem genérica

### Fallback

Se a API do OpenAI falhar, o sistema automaticamente usa prompts pré-definidos para cada categoria, garantindo que a geração de imagens continue funcionando.

## 🎨 Stability AI

### Configuração

Adicione sua chave API no arquivo `.env`:

```env
STABILITY_API_KEY=sk-xxxxxxxxxxxxx
```

### Funcionalidades

O serviço Stability AI (`utils/stabilityService.js`) é responsável por:

- Gerar imagens a partir dos prompts
- Salvar imagens no formato PNG
- Gerenciar qualidade e resolução
- Verificar status e créditos da API

### Exemplo de Uso

```javascript
const stabilityService = require('./utils/stabilityService');

const nomeArquivo = await stabilityService.gerarImagem(
  'Beautiful good morning card with sunrise and flowers',
  {
    width: 1024,
    height: 1024,
    steps: 30,
    cfg_scale: 7
  }
);

// Retorna: "imagem-1699876543210.png"
```

### Parâmetros de Geração

- **width**: Largura da imagem (padrão: 1024px)
- **height**: Altura da imagem (padrão: 1024px)
- **steps**: Número de passos de difusão (padrão: 30)
  - Mais passos = melhor qualidade, mas mais lento
  - Recomendado: 20-50
- **cfg_scale**: Escala de orientação do prompt (padrão: 7)
  - Valores mais altos = mais fiel ao prompt
  - Recomendado: 5-15
- **samples**: Número de imagens a gerar (padrão: 1)

### Engine Utilizada

- **stable-diffusion-xl-1024-v1-0**: Engine principal
  - Resolução: até 1024x1024
  - Qualidade: Alta
  - Velocidade: Moderada

### Verificar Status

```javascript
const status = await stabilityService.verificarStatus();
console.log(status);
// { status: 'online', creditos: 25.5 }
```

## 📡 API Endpoint: Gerar Imagem

### POST `/api/imagens/gerar`

Gera uma nova imagem personalizada.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "categoria": "aniversario",
  "background": "aniversario1",
  "cor_texto": "gold",
  "tipo_mensagem": "personalizada",
  "nome_destinatario": "Maria",
  "mensagem_adicional": "Que seu dia seja especial"
}
```

**Resposta de Sucesso (201):**
```json
{
  "mensagem": "Imagem gerada com sucesso!",
  "imagem": {
    "id": 1,
    "url": "/uploads/imagem-1699876543210.png",
    "categoria": "aniversario",
    "tipo_credito": "gratuito",
    "tem_marca_dagua": true,
    "data_criacao": "2024-11-11T10:30:00.000Z"
  },
  "creditos_restantes": {
    "gratuitos": 7,
    "premium": 0,
    "total": 7
  }
}
```

**Resposta de Erro (403):**
```json
{
  "erro": "Créditos insuficientes. Compre mais créditos para continuar.",
  "creditos_gratuitos": 0,
  "creditos_premium": 0
}
```

## 🔄 Fluxo Completo no Controller

```javascript
// 1. Validar dados
if (!categoria || !background || !cor_texto) {
  return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
}

// 2. Verificar créditos
const usuario = await Usuario.buscarPorId(usuarioId);
if (usuario.creditos_gratuitos + usuario.creditos_premium <= 0) {
  return res.status(403).json({ erro: 'Créditos insuficientes' });
}

// 3. Gerar prompt com ChatGPT
const prompt = await openaiService.gerarPrompt(dados);

// 4. Gerar imagem com Stability AI
const nomeArquivo = await stabilityService.gerarImagem(prompt);

// 5. Debitar crédito
const tipoCredito = await Usuario.usarCredito(usuarioId);

// 6. Salvar no banco
const imagem = await Imagem.criar({
  usuario_id: usuarioId,
  url_imagem: `/uploads/${nomeArquivo}`,
  tipo_credito: tipoCredito,
  ...dados
});

// 7. Retornar resposta
res.status(201).json({ mensagem: 'Sucesso!', imagem });
```

## 💰 Custos Estimados

### OpenAI (GPT-4)
- ~$0.03 por prompt gerado
- ~500 tokens por requisição
- Alternativa: GPT-3.5-turbo (~$0.002 por prompt)

### Stability AI
- ~$0.02 por imagem (1024x1024, 30 steps)
- Créditos vendidos em pacotes
- 1 crédito = ~100 imagens

### Recomendação

Para reduzir custos em produção:
1. Use GPT-3.5-turbo ao invés de GPT-4
2. Reduza `steps` para 25 no Stability AI
3. Implemente cache de prompts similares
4. Use fallback de prompts pré-definidos

## 🛡️ Tratamento de Erros

Ambos os serviços possuem tratamento de erros robusto:

```javascript
try {
  const prompt = await openaiService.gerarPrompt(dados);
} catch (error) {
  // Usa prompt fallback pré-definido
  const prompt = openaiService.gerarPromptFallback(dados);
}

try {
  const imagem = await stabilityService.gerarImagem(prompt);
} catch (error) {
  // Retorna erro para o usuário
  throw new Error('Falha ao gerar imagem');
}
```

## 🧪 Testando as APIs

### Teste OpenAI

```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Teste Stability AI

```bash
curl -X GET https://api.stability.ai/v1/user/balance \
  -H "Authorization: Bearer $STABILITY_API_KEY"
```

## 📝 Logs

O sistema gera logs detalhados durante a geração:

```
🎨 Iniciando geração de imagem para usuário João Silva
💳 Créditos disponíveis: 8 gratuitos + 0 premium

📝 ETAPA 1: Gerando prompt com ChatGPT...
✅ Prompt gerado pelo ChatGPT: Beautiful birthday card...

🎨 ETAPA 2: Gerando imagem com Stability AI...
✅ Imagem gerada com sucesso: imagem-1699876543210.png

💳 ETAPA 3: Debitando crédito...
✅ Crédito gratuito usado

💾 ETAPA 4: Salvando registro no banco...
✅ Imagem gerada com sucesso!
```

## 🚀 Próximos Passos

Na próxima entrega, implementaremos:
- Aplicação de marca d'água em imagens gratuitas
- Geração de QR Code
- Processamento adicional de imagens
- Otimização e compressão

## 📞 Suporte

Para obter chaves de API:
- **OpenAI**: https://platform.openai.com/api-keys
- **Stability AI**: https://platform.stability.ai/account/keys
