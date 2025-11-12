const db = require('../config/database');

class Pacote {
  // Criar registro de compra de pacote
  static async criar(usuarioId, tipo, quantidadeCreditos, valor, metodoPagamento = null) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO pacotes (
          usuario_id, tipo, quantidade_creditos, valor, metodo_pagamento
        ) VALUES (?, ?, ?, ?, ?)
      `;

      db.run(sql, [usuarioId, tipo, quantidadeCreditos, valor, metodoPagamento], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            usuario_id: usuarioId,
            tipo,
            quantidade_creditos: quantidadeCreditos,
            valor,
            status: 'pendente'
          });
        }
      });
    });
  }

  // Confirmar pagamento
  static async confirmarPagamento(pacoteId, transactionId) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE pacotes 
        SET status = 'confirmado', 
            data_confirmacao = CURRENT_TIMESTAMP,
            transaction_id = ?
        WHERE id = ?
      `;
      
      db.run(sql, [transactionId, pacoteId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  // Buscar pacote por ID
  static async buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM pacotes WHERE id = ?';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Buscar pacotes por usuário
  static async buscarPorUsuario(usuarioId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM pacotes 
        WHERE usuario_id = ? 
        ORDER BY data_compra DESC
      `;
      
      db.all(sql, [usuarioId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Listar todos os pacotes (admin)
  static async listarTodos(limite = 100) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, u.nome, u.email 
        FROM pacotes p
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.data_compra DESC
        LIMIT ?
      `;
      
      db.all(sql, [limite], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Estatísticas de vendas
  static async estatisticas() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_vendas,
          SUM(valor) as receita_total,
          SUM(CASE WHEN status = 'confirmado' THEN valor ELSE 0 END) as receita_confirmada,
          SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as receita_pendente
        FROM pacotes
      `;
      
      db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Cancelar pacote
  static async cancelar(pacoteId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE pacotes SET status = "cancelado" WHERE id = ?';
      
      db.run(sql, [pacoteId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
}

module.exports = Pacote;
