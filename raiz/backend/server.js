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

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/imagens', require('./routes/imagens'));
app.use('/api/processamento', require('./routes/processamento'));
app.use('/api/pagamento', require('./routes/pagamento'));
app.use('/api/admin', require('./routes/admin'));

// ==============================
// 🔹 SERVIR FRONTEND (build do React, Vue etc.)
// ==============================
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Rota coringa: envia index.html para qualquer rota que não comece com /api
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ erro: 'Rota não encontrada' });
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

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
