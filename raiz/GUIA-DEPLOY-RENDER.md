# 🚀 Guia de Deploy no Render - Gerador de Abraços

Este guia passo a passo vai te ajudar a fazer o deploy da aplicação Gerador de Abraços no Render.

## 📋 Pré-requisitos

Antes de começar, você precisa:

1. ✅ Conta no [GitHub](https://github.com)
2. ✅ Conta no [Render](https://render.com) (gratuita)
3. ✅ Chave da API OpenAI ([obter aqui](https://platform.openai.com/api-keys))
4. ✅ Chave da API Stability AI ([obter aqui](https://platform.stability.ai/account/keys))

## 🔑 Obtendo as Chaves de API

### OpenAI API Key

1. Acesse [OpenAI Platform](https://platform.openai.com)
2. Faça login ou crie uma conta
3. Vá em "API Keys" no menu lateral
4. Clique em "Create new secret key"
5. Copie a chave (começa com `sk-proj-...`)
6. **Importante**: Guarde essa chave em local seguro, ela só aparece uma vez!

### Stability AI API Key

1. Acesse [Stability AI](https://platform.stability.ai)
2. Faça login ou crie uma conta
3. Vá em "Account" → "API Keys"
4. Clique em "Create API Key"
5. Copie a chave (começa com `sk-...`)
6. **Importante**: Guarde essa chave em local seguro!

## 📤 Passo 1: Preparar o Código no GitHub

### 1.1 Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique no botão **"New"** (ou ícone **+** → **"New repository"**)
3. Preencha:
   - **Repository name**: `gerador-de-abracos`
   - **Description**: "Aplicação web para criação de imagens personalizadas com IA"
   - **Visibility**: Escolha **Public** ou **Private**
4. **NÃO** marque "Initialize this repository with a README"
5. Clique em **"Create repository"**

### 1.2 Fazer Upload do Código

Você tem duas opções:

#### Opção A: Via Interface Web (Mais Fácil)

1. No seu computador, abra a pasta `gerador-de-abracos-render`
2. Selecione **todos os arquivos e pastas** (exceto `node_modules` e `.env`)
3. Arraste e solte na página do repositório no GitHub
4. Adicione uma mensagem de commit: "Primeira versão da aplicação"
5. Clique em **"Commit changes"**

#### Opção B: Via Git (Linha de Comando)

```bash
# Na pasta gerador-de-abracos-render
git init
git add .
git commit -m "Primeira versão da aplicação"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gerador-de-abracos.git
git push -u origin main
```

## 🌐 Passo 2: Deploy no Render

### 2.1 Criar Web Service

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** (canto superior direito)
3. Selecione **"Web Service"**

### 2.2 Conectar Repositório

1. Clique em **"Connect account"** para conectar seu GitHub
2. Autorize o Render a acessar seus repositórios
3. Encontre o repositório `gerador-de-abracos` na lista
4. Clique em **"Connect"**

### 2.3 Configurar o Serviço

Preencha os campos:

- **Name**: `gerador-de-abracos` (ou outro nome de sua preferência)
- **Region**: Escolha a região mais próxima (ex: Oregon)
- **Branch**: `main`
- **Root Directory**: deixe em branco
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Selecione **"Free"** (ou outro plano se preferir)

### 2.4 Adicionar Variáveis de Ambiente

Role a página até a seção **"Environment Variables"** e adicione:

| Key | Value | Observação |
|-----|-------|------------|
| `NODE_ENV` | `production` | Ambiente de produção |
| `JWT_SECRET` | `[gere uma chave aleatória]` | Use um gerador de senhas forte |
| `OPENAI_API_KEY` | `sk-proj-...` | Sua chave OpenAI |
| `STABILITY_API_KEY` | `sk-...` | Sua chave Stability AI |

**Dica para gerar JWT_SECRET**: Use um gerador online como [RandomKeygen](https://randomkeygen.com/) ou execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Criar o Serviço

1. Revise todas as configurações
2. Clique em **"Create Web Service"**
3. Aguarde o deploy (pode levar 2-5 minutos)

## 📊 Passo 3: Configurar Disco Persistente (Recomendado)

Para que as imagens geradas não sejam perdidas após redeploys:

1. No dashboard do seu serviço, vá na aba **"Disks"**
2. Clique em **"Add Disk"**
3. Configure:
   - **Name**: `gerador-de-abracos-data`
   - **Mount Path**: `/opt/render/project/src/uploads`
   - **Size**: `1 GB` (ou mais, se necessário)
4. Clique em **"Create"**

**Nota**: Discos persistentes não estão disponíveis no plano gratuito. Se estiver usando o plano Free, as imagens serão perdidas a cada redeploy.

## 🗄️ Passo 4: Inicializar Banco de Dados

Após o primeiro deploy bem-sucedido:

1. No dashboard do Render, vá na aba **"Shell"**
2. Execute os comandos:

```bash
npm run init-db
npm run create-admin
```

3. Siga as instruções para criar o usuário administrador

## ✅ Passo 5: Testar a Aplicação

1. No dashboard, copie a URL do seu serviço (algo como `https://gerador-de-abracos.onrender.com`)
2. Abra a URL no navegador
3. Você deve ver a página principal do Gerador de Abraços
4. Teste:
   - Acesse `/cadastro` para criar uma conta
   - Faça login
   - Tente criar uma imagem

## 🔧 Configurações Opcionais

### Custom Domain (Domínio Personalizado)

1. Na aba **"Settings"** do seu serviço
2. Role até **"Custom Domain"**
3. Clique em **"Add Custom Domain"**
4. Siga as instruções para configurar seu domínio

### Auto-Deploy

Por padrão, o Render faz deploy automático quando você faz push para o GitHub. Para desabilitar:

1. Vá em **"Settings"**
2. Em **"Build & Deploy"**, desmarque **"Auto-Deploy"**

## 🐛 Troubleshooting (Resolução de Problemas)

### Deploy Falhou

1. Verifique os **logs** na aba "Logs"
2. Problemas comuns:
   - **"Module not found"**: Execute `npm install` localmente e faça commit do `package-lock.json`
   - **"Port already in use"**: Ignore, isso é normal no Render
   - **"API key not found"**: Verifique se adicionou todas as variáveis de ambiente

### Aplicação não abre

1. Verifique se o deploy foi concluído (status "Live" em verde)
2. Aguarde 1-2 minutos após o deploy
3. Limpe o cache do navegador (Ctrl+Shift+R)
4. Verifique os logs para erros

### Imagens não são geradas

1. Verifique se as chaves de API estão corretas
2. Confirme que tem créditos nas contas OpenAI e Stability AI
3. Verifique os logs para mensagens de erro específicas

### Banco de dados vazio

1. Execute `npm run init-db` no Shell do Render
2. Se já executou, o banco pode ter sido resetado em um redeploy
3. Considere usar um banco de dados externo (PostgreSQL) para produção

## 📈 Monitoramento

### Ver Logs

1. Vá na aba **"Logs"** do seu serviço
2. Você verá todos os logs em tempo real
3. Use para debugar problemas

### Métricas

1. Aba **"Metrics"** mostra:
   - CPU usage
   - Memory usage
   - Request count
   - Response time

### Health Check

O Render verifica automaticamente o endpoint `/health` para garantir que a aplicação está funcionando.

## 💰 Custos

### Plano Free
- ✅ Gratuito
- ⚠️ Aplicação "dorme" após 15 minutos de inatividade
- ⚠️ Pode levar 30-60 segundos para "acordar"
- ⚠️ 750 horas/mês de uso

### Plano Starter ($7/mês)
- ✅ Aplicação sempre ativa
- ✅ Sem tempo de "despertar"
- ✅ Suporte a discos persistentes
- ✅ Melhor performance

## 🔄 Atualizações Futuras

Para atualizar a aplicação:

1. Faça as alterações no código localmente
2. Faça commit e push para o GitHub
3. O Render fará deploy automático
4. Aguarde o deploy concluir

## 🎉 Pronto!

Sua aplicação está no ar! Agora você pode:

- Compartilhar o link com usuários
- Configurar um domínio personalizado
- Monitorar o uso e performance
- Adicionar mais funcionalidades

## 📞 Suporte

- **Documentação Render**: https://render.com/docs
- **Comunidade Render**: https://community.render.com
- **Suporte OpenAI**: https://help.openai.com
- **Suporte Stability AI**: https://platform.stability.ai/docs

---

**Boa sorte com seu projeto! 🚀💕**
