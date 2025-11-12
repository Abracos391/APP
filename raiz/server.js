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

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Servir arquivos de upload (imagens geradas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/imagens', require('./routes/imagens'));
app.use('/api/processamento', require('./routes/processamento'));
app.use('/api/pagamento', require('./routes/pagamento'));
app.use('/api/admin', require('./routes/admin'));

// Rota de teste da API
app.get('/api', (req, res) => {
  res.json({ 
    mensagem: '💌 Bem-vindo ao Gerador de Abraços API',
    versao: '1.0.0',
    status: 'online'
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Servir index.html para a rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir cadastro.html
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

// Tratamento de erros 404 para rotas de API
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    erro: 'Rota de API não encontrada' 
  });
});

// Para outras rotas, servir o index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n✅ Aplicação consolidada - Frontend e Backend juntos!`);
  console.log(`\n📄 Páginas:`);
  console.log(`   GET  / - Página principal (criar imagens)`);
  console.log(`   GET  /cadastro - Página de cadastro/login`);
  console.log(`\n🔌 API Endpoints:`);
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
