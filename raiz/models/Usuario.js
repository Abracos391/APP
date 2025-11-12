const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  // Criar novo usuário
  static async criar(nome, email, whatsapp, senha) {
    return new Promise((resolve, reject) => {
      // Hash da senha
      const senhaHash = bcrypt.hashSync(senha, 10);

      const sql = `
        INSERT INTO usuarios (nome, email, whatsapp, senha, creditos_gratuitos)
        VALUES (?, ?, ?, ?, 8)
      `;

      db.run(sql, [nome, email, whatsapp, senhaHash], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            nome,
            email,
            whatsapp,
            creditos_gratuitos: 8,
            creditos_premium: 0
          });
        }
      });
    });
  }

  // Buscar usuário por email
  static async buscarPorEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM usuarios WHERE email = ? AND ativo = 1';
      
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Buscar usuário por ID
  static async buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM usuarios WHERE id = ? AND ativo = 1';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Verificar senha
  static async verificarSenha(senhaPlana, senhaHash) {
    return bcrypt.compareSync(senhaPlana, senhaHash);
  }

  // Atualizar créditos
  static async atualizarCreditos(usuarioId, tipo, quantidade) {
    return new Promise((resolve, reject) => {
      const campo = tipo === 'gratuito' ? 'creditos_gratuitos' : 'creditos_premium';
      const sql = `UPDATE usuarios SET ${campo} = ${campo} + ? WHERE id = ?`;
      
      db.run(sql, [quantidade, usuarioId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  // Usar crédito
  static async usarCredito(usuarioId) {
    return new Promise(async (resolve, reject) => {
      try {
        const usuario = await Usuario.buscarPorId(usuarioId);
        
        if (!usuario) {
          return reject(new Error('Usuário não encontrado'));
        }

        let tipoCredito = null;
        let sql = null;

        // Priorizar créditos premium
        if (usuario.creditos_premium > 0) {
          tipoCredito = 'premium';
          sql = 'UPDATE usuarios SET creditos_premium = creditos_premium - 1 WHERE id = ?';
        } else if (usuario.creditos_gratuitos > 0) {
          tipoCredito = 'gratuito';
          sql = 'UPDATE usuarios SET creditos_gratuitos = creditos_gratuitos - 1 WHERE id = ?';
        } else {
          return reject(new Error('Créditos insuficientes'));
        }

        db.run(sql, [usuarioId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(tipoCredito);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Resetar créditos gratuitos mensais
  static async resetarCreditosGratuitos(usuarioId) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE usuarios 
        SET creditos_gratuitos = 8, 
            ultimo_reset_gratuito = CURRENT_DATE 
        WHERE id = ?
      `;
      
      db.run(sql, [usuarioId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  // Verificar e resetar créditos se necessário
  static async verificarResetMensal(usuarioId) {
    return new Promise(async (resolve, reject) => {
      try {
        const usuario = await Usuario.buscarPorId(usuarioId);
        
        if (!usuario) {
          return reject(new Error('Usuário não encontrado'));
        }

        const hoje = new Date();
        const ultimoReset = new Date(usuario.ultimo_reset_gratuito);
        
        // Calcular diferença em dias
        const diffTime = Math.abs(hoje - ultimoReset);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Se passou 30 dias, resetar
        if (diffDays >= 30) {
          await Usuario.resetarCreditosGratuitos(usuarioId);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Listar todos os usuários (admin)
  static async listarTodos() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nome, email, whatsapp, tipo_conta, 
               creditos_gratuitos, creditos_premium, 
               data_cadastro, ativo
        FROM usuarios
        ORDER BY data_cadastro DESC
      `;
      
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Usuario;
