require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (imagens geradas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas da API (uso try/catch para não quebrar a inicialização se algum arquivo faltar)
try { app.use('/api/auth', require('./routes/auth')); } catch (e) { console.warn('rota /api/auth não registrada:', e.message); }
try { app.use('/api/imagens', require('./routes/imagens')); } catch (e) { console.warn('rota /api/imagens não registrada:', e.message); }
try { app.use('/api/processamento', require('./routes/processamento')); } catch (e) { console.warn('rota /api/processamento não registrada:', e.message); }
try { app.use('/api/pagamento', require('./routes/pagamento')); } catch (e) { console.warn('rota /api/pagamento não registrada:', e.message); }
try { app.use('/api/admin', require('./routes/admin')); } catch (e) { console.warn('rota /api/admin não registrada:', e.message); }

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir frontend build (ajuste o nome se sua pasta for diferente)
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Rota coringa: se a rota começar com /api retorna 404 (foi tratada acima), caso contrário serve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ erro: 'Rota não encontrada' });
  }

  const indexFile = path.join(buildPath, 'index.html');
  return res.sendFile(indexFile, (err) => {
    if (err) {
      // Se index.html não existir (por exemplo, ainda não fez build), retorna boas-vindas JSON
      return res.status(200).json({
        mensagem: '💌 Bem-vindo ao Gerador de Abraços API',
        versao: '1.0.0',
        status: 'online'
      });
    }
  });
});

// Tratamento de erros 404 (fallback)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Rotas principais: /api/* e / (SPA)`);
});

module.exports = app;
}
try {
  app.use('/api/admin', require('./routes/admin'));
} catch (e) {
  console.warn('rota /api/admin não registrada:', e.message);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir frontend build (ajuste o nome da pasta se necessário)
// Espera-se: raiz/frontend/build/index.html
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Rota coringa: se for rota /api/* responde 404; caso contrário serve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ erro: 'Rota não encontrada' });
  }

  const indexFile = path.join(buildPath, 'index.html');
  // enviar index.html se existir, senão retornar uma mensagem simples
  return res.sendFile(indexFile, (err) => {
    if (err) {
      return res.status(200).json({
        mensagem: '💌 Bem-vindo ao Gerador de Abraços API',
        versao: '1.0.0',
        status: 'online'
      });
    }
  });
});

// Tratamento de erros 404 (fallback)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Rotas principais: /api/* e / (SPA)`);
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
  Estrutura esperada:
    raiz/
      backend/  <-- __dirname aqui
      frontend/ <-- build será frontend/build
*/
const buildPath = path.join(__dirname, '../frontend/build');

// Se existir o build, sirva os arquivos estáticos
app.use(express.static(buildPath));

// Rota coringa para servir index.html da SPA
app.get('*', (req, res) => {
  // Mantém comportamento das rotas /api/*
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ erro: 'Rota não encontrada' });
  }

  // Se não existir o arquivo index.html (ex.: ainda não fez build), responde com mensagem útil
  const indexFile = path.join(buildPath, 'index.html');
  return res.sendFile(indexFile, (err) => {
    if (err) {
      // Se não encontrou index.html, retorna informação simples (útil durante desenvolvimento)
      return res.status(200).json({
        mensagem: '💌 Bem-vindo ao Gerador de Abraços API',
        versao: '1.0.0',
        status: 'online'
      });
    }
  });
});

// Tratamento de erros 404 (para rotas não capturadas por /api e não SPA)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n✅ Rotas disponíveis:`);
  console.log(`   POST /api/auth/cadastro - Cadastrar usuário`);
  console.log(`   POST /api/auth/login - Fazer login`);
  console.log(`   GET  /api/auth/perfil - Ver perfil (autenticado)`);
  console.log(`   GET  /api/auth/verificar - Verificar token (autenticado)`);
  console.log(`   POST /api/imagens/gerar - Gerar imagem (autenticado)`);
  console.log(`   GET  /api/imagens - Listar imagens (autenticado)`);
  console.log(`   GET  /api/imagens/:id - Buscar imagem (autenticado)`);
  console.log(`   DELETE /api/imagens/:id - Deletar imagem (autenticado)`);
  console.log(`\n💡 Use Ctrl+C para parar o servidor\n`);
});

module.exports = app;

// ==============================
// 🔹 ROTAS DE TESTE E SAÚDE
// ==============================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ==============================
// 🔹 TRATAMENTO DE ERROS
// ==============================
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==============================
// 🔹 INICIAR SERVIDOR
// ==============================
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n✅ Rotas disponíveis:`);
  console.log(`   POST /api/auth/cadastro - Cadastrar usuário`);
  console.log(`   POST /api/auth/login - Fazer login`);
  console.log(`   GET  /api/auth/perfil - Ver perfil (autenticado)`);
  console.log(`   GET  /api/auth/verificar - Verificar token (autenticado)`);
  console.log(`   POST /api/imagens/gerar - Gerar imagem (autenticado)`);
  console.log(`   GET  /api/imagens - Listar imagens (autenticado)`);
  console.log(`   GET  /api/imagens/:id - Buscar imagem (autenticado)`);
  console.log(`   DELETE /api/imagens/:id - Deletar imagem (autenticado)`);
  console.log(`\n💡 Use Ctrl+C para parar o servidor\n`);
});

module.exports = app;
    timestamp: new Date().toISOString()
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ 
    erro: 'Rota não encontrada' 
  });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n✅ Rotas disponíveis:`);
  console.log(`   POST /api/auth/cadastro - Cadastrar usuário`);
  console.log(`   POST /api/auth/login - Fazer login`);
  console.log(`   GET  /api/auth/perfil - Ver perfil (autenticado)`);
  console.log(`   GET  /api/auth/verificar - Verificar token (autenticado)`);
  console.log(`   POST /api/imagens/gerar - Gerar imagem (autenticado)`);
  console.log(`   GET  /api/imagens - Listar imagens (autenticado)`);
  console.log(`   GET  /api/imagens/:id - Buscar imagem (autenticado)`);
  console.log(`   DELETE /api/imagens/:id - Deletar imagem (autenticado)`);
  console.log(`\n💡 Use Ctrl+C para parar o servidor\n`);
});

module.exports = app;
