# 🔔 Confi Notifications

Sistema de notificações escalável com arquitetura orientada a eventos, desenvolvido para gerenciar notificações baseadas em tópicos com processamento assíncrono.

## 📋 Sobre o Projeto

O **Confi Notifications** é uma API REST que implementa um sistema completo de notificações onde assinantes podem se inscrever em tópicos de interesse e receber notificações de forma assíncrona. A aplicação utiliza RabbitMQ para processamento em filas, garantindo alta disponibilidade e escalabilidade.

### Principais Funcionalidades

- **Gerenciamento de Tópicos**: Criação e organização de tópicos de notificação
- **Sistema de Assinaturas**: Inscrição de assinantes em tópicos específicos
- **Notificações**: Criação e envio de notificações para assinantes de um tópico
- **Processamento Assíncrono**: Utilização de filas RabbitMQ para processar notificações sem bloquear a API
- **Controle de Status**: Marcação de notificações como lidas, enviadas e deletadas
- **Busca e Filtros**: Consulta de notificações com filtros avançados

## 🛠️ Stack Tecnológica

- **Node.js** com **TypeScript** - Runtime e linguagem
- **Fastify** - Framework web de alta performance
- **MongoDB** - Banco de dados NoSQL
- **Prisma** - ORM para acesso ao banco de dados
- **RabbitMQ** - Message broker para processamento assíncrono
- **Zod** - Validação de schemas e tipos
- **Docker & Docker Compose** - Containerização

## 🏗️ Arquitetura e Decisões Técnicas

### Arquitetura Modular

O projeto segue uma arquitetura modular clara, facilitando manutenção e escalabilidade:

```
src/
├── core/                    # Código compartilhado
│   ├── errors/             # Tratamento de erros customizados
│   ├── providers/          # Provedores externos (RabbitMQ)
│   └── utils/              # Utilitários gerais
├── modules/
│   └── notifications/      # Módulo de notificações
│       ├── http/          # Camada HTTP (routes, controllers, schemas)
│       ├── services/      # Lógica de negócio (use-cases, factories)
│       ├── repository/    # Acesso aos dados
│       ├── events/        # Consumers de eventos RabbitMQ
│       └── errors/        # Erros específicos do módulo
└── generated/             # Código gerado (Prisma Client)
```

### Event-Driven Architecture

A aplicação utiliza **arquitetura orientada a eventos** com RabbitMQ para desacoplar operações:

1. **Fila `notify-subscriber`**: Processa o envio de notificações para todos os assinantes de um tópico
2. **Fila `topic-subscription`**: Gerencia a inscrição de múltiplos assinantes em tópicos

**Benefícios:**
- ✅ Desacoplamento entre serviços
- ✅ Resiliência: se o processamento falhar, a mensagem permanece na fila
- ✅ Escalabilidade: múltiplos consumers podem processar mensagens em paralelo
- ✅ Performance: operações pesadas não bloqueiam a API

### Padrões de Design

- **Factory Pattern**: Criação centralizada de instâncias de serviços (`factories/`)
- **Use Case Pattern**: Cada operação de negócio é um caso de uso independente
- **Repository Pattern**: Abstração da camada de acesso aos dados
- **Dependency Injection**: Injeção de dependências via construtores

### Validação e Tratamento de Erros

- **Zod** para validação de entrada/saída com type-safety
- **Error Handler Global** no Fastify para tratamento consistente de erros
- Erros customizados com mensagens descritivas e códigos específicos
- Validação automática de schemas em todas as rotas

### Modelo de Dados

O sistema utiliza 6 entidades principais no MongoDB:

- **Subscriber**: Usuários que recebem notificações
- **Topic**: Categorias de notificações
- **Notification**: Conteúdo das notificações
- **TopicNotification**: Relacionamento entre tópicos e notificações
- **SubscriberTopic**: Inscrições de assinantes em tópicos
- **SubscriberNotification**: Status de entrega das notificações (enviada, lida, deletada)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd confi-notifications
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mongodb://root:rootpassword@localhost:27017/confi-server-db?authSource=admin"
RABBITMQ_URL="amqp://root:rootpassword@localhost:5672"
NODE_ENV="development"
```

### 4. Iniciar infraestrutura (MongoDB + RabbitMQ)

```bash
docker-compose up -d
```

Serviços disponíveis:
- MongoDB: `localhost:27017`
- RabbitMQ: `localhost:5672`
- RabbitMQ Management UI: `http://localhost:15672` (usuário: `root`, senha: `rootpassword`)

### 5. Executar migrations do Prisma

```bash
npx prisma generate
npx prisma db push
```

### 6. Iniciar a aplicação

```bash
npm run start:dev
```

A API estará disponível em: `http://localhost:3000`

## 📡 Endpoints Principais

Base URL: `http://localhost:3000/api/v1/notifications`

### Tópicos

- `POST /topics` - Criar novo tópico
- `POST /topics/subscribe` - Inscrever assinantes em um tópico

### Notificações

- `POST /notifications` - Criar notificação
- `POST /notifications/search` - Buscar notificações de um usuário
- `POST /notifications/notify` - Disparar envio de notificações (adiciona à fila)
- `PATCH /notifications/read` - Marcar notificações como lidas
- `DELETE /notifications` - Deletar notificações

## 🔍 Exemplo de Fluxo

1. **Criar um tópico**:
```bash
POST /api/v1/notifications/topics
{
  "domain": "pedidos.concluidos",
  "description": "Notificações de pedidos concluídos"
}
```

2. **Inscrever assinantes**:
```bash
POST /api/v1/notifications/topics/subscribe
{
  "domain": "pedidos.concluidos",
  "subscribers": [
    { "subId": "user123", "subject": "Seu pedido foi concluído!" }
  ]
}
```

3. **Criar notificação e enviar**:
```bash
POST /api/v1/notifications/notifications
{
  "topicId": "...",
  "subject": "Pedido #1234 entregue"
}

POST /api/v1/notifications/notifications/notify
{
  "topicId": "...",
  "notificationId": "..."
}
```

4. **Buscar notificações do usuário**:
```bash
POST /api/v1/notifications/notifications/search
{
  "subscriberId": "user123"
}
```

## 📦 Scripts Disponíveis

```bash
npm run start:dev    # Inicia servidor em modo desenvolvimento com hot-reload
```

## 🧪 Tecnologias de Suporte

- **tsx**: Execução de TypeScript com hot-reload
- **Prisma Studio**: Interface gráfica para visualizar dados (`npx prisma studio`)
- **Fastify Type Provider Zod**: Integração perfeita entre Fastify e Zod

## 📝 Observações

- A aplicação carrega automaticamente os consumers RabbitMQ ao iniciar
- O Prisma Client é gerado em `src/generated/prisma` para manter organização
- Logs detalhados estão disponíveis para debugging em desenvolvimento
- O tratamento de erros inclui informações de debug apenas em ambiente de desenvolvimento

---

**Desenvolvido com ❤️ usando Node.js e TypeScript**

