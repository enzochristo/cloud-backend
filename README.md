# Demay Bank — Cloud Backend

Plataforma escalável de processamento de pagamentos construída na AWS.  
Projeto da disciplina **Computação em Nuvem — Insper 2026**.

---

## Links Rápidos

| Recurso | Link |
|---------|------|
| 🖥️ Frontend | `<!-- ADICIONAR LINK DO FRONTEND -->` |
| 🎥 Vídeo de Apresentação | `<!-- ADICIONAR LINK DO YOUTUBE -->` |
| 📊 Relatório de Testes de Carga | [Acessar](https://enzochristo.github.io/cloud-backend/) |

---

## Relatório do Projeto

<!-- Quando o PDF estiver pronto, faça upload para a pasta /docs do repositório e substitua a linha abaixo pelo link gerado -->

> 📎 O relatório técnico completo do projeto será disponibilizado em breve.

---

## Arquitetura

```mermaid
graph TB
    subgraph S3["☁️ S3"]
        CLIENT["🖥️ CLIENT\nFrontend"]
    end

    subgraph ECS["⚙️ ECS"]
        SERVER["SERVER\nNestJS"]
    end

    subgraph RDS["🗄️ RDS"]
        PG["POSTGRESQL"]
    end

    subgraph LAMBDA1["λ Lambda 1"]
        VAL["VALIDAÇÃO\nE PENDÊNCIA\nNO PAGAMENTO"]
    end

    subgraph SQS_BOX["📨 SQS"]
        FILA["FILA"]
    end

    subgraph LAMBDA2["λ Lambda 2"]
        PROC["TRANSAÇÃO FINANCEIRA\nATUALIZAÇÃO DO STATUS"]
    end

    CLIENT -->|ALB| SERVER
    SERVER -->|RDS| PG
    CLIENT -->|API GATEWAY| VAL
    VAL -->|enfileira| FILA
    FILA -->|enfileira| PROC
    PROC -->|RDS Proxy| PG
```

### Fluxo ECS — Gerenciamento de Usuários
```
Cliente → ALB (Load Balancer) → ECS (NestJS API) → RDS PostgreSQL
```

### Fluxo Assíncrono — Transações Financeiras
```
Cliente → API Gateway → Lambda 1 (validação + enfileiramento)
                      → SQS (fila) → Lambda 2 (processamento) → RDS PostgreSQL
```

---

## Banco de Dados

```mermaid
erDiagram
    User {
        int id PK
        string name
        string email
        string password
        decimal balance
    }

    Transfer {
        int id PK
        int senderId FK
        int recipientId FK
        decimal amount
        string status
        datetime createdAt
    }

    User ||--o{ Transfer : "envia"
    User ||--o{ Transfer : "recebe"
```

### Tabela `User`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `INT` PK | Identificador único |
| `name` | `VARCHAR` | Nome do usuário |
| `email` | `VARCHAR` UNIQUE | E-mail de acesso |
| `password` | `VARCHAR` | Senha |
| `balance` | `DECIMAL` | Saldo da conta |

### Tabela `Transfer`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `INT` PK | Identificador único |
| `senderId` | `INT` FK → User | Remetente |
| `recipientId` | `INT` FK → User | Destinatário |
| `amount` | `DECIMAL` | Valor da transferência |
| `status` | `VARCHAR` | `in_process` / `completed` / `refused` |
| `createdAt` | `TIMESTAMP` | Data de criação |

---

## Arquitetura do Código

O backend segue os princípios de **Arquitetura em Camadas Verticais** (Vertical Slice) combinados com **Clean Code**, organizando o código por domínio de negócio em vez de por tipo técnico.

### Camadas por módulo

```
user/
├── controller/   ← Recebe a requisição HTTP, valida input, delega para o service
├── service/      ← Contém a lógica de negócio (regras, orquestração)
├── repository/   ← Acesso ao banco de dados (abstração do Prisma)
├── entities/     ← Definição do modelo de dados e validações (class-validator)
└── dtos/         ← Objetos de transferência de dados (entrada/saída da API)
```

Cada módulo é **independente e coeso** — o módulo `user` não conhece o módulo `dashboard` e vice-versa. Isso reduz acoplamento e facilita evolução e testes isolados.

### Princípios aplicados

| Princípio | Aplicação |
|-----------|-----------|
| **Single Responsibility** | Cada classe tem uma única responsabilidade (Controller só roteia, Service só processa, Repository só persiste) |
| **Separation of Concerns** | Lógica de negócio separada da infraestrutura (banco, HTTP) |
| **Dependency Injection** | NestJS injeta as dependências automaticamente via construtores |
| **DTO Pattern** | Entradas e saídas da API são tipadas e validadas via DTOs separados da entidade |
| **Repository Pattern** | O acesso ao banco é abstraído — o Service nunca faz queries diretamente |

---

## Endpoints da API

Documentação Swagger disponível em `/api` após subir o servidor.

### Usuários — ECS via ALB

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check |
| `GET` | `/user` | Lista todos os usuários |
| `POST` | `/user/register` | Cadastra novo usuário |
| `POST` | `/user/login` | Autentica usuário |

### Transações — API Gateway → Lambda

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/transactions` | Cria e enfileira uma transação |

**Body:**
```json
{
  "id_sender": 1,
  "id_receptor": 2,
  "valor": 100.00
}
```

---

## Estrutura do Projeto

```
cloud-backend/
├── src/
│   ├── main.ts                           # Entry point (NestJS + Swagger)
│   ├── app.module.ts                     # Módulo raiz
│   ├── database/
│   │   └── prisma.service.ts             # Conexão com o banco via Prisma
│   ├── user/
│   │   ├── controller/user.controller.ts
│   │   ├── service/user.service.ts
│   │   ├── repository/user.repository.ts
│   │   ├── entities/user.entity.ts
│   │   └── dtos/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       └── user-response.dto.ts
│   └── dashboard/
│       ├── controller/transactions.controller.tsx
│       ├── service/transaction.service.tsx
│       ├── repository/transaction.repository.tsx
│       ├── entities/transactions.entities.tsx
│       └── dtos/transactions.dto.tsx
├── prisma/
│   └── schema.prisma                     # Schema do banco de dados
├── load-tests/
│   ├── demay-bank-load-test.jmx          # Plano de testes JMeter
│   └── relatorio/                        # Relatório técnico dos testes
└── .env                                  # Variáveis de ambiente (não versionado)
```

---

## Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/enzochristo/cloud-backend.git
cd cloud-backend
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/demaybank?schema=public"
PORT=3000
HOST=0.0.0.0
```

### 4. Subir o banco com Docker

```bash
docker run --name demay-bank-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=demaybank \
  -p 5432:5432 \
  -d postgres:15
```

### 5. Criar as tabelas

```bash
npx prisma db push
```

### 6. Iniciar o servidor

```bash
# Desenvolvimento (hot reload)
pnpm start:dev

# Produção
pnpm build && pnpm start:prod
```

### 7. Acessar

| Recurso | URL |
|---------|-----|
| API | `http://localhost:3000` |
| Swagger | `http://localhost:3000/api` |
| Health | `http://localhost:3000/health` |

---

## Infraestrutura AWS

| Serviço | Uso |
|---------|-----|
| **ECS Fargate** | Execução do servidor NestJS em container |
| **ALB** | Load balancer para o ECS |
| **API Gateway** | Exposição do endpoint de transações |
| **Lambda 1** | Validação e enfileiramento de transações |
| **Lambda 2** | Processamento assíncrono e atualização de status |
| **SQS** | Fila de mensagens entre Lambda 1 e Lambda 2 |
| **RDS PostgreSQL** | Banco de dados relacional |
| **RDS Proxy** | Pool de conexões para o banco |
| **Secrets Manager** | Credenciais do banco de dados |
| **S3 + CloudFront** | Hospedagem do frontend |

---

## Testes de Carga

Realizados com **Apache JMeter 5.6.3** contra o ambiente de produção AWS.

| Cenário | Threads | Requisições | Error % | Latência Média |
|---------|---------|-------------|---------|----------------|
| Health Check (Baseline) | 50 | 500 | 0% | 159ms |
| Login Simultâneo | 50 | 500 | 0,4% | 867ms |
| Transações Alta Escala | 100 | 1.000 | 0% | 963ms |
| Consultas Simultâneas | 150 | 3.000 | 0% | 680ms |
| Rajada (Burst) | 300 | 900 | 0% | 2.504ms |

**1.907 transações processadas de ponta a ponta** (API Gateway → Lambda → SQS → Lambda → RDS) sem nenhuma perda.

📄 [Ver relatório técnico completo](https://enzochristo.github.io/cloud-backend/)

---

## Licença

Projeto acadêmico — Insper 2026.
