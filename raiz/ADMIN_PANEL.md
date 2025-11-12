# 👨‍💼 Painel Administrativo

Documentação completa do painel administrativo para gerenciamento do sistema.

## 📋 Visão Geral

O painel administrativo permite que administradores gerenciem usuários, vendas, créditos e visualizem estatísticas detalhadas do sistema.

## 🔐 Acesso

### Criar Usuário Admin

```bash
npm run create-admin
```

Este comando cria um usuário administrador com as seguintes credenciais padrão:

- **Email**: admin@geradordeabracos.com
- **Senha**: admin123

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

### Login como Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@geradordeabracos.com",
    "senha": "admin123"
  }'
```

O token retornado terá permissões de administrador.

## 🛡️ Proteção de Rotas

Todas as rotas administrativas requerem:

1. **Autenticação**: Token JWT válido
2. **Autorização**: `tipo_conta = 'admin'`

```javascript
// Middleware aplicado
router.use(auth);      // Verifica token
router.use(isAdmin);   // Verifica se é admin
```

## 📡 API Endpoints

### GET `/api/admin/dashboard`

Dashboard com estatísticas gerais do sistema.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Resposta:**
```json
{
  "usuarios": {
    "total": 150,
    "novos_hoje": 5
  },
  "imagens": {
    "total": 1250,
    "geradas_hoje": 45,
    "por_categoria": [
      { "categoria": "aniversario", "total": 350 },
      { "categoria": "bomdia", "total": 280 },
      { "categoria": "natal", "total": 220 }
    ]
  },
  "vendas": {
    "total": 75,
    "receita_total": 1875.00,
    "receita_confirmada": 1750.00,
    "receita_pendente": 125.00
  },
  "creditos": {
    "gratuitos_circulacao": 1200,
    "premium_circulacao": 850,
    "total_circulacao": 2050
  }
}
```

### GET `/api/admin/usuarios`

Listar todos os usuários do sistema.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Resposta:**
```json
{
  "total": 150,
  "usuarios": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "whatsapp": "11987654321",
      "tipo_conta": "gratuito",
      "creditos_gratuitos": 8,
      "creditos_premium": 0,
      "data_cadastro": "2024-11-01 10:30:00",
      "ativo": 1
    }
  ]
}
```

### GET `/api/admin/usuarios/:usuarioId`

Detalhes completos de um usuário específico.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Resposta:**
```json
{
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "whatsapp": "11987654321",
    "tipo_conta": "gratuito",
    "creditos_gratuitos": 8,
    "creditos_premium": 20,
    "data_cadastro": "2024-11-01 10:30:00",
    "ultimo_reset_gratuito": "2024-11-01",
    "ativo": 1
  },
  "estatisticas": {
    "total_imagens": 15,
    "total_compras": 2,
    "valor_gasto": 50.00
  },
  "ultimas_imagens": [
    {
      "id": 15,
      "categoria": "aniversario",
      "data_criacao": "2024-11-11 09:00:00"
    }
  ],
  "ultimas_compras": [
    {
      "id": 2,
      "tipo": "premium_20",
      "valor": 25.00,
      "status": "confirmado",
      "data_compra": "2024-11-10 15:00:00"
    }
  ]
}
```

### POST `/api/admin/usuarios/:usuarioId/creditos`

Adicionar créditos manualmente a um usuário.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "tipo": "premium",
  "quantidade": 10,
  "motivo": "Compensação por problema técnico"
}
```

**Resposta:**
```json
{
  "mensagem": "Créditos adicionados com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "creditos_gratuitos": 8,
    "creditos_premium": 30
  },
  "operacao": {
    "tipo": "premium",
    "quantidade": 10,
    "motivo": "Compensação por problema técnico"
  }
}
```

### PATCH `/api/admin/usuarios/:usuarioId/toggle`

Ativar ou desativar um usuário.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Resposta:**
```json
{
  "mensagem": "Usuário desativado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "ativo": 0
  }
}
```

### GET `/api/admin/vendas`

Listar todas as vendas do sistema.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Params:**
- `limite` (opcional): Número máximo de resultados (padrão: 100)

**Resposta:**
```json
{
  "total": 75,
  "vendas": [
    {
      "id": 75,
      "usuario": {
        "id": 45,
        "nome": "Maria Santos",
        "email": "maria@email.com"
      },
      "tipo": "premium_20",
      "creditos": 20,
      "valor": 25.00,
      "status": "confirmado",
      "metodo_pagamento": "pix",
      "data_compra": "2024-11-11 10:00:00",
      "data_confirmacao": "2024-11-11 10:05:00",
      "transaction_id": "TXN123456"
    }
  ]
}
```

### GET `/api/admin/relatorio/atividades`

Relatório de atividades do sistema.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Params:**
- `periodo`: 'dia', 'semana', 'mes' ou vazio (todos)

