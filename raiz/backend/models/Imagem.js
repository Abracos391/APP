const db = require('../config/database');

class Imagem {
  // Criar registro de imagem
  static async criar(dados) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO imagens (
          usuario_id, categoria, background, cor_texto, 
          tipo_mensagem, nome_destinatario, mensagem_adicional, 
          url_imagem, tipo_credito
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        dados.usuario_id,
        dados.categoria,
        dados.background,
        dados.cor_texto,
        dados.tipo_mensagem,
        dados.nome_destinatario || null,
        dados.mensagem_adicional || null,
        dados.url_imagem,
        dados.tipo_credito
      ];

      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            ...dados
          });
        }
      });
    });
  }

  // Buscar imagens por usuário
  static async buscarPorUsuario(usuarioId, limite = 50) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM imagens 
        WHERE usuario_id = ? 
        ORDER BY data_criacao DESC 
        LIMIT ?
      `;
      
      db.all(sql, [usuarioId, limite], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Buscar imagem por ID
  static async buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM imagens WHERE id = ?';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Contar imagens por usuário
  static async contarPorUsuario(usuarioId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as total FROM imagens WHERE usuario_id = ?';
      
      db.get(sql, [usuarioId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.total);
        }
      });
    });
  }

  // Estatísticas de imagens
  static async estatisticas() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_imagens,
          COUNT(DISTINCT usuario_id) as total_usuarios,
          categoria,
          COUNT(*) as total_por_categoria
        FROM imagens
        GROUP BY categoria
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

  // Deletar imagem
  static async deletar(id, usuarioId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM imagens WHERE id = ? AND usuario_id = ?';
      
      db.run(sql, [id, usuarioId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
}

module.exports = Imagem;
