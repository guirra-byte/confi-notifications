# 🔔 Confi Notifications

Sistema de notificações em tempo real com **Arquitetura Orientada a Eventos** e **Monólito Modular**, desenvolvido para gerenciar notificações baseadas em tópicos com processamento assíncrono via RabbitMQ e comunicação bidirecional via SSE (Server-Sent Events).

## 📋 Sobre o Projeto

O **Confi Notifications** é um **monólito modular** que implementa um sistema completo de notificações em tempo real. A aplicação combina os benefícios de uma arquitetura modular bem definida com a simplicidade operacional de um monólito, sendo ideal para equipes que buscam escalabilidade sem a complexidade de microserviços.

### Características Principais

- **Monólito Modular**: Código organizado em módulos independentes e coesos, mantendo baixo acoplamento
- **Event-Driven Architecture**: Comunicação assíncrona via RabbitMQ para operações de longa duração
- **Real-Time Push**: SSE (Server-Sent Events) para envio de notificações instantâneas ao frontend
- **Pub/Sub Pattern**: Sistema de tópicos onde assinantes recebem apenas notificações relevantes

### Principais Funcionalidades

- **Gerenciamento de Tópicos**: Criação e organização de tópicos de notificação
- **Sistema de Assinaturas**: Inscrição de assinantes em tópicos específicos
- **Notificações**: Criação e envio de notificações para assinantes de um tópico
- **Processamento Assíncrono**: Utilização de filas RabbitMQ para processar notificações sem bloquear a API
- **Controle de Status**: Marcação de notificações como lidas, enviadas e deletadas
- **Busca e Filtros**: Consulta de notificações com filtros avançados

## 🎨 Visão Geral da Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                      CONFI NOTIFICATIONS                         │
│                   (Monólito Modular)                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  FASTIFY API                           │    │
│  │                                                        │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │    │
│  │  │   HTTP      │  │     SSE      │  │  RabbitMQ   │  │    │
│  │  │ Controllers │  │   Handler    │  │  Publishers │  │    │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │    │
│  │         │               │   ▲               │         │    │
│  └─────────┼───────────────┼───┼───────────────┼─────────┘    │
│            │               │   │               │              │
│            ▼               │   │               ▼              │
│  ┌─────────────────────────┼───┼────────────────────────┐    │
│  │    MODULE: Notifications│   │                        │    │
│  │                         │   │                        │    │
│  │  ┌──────────────┐       │   │      ┌──────────────┐ │    │
│  │  │  Use Cases   │       │   │      │   Event      │ │    │
│  │  │  (Services)  │       │   │      │  Consumers   │ │    │
│  │  └──────┬───────┘       │   │      └──────┬───────┘ │    │
│  │         │               │   │             │         │    │
│  │         ▼               │   │             ▼         │    │
│  │  ┌──────────────┐       │   │      ┌──────────────┐ │    │
│  │  │ Repositories │       │   └──────┤   SSE Map    │ │    │
│  │  └──────────────┘       │          │  (Stateful)  │ │    │
│  └─────────────────────────┘          └──────────────┘ │    │
│            │                                  │         │    │
└────────────┼──────────────────────────────────┼─────────┘    │
             │                                  │               
             ▼                                  ▼               
   ┌──────────────────┐              ┌──────────────────┐      
   │     MongoDB      │              │    RabbitMQ      │      
   │  (Persistence)   │              │  (Event Broker)  │      
   └──────────────────┘              └──────────────────┘      
             ▲                                                  
             │                                                  
    ┌────────┴────────┐                                         
    │   Subscribers   │◄──────────SSE Push────────┐            
    │   (Frontend)    │                           │            
    └─────────────────┘                           │            
         EventSource API              Real-time Notifications   
