# 🎨 Sistema de Processamento de Imagens

Documentação completa do sistema de processamento, marca d'água e QR Code.

## 📋 Visão Geral

O sistema de processamento é responsável por:

1. **Adicionar marca d'água** em imagens gratuitas
2. **Gerar e inserir QR Code** com link para o site
3. **Otimizar** imagens para web
4. **Redimensionar** imagens conforme necessário
5. **Criar thumbnails** para visualização rápida

## 🔧 Tecnologias Utilizadas

- **Sharp**: Processamento de imagens de alta performance
- **QRCode**: Geração de códigos QR

## 🎯 Fluxo de Processamento

### Imagens Gratuitas

```
Imagem gerada
    ↓
Adicionar marca d'água (texto)
    ↓
Adicionar QR Code (canto inferior direito)
    ↓
Salvar imagem processada
    ↓
Deletar imagem original
```

### Imagens Premium

```
Imagem gerada
    ↓
Sem processamento adicional
    ↓
Retornar imagem original
```

## 📝 Marca D'água

### Características

- **Texto**: "Criado por: Gerador de Abraços"
- **Posição**: Parte inferior central
- **Cor**: Branco com sombra
- **Fundo**: Barra semi-transparente preta
- **Tamanho**: Responsivo (baseado na largura da imagem)

### Implementação

```javascript
const watermarkSvg = `
  <svg width="${width}" height="${height}">
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
      Criado por: Gerador de Abraços
    </text>
  </svg>
`;
```

## 🔲 QR Code

### Características

- **Tamanho**: 120x120 pixels
- **Posição**: Canto inferior direito
- **Margem**: 20 pixels das bordas
- **Conteúdo**: URL do site
- **Cores**: Preto e branco

### Geração

```javascript
const qrCodeBuffer = await QRCode.toDataURL(url, {
  width: 200,
  margin: 1,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
});
```

## 📡 API Endpoints

### POST `/api/processamento/:imagemId/reprocessar`

Reprocessar uma imagem existente.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "tipoCredito": "premium"
}
```

**Resposta:**
```json
{
  "mensagem": "Imagem reprocessada com sucesso",
  "url": "/uploads/imagem-1699876543210-processed.png"
}
```

### POST `/api/processamento/:imagemId/thumbnail`

Criar thumbnail de uma imagem.

**Query Params:**
- `tamanho` (opcional): Tamanho do thumbnail em pixels (padrão: 300)

**Resposta:**
```json
{
  "mensagem": "Thumbnail criado com sucesso",
  "url": "/uploads/imagem-1699876543210-thumb.png"
}
```

### POST `/api/processamento/:imagemId/redimensionar`

Redimensionar uma imagem.

**Body:**
```json
{
  "width": 800,
  "height": 600
}
```

**Resposta:**
```json
{
  "mensagem": "Imagem redimensionada com sucesso",
  "url": "/uploads/imagem-1699876543210-800x600.png",
  "dimensoes": {
    "width": 800,
    "height": 600
  }
}
```

### GET `/api/processamento/:imagemId/info`

Obter informações técnicas da imagem.

**Resposta:**
```json
{
  "imagem": {
    "id": 1,
    "url": "/uploads/imagem-1699876543210.png",
    "categoria": "aniversario",
    "tipo_credito": "gratuito"
  },
  "metadata": {
    "width": 1024,
    "height": 1024,
    "format": "png",
    "size": 245678,
    "hasAlpha": true
  }
}
```

### POST `/api/processamento/qrcode`

Gerar QR Code standalone.

**Body:**
```json
{
  "url": "https://geradordeabracos.com"
}
```

**Resposta:**
Imagem PNG do QR Code (Content-Type: image/png)

## 🔄 Integração com Geração de Imagens

O processamento é automaticamente aplicado durante a geração:

```javascript
// No imagemController.js

// 1. Gerar imagem com Stability AI
let nomeArquivo = await stabilityService.gerarImagem(prompt);

// 2. Usar crédito
const tipoCredito = await Usuario.usarCredito(usuarioId);

// 3. Processar imagem (adicionar marca d'água se gratuito)
nomeArquivo = await imageProcessingService.processarImagem(nomeArquivo, tipoCredito);

