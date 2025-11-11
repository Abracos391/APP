const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'gerador-abracos.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Inicializando banco de dados...\n');

// Criar tabelas
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      whatsapp TEXT NOT NULL,
      senha TEXT NOT NULL,
      tipo_conta TEXT DEFAULT 'gratuito',
      creditos_gratuitos INTEGER DEFAULT 8,
      creditos_premium INTEGER DEFAULT 0,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      ultimo_reset_gratuito DATE DEFAULT CURRENT_DATE,
      ativo INTEGER DEFAULT 1
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela usuarios:', err.message);
    } else {
      console.log('✅ Tabela usuarios criada');
    }
  });

  // Tabela de pacotes comprados
  db.run(`
    CREATE TABLE IF NOT EXISTS pacotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      quantidade_creditos INTEGER NOT NULL,
      valor REAL NOT NULL,
      status TEXT DEFAULT 'pendente',
      data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_confirmacao DATETIME,
      metodo_pagamento TEXT,
      transaction_id TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela pacotes:', err.message);
    } else {
      console.log('✅ Tabela pacotes criada');
    }
  });

  // Tabela de imagens geradas
  db.run(`
    CREATE TABLE IF NOT EXISTS imagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      categoria TEXT NOT NULL,
      background TEXT NOT NULL,
      cor_texto TEXT NOT NULL,
      tipo_mensagem TEXT NOT NULL,
      nome_destinatario TEXT,
      mensagem_adicional TEXT,
      url_imagem TEXT NOT NULL,
      tipo_credito TEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela imagens:', err.message);
    } else {
      console.log('✅ Tabela imagens criada');
    }
  });

  // Tabela de sessões (tokens)
  db.run(`
    CREATE TABLE IF NOT EXISTS sessoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_expiracao DATETIME NOT NULL,
      ativo INTEGER DEFAULT 1,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela sessoes:', err.message);
    } else {
      console.log('✅ Tabela sessoes criada');
    }
  });

  // Tabela de propagandas
  db.run(`
    CREATE TABLE IF NOT EXISTS propagandas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      tipo TEXT NOT NULL,
      posicao TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      url_destino TEXT,
      ativo INTEGER DEFAULT 1,
      data_inicio DATE,
      data_fim DATE,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela propagandas:', err.message);
    } else {
      console.log('✅ Tabela propagandas criada');
    }
  });

  // Criar índices para melhor performance
  db.run('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');
  db.run('CREATE INDEX IF NOT EXISTS idx_imagens_usuario ON imagens(usuario_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_pacotes_usuario ON pacotes(usuario_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes(token)');

  console.log('\n✅ Índices criados');
  console.log('\n🎉 Banco de dados inicializado com sucesso!');
});

db.close();