```

**Fluxo de Dados:**
1. **HTTP Request** → Controllers → Use Cases → Repositories → MongoDB
2. **Event Publishing** → RabbitMQ Queues → Consumers → Use Cases
3. **Real-Time Push** → SSE Map → EventSource (Frontend)

## 🛠️ Stack Tecnológica

- **Node.js** com **TypeScript** - Runtime e linguagem
- **Fastify** - Framework web de alta performance
- **MongoDB** - Banco de dados NoSQL
- **Prisma** - ORM para acesso ao banco de dados
- **RabbitMQ** - Message broker para processamento assíncrono
- **Zod** - Validação de schemas e tipos
- **Docker & Docker Compose** - Containerização

## 🏗️ Arquitetura e Decisões Técnicas

### Monólito Modular: O Melhor dos Dois Mundos

Esta aplicação adota a arquitetura de **Monólito Modular**, uma abordagem que combina:

- ✅ **Simplicidade Operacional**: Deploy único, debugging facilitado, transações ACID
- ✅ **Organização de Microserviços**: Módulos independentes com baixo acoplamento
- ✅ **Evolução Gradual**: Possibilidade de extrair módulos para serviços independentes no futuro
- ✅ **Performance**: Comunicação interna sem overhead de rede

**Estrutura Modular:**

```
src/
├── core/                    # Código compartilhado (infraestrutura)
│   ├── errors/             # Tratamento de erros customizados
│   ├── providers/          # Provedores externos (RabbitMQ)
│   └── utils/              # Utilitários gerais
├── modules/
│   └── notifications/      # Módulo de notificações (independente)
│       ├── http/          # Camada HTTP (routes, controllers, schemas)
│       ├── services/      # Lógica de negócio (use-cases, factories)
│       ├── repository/    # Acesso aos dados (abstraído por interfaces)
│       ├── events/        # Event Consumers (RabbitMQ)
│       └── errors/        # Erros de domínio específicos
└── generated/             # Código gerado (Prisma Client)
```

**Cada módulo é autônomo** com suas próprias rotas, lógica de negócio, repositórios e event handlers. Novos módulos podem ser adicionados sem afetar os existentes.

---

### 🎯 Event-Driven Architecture com RabbitMQ

A aplicação é fundamentalmente **orientada a eventos**, utilizando RabbitMQ como backbone para comunicação assíncrona e desacoplada.

#### Filas e Responsabilidades

**1. Fila `notify-subscriber`** (High Priority)
- **Propósito**: Envio assíncrono de notificações via SSE para subscribers conectados
- **Publisher**: Controller HTTP `POST /notifications/notify`
- **Consumer**: `notify-subscribers.consumer.ts`
- **Payload**: `{ topicId, notificationId }`
- **Ação**: Busca todos subscribers do tópico e envia via SSE para os conectados

**2. Fila `topic-subscription`** (Batch Processing)
- **Propósito**: Inscrição em massa de subscribers em tópicos
- **Publisher**: Controller HTTP `POST /topics/subscribe`
- **Consumer**: `topic-subscription.consumer.ts`
- **Payload**: `{ domain, subscribers: [{ subId, subject }] }`
- **Ação**: Cria relacionamentos SubscriberTopic no banco

#### Por que Event-Driven?

**Desacoplamento Temporal:**
```
Cliente → API (200 OK imediato) → RabbitMQ Queue → Consumer (processa em background)
```

**Vantagens Implementadas:**
- ✅ **Resiliência**: Mensagens persistem em disco (durable: true) até processamento
- ✅ **Retry Automático**: Consumers podem reprocessar mensagens em caso de falha
- ✅ **Escalabilidade Horizontal**: Múltiplos consumers competem pela mesma fila
- ✅ **Backpressure**: Fila absorve picos de carga sem derrubar o sistema
- ✅ **Observabilidade**: RabbitMQ Management UI mostra estado de cada fila

---

### 📡 SSE (Server-Sent Events): Push em Tempo Real

A aplicação implementa **SSE** para enviar notificações instantâneas do servidor para o frontend, sem polling ou WebSockets complexos.

#### Arquitetura SSE

```
Frontend (EventSource) ←──── SSE Connection ←──── NotifySubscribers Service
                                                           ↓
                                                    Static Map<subId, Reply>
                                                           ↑
                                                    RabbitMQ Consumer
```

**Classe `SseHandler`:**
- Mantém um **Map estático** de conexões ativas: `Map<subscriberId, FastifyReply>`
- Gerencia ciclo de vida das conexões (abertura, keep-alive, close)
- Envia eventos no formato SSE: `data: <payload>\n\n`

**Fluxo de Conexão:**
```typescript
1. Cliente: GET /sse/connect?subscriberId=xyz
2. Servidor: Adiciona reply ao Map + envia headers SSE
3. Servidor: Mantém conexão aberta (keep-alive)
4. RabbitMQ: Notificação chega na fila notify-subscriber
5. Consumer: Busca reply do Map e envia evento SSE
6. Cliente: EventSource.onmessage() recebe notificação
```

**Benefícios do SSE sobre Alternativas:**

| Aspecto | SSE | WebSocket | Polling |
|---------|-----|-----------|---------|
| Unidirecional | ✅ Perfeito | ❌ Bidirecional desnecessário | ✅ Mas ineficiente |
| HTTP/2 | ✅ Multiplexing | ❌ Protocolo próprio | ✅ Mas muitas requisições |
| Simplicidade | ✅ EventSource nativo | ⚠️ Libs complexas | ✅ Mas desperdício |
| Reconexão Auto | ✅ Nativo | ❌ Manual | N/A |
| Firewall/Proxy | ✅ HTTP padrão | ⚠️ Pode bloquear | ✅ HTTP padrão |

**Event Sourcing no Frontend:**
O cliente pode manter histórico de eventos SSE recebidos, possibilitando:
- Replay de notificações offline
- Sincronização de estado local
- Auditoria de eventos recebidos

#### Implementação do SSE

```typescript
// Backend: notify-subscribers.ts
class SseHandler {
  protected static sseClients: Map<string, FastifyReply> = new Map();
  
