# 📝 Notas de Implementação e Melhorias Futuras

Este documento contém ideias, melhorias e implementações futuras planejadas para o projeto Confi Notifications.

## 🎯 Implementações Prioritárias

### Frontend
- [ ] Criar aplicação frontend para consumir a API de notificações
- [ ] Implementar conexão SSE (Server-Sent Events) no cliente Frontend para receber notificações em tempo real
- [ ] Event sourcing no frontend: armazenar histórico de eventos SSE recebidos

**Stack Sugerida:**
- React/Next.Js
- EventSource API para SSE
- React Query ou SWR para cache de dados

### Camada de Cache com Redis (Read-Through)

- [ ] Implementar Redis como camada de cache
- [ ] Padrão Read-Through: ler primeiro do cache, se não encontrar, consultar o banco e atualizar o cache
- [ ] Cache de queries frequentes:
  - Tópicos por domínio
  - Assinaturas de tópicos
  - Notificações recentes por subscriber
- [ ] Invalidação de cache inteligente:
  - Invalidar cache quando tópico é criado/atualizado
  - Invalidar cache quando assinatura é modificada
  - TTL configurável por tipo de dado

### Documentação da API com Swagger/OpenAPI

- [ ] Integrar Swagger UI com Fastify
- [ ] Gerar documentação OpenAPI a partir dos schemas Zod
- [ ] Documentar todos os endpoints com exemplos
- [ ] Adicionar descrições detalhadas de request/response
- [ ] Incluir códigos de erro possíveis
- [ ] Exemplos de payloads para cada endpoint
- [ ] Testar endpoints diretamente pela interface Swagger

**Bibliotecas Sugeridas:**
- `@fastify/swagger` - Integração Swagger com Fastify
- `@fastify/swagger-ui` - Interface visual do Swagger
- `zod-to-json-schema` - Converter schemas Zod para JSON Schema (já instalado)

**Endpoint Sugerido:**
- `GET /api/docs` - Documentação interativa do Swagger

### Testes

#### Testes Unitários
- [ ] Testes para Use Cases:
  - `CreateNotification`
  - `CreateTopic`
  - `TopicSubscription`
  - `NotifySubscribers`
  - `FetchAllUserNotifications`
- [ ] Testes para Repositories:
  - `MongooseNotificationRepository`
  - Métodos CRUD
  - Queries complexas
- [ ] Testes para Factories
- [ ] Testes para Event Consumers

#### Testes de Integração
- [ ] Testes end-to-end das rotas HTTP
- [ ] Testes de integração com MongoDB
- [ ] Testes de integração com RabbitMQ
- [ ] Testes de fluxo completo: criar tópico → inscrever → notificar

#### Testes de Performance
- [ ] Load testing com múltiplos subscribers
- [ ] Teste de throughput do RabbitMQ
- [ ] Teste de escalabilidade do SSE
- [ ] Benchmark de queries MongoDB

**Stack de Testes Sugerida:**
- **Vitest** ou **Jest** - Framework de testes
- **Supertest** - Testes de API HTTP
- **MongoDB Memory Server** - MongoDB em memória para testes
- **k6** ou **Artillery** - Load testing

## 🚀 Melhorias Adicionais

### Infraestrutura e Observabilidade

- [ ] Adicionar endpoint SSE `/sse/connect` (atualmente implícito)
- [ ] Implementar retry policy com DLQ (Dead Letter Queue) no RabbitMQ
- [ ] Implementar Redis para SSE Map distribuído (multi-instância)
- [ ] Adicionar métricas (Prometheus) e tracing (OpenTelemetry)
- [ ] Implementar rate limiting por subscriber
- [ ] Health check endpoints (`/health`, `/ready`)
- [ ] Logging estruturado (Winston ou Pino)
- [ ] Monitoramento de performance (APM)

### Funcionalidades

- [ ] Notificações agendadas (cron jobs)
- [ ] Templates de notificações
- [ ] Múltiplos canais de notificação (email, SMS, push)
- [ ] Agrupamento de notificações similares
- [ ] Preferências de notificação por subscriber
- [ ] Webhooks para integrações externas

**Última atualização**: 2025-11-12

