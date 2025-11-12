# 💌 Gerador de Abraços - Versão Consolidada para Render

Aplicativo web completo para criação de wallpapers e figurinhas personalizadas com IA, consolidado em uma única aplicação para deploy no Render.

## 📋 Sobre o Projeto

O **Gerador de Abraços** é um aplicativo web que permite aos usuários criar imagens personalizadas para diversas ocasiões (aniversários, bom dia, Natal, etc.) usando inteligência artificial.

### Características Principais

- 🎨 Geração de imagens com IA (Stability AI)
- 🤖 Prompts criativos via ChatGPT
- 💳 Sistema de créditos (gratuito + premium)
- 💰 Pagamentos integrados
- 👨‍💼 Painel administrativo completo
- 🖼️ Processamento de imagens (marca d'água + QR Code)
- 📱 Layout responsivo
- 🚀 **Frontend e Backend consolidados em um único servidor**

## 🏗️ Estrutura do Projeto

```
gerador-de-abracos-render/
├── public/                     # Frontend (HTML, CSS, JS, imagens)
│   ├── css/                    # Estilos CSS
│   ├── js/                     # Scripts JavaScript
│   ├── images/                 # Imagens de fundo
│   ├── assets/                 # Outros recursos
│   ├── index.html              # Página principal
│   └── cadastro.html           # Página de cadastro/login
│
├── config/                     # Configurações e banco de dados
├── controllers/                # Controladores da API
├── middleware/                 # Middlewares (auth, etc)
├── models/                     # Models do banco de dados
├── routes/                     # Rotas da API
├── utils/                      # Utilitários e serviços
├── uploads/                    # Imagens geradas
│
├── server.js                   # Servidor principal (Express)
├── package.json                # Dependências
├── render.yaml                 # Configuração do Render
└── README.md                   # Este arquivo
```

## 🚀 Instalação e Configuração Local

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chaves de API (OpenAI e Stability AI)

### Passo 1: Instalar Dependências

```bash
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_super_segura

# APIs
OPENAI_API_KEY=sk-proj-xxxxx
STABILITY_API_KEY=sk-xxxxx
```

### Passo 3: Inicializar Banco de Dados

```bash
npm run init-db
```

### Passo 4: Criar Usuário Administrador

```bash
npm run create-admin
```

### Passo 5: Iniciar Servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🌐 Deploy no Render

### Opção 1: Deploy via Dashboard do Render

1. Crie uma conta no [Render](https://render.com)
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: gerador-de-abracos
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (ou escolha outro)

5. Adicione as variáveis de ambiente:
   - `NODE_ENV`: production
   - `JWT_SECRET`: (gere uma chave segura)
   - `OPENAI_API_KEY`: sua chave OpenAI
   - `STABILITY_API_KEY`: sua chave Stability AI
   - `PAYMENT_API_KEY`: sua chave de pagamento (opcional)

6. Clique em "Create Web Service"

### Opção 2: Deploy via render.yaml

1. Faça push do projeto para o GitHub
2. No Render, selecione "New Blueprint Instance"
3. Conecte seu repositório
4. O Render detectará automaticamente o `render.yaml`
5. Configure as variáveis de ambiente secretas
6. Clique em "Apply"

### Configuração de Disco Persistente (Recomendado)

Para manter as imagens geradas após redeploys:

1. No dashboard do Render, vá em "Disks"
2. Crie um novo disco:
   - **Name**: gerador-de-abracos-data
   - **Mount Path**: /opt/render/project/src/uploads
   - **Size**: 1 GB (ou mais)

## 📡 Endpoints Disponíveis

### Páginas Web

- `GET /` - Página principal (criar imagens)
- `GET /cadastro` - Página de cadastro/login

### API - Autenticação

- `POST /api/auth/cadastro` - Cadastrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/perfil` - Ver perfil (autenticado)
- `GET /api/auth/verificar` - Verificar token (autenticado)

### API - Imagens

- `POST /api/imagens/gerar` - Gerar nova imagem (autenticado)
- `GET /api/imagens` - Listar imagens do usuário (autenticado)
- `GET /api/imagens/:id` - Buscar imagem específica (autenticado)
- `DELETE /api/imagens/:id` - Deletar imagem (autenticado)

### API - Processamento

- `POST /api/processamento/:id/reprocessar` - Reprocessar imagem
- `POST /api/processamento/:id/thumbnail` - Criar thumbnail
- `POST /api/processamento/:id/redimensionar` - Redimensionar
- `GET /api/processamento/:id/info` - Metadados
- `POST /api/processamento/qrcode` - Gerar QR Code

### API - Pagamento

- `GET /api/pagamento/pacotes` - Listar pacotes
- `POST /api/pagamento/pedido` - Criar pedido
- `POST /api/pagamento/confirmar/:id` - Confirmar pagamento
- `GET /api/pagamento/historico` - Histórico de compras
- `DELETE /api/pagamento/cancelar/:id` - Cancelar pedido

### API - Admin (requer permissão)

- `GET /api/admin/dashboard` - Dashboard
- `GET /api/admin/usuarios` - Listar usuários
- `GET /api/admin/usuarios/:id` - Detalhes do usuário
- `POST /api/admin/usuarios/:id/creditos` - Adicionar créditos
- `PATCH /api/admin/usuarios/:id/toggle` - Ativar/Desativar
- `GET /api/admin/vendas` - Listar vendas
- `GET /api/admin/relatorio/atividades` - Relatórios

## 💳 Sistema de Créditos

### Plano Gratuito

- **8 créditos por mês**
- Resetam automaticamente a cada 30 dias
- Imagens com marca d'água
- Imagens com QR Code

### Plano Premium

- **R$ 25,00 por 20 créditos**
- Sem marca d'água
- Qualidade máxima
- Compre quantos pacotes quiser

## 🎨 Categorias de Imagens

- Bom dia
- Boa tarde
- Boa noite
- Aniversário
- Natal
- Páscoa
- Dia das Mães
- Dia dos Pais
- Ano Novo
- Mensagem Genérica

## 🔧 Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia
- **Sharp** - Processamento de imagens
- **QRCode** - Geração de QR Codes
- **Axios** - Cliente HTTP

### Frontend

- **HTML5** - Estrutura
- **CSS3** - Estilos
- **JavaScript** - Interatividade (sem frameworks)

### APIs Externas

- **OpenAI (ChatGPT)** - Geração de prompts
- **Stability AI** - Geração de imagens

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Validação de inputs
- Proteção contra SQL injection
- CORS configurado
- Rate limiting (recomendado para produção)

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
npm install
```

### Erro: "EADDRINUSE: address already in use"

Mude a porta no `.env` ou mate o processo:

```bash
lsof -ti:3000 | xargs kill -9
```

### Erro: "OpenAI API key not found"

Configure a chave no arquivo `.env`:

```env
OPENAI_API_KEY=sua_chave_aqui
```

### Imagens não aparecem

Verifique se a pasta `uploads` existe e tem permissões corretas:

```bash
mkdir -p uploads
chmod 755 uploads
```

### Problemas no Render

1. Verifique os logs no dashboard do Render
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique se o disco persistente está montado corretamente

## 📚 Diferenças da Versão Original

Esta versão foi **consolidada** para rodar em um único servidor no Render, ao invés de ter frontend (Vercel) e backend (Render) separados:

### Mudanças Principais:

1. **Frontend movido para pasta `public/`**
   - Todos os arquivos HTML, CSS e JS agora estão em `public/`
   - Express serve os arquivos estáticos automaticamente

2. **URLs da API atualizadas**
   - JavaScript usa URLs relativas (`/api/...`)
   - Não precisa mais de CORS entre domínios diferentes
   - Variáveis `FRONTEND_URL` e `BACKEND_URL` removidas

3. **Servidor Express atualizado**
   - Serve tanto páginas web quanto API
   - Rotas organizadas: `/` para páginas, `/api/*` para API
   - Health check em `/health` para o Render

4. **Configuração simplificada**
   - Arquivo `render.yaml` para deploy automático
   - Menos variáveis de ambiente necessárias
   - Deploy mais simples e rápido

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Suporte

Para suporte, abra uma issue no GitHub.

## 🎉 Agradecimentos

- OpenAI pela API do ChatGPT
- Stability AI pela API de geração de imagens
- Render pela plataforma de hospedagem
- Comunidade open source

---

**Desenvolvido com 💕 para criar momentos especiais**
