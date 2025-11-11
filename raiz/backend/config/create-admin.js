const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'gerador-abracos.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Criando usuário administrador...\n');

// Dados do admin
const adminData = {
  nome: 'Administrador',
  email: 'admin@geradordeabracos.com',
  whatsapp: '00000000000',
  senha: 'admin123', // MUDE ISSO EM PRODUÇÃO!
  tipo_conta: 'admin'
};

// Hash da senha
const senhaHash = bcrypt.hashSync(adminData.senha, 10);

// Verificar se admin já existe
db.get('SELECT * FROM usuarios WHERE email = ?', [adminData.email], (err, row) => {
  if (err) {
    console.error('❌ Erro ao verificar admin:', err.message);
    db.close();
    return;
  }

  if (row) {
    console.log('⚠️  Usuário admin já existe!');
    console.log(`📧 Email: ${adminData.email}`);
    console.log('💡 Use este email para fazer login como admin\n');
    db.close();
    return;
  }

  // Criar admin
  db.run(
    `INSERT INTO usuarios (nome, email, whatsapp, senha, tipo_conta, creditos_gratuitos, creditos_premium)
     VALUES (?, ?, ?, ?, ?, 0, 0)`,
    [adminData.nome, adminData.email, adminData.whatsapp, senhaHash, adminData.tipo_conta],
    function(err) {
      if (err) {
        console.error('❌ Erro ao criar admin:', err.message);
      } else {
        console.log('✅ Usuário administrador criado com sucesso!\n');
        console.log('📋 Credenciais de acesso:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Senha: ${adminData.senha}`);
        console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');
      }
      db.close();
    }
  );
});
