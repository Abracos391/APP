# 💌 Gerador de Abraços - Projeto Completo

Aplicativo web completo para criação de wallpapers e figurinhas personalizadas com IA.

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

## 🏗️ Estrutura do Projeto

```
gerador-de-abracos/
├── backend/                    # Backend Node.js + Express
│   ├── config/                 # Configurações e banco de dados
│   ├── controllers/            # Controladores da API
│   ├── middleware/             # Middlewares (auth, etc)
│   ├── models/                 # Models do banco de dados
│   ├── routes/                 # Rotas da API
│   ├── utils/                  # Utilitários e serviços
│   ├── uploads/                # Imagens geradas
│   ├── server.js               # Servidor principal
│   └── package.json            # Dependências
│
├── cadastro.html               # Página de cadastro
├── index.html                  # Página principal
├── css/                        # Estilos CSS
│   ├── style.css               # Estilos globais
│   ├── cadastro.css            # Estilos do cadastro
│   └── criar.css               # Estilos da criação
├── js/                         # Scripts JavaScript
│   ├── cadastro.js             # Script do cadastro
│   └── criar.js                # Script da criação
├── images/                     # Imagens de fundo
└── assets/                     # Outros recursos
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chaves de API (OpenAI e Stability AI)

### Passo 1: Instalar Dependências

```bash
cd backend
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

# URLs
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:3000
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

### Passo 6: Abrir Frontend

Abra o arquivo `cadastro.html` ou `index.html` em um navegador, ou use um servidor HTTP:

```bash
# Com Python
python3 -m http.server 8080

# Com Node.js (http-server)
npx http-server -p 8080
```

Acesse: `http://localhost:8080`

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/cadastro` - Cadastrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/perfil` - Ver perfil
- `GET /api/auth/verificar` - Verificar token

### Imagens

- `POST /api/imagens/gerar` - Gerar nova imagem
- `GET /api/imagens` - Listar imagens do usuário
- `GET /api/imagens/:id` - Buscar imagem específica
- `DELETE /api/imagens/:id` - Deletar imagem

### Processamento

- `POST /api/processamento/:id/reprocessar` - Reprocessar imagem
- `POST /api/processamento/:id/thumbnail` - Criar thumbnail
- `POST /api/processamento/:id/redimensionar` - Redimensionar
- `GET /api/processamento/:id/info` - Metadados
- `POST /api/processamento/qrcode` - Gerar QR Code

### Pagamento

- `GET /api/pagamento/pacotes` - Listar pacotes
- `POST /api/pagamento/pedido` - Criar pedido
- `POST /api/pagamento/confirmar/:id` - Confirmar pagamento
- `GET /api/pagamento/historico` - Histórico de compras
- `DELETE /api/pagamento/cancelar/:id` - Cancelar pedido

### Admin (requer permissão)

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
- **JavaScript** - Interatividade

### APIs Externas

- **OpenAI (ChatGPT)** - Geração de prompts
- **Stability AI** - Geração de imagens

## 📚 Documentação

- [Backend - Autenticação](backend/README.md)
- [Integração com APIs](backend/API_INTEGRATION.md)
- [Processamento de Imagens](backend/IMAGE_PROCESSING.md)
- [Sistema de Pagamento](backend/PAYMENT_SYSTEM.md)
- [Painel Administrativo](backend/ADMIN_PANEL.md)

## 🧪 Testes

### Teste Rápido da API

```bash
# 1. Cadastrar usuário
curl -X POST http://localhost:3000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@email.com",
    "whatsapp": "11999999999",
    "senha": "senha123"
  }'

# 2. Fazer login (copie o token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "senha": "senha123"
  }'

# 3. Gerar imagem (use o token)
curl -X POST http://localhost:3000/api/imagens/gerar \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "categoria": "bomdia",
    "background": "carta1",
    "cor_texto": "gold",
    "tipo_mensagem": "personalizada",
    "nome_destinatario": "Maria"
  }'
```

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Validação de inputs
- Proteção contra SQL injection
- CORS configurado
- Rate limiting (recomendado para produção)

## 📦 Deploy

### Preparação para Produção

1. **Altere variáveis de ambiente**:
   - Use senhas fortes
   - Configure URLs de produção
   - Use chaves API de produção

2. **Configure HTTPS**:
   - Use certificado SSL
   - Redirecione HTTP para HTTPS

3. **Otimizações**:
   - Habilite compressão gzip
   - Configure cache
   - Use CDN para imagens

4. **Monitoramento**:
   - Configure logs
   - Implemente health checks
   - Use ferramentas de monitoramento

### Opções de Deploy

- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Banco de Dados**: PostgreSQL (recomendado para produção)

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
mkdir -p backend/uploads
chmod 755 backend/uploads
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Gerador de Abraços Team**

## 📞 Suporte

Para suporte, envie um email para suporte@geradordeabracos.com ou abra uma issue no GitHub.

## 🎉 Agradecimentos

- OpenAI pela API do ChatGPT
- Stability AI pela API de geração de imagens
- Comunidade open source

---

**Desenvolvido com 💕 para criar momentos especiais**
