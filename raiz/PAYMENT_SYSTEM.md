# 💳 Sistema de Pagamento

Documentação completa do sistema de pagamento e compra de pacotes premium.

## 📋 Visão Geral

O sistema permite que usuários comprem pacotes de créditos premium através de diferentes métodos de pagamento.

## 💰 Pacotes Disponíveis

### Pacote Premium - R$ 25,00

- **20 créditos premium**
- Sem marca d'água
- Qualidade máxima
- Download ilimitado
- Suporte prioritário

## 🔄 Fluxo de Compra

```
1. Usuário escolhe pacote
   ↓
2. Sistema cria pedido (status: pendente)
   ↓
3. Usuário realiza pagamento
   ↓
4. Gateway notifica via webhook
   ↓
5. Sistema confirma pagamento
   ↓
6. Créditos são adicionados
   ↓
7. Status muda para: confirmado
```

## 📡 API Endpoints

### GET `/api/pagamento/pacotes`

Listar pacotes disponíveis.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "pacotes": [
    {
      "id": "premium_20",
      "nome": "Pacote Premium",
      "descricao": "20 imagens personalizadas sem marca d'água",
      "creditos": 20,
      "valor": 25.00,
      "beneficios": [
        "Sem marca d'água",
        "Qualidade premium",
        "Download ilimitado",
        "Suporte prioritário"
      ]
    }
  ],
  "metodos_pagamento": [
    "pix",
    "cartao_credito",
    "cartao_debito",
    "boleto"
  ]
}
```

### POST `/api/pagamento/pedido`

Criar novo pedido de compra.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "tipo_pacote": "premium_20",
  "metodo_pagamento": "pix"
}
```

**Resposta (201):**
```json
{
  "mensagem": "Pedido criado com sucesso",
  "pedido": {
    "id": 1,
    "tipo": "premium_20",
    "descricao": "Pacote Premium - 20 imagens",
    "creditos": 20,
    "valor": 25.00,
    "status": "pendente",
    "metodo_pagamento": "pix"
  },
  "proximos_passos": {
    "mensagem": "Complete o pagamento usando o método escolhido",
    "webhook_url": "http://localhost:3000/api/pagamento/webhook",
    "confirmation_url": "http://localhost:3000/api/pagamento/confirmar/1"
  }
}
```

### POST `/api/pagamento/confirmar/:pacoteId`

Confirmar pagamento manualmente (para testes).

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "transaction_id": "TXN123456789"
}
```

**Resposta:**
```json
{
  "mensagem": "Pagamento confirmado com sucesso!",
  "pacote": {
    "id": 1,
    "tipo": "premium_20",
    "creditos_adicionados": 20,
    "valor_pago": 25.00
  },
  "creditos_atuais": {
    "gratuitos": 8,
    "premium": 20,
    "total": 28
  }
}
```

### GET `/api/pagamento/link/:pacoteId`

Gerar link de pagamento.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "mensagem": "Link de pagamento gerado",
  "link": "https://geradordeabracos.com/pagamento/1",
  "pacote": {
    "id": 1,
    "valor": 25.00,
    "creditos": 20
  },
  "expiracao": "24 horas"
}
```

### GET `/api/pagamento/historico`

Histórico de compras do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "total_compras": 3,
  "valor_total_gasto": 75.00,
  "compras": [
    {
      "id": 3,
      "tipo": "premium_20",
      "creditos": 20,
      "valor": 25.00,
      "status": "confirmado",
      "metodo_pagamento": "pix",
      "data_compra": "2024-11-11 10:30:00",
      "data_confirmacao": "2024-11-11 10:35:00"
    },
    {
      "id": 2,
      "tipo": "premium_20",
      "creditos": 20,
      "valor": 25.00,
      "status": "confirmado",
      "metodo_pagamento": "cartao_credito",
      "data_compra": "2024-11-10 15:20:00",
      "data_confirmacao": "2024-11-10 15:20:30"
    },
    {
      "id": 1,
      "tipo": "premium_20",
      "creditos": 20,
      "valor": 25.00,
      "status": "cancelado",
      "metodo_pagamento": "boleto",
      "data_compra": "2024-11-09 09:00:00",
      "data_confirmacao": null
    }
  ]
}
```

### DELETE `/api/pagamento/cancelar/:pacoteId`

Cancelar pedido pendente.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "mensagem": "Pedido cancelado com sucesso",
  "pacote_id": 1
}
```

### POST `/api/pagamento/webhook`

Webhook para receber notificações de pagamento (rota pública).

**Body:** Varia conforme o gateway de pagamento

**Resposta:**
```json
{
  "mensagem": "Webhook recebido"
}
```

## 🔌 Integração com Gateways

### Mercado Pago

