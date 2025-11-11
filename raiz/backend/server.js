cat > raiz/backend/server.js <<'EOF'
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

// Servir frontend estático (pasta public ao lado de backend)
app.use(express.static(path.join(__dirname, '../public')));

// Servir uploads (imagens geradas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas da API - carregamento seguro para não quebrar se arquivo faltar
const safeRequire = (file, mount) => {
  try {
    const router = require(file);
    app.use(mount, router);
    console.log(`Rota registrada: ${mount}`);
  } catch (err) {
    console.warn(`Rota não registrada (${mount}): ${err.message}`);
  }
};

safeRequire('./routes/auth', '/api/auth');
safeRequire('./routes/imagens', '/api/imagens');
safeRequire('./routes/processamento', '/api/processamento');
safeRequire('./routes/pagamento', '/api/pagamento');
safeRequire('./routes/admin', '/api/admin');

// Rota principal - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Start
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
EOF