  protected handleSseConnection(subscriberId: string, reply: FastifyReply) {
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Connection", "keep-alive");
    
    SseHandler.sseClients.set(subscriberId, reply);
    
    reply.raw.on("close", () => {
      SseHandler.sseClients.delete(subscriberId);
    });
  }
}
```

```javascript
// Frontend: Conectando ao SSE
const eventSource = new EventSource('/api/v1/sse/connect?subscriberId=user123');

eventSource.onmessage = (event) => {
  const notification = event.data;
  // Adiciona ao event store local (event sourcing)
  eventStore.append({ type: 'NOTIFICATION_RECEIVED', payload: notification });
};
```

---

### 🔄 Diagrama de Sequência Completo

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐
│ Frontend│    │ Fastify  │    │ RabbitMQ │    │Consumer │    │ MongoDB  │
└────┬────┘    └────┬─────┘    └────┬─────┘    └────┬────┘    └────┬─────┘
     │              │               │               │              │
     │ 1. GET /sse/connect          │               │              │
     ├─────────────>│               │               │              │
     │              │ (Abre SSE)    │               │              │
     │<─────────────┤               │               │              │
     │ Keep-Alive   │               │               │              │
     │              │               │               │              │
     │ 2. POST /notify              │               │              │
     ├─────────────>│               │               │              │
     │              │ 3. Publish    │               │              │
     │              ├──────────────>│               │              │
     │ 200 OK       │               │               │              │
     │<─────────────┤               │               │              │
     │              │               │ 4. Consume    │              │
     │              │               ├──────────────>│              │
     │              │               │               │ 5. Query     │
     │              │               │               ├─────────────>│
     │              │               │               │ Subscribers  │
     │              │               │               │<─────────────┤
     │              │ 6. Get SSE Reply              │              │
     │              │<──────────────────────────────┤              │
     │ 7. SSE Push  │               │               │              │
     │<─────────────┤               │               │              │
     │ Notification!│               │               │ 8. Mark Sent │
     │              │               │               ├─────────────>│
     │              │               │               │              │
```

**Legenda:**
1. Frontend abre conexão SSE persistente (fica aberta)
2. Backend recebe request para enviar notificação
3. Publica mensagem na fila RabbitMQ (retorna 200 OK imediato)
4. Consumer consome mensagem da fila
5. Consumer busca subscribers do tópico no MongoDB
6. Consumer recupera conexão SSE do Map estático
7. Envia notificação via SSE para o frontend
8. Marca notificação como enviada no banco

---

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

## 🔍 Exemplo de Fluxo Completo (End-to-End)

### Cenário: Sistema de Pedidos E-commerce

**1. Frontend: Conectar ao SSE** (Tempo Real)
```javascript
// Cliente abre conexão persistente ao iniciar a aplicação
const eventSource = new EventSource('http://localhost:3000/api/v1/sse/connect?subscriberId=user123');

eventSource.onmessage = (event) => {
  const notification = event.data;
  toast.success(notification); // Exibe notificação em tempo real
};

eventSource.onerror = () => {
  console.log('Reconectando...'); // Reconexão automática
};
```

**2. Backend: Criar Tópico**
```bash
POST /api/v1/notifications/topics
{
  "domain": "pedidos.concluidos",
  "description": "Notificações quando pedidos são finalizados"
}
# Response: { topicId: "abc123" }
```

**3. Backend: Inscrever Usuários no Tópico** (Assíncrono via RabbitMQ)
```bash
POST /api/v1/notifications/topics/subscribe
{
  "domain": "pedidos.concluidos",
  "subscribers": [
    { "subId": "user123", "subject": "Pedido finalizado" },
    { "subId": "user456", "subject": "Pedido finalizado" }
  ]
}
# Response: 200 OK (mensagem vai para fila 'topic-subscription')
# Consumer processa inscrições em background
```

**4. Backend: Criar Notificação**
```bash
POST /api/v1/notifications/notifications
{
  "topicId": "abc123",
  "subject": "Seu pedido #1234 foi entregue! 🎉"
}
# Response: { notificationId: "xyz789" }
```

**5. Backend: Disparar Envio** (Assíncrono via RabbitMQ + SSE)
```bash
POST /api/v1/notifications/notifications/notify
{
  "topicId": "abc123",
  "notificationId": "xyz789"
}
# Response: 200 OK (mensagem vai para fila 'notify-subscriber')
```

