// ========================================
// CONFIGURAÇÃO DO BANCO DE DADOS - SQLite
// ========================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Caminho do banco de dados
const dbPath = path.join(__dirname, '../../data/abracos.db');

// Criar pasta de dados se não existir
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite em:', dbPath);
    }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

// Criar tabelas se não existirem
db.serialize(() => {
    // Tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            plano TEXT DEFAULT 'gratuito',
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela usuarios:', err);
        else console.log('✅ Tabela usuarios pronta');
    });

    // Tabela de imagens geradas
    db.run(`
        CREATE TABLE IF NOT EXISTS imagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            titulo TEXT,
            descricao TEXT,
            caminho_arquivo TEXT NOT NULL,
            tamanho_bytes INTEGER,
            tema TEXT,
            texto_principal TEXT,
            dedicatoria TEXT,
            fonte TEXT,
            tamanho_fonte TEXT,
            cor_texto TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela imagens:', err);
        else console.log('✅ Tabela imagens pronta');
    });

    // Tabela de pagamentos
    db.run(`
        CREATE TABLE IF NOT EXISTS pagamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            plano TEXT NOT NULL,
            valor DECIMAL(10, 2),
            status TEXT DEFAULT 'pendente',
            referencia_externa TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            confirmado_em DATETIME,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela pagamentos:', err);
        else console.log('✅ Tabela pagamentos pronta');
    });

    // Tabela de logs
    db.run(`
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            acao TEXT NOT NULL,
            detalhes TEXT,
            ip_address TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela logs:', err);
        else console.log('✅ Tabela logs pronta');
    });
});

module.exports = db;
