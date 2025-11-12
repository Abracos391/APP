# 🔧 Backend - Gerador de Abraços

Backend completo com sistema de autenticação, banco de dados SQLite e gerenciamento de usuários e créditos.

## 📁 Estrutura

```
backend/
├── config/
│   ├── database.js           # Configuração do banco de dados
│   └── init-database.js      # Script de inicialização do BD
├── controllers/
│   └── authController.js     # Controlador de autenticação
├── middleware/
│   └── auth.js               # Middleware de autenticação JWT
├── models/
│   ├── Usuario.js            # Model de usuário
│   ├── Imagem.js             # Model de imagem
│   └── Pacote.js             # Model de pacote
├── routes/
│   └── auth.js               # Rotas de autenticação
├── utils/                    # Utilitários (vazio por enquanto)
├── .env.example              # Exemplo de variáveis de ambiente
├── package.json              # Dependências do projeto
├── server.js                 # Servidor Express principal
└── README.md                 # Este arquivo
```

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 3. Inicializar banco de dados

```bash
npm run init-db
```

Este comando criará o banco de dados SQLite com todas as tabelas necessárias.

## ▶️ Executar

### Modo desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📡 API Endpoints

### Autenticação

#### POST `/api/auth/cadastro`
Cadastrar novo usuário

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "whatsapp": "(11) 98765-4321",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "mensagem": "Cadastro realizado com sucesso!",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "creditos_gratuitos": 8,
    "creditos_premium": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Fazer login

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "mensagem": "Login realizado com sucesso!",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "creditos_gratuitos": 8,
    "creditos_premium": 0,
    "tipo_conta": "gratuito"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/perfil`
Obter dados do usuário logado (requer autenticação)

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "whatsapp": "(11) 98765-4321",
    "creditos_gratuitos": 8,
    "creditos_premium": 0,
    "tipo_conta": "gratuito",
    "data_cadastro": "2024-11-11 10:30:00"
  }
}
```

#### GET `/api/auth/verificar`
Verificar se o token é válido (requer autenticação)

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "valido": true,
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

## 🗄️ Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

### Tabela: usuarios
- `id` - ID do usuário (chave primária)
- `nome` - Nome completo
- `email` - E-mail (único)
- `whatsapp` - Número do WhatsApp
- `senha` - Senha criptografada (bcrypt)
- `tipo_conta` - Tipo de conta (gratuito/premium/admin)
- `creditos_gratuitos` - Créditos gratuitos disponíveis
- `creditos_premium` - Créditos premium disponíveis
- `data_cadastro` - Data de cadastro
- `ultimo_reset_gratuito` - Data do último reset de créditos gratuitos
- `ativo` - Status da conta (1=ativo, 0=inativo)

### Tabela: pacotes
- `id` - ID do pacote
- `usuario_id` - ID do usuário (FK)
- `tipo` - Tipo do pacote
- `quantidade_creditos` - Quantidade de créditos
- `valor` - Valor pago
- `status` - Status do pagamento (pendente/confirmado/cancelado)
- `data_compra` - Data da compra
- `data_confirmacao` - Data de confirmação do pagamento
- `metodo_pagamento` - Método de pagamento utilizado
- `transaction_id` - ID da transação

### Tabela: imagens
- `id` - ID da imagem
- `usuario_id` - ID do usuário (FK)
- `categoria` - Categoria da imagem
- `background` - Fundo escolhido
- `cor_texto` - Cor do texto
- `tipo_mensagem` - Tipo de mensagem (personalizada/generica)
- `nome_destinatario` - Nome do destinatário (se personalizada)
- `mensagem_adicional` - Mensagem adicional
- `url_imagem` - URL da imagem gerada
- `tipo_credito` - Tipo de crédito usado (gratuito/premium)
- `data_criacao` - Data de criação

### Tabela: sessoes
- `id` - ID da sessão
- `usuario_id` - ID do usuário (FK)
- `token` - Token JWT
- `data_criacao` - Data de criação
- `data_expiracao` - Data de expiração
- `ativo` - Status da sessão

### Tabela: propagandas
- `id` - ID da propaganda
- `titulo` - Título da propaganda
- `tipo` - Tipo (banner/carrossel)
- `posicao` - Posição (topo/lateral/rodape)
- `conteudo` - Conteúdo HTML/texto
- `url_destino` - URL de destino
- `ativo` - Status (1=ativo, 0=inativo)
- `data_inicio` - Data de início
- `data_fim` - Data de fim
- `data_criacao` - Data de criação

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é gerado no login/cadastro e deve ser enviado no header `Authorization` como `Bearer {token}` em todas as requisições protegidas.

**Expiração do token:** 7 dias

## 💳 Sistema de Créditos

- **Créditos gratuitos:** 8 por mês (resetam automaticamente)
- **Créditos premium:** Comprados em pacotes de 20 por R$ 25,00
- **Prioridade:** Sistema usa créditos premium primeiro, depois gratuitos

## 🔄 Reset Mensal

O sistema verifica automaticamente se passaram 30 dias desde o último reset e recarrega os 8 créditos gratuitos.

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite3** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso
- **dotenv** - Variáveis de ambiente

## 📝 Próximos Passos

Esta é a primeira entrega do backend. As próximas entregas incluirão:

1. ✅ Sistema de autenticação e banco de dados (ENTREGUE)
2. 🔄 Integração com APIs (OpenAI + Stability AI)
3. 🔄 Sistema de geração de imagens
4. 🔄 Sistema de pagamento
5. 🔄 Painel administrativo
6. 🔄 Funcionalidades extras

## 🧪 Testando a API

Você pode testar a API usando ferramentas como:
- **Postman**
- **Insomnia**
- **cURL**
- **Thunder Client** (extensão VS Code)

Exemplo com cURL:

```bash
# Cadastrar usuário
curl -X POST http://localhost:3000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com","whatsapp":"11987654321","senha":"senha123"}'

# Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"senha123"}'

# Ver perfil (substitua {TOKEN} pelo token recebido)
curl -X GET http://localhost:3000/api/auth/perfil \
  -H "Authorization: Bearer {TOKEN}"
```

## 📞 Suporte

Este backend está pronto para uso e integração com o frontend. As próximas partes serão entregues incrementalmente.