**6. Processamento Automático (Background)**
```
[RabbitMQ] → Consumer lê fila 'notify-subscriber'
           → Busca subscribers do tópico "pedidos.concluidos"
           → Para cada subscriber CONECTADO via SSE:
              * Envia evento SSE: "data: Seu pedido #1234 foi entregue! 🎉\n\n"
              * Marca notificação como 'isSent: true' no banco
```

**7. Frontend: Recebe Notificação Instantânea** ⚡
```javascript
// EventSource.onmessage() dispara automaticamente
eventSource.onmessage = (event) => {
  console.log('Nova notificação:', event.data);
  // → "Seu pedido #1234 foi entregue! 🎉"
  
  // Event Sourcing: Armazena no state local
  dispatch({ type: 'NOTIFICATION_RECEIVED', payload: event.data });
};
```

**8. Backend: Consultar Histórico de Notificações**
```bash
POST /api/v1/notifications/notifications/search
{
  "subscriberId": "user123",
  "isSent": true,
  "isRead": false
}
# Response: [ { id, subject, isSent, isRead, createdAt } ]
```

### Fluxo Visual

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│  Frontend   │◄────SSE─┤   Fastify    │◄────────┤   RabbitMQ   │
│ (EventSource)│         │  (SSE Map)   │  consume │   (Queues)   │
└─────────────┘         └──────┬───────┘         └──────▲───────┘
                               │                         │
                               │                         │
                        ┌──────▼───────┐         ┌──────┴───────┐
                        │   MongoDB    │         │  Controllers │
                        │  (Persist)   │         │  (Publish)   │
                        └──────────────┘         └──────────────┘
```

## 📦 Scripts Disponíveis

```bash
npm run start:dev    # Inicia servidor em modo desenvolvimento com hot-reload
```

## 🧪 Tecnologias de Suporte

- **tsx**: Execução de TypeScript com hot-reload
- **Prisma Studio**: Interface gráfica para visualizar dados (`npx prisma studio`)
- **Fastify Type Provider Zod**: Integração perfeita entre Fastify e Zod

## 🚀 Benefícios da Arquitetura Escolhida

### Monólito Modular vs Microserviços

Esta arquitetura é ideal quando você quer:

✅ **Manter Simplicidade Operacional**
- Single point of deployment (1 container Docker)
- Debugging facilitado (stack trace completo)
- Transações ACID nativas (mesmo banco)
- Sem latência de rede entre módulos

✅ **Organização e Escalabilidade de Código**
- Módulos independentes com boundaries claros
- Fácil de encontrar e modificar funcionalidades
- Onboarding de desenvolvedores mais rápido
- Testabilidade por módulo

✅ **Evolução Gradual**
- Extraia módulos para microserviços **somente quando necessário**
- Migração incremental sem reescrever tudo
- Mantenha módulos estáveis como monólito

### Event-Driven + SSE: Combinação Poderosa

**RabbitMQ (Async Tasks)** + **SSE (Real-Time Push)** = Melhor dos dois mundos

| Aspecto | Implementação | Benefício |
|---------|---------------|-----------|
| API Response Time | RabbitMQ devolve 200 OK imediato | UX responsiva |
| Processamento Pesado | Consumer em background | Não bloqueia threads |
| Notificações Tempo Real | SSE push instantâneo | Zero polling |
| Escalabilidade | Múltiplos consumers + Stateful SSE | Horizontal scaling |
| Resiliência | Mensagens persistem em disco | Zero perda de dados |

### Considerações de Escalabilidade

## 📝 Observações Técnicas

- **Consumers Automáticos**: Carregam ao iniciar (imports em `app.ts`)
- **Prisma Client Customizado**: Gerado em `src/generated/prisma` para organização
- **Logs Simples e Estruturados**: Fastify Logger nativo para debugging
- **Error Handling**: Erros com contexto em dev, mensagens limpas em prod
- **Conexões SSE**: Gerenciadas em memória (Map estático)
- **RabbitMQ**: Filas duráveis (persistem reinicializações)

## 🔧 Melhorias Futuras

- [ ] Adicionar endpoint SSE `/sse/connect` (atualmente implícito)
- [ ] Implementar retry policy com DLQ (Dead Letter Queue) no RabbitMQ
- [ ] Adicionar testes unitários e e2e
- [ ] Implementar Redis para SSE Map distribuído (multi-instância)
- [ ] Adicionar métricas (Prometheus) e tracing (OpenTelemetry)
- [ ] Implementar rate limiting por subscriber
- [ ] Event Sourcing completo: armazenar todos eventos em event store
- [ ] Implementar Frontend

---

**Desenvolvido com ❤️ usando Node.js, TypeScript e Arquitetura Orientada a Eventos**