```javascript
// Instalar SDK
npm install mercadopago

// Configurar
const mercadopago = require('mercadopago');
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Criar preferência de pagamento
const preference = {
  items: [
    {
      title: 'Pacote Premium - 20 imagens',
      unit_price: 25.00,
      quantity: 1
    }
  ],
  back_urls: {
    success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
    failure: `${process.env.FRONTEND_URL}/pagamento/falha`,
    pending: `${process.env.FRONTEND_URL}/pagamento/pendente`
  },
  notification_url: `${process.env.BACKEND_URL}/api/pagamento/webhook`
};

const response = await mercadopago.preferences.create(preference);
const linkPagamento = response.body.init_point;
```

### Stripe

```javascript
// Instalar SDK
npm install stripe

// Configurar
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Criar sessão de checkout
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'brl',
        product_data: {
          name: 'Pacote Premium - 20 imagens'
        },
        unit_amount: 2500 // em centavos
      },
      quantity: 1
    }
  ],
  mode: 'payment',
  success_url: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
  cancel_url: `${process.env.FRONTEND_URL}/pagamento/cancelado`,
  metadata: {
    pacote_id: pacoteId,
    usuario_id: usuarioId
  }
});

const linkPagamento = session.url;
```

## 🔐 Segurança

### Validações Implementadas

1. **Autenticação**: Token JWT obrigatório
2. **Autorização**: Usuário só acessa seus próprios pedidos
3. **Status**: Validação de status antes de ações
4. **Webhook**: Verificação de assinatura (a implementar)

### Webhook Security

```javascript
// Exemplo de verificação de assinatura (Mercado Pago)
const crypto = require('crypto');

function verificarWebhook(req) {
  const signature = req.headers['x-signature'];
  const dataId = req.body.data.id;
  
  const hash = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(dataId)
    .digest('hex');
  
  return hash === signature;
}
```

## 💾 Banco de Dados

### Tabela: pacotes

```sql
CREATE TABLE pacotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  quantidade_creditos INTEGER NOT NULL,
  valor REAL NOT NULL,
  status TEXT DEFAULT 'pendente',
  data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_confirmacao DATETIME,
  metodo_pagamento TEXT,
  transaction_id TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### Status Possíveis

- `pendente`: Aguardando pagamento
- `confirmado`: Pagamento confirmado, créditos adicionados
- `cancelado`: Pedido cancelado pelo usuário ou expirado

## 🧪 Testando Pagamentos

### Teste Manual

```bash
# 1. Criar pedido
curl -X POST http://localhost:3000/api/pagamento/pedido \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_pacote": "premium_20",
    "metodo_pagamento": "pix"
  }'

# 2. Confirmar pagamento (teste)
curl -X POST http://localhost:3000/api/pagamento/confirmar/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TEST123"
  }'

# 3. Verificar créditos
curl -X GET http://localhost:3000/api/auth/perfil \
  -H "Authorization: Bearer {token}"
```

### Teste de Webhook

```bash
curl -X POST http://localhost:3000/api/pagamento/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "12345"
    }
  }'
```

## 📊 Estatísticas

### Consultar Vendas (Admin)

```javascript
const estatisticas = await Pacote.estatisticas();

// Retorna:
{
  total_vendas: 150,
  receita_total: 3750.00,
  receita_confirmada: 3500.00,
  receita_pendente: 250.00
}
```

## 🔄 Fluxo Completo no Código

```javascript
// 1. Usuário cria pedido
const pedido = await Pacote.criar(usuarioId, 'premium_20', 20, 25.00, 'pix');

// 2. Sistema gera link de pagamento
const link = await gerarLinkPagamento(pedido.id);

// 3. Usuário paga

// 4. Gateway envia webhook
// POST /api/pagamento/webhook

// 5. Sistema confirma pagamento
await Pacote.confirmarPagamento(pedido.id, transactionId);

// 6. Adiciona créditos
await Usuario.atualizarCreditos(usuarioId, 'premium', 20);

// 7. Usuário recebe notificação
```

## 💡 Boas Práticas

### Para Produção

1. **Use HTTPS**: Sempre em produção
2. **Valide Webhooks**: Verifique assinaturas
3. **Log Transações**: Registre tudo
4. **Retry Logic**: Implemente retry para webhooks
5. **Timeout**: Configure timeouts adequados
6. **Idempotência**: Evite processar o mesmo pagamento 2x

### Segurança

```javascript
// Verificar se pagamento já foi processado
const pacote = await Pacote.buscarPorId(pacoteId);
if (pacote.status === 'confirmado') {
  return; // Já processado, ignorar
}

// Processar pagamento
await processarPagamento(pacote);
```

## 📝 Variáveis de Ambiente

Adicione no `.env`:

```env
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_chave_publica_aqui

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Webhook
WEBHOOK_SECRET=sua_chave_secreta_webhook
```

## 🚀 Próximos Passos

Melhorias futuras:

1. Implementar gateway real (Mercado Pago/Stripe)
2. Sistema de cupons de desconto
3. Planos de assinatura mensal
4. Programa de afiliados
5. Relatórios financeiros
6. Reembolsos automáticos

## 📞 Suporte

Para configurar gateways de pagamento:
- **Mercado Pago**: https://www.mercadopago.com.br/developers
- **Stripe**: https://stripe.com/docs