// 4. Salvar no banco
await Imagem.criar({
  url_imagem: `/uploads/${nomeArquivo}`,
  tipo_credito: tipoCredito,
  ...
});
```

## 🎨 Funções Disponíveis

### processarImagem(imagePath, tipoCredito)

Processa a imagem adicionando marca d'água e QR Code se for gratuita.

```javascript
const nomeProcessado = await imageProcessingService.processarImagem(
  'imagem-123.png',
  'gratuito'
);
```

### gerarQRCode(url)

Gera um QR Code para uma URL.

```javascript
const qrCodeBuffer = await imageProcessingService.gerarQRCode(
  'https://geradordeabracos.com'
);
```

### otimizarImagem(imagePath, qualidade)

Otimiza e comprime a imagem.

```javascript
await imageProcessingService.otimizarImagem('imagem-123.png', 85);
```

### redimensionarImagem(imagePath, width, height)

Redimensiona a imagem mantendo proporções.

```javascript
const novoNome = await imageProcessingService.redimensionarImagem(
  'imagem-123.png',
  800,
  600
);
```

### criarThumbnail(imagePath, tamanho)

Cria um thumbnail quadrado da imagem.

```javascript
const thumbNome = await imageProcessingService.criarThumbnail(
  'imagem-123.png',
  300
);
```

### getImageInfo(imagePath)

Obtém metadados da imagem.

```javascript
const info = await imageProcessingService.getImageInfo('imagem-123.png');
// { width: 1024, height: 1024, format: 'png', size: 245678, hasAlpha: true }
```

## 🖼️ Exemplo Visual

### Imagem Gratuita (com marca d'água)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         CONTEÚDO DA IMAGEM          │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ Criado por: Gerador de Abraços  [QR]│
└─────────────────────────────────────┘
```

### Imagem Premium (sem marca d'água)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         CONTEÚDO DA IMAGEM          │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

## ⚙️ Configurações

Configure no arquivo `.env`:

```env
# URL do site para o QR Code
FRONTEND_URL=https://geradordeabracos.com
```

## 🔍 Logs

O sistema gera logs detalhados durante o processamento:

```
🎨 Processando imagem gratuita - adicionando marca d'água...
✅ Marca d'água e QR Code adicionados
```

Ou para imagens premium:

```
✨ Imagem premium - sem marca d'água
```

## 📊 Performance

### Sharp vs Outras Bibliotecas

Sharp é 4-5x mais rápido que ImageMagick e 10x mais rápido que Jimp:

- **Processamento**: ~200ms por imagem
- **Redimensionamento**: ~50ms
- **Thumbnail**: ~30ms
- **QR Code**: ~100ms

### Otimizações Implementadas

1. **Processamento em memória**: Evita I/O desnecessário
2. **Compressão inteligente**: Qualidade 85% (ótimo equilíbrio)
3. **Formato PNG otimizado**: Nível de compressão 9
4. **Remoção de imagem original**: Economiza espaço

## 🚨 Tratamento de Erros

Se o processamento falhar, o sistema:

1. Registra o erro no console
2. Retorna a imagem original sem processamento
3. Continua o fluxo normalmente

```javascript
try {
  return await processarImagem(path, tipo);
} catch (error) {
  console.error('Erro ao processar:', error);
  return path; // Retorna imagem original
}
```

## 🔐 Segurança

- Validação de permissões do usuário
- Sanitização de caminhos de arquivo
- Proteção contra path traversal
- Validação de tipos de arquivo

## 📝 Próximos Passos

Melhorias futuras:

1. Suporte a mais formatos (JPEG, WebP)
2. Filtros e efeitos adicionais
3. Marca d'água customizável
4. Batch processing
5. CDN integration

## 💡 Dicas de Uso

### Para Desenvolvedores

- Use thumbnails para listagens
- Otimize imagens antes de servir
- Cache imagens processadas
- Implemente lazy loading no frontend

### Para Usuários Premium

- Imagens sem marca d'água
- Qualidade máxima
- Download em múltiplos tamanhos
- Sem limite de processamento