**Resposta:**
```json
{
  "periodo": "semana",
  "imagens_por_dia": [
    { "data": "2024-11-11", "total": 45 },
    { "data": "2024-11-10", "total": 52 },
    { "data": "2024-11-09", "total": 38 }
  ],
  "cadastros_por_dia": [
    { "data": "2024-11-11", "total": 5 },
    { "data": "2024-11-10", "total": 8 },
    { "data": "2024-11-09", "total": 3 }
  ],
  "vendas_por_dia": [
    { "data": "2024-11-11", "total": 3, "receita": 75.00 },
    { "data": "2024-11-10", "total": 5, "receita": 125.00 },
    { "data": "2024-11-09", "total": 2, "receita": 50.00 }
  ]
}
```

## 📊 Casos de Uso

### 1. Monitorar Sistema

```bash
# Ver dashboard geral
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer {admin_token}"
```

### 2. Gerenciar Usuário com Problema

```bash
# Ver detalhes do usuário
curl -X GET http://localhost:3000/api/admin/usuarios/123 \
  -H "Authorization: Bearer {admin_token}"

# Adicionar créditos de compensação
curl -X POST http://localhost:3000/api/admin/usuarios/123/creditos \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "premium",
    "quantidade": 5,
    "motivo": "Compensação por erro no sistema"
  }'
```

### 3. Desativar Usuário Abusivo

```bash
curl -X PATCH http://localhost:3000/api/admin/usuarios/456/toggle \
  -H "Authorization: Bearer {admin_token}"
```

### 4. Analisar Vendas

```bash
# Listar últimas 50 vendas
curl -X GET "http://localhost:3000/api/admin/vendas?limite=50" \
  -H "Authorization: Bearer {admin_token}"
```

### 5. Gerar Relatório Mensal

```bash
curl -X GET "http://localhost:3000/api/admin/relatorio/atividades?periodo=mes" \
  -H "Authorization: Bearer {admin_token}"
```

## 🎨 Interface Frontend (Sugestão)

### Dashboard

```
┌─────────────────────────────────────────────────────┐
│  📊 DASHBOARD - GERADOR DE ABRAÇOS                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👥 Usuários                                        │
│     Total: 150        Novos hoje: 5                │
│                                                     │
│  🖼️  Imagens                                        │
│     Total: 1.250      Geradas hoje: 45             │
│                                                     │
│  💰 Vendas                                          │
│     Total: 75         Receita: R$ 1.875,00         │
│                                                     │
│  🎫 Créditos em Circulação                         │
│     Gratuitos: 1.200  Premium: 850                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Lista de Usuários

```
┌─────────────────────────────────────────────────────┐
│  👥 USUÁRIOS (150)                    [+ Novo]      │
├──────┬──────────────┬───────────────┬──────────────┤
│ ID   │ Nome         │ Email         │ Créditos     │
├──────┼──────────────┼───────────────┼──────────────┤
│ 150  │ João Silva   │ joao@...      │ 8G + 20P     │
│ 149  │ Maria Santos │ maria@...     │ 5G + 0P      │
│ 148  │ Pedro Costa  │ pedro@...     │ 0G + 40P     │
└──────┴──────────────┴───────────────┴──────────────┘
```

## 🔒 Segurança

### Proteções Implementadas

1. **Autenticação obrigatória**: Token JWT
2. **Verificação de permissão**: Middleware `isAdmin`
3. **Logs de ações**: Todas as ações admin são logadas
4. **Validação de dados**: Inputs são validados

### Recomendações

1. **Senha forte**: Use senhas complexas para admins
2. **Rotação de tokens**: Implemente refresh tokens
3. **Auditoria**: Registre todas as ações em tabela separada
4. **2FA**: Implemente autenticação de dois fatores
5. **IP Whitelist**: Restrinja acesso por IP em produção

## 📝 Logs

O sistema gera logs para ações administrativas:

```
✅ Admin adicionou 10 créditos premium para João Silva (Compensação por erro)
```

## 🚀 Melhorias Futuras

1. **Auditoria completa**: Tabela de logs de todas as ações
2. **Filtros avançados**: Buscar usuários por critérios
3. **Exportação de dados**: CSV, Excel
4. **Gráficos**: Visualizações de dados
5. **Notificações**: Alertas para eventos importantes
6. **Backup automático**: Backup do banco de dados
7. **Configurações**: Painel de configurações do sistema

## 💡 Dicas

### Para Administradores

- Monitore o dashboard diariamente
- Verifique vendas pendentes regularmente
- Analise relatórios semanalmente
- Responda rapidamente a problemas de usuários

### Para Desenvolvedores

- Sempre valide permissões de admin
- Registre todas as ações importantes
- Implemente rate limiting
- Use transações para operações críticas

## 🧪 Testando

```bash
# 1. Criar banco de dados
npm run init-db

# 2. Criar usuário admin
npm run create-admin

# 3. Fazer login como admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@geradordeabracos.com","senha":"admin123"}'

# 4. Testar dashboard (use o token recebido)
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer {token}"
```

## 📞 Suporte

Para questões sobre o painel administrativo, consulte a documentação completa ou entre em contato com a equipe de desenvolvimento.
