// ========================================
// GERADOR DE ABRAÇOS - SERVIDOR DEFINITIVO
// Backend + Frontend Unificado
// Versão 2.0 - Otimizada
// ========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./backend/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES GLOBAIS
// ========================================

// CORS - permitir requisições
app.use(cors());

// Parser de JSON
app.use(express.json({ limit: '10mb' })); // Aumentado para suportar imagens base64

// Parser de URL encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Servir imagens geradas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log de requisições (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ========================================
// ROTAS DA API (Backend)
// ========================================

// Rota raiz da API - status
app.get('/api', (req, res) => {
    res.json({
        mensagem: '💌 Bem-vindo ao Gerador de Abraços API v2.0',
        versao: '2.0.0',
        status: 'online',
        features: {
            temas_predefinidos: true,
            texto_personalizado: true,
            arrastar_texto: true,
            cartoes_digitais: true,
            planos_premium: true
        }
    });
});

// Rotas de autenticação
app.use('/api/auth', require('./backend/routes/auth'));

// Rotas de imagens
app.use('/api/imagens', require('./backend/routes/imagens'));

// Rotas de processamento
app.use('/api/processamento', require('./backend/routes/processamento'));

// Rotas de pagamento
app.use('/api/pagamento', require('./backend/routes/pagamento'));

// Rotas administrativas
app.use('/api/admin', require('./backend/routes/admin'));

// ========================================
// ROTAS DO FRONTEND (Páginas HTML)
// ========================================

// Página de cadastro (rota principal)
app.get('/', (req, res) => {
    const cadastroPath = path.join(__dirname, 'public', 'cadastro.html');
    res.sendFile(cadastroPath, (err) => {
        if (err) {
            console.error('Erro ao servir cadastro.html:', err);
            res.status(404).send('Página não encontrada');
        }
    });
});

// Página de cadastro (explícita)
app.get('/cadastro', (req, res) => {
    const cadastroPath = path.join(__dirname, 'public', 'cadastro.html');
    res.sendFile(cadastroPath, (err) => {
        if (err) {
            console.error('Erro ao servir cadastro.html:', err);
            res.status(404).send('Página não encontrada');
        }
    });
});

// Página principal (criação de imagens)
app.get('/app', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Erro ao servir index.html:', err);
            res.status(404).send('Página não encontrada');
        }
    });
});

// Rota catch-all para SPA
app.get('*', (req, res) => {
    // Se for uma rota de API, retorna 404
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ erro: 'Endpoint não encontrado' });
    }
    
    // Se for um arquivo estático que não existe, retorna 404
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        return res.status(404).send('Arquivo não encontrado');
    }
    
    // Caso contrário, serve a página de cadastro
    const cadastroPath = path.join(__dirname, 'public', 'cadastro.html');
    res.sendFile(cadastroPath, (err) => {
        if (err) {
            res.status(404).send('Página não encontrada');
        }
    });
});

// ========================================
// TRATAMENTO DE ERROS
// ========================================

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    
    // Erro de JSON parsing
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ erro: 'JSON inválido' });
    }
    
    // Erro genérico
    res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  💌 GERADOR DE ABRAÇOS - Versão 2.0');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('✅ Rotas disponíveis:');
    console.log('');
    console.log('   📱 FRONTEND:');
    console.log('   GET  /                    → Página de cadastro');
    console.log('   GET  /cadastro            → Página de cadastro');
    console.log('   GET  /app                 → Página principal (criar imagens)');
    console.log('');
    console.log('   🔧 API - AUTENTICAÇÃO:');
    console.log('   POST /api/auth/cadastro   → Cadastrar usuário');
    console.log('   POST /api/auth/login      → Fazer login');
    console.log('   GET  /api/auth/perfil     → Ver perfil (autenticado)');
    console.log('');
    console.log('   🎨 API - IMAGENS:');
    console.log('   POST /api/imagens/gerar   → Gerar imagem (autenticado)');
    console.log('   GET  /api/imagens         → Listar imagens (autenticado)');
    console.log('   GET  /api/imagens/:id     → Buscar imagem específica');
    console.log('   DELETE /api/imagens/:id   → Deletar imagem');
    console.log('');
    console.log('   💰 API - PAGAMENTO:');
    console.log('   GET  /api/pagamento/pacotes    → Listar pacotes');
    console.log('   POST /api/pagamento/pedido     → Criar pedido');
    console.log('   POST /api/pagamento/confirmar  → Confirmar pagamento');
    console.log('');
    console.log('   👑 API - ADMIN:');
    console.log('   GET  /api/admin/dashboard → Dashboard (admin)');
    console.log('   GET  /api/admin/usuarios  → Listar usuários (admin)');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('✨ NOVIDADES VERSÃO 2.0:');
    console.log('   ✅ 40+ temas predefinidos organizados por categoria');
    console.log('   ✅ Usuário escreve o próprio texto (sem IA)');
    console.log('   ✅ Arrastar e posicionar texto (mouse + touch)');
    console.log('   ✅ 6 fontes, 4 tamanhos, 6 cores de texto');
    console.log('   ✅ Campo de dedicatória opcional');
    console.log('   ✅ Banner do patrocinador integrado');
    console.log('   ✅ Área protegida para propaganda');
    console.log('   ✅ Canvas HTML5 para edição');
    console.log('   ✅ Download direto do canvas');
    console.log('');
    console.log('💡 Frontend e Backend rodando juntos!');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
});

// Conectar ao banco de dados
db.serialize(() => {
    console.log('✅ Conectado ao banco de dados SQLite');
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
    console.log('SIGTERM recebido. Encerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT recebido. Encerrando servidor...');
    process.exit(0);
});

module.exports = app;
