# ⚡ Guia de Início Rápido

Configure e execute o Gerador de Abraços em 5 minutos!

## 🚀 Instalação Rápida

### 1. Instalar Dependências (2 min)

```bash
cd gerador-de-abracos/backend
npm install
```

### 2. Configurar Ambiente (1 min)

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas chaves de API
nano .env  # ou use seu editor favorito
```

**Mínimo necessário no .env:**
```env
OPENAI_API_KEY=sua_chave_openai
STABILITY_API_KEY=sua_chave_stability
JWT_SECRET=qualquer_string_secreta_aqui
```

### 3. Inicializar Banco (30 seg)

```bash
npm run init-db
npm run create-admin
```

### 4. Iniciar Servidor (30 seg)

```bash
npm run dev
```

✅ **Backend rodando em:** `http://localhost:3000`

### 5. Abrir Frontend (30 seg)

Em outro terminal:

```bash
cd gerador-de-abracos
python3 -m http.server 8080
```

✅ **Frontend disponível em:** `http://localhost:8080`

## 🎯 Teste Rápido

### Via Interface Web

1. Abra `http://localhost:8080/cadastro.html`
2. Cadastre-se com email e senha
3. Vá para `http://localhost:8080/index.html`
4. Escolha categoria, fundo, cor e mensagem
5. Clique em "Criar imagem"
6. Aguarde ~10 segundos
7. Baixe sua imagem!

### Via API (cURL)

```bash
# 1. Cadastrar
curl -X POST http://localhost:3000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","whatsapp":"11999999999","senha":"123456"}'

# 2. Login (copie o token da resposta)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","senha":"123456"}'

# 3. Gerar imagem (substitua {TOKEN})
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

## 🔑 Obter Chaves de API

### OpenAI (ChatGPT)

1. Acesse: https://platform.openai.com/api-keys
2. Faça login ou crie conta
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-proj-...`)
5. Cole no `.env` em `OPENAI_API_KEY`

💰 **Custo:** ~$0.03 por imagem

### Stability AI

1. Acesse: https://platform.stability.ai/account/keys
2. Faça login ou crie conta
3. Clique em "Create API Key"
4. Copie a chave (começa com `sk-...`)
5. Cole no `.env` em `STABILITY_API_KEY`

💰 **Custo:** ~$0.02 por imagem

## 👨‍💼 Acessar Painel Admin

### Credenciais Padrão

- **Email:** admin@geradordeabracos.com
- **Senha:** admin123

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@geradordeabracos.com","senha":"admin123"}'
```

### Ver Dashboard

```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

## 🐛 Problemas Comuns

### ❌ "Cannot find module"

**Solução:**
```bash
cd backend
npm install
```

### ❌ "Port 3000 already in use"

**Solução 1:** Mude a porta no `.env`
```env
PORT=3001
```

**Solução 2:** Mate o processo
```bash
lsof -ti:3000 | xargs kill -9
```

### ❌ "OpenAI API key not found"

**Solução:** Configure no `.env`
```env
OPENAI_API_KEY=sua_chave_aqui
```

### ❌ "CORS error"

**Solução:** Certifique-se que o backend está rodando e o CORS está habilitado (já configurado por padrão)

### ❌ Imagem não carrega

**Solução:** Verifique se a pasta `uploads` existe
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

## 📊 Estrutura de Arquivos Importantes

```
gerador-de-abracos/
├── backend/
│   ├── .env                    ← Configure aqui!
│   ├── server.js               ← Servidor principal
│   ├── package.json            ← Dependências
│   └── gerador-abracos.db      ← Banco (criado automaticamente)
│
├── cadastro.html               ← Abra no navegador
├── index.html                  ← Abra no navegador
└── README.md                   ← Documentação completa
```

## 📝 Próximos Passos

Depois de testar:

1. **Personalize o layout** - Edite arquivos CSS
2. **Adicione imagens de fundo** - Coloque em `images/`
3. **Configure pagamentos** - Veja `PAYMENT_SYSTEM.md`
4. **Deploy em produção** - Veja seção de deploy no README

## 🎓 Aprenda Mais

- [README Completo](README.md) - Documentação detalhada
- [API Integration](backend/API_INTEGRATION.md) - Como funcionam as APIs
- [Image Processing](backend/IMAGE_PROCESSING.md) - Processamento de imagens
- [Payment System](backend/PAYMENT_SYSTEM.md) - Sistema de pagamento
- [Admin Panel](backend/ADMIN_PANEL.md) - Painel administrativo

## 💡 Dicas

- **Desenvolvimento:** Use `npm run dev` (auto-reload)
- **Produção:** Use `npm start`
- **Logs:** Acompanhe o console para ver o que está acontecendo
- **Teste:** Use Postman ou Insomnia para testar a API
- **Debug:** Ative `NODE_ENV=development` para ver erros detalhados

## 🎉 Pronto!

Agora você tem o Gerador de Abraços funcionando localmente!

Crie suas primeiras imagens e explore todas as funcionalidades.

---

**Dúvidas?** Consulte o [README completo](README.md) ou abra uma issue no GitHub.
