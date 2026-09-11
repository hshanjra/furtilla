# General-Purpose Medusa-Like Framework

A lightweight, domain-agnostic TypeScript application framework inspired by the architecture and developer experience of Medusa v2.

The goal is **not to clone Medusa**.

The goal is to reproduce the useful framework primitives:

- Modules
- Data models / DML
- Service factories
- Automatic typed CRUD
- Dependency injection
- API routes
- Middleware
- Workflows
- Workflow steps
- Transactions
- Events
- Subscribers
- Jobs
- Scheduler
- Configuration
- CLI
- Testing utilities

while removing all commerce assumptions.

---

# 1. Core Philosophy

The framework should know about:

```text
Application
Module
Model
Service
Repository
Workflow
Step
Route
Middleware
Event
Subscriber
Job
Transaction
Container
```

The framework must NOT know about:

```text
Product
Cart
Order
Customer
Payment
Fulfillment
Inventory
Promotion
Sales Channel
Price
```

Those belong entirely to applications.

---

# 2. Target Developer Experience

The framework should intentionally feel familiar to Medusa v2 developers.

A module should look approximately like:

```text
src/modules/blog/
├── index.ts
├── service.ts
└── models/
    └── post.ts
```

Model:

```ts
import { model } from "@my-framework/framework";

export const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text().nullable(),
  published: model.boolean().default(false),
  createdAt: model.dateTime(),
  updatedAt: model.dateTime(),
});
```

Service:

```ts
import { ServiceFactory } from "@my-framework/framework";
import { Post } from "./models/post";

class BlogModuleService extends ServiceFactory({
  Post,
}) {
  async publishPost(id: string) {
    // custom business logic
  }
}

export default BlogModuleService;
```

The service should automatically provide typed methods similar to:

```ts
service.createPosts(...)
service.createPost(...)
service.retrievePost(...)
service.listPosts(...)
service.updatePosts(...)
service.updatePost(...)
service.deletePosts(...)
service.deletePost(...)
```

The exact API should be finalized during implementation.

---

# 3. Package Strategy

The framework should use the following strategy:

| Area              | Decision                                             |
| ----------------- | ---------------------------------------------------- |
| HTTP              | Fastify                                              |
| Database driver   | `pg`                                                 |
| SQL / ORM         | Drizzle                                              |
| DML               | Build ourselves                                      |
| Service Factory   | Build ourselves                                      |
| CRUD generation   | Build ourselves                                      |
| DI                | Build ourselves                                      |
| Workflows         | Build ourselves                                      |
| Events            | Build ourselves initially                            |
| Middleware        | Build ourselves over Fastify                         |
| Route discovery   | Build ourselves                                      |
| Configuration     | Build ourselves                                      |
| Logger            | Thin wrapper; Pino only if needed                    |
| Validation        | Zod initially                                        |
| Migrations        | Drizzle Kit                                          |
| CLI               | Build ourselves / tiny CLI dependency                |
| Testing           | Vitest                                               |
| Jobs              | Build ourselves initially                            |
| Durable workflows | Optional Temporal integration later                  |
| Queue             | Avoid initially; add BullMQ/Redis only when required |
| Cache             | Build interface; Redis implementation later          |
| Redis             | `ioredis` or official Redis client only when needed  |

The key rule:

> **Do not write infrastructure that is already excellent and stable. Write the framework-specific abstraction ourselves.**

---

# 4. Why Drizzle

Use Drizzle as the low-level database engine.

Drizzle provides:

- TypeScript schema definitions
- Type inference
- PostgreSQL support
- SQL-like queries
- Relational queries
- Transactions
- Migrations
- Migration generation

Its schema is defined directly in TypeScript, and Drizzle Kit can generate migrations from schema changes.

This lets us build:

```text
Our DML
   ↓
Drizzle schema
   ↓
PostgreSQL
```

rather than:

```text
Our DML
   ↓
Our own SQL engine
   ↓
Our own migration engine
   ↓
PostgreSQL
```

That would be unnecessary work.

---

# 5. Why NOT MikroORM

Medusa v2 currently uses MikroORM internally for its data layer/migrations. Its documentation describes the v2 migration system as being based on MikroORM.

For this framework, however, use:

```text
DML
 ↓
Drizzle
 ↓
PostgreSQL
```

instead of:

```text
DML
 ↓
MikroORM
 ↓
PostgreSQL
```

Reasons:

- Smaller conceptual surface
- Excellent TypeScript inference
- SQL-like API
- Schema-as-TypeScript
- Migration tooling
- Less ORM magic
- Easier to understand internally
- Easier to maintain ourselves

We don't need to reproduce Medusa's exact underlying database implementation.

We need to reproduce its **developer experience**.

---

# 6. Our DML

This is one of the few areas where we should intentionally build our own system.

Package:

```text
@my-framework/dml
```

Goal:

```ts
const User = model.define("user", {
  id: model.id().primaryKey(),

  name: model.text(),

  email: model.text().unique(),

  age: model.number().nullable(),

  active: model.boolean().default(true),

  metadata: model.json().nullable(),

  createdAt: model.dateTime(),
});
```

The DML should compile into Drizzle definitions.

Conceptually:

```text
model.define()
      ↓
ModelDefinition
      ↓
DrizzleSchema
      ↓
PostgreSQL
```

---

# 7. DML Design

The DML needs to describe:

### Primitive types

```ts
model.id();
model.text();
model.number();
model.integer();
model.boolean();
model.dateTime();
model.json();
model.bigInt();
model.decimal();
```

### Modifiers

```ts
.primaryKey()
.unique()
.nullable()
.default(...)
```

### Indexes

```ts
model.index();
model.uniqueIndex();
```

### Relations

```ts
model.belongsTo(...)
model.hasMany(...)
model.hasOne(...)
```

But relations should NOT automatically become database foreign keys unless explicitly configured.

Example:

```ts
export const Project = model.define("project", {
  id: model.id().primaryKey(),

  name: model.text(),

  ownerId: model.id(),
});
```

Then optionally:

```ts
Project.belongsTo("owner", {
  model: User,
  foreignKey: "ownerId",
});
```

---

# 8. Type Inference

This is critical.

Given:

```ts
const User = model.define("user", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  age: model.number().nullable(),
});
```

the framework should infer:

```ts
type User = InferModel<typeof User>;
```

as approximately:

```ts
type User = {
  id: string;
  name: string;
  email: string;
  age: number | null;
};
```

And:

```ts
type UserCreate = InferCreate<typeof User>;
```

should understand required/default/optional fields.

For example:

```ts
await service.createUsers({
  name: "John",
  email: "john@example.com",
});
```

should compile.

But:

```ts
await service.createUsers({
  name: 123,
});
```

should fail at compile time.

This is one of the highest-priority features.

---

# 9. Service Factory

Package:

```text
@my-framework/service
```

This is one of the most important components.

Medusa's service factory follows this exact model:

```ts
class BlogModuleService extends MedusaService({
  Post,
}) {}
```

and generates CRUD methods automatically.

We should implement the same conceptual pattern.

Our API:

```ts
class BlogModuleService extends ServiceFactory({
  Post,
}) {}
```

The factory receives model definitions.

It generates:

```text
createPost
createPosts

retrievePost

listPosts

updatePost
updatePosts

deletePost
deletePosts

softDeletePost
softDeletePosts

restorePost
restorePosts
```

where appropriate.

---

# 10. CRUD Type Safety

The generated methods must infer types from the model.

Example:

```ts
const post = await service.createPosts({
  title: "Hello",
  content: "World",
});
```

Return:

```ts
Post;
```

Query:

```ts
const posts = await service.listPosts({
  title: "Hello",
});
```

Return:

```ts
Post[]
```

Retrieve:

```ts
const post = await service.retrievePost(postId);
```

Return:

```ts
Post;
```

or:

```ts
Post | null;
```

depending on API semantics.

---

# 11. Query API

Do not build a complicated query language initially.

Provide:

```ts
service.listPosts({
  filters: {
    published: true,
  },

  fields: ["id", "title", "createdAt"],

  limit: 20,

  offset: 0,

  order: {
    createdAt: "DESC",
  },
});
```

TypeScript should restrict fields:

```ts
fields: [
  "id",
  "title",
  "notARealField", // compile error
];
```

Filters should also be model-aware.

---

# 12. Relations

Eventually support:

```ts
service.listPosts({
  fields: ["id", "title", "author.id", "author.name"],
});
```

The relation graph should be known at compile time where possible.

Do NOT attempt to make the entire relation/query engine compile-time magic.

Practical type safety is more valuable than extremely complicated TypeScript.

---

# 13. Repository Layer

The service factory should internally use repositories.

Architecture:

```text
ServiceFactory
      ↓
Repository
      ↓
Drizzle
      ↓
PostgreSQL
```

Example:

```ts
class PostRepository {
  find(...)
  findOne(...)
  create(...)
  update(...)
  delete(...)
}
```

The application normally should not need to interact with this directly.

For advanced queries:

```ts
const repository = service.getRepository(Post);
```

can be exposed as an escape hatch.

---

# 14. Custom Service Methods

The generated service must be extendable.

Example:

```ts
class ProjectModuleService extends ServiceFactory({
  Project,
}) {
  async archiveProject(id: string) {
    ...
  }

  async getProjectStatistics(id: string) {
    ...
  }
}
```

This gives us:

```text
Generated CRUD
       +
Custom business logic
```

This is the desired model.

---

# 15. Dependency Injection

Build our own DI container.

Do NOT use NestJS DI.

Do NOT make the application dependent on a large DI framework.

Why?

The required functionality is relatively small:

```text
singleton
scoped
transient
factory
value
class
dependency resolution
lifecycle
```

A custom container should be manageable.

Example:

```ts
container.register("logger", {
  useValue: logger,
});

container.register("database", {
  useFactory: ({ config }) => {
    return createDatabase(config.database);
  },
});
```

Resolve:

```ts
container.resolve("database");
```

---

# 16. DI Type Safety

This should be typed.

Instead of:

```ts
container.resolve("anything");
```

returning:

```ts
any;
```

use a registry:

```ts
interface ContainerRegistry {
  logger: Logger;
  database: Database;
  eventBus: EventBus;
  projectModuleService: ProjectModuleService;
}
```

Then:

```ts
container.resolve("projectModuleService");
```

returns:

```ts
ProjectModuleService;
```

automatically.

Modules should augment the registry.

Potential TypeScript pattern:

```ts
declare module "@my-framework/container" {
  interface ServiceRegistry {
    projectService: ProjectModuleService;
  }
}
```

This provides strong typing without requiring a large DI package.

---

# 17. Workflows

Build our own workflow engine.

Do NOT initially use Temporal.

Why?

Medusa-like workflows are application-level workflows with steps, transactions, retries, and compensation.

Temporal solves a larger problem:

- Durable execution
- Distributed workers
- Crash recovery
- Long-running workflows
- External orchestration

Temporal is excellent for that use case, but it introduces infrastructure and operational complexity. Temporal guarantees durable execution across crashes and infrastructure failures.

We don't need that for v1.

Architecture:

```text
Workflow
   ↓
Step
   ↓
Service
   ↓
Database
```

---

# 18. Workflow API

Example:

```ts
const createProject = createWorkflow("create-project", (input) => {
  const project = createProjectStep(input);

  return project;
});
```

Step:

```ts
const createProjectStep = createStep({
  name: "create-project",

  execute: async (input, context) => {
    const service = context.container.resolve("projectService");

    return service.createProjects(input);
  },

  compensate: async (project, context) => {
    const service = context.container.resolve("projectService");

    await service.deleteProjects(project.id);
  },
});
```

---

# 19. Workflow Requirements

Implement:

```text
Step
Workflow
StepResponse
Context
Execution ID
Step ID
Retry
Timeout
Compensation
Transactions
Error handling
Logging
```

Eventually:

```text
parallel()
when()
branch()
map()
foreach()
```

But do not implement these initially.

---

# 20. Workflow Transactions

The workflow should support:

```ts
await workflow.run({
  input,
});
```

with transaction context.

Architecture:

```text
Workflow
   ↓
Transaction
   ↓
Step A
   ↓
Step B
   ↓
Step C
```

If the database transaction fails:

```text
rollback
```

If a completed external action needs reversal:

```text
compensation
```

Do not confuse the two.

---

# 21. Durable Workflow Option

Later:

```text
@my-framework/workflow-local
@my-framework/workflow-temporal
```

The default should remain:

```text
Local Workflow Engine
```

Applications that need true durable distributed workflows can install:

```text
Temporal adapter
```

This keeps the base framework small.

---

# 22. API Layer

Use Fastify.

Package:

```text
@my-framework/http
```

The framework owns:

- Route discovery
- Request context
- Middleware
- Error handling
- Validation
- Authentication hooks
- Response helpers

Fastify owns:

- HTTP parsing
- HTTP server
- low-level routing
- HTTP lifecycle

---

# 23. API Route Syntax

Prefer a simple Medusa-like syntax.

```ts
import type { FrameworkRequest, FrameworkResponse } from "@my-framework/http";

export async function GET(req: FrameworkRequest, res: FrameworkResponse) {
  const service = req.scope.resolve("projectService");

  const projects = await service.listProjects();

  return res.json(projects);
}
```

POST:

```ts
export async function POST(req, res) {
  const result = await createProjectWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  return res.json(result);
}
```

---

# 24. Route Type Safety

Route body:

```ts
const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});
```

Then:

```ts
req.validatedBody;
```

must infer:

```ts
{
  name: string
  description?: string
}
```

Use Zod initially rather than building our own validation engine.

Validation is not the interesting part of this framework.

The framework integration is.

---

# 25. Middleware

Build our own middleware registration layer over Fastify.

Example:

```ts
defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      middleware: [authenticate(), requireAdmin()],
    },
  ],
});
```

Support:

```text
global middleware
route middleware
method matching
route matching
request context
authentication
authorization
error middleware
```

---

# 26. Events

Build a small event bus ourselves.

Do not introduce Kafka/RabbitMQ/Redis initially.

Example:

```ts
await eventBus.emit("project.created", {
  projectId: project.id,
});
```

Subscriber:

```ts
export default defineSubscriber({
  event: "project.created",

  handler: async ({ data, container }) => {
    ...
  },
})
```

---

# 27. Event Architecture

Initial:

```text
Application
    ↓
EventBus
    ↓
In-process subscribers
```

Later:

```text
EventBus
   ├── InMemory
   ├── Redis
   ├── RabbitMQ
   └── Kafka
```

Adapters should be optional.

---

# 28. Jobs

Build a basic local job system.

Example:

```ts
defineJob({
  name: "process-documents",

  schedule: "*/5 * * * *",

  handler: async ({ container }) => {
    ...
  },
})
```

Initial implementation:

```text
Node process
    ↓
Scheduler
    ↓
Job
```

No Redis.

No queue.

No external infrastructure.

---

# 29. Queue

Do NOT add a queue dependency to the core framework.

When needed:

```text
@my-framework/queue
```

Possible implementation:

```text
BullMQ + Redis
```

or another proven queue.

The application should opt into it.

---

# 30. Cache

Define interface:

```ts
interface Cache {
  get<T>(key: string): Promise<T | null>;

  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;

  delete(key: string): Promise<void>;
}
```

Initial implementation:

```text
MemoryCache
```

Later:

```text
RedisCache
```

---

# 31. Authentication

Do NOT build authentication into the core.

Build an authentication interface:

```ts
interface Authenticator {
  authenticate(request: Request): Promise<AuthContext>;
}
```

Then adapters:

```text
@my-framework/auth
@my-framework/auth-jwt
@my-framework/auth-session
```

The framework should only understand:

```ts
req.auth;
```

---

# 32. Database Package

Structure:

```text
@my-framework/database
```

Dependencies:

```text
drizzle-orm
pg
```

Responsibilities:

```text
connection
transactions
repositories
DML compiler
model metadata
```

Drizzle remains below our abstraction.

---

# 33. DML Compiler

This is an important internal component.

Input:

```ts
const User = model.define("user", {
  id: model.id().primaryKey(),
  email: model.text().unique(),
});
```

Compiler:

```text
ModelDefinition
      ↓
ColumnMetadata
      ↓
DrizzleTable
      ↓
PostgreSQL
```

It should also expose metadata:

```ts
User.metadata.fields.email;
```

This metadata powers:

- CRUD
- validation
- query generation
- serialization
- migrations
- admin tools later
- documentation generation later

---

# 34. Service Factory Internals

The service factory should not generate code files.

It should generate a class at runtime/type level.

Conceptually:

```ts
function ServiceFactory<
  TModels extends ModelRegistry
>(models: TModels) {
  return class GeneratedService {
    ...
  }
}
```

Type-level mapping:

```text
Model
  ↓
Infer entity
  ↓
Infer create input
  ↓
Infer update input
  ↓
Infer filters
  ↓
Generate service methods
```

This is the core TypeScript challenge.

---

# 35. Generated API

For:

```ts
class BlogService extends ServiceFactory({
  Post,
  Author,
}) {}
```

generate:

```ts
createPosts();
createPost();

retrievePost();

listPosts();

updatePosts();
updatePost();

deletePosts();
deletePost();
```

and equivalent methods for `Author`.

Potentially:

```ts
softDeletePosts();
restorePosts();
```

if soft deletion is enabled.

---

# 36. Query Type System

Implement generic query types:

```ts
type ListQuery<TModel>
type RetrieveQuery<TModel>
type CreateInput<TModel>
type UpdateInput<TModel>
type Filter<TModel>
type Order<TModel>
type Fields<TModel>
```

Example:

```ts
type PostCreateInput = CreateInput<typeof Post>;
```

Then:

```ts
service.createPosts(input);
```

is fully typed.

---

# 37. Avoid Overengineering TypeScript

There is a danger here.

Do NOT try to make:

```ts
service.listPosts({
  filter: {
    title: {
      contains: "hello",
    },
  },
  fields: {
    author: {
      email: true,
    },
  },
});
```

perfectly type-safe from day one.

Start with:

```ts
service.listPosts({
  filters: {
    title: "hello",
  },

  fields: ["id", "title"],
});
```

Then gradually expand.

Practical type safety is better than a 2,000-line TypeScript type system nobody understands.

---

# 38. Module Definition

Example:

```ts
export default defineModule({
  key: "blog",

  service: BlogModuleService,
});
```

The module loader discovers:

```text
module
   ↓
service
   ↓
models
   ↓
container
```

The service becomes injectable:

```ts
container.resolve("blog");
```

or:

```ts
container.resolve("blogModuleService");
```

Choose one naming convention and keep it stable.

---

# 39. Module Dependencies

Example:

```ts
defineModule({
  key: "documents",

  dependencies: ["storage", "users"],

  service: DocumentService,
});
```

Startup order:

```text
users
storage
   ↓
documents
```

Detect circular dependencies during startup.

---

# 40. Module Isolation

A module should own:

```text
models
services
repositories
events
```

A module should NOT directly access another module's database tables.

Instead:

```text
Module A
   ↓
Module B Service
```

This keeps boundaries clean.

---

# 41. Module Links

Eventually implement:

```ts
defineLink({
  source: Project,
  target: User,
  relation: "owner",
});
```

But do not build this before the core CRUD system works.

---

# 42. CLI

Build our own thin CLI.

Commands:

```bash
framework dev
framework build
framework start

framework generate module blog
framework generate model post
framework generate workflow create-post

framework migrate
framework migration:create
framework migration:run

framework doctor
framework exec
```

Avoid a large CLI framework unless it becomes necessary.

---

# 43. File Discovery

Discover:

```text
src/modules/**
src/api/**
src/workflows/**
src/subscribers/**
src/jobs/**
src/middlewares.ts
```

Do not make discovery excessively magical.

Startup output:

```text
Framework v0.1.0

✓ 4 modules
✓ 18 API routes
✓ 7 workflows
✓ 5 subscribers
✓ 3 jobs

✓ PostgreSQL connected

Server:
http://localhost:9000
```

---

# 44. Package Structure

Recommended monorepo:

```text
packages/
├── core/
├── container/
├── dml/
├── database/
├── service/
├── workflow/
├── http/
├── events/
├── scheduler/
├── config/
├── cli/
├── testing/
│
└── integrations/
    ├── redis/
    ├── queue/
    ├── temporal/
    └── auth/
```

Keep integration packages separate.

---

# 45. Package Dependency Graph

Target:

```text
                    core
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      container     dml       config
          │          │
          │       database
          │          │
          └────┬─────┘
               ↓
            service
               │
               ↓
            workflow
               │
          ┌────┴────┐
          ↓         ↓
        http      events
```

Infrastructure integrations stay outside core.

---

# 46. Dependency Budget

Core packages should have extremely few dependencies.

Target:

```text
core
0-3 runtime dependencies

container
0 dependencies

dml
0 dependencies

service
0-1 dependencies

workflow
0 dependencies

http
fastify

database
drizzle-orm
pg

config
0-1 dependencies

events
0 dependencies
```

Development dependencies are separate.

---

# 47. Dependencies We SHOULD Use

## Fastify

Use it.

Do not recreate an HTTP server.

---

## Drizzle

Use it.

Do not recreate SQL query building, PostgreSQL typing, or migration generation.

Drizzle's TypeScript schema is specifically designed to be a source of truth for queries and migrations.

---

## PostgreSQL `pg`

Use it.

Do not implement a PostgreSQL driver.

---

## Zod

Use initially.

Validation is not the framework's competitive advantage.

---

## Vitest

Use it.

Do not write a testing framework.

---

# 48. Dependencies We SHOULD NOT Use Initially

Avoid:

```text
NestJS
Express
MikroORM
TypeORM
Awilix
Inversify
Temporal
BullMQ
Redis
Kafka
RabbitMQ
GraphQL
```

unless a real requirement appears.

---

# 49. Why Build Our Own DI Instead of Awilix?

Awilix is a legitimate DI container.

But our requirements are small enough that:

```text
~500-1000 lines
```

of well-tested DI implementation can probably cover what we need.

Benefits:

- No dependency upgrade
- Full control
- Better TypeScript integration
- Module registry integration
- Request scope integration
- Framework lifecycle integration

This is an area where writing our own is justified.

---

# 50. Why Build Our Own Workflow Engine?

Because the desired API is specifically:

```ts
createWorkflow();
createStep();
StepResponse;
compensation;
transactions;
```

A generic workflow library would impose its own abstraction.

Our workflow engine should remain small.

If we eventually need:

```text
distributed workers
durable execution
days/months-long workflows
automatic crash recovery
```

then use Temporal as an optional adapter.

Temporal is specifically designed for durable execution that resumes after crashes and infrastructure failures.

---

# 51. Why Build Our Own Event Bus?

Because an in-memory event bus is trivial.

Initial:

```ts
class EventBus {
  subscribe(...)
  emit(...)
}
```

This avoids:

```text
Redis
Kafka
RabbitMQ
```

until actually required.

---

# 52. Why Build Our Own Service Factory?

Because this is one of the framework's defining features.

We want:

```ts
class UserService extends ServiceFactory({
  User,
}) {}
```

to produce:

```text
CRUD
Filtering
Pagination
Sorting
Relations
Transactions
Typed inputs
Typed outputs
```

No generic third-party library is going to provide exactly the developer experience we want.

---

# 53. CRUD Implementation

The generated service should internally use:

```text
ServiceFactory
      ↓
ModelMetadata
      ↓
RepositoryFactory
      ↓
Drizzle
      ↓
PostgreSQL
```

Repository factory:

```ts
createRepository(User);
```

automatically understands:

```text
table
columns
primary key
relations
types
```

---

# 54. Repository Factory

Example:

```ts
const userRepository = repositoryFactory.create(User);
```

Then internally:

```ts
userRepository.findMany(...)
userRepository.findOne(...)
userRepository.create(...)
userRepository.update(...)
userRepository.delete(...)
```

The public application API should generally remain the service.

---

# 55. Transactions

Repository methods should accept context:

```ts
service.createUsers(data, context);
```

or:

```ts
context.transaction(...)
```

Do not expose Drizzle's transaction object throughout the application.

The framework owns transaction boundaries.

---

# 56. Model Metadata

Every model should contain metadata:

```ts
Post.metadata = {
  name: "post",

  tableName: "post",

  fields: {
    id: ...,
    title: ...,
    content: ...
  },

  primaryKey: "id",

  indexes: [...],

  relations: [...]
}
```

This metadata becomes the foundation for:

```text
CRUD
validation
queries
migrations
serialization
admin tooling
documentation
```

---

# 57. Serialization

Create a simple serializer.

Example:

```ts
serialize(post);
```

handles:

```text
Date
BigInt
Decimal
JSON
Relations
```

Do not expose database-specific objects to API consumers.

---

# 58. API Validation

Use:

```text
Zod
```

for request validation.

Potential future integration:

```ts
model → validation schema
```

but do not make DML responsible for all API validation.

Database schema and API schema are different concerns.

---

# 59. Authentication

Core only knows:

```ts
AuthContext;
```

Example:

```ts
type AuthContext = {
  authenticated: boolean;
  userId?: string;
  roles?: string[];
};
```

Authentication implementation remains outside core.

---

# 60. Observability

Initial:

```text
request ID
structured logging
workflow ID
step ID
error cause
execution timing
```

Do not build OpenTelemetry integration immediately.

Later:

```text
@my-framework/opentelemetry
```

---

# 61. Security

Security requirements:

- Dependency audit
- SQL parameterization
- Input validation
- Secure headers
- Authentication hooks
- Authorization hooks
- Rate limiting adapter
- Secret handling
- Error redaction
- Request size limits

Never sacrifice security to reduce dependencies.

---

# 62. Testing

Critical tests:

### DML

```text
model definition
type inference
metadata
relations
defaults
indexes
```

### Service Factory

```text
create
retrieve
list
update
delete
filters
pagination
sorting
transactions
```

### Workflow

```text
success
failure
compensation
retry
transaction rollback
```

### DI

```text
singleton
transient
scoped
factory
dependency graph
circular dependencies
```

### HTTP

```text
routes
middleware
validation
errors
request context
```

---

# 63. Reference Application

Build:

```text
Project Management API
```

Modules:

```text
users
projects
tasks
documents
```

Example:

```text
Project
 ├── owner → User
 ├── tasks
 └── documents
```

Workflow:

```text
createProject
    ↓
create project
    ↓
create default task
    ↓
create README document
    ↓
emit project.created
```

This becomes the primary integration test.

---

# 64. Example Final Application

A real application should eventually look like:

```text
my-app/
├── src/
│   ├── api/
│   │   ├── projects/
│   │   │   └── route.ts
│   │   └── projects/
│   │       └── [id]/
│   │           └── route.ts
│   │
│   ├── modules/
│   │   ├── project/
│   │   │   ├── index.ts
│   │   │   ├── service.ts
│   │   │   └── models/
│   │   │       └── project.ts
│   │   │
│   │   └── user/
│   │
│   ├── workflows/
│   │   └── create-project.ts
│   │
│   ├── subscribers/
│   │   └── project-created.ts
│   │
│   └── middlewares.ts
│
├── framework.config.ts
└── package.json
```

---

# 65. Example Module

```ts
// models/project.ts

import { model } from "@my-framework/framework";

export const Project = model.define("project", {
  id: model.id().primaryKey(),

  name: model.text(),

  description: model.text().nullable(),

  ownerId: model.id(),

  status: model.enum(["draft", "active", "archived"]).default("draft"),

  createdAt: model.dateTime(),

  updatedAt: model.dateTime(),
});
```

Service:

```ts
// service.ts

import { ServiceFactory } from "@my-framework/framework";
import { Project } from "./models/project";

class ProjectModuleService extends ServiceFactory({
  Project,
}) {
  async archiveProject(id: string) {
    return this.updateProjects({
      selector: { id },
      data: {
        status: "archived",
      },
    });
  }
}

export default ProjectModuleService;
```

This should be the normal development experience.

---

# 66. Automatic CRUD

The developer should NOT have to write:

```text
create()
find()
findOne()
update()
delete()
repository()
mapper()
DTO()
```

for every model.

Instead:

```ts
class ProjectService extends ServiceFactory({
  Project,
}) {}
```

should be enough.

This is one of the main reasons for building the framework.

---

# 67. Custom Business Logic

Generated CRUD should not prevent custom logic.

Example:

```ts
class ProjectService extends ServiceFactory({
  Project,
}) {
  async archiveProject(id: string) {
    const project = await this.retrieveProject(id);

    if (project.status === "archived") {
      return project;
    }

    return this.updateProjects({
      selector: { id },
      data: {
        status: "archived",
      },
    });
  }
}
```

Generated methods handle boring database operations.

Custom methods handle business logic.

---

# 68. Medusa-Like Architecture

Target:

```text
                     Application
                          │
             ┌────────────┼────────────┐
             ↓            ↓            ↓
           Routes      Workflows     Jobs
             │            │            │
             └────────────┼────────────┘
                          ↓
                     Module Services
                          │
                    Service Factory
                          │
                    Repository Factory
                          │
                       Drizzle
                          │
                     PostgreSQL
```

---

# 69. Medusa Concepts We Should Reproduce

Medusa's framework documentation identifies these concepts:

```text
Container
Modules
Data Models
API Routes
Scheduled Jobs
Query
Workflows
Events/Subscribers
Plugins
```

These are exactly the right conceptual building blocks for our framework.

Our equivalent:

```text
Container
Modules
DML Models
API Routes
Jobs
Query/Repository
Workflows
Events/Subscribers
Plugins
```

---

# 70. Medusa Concepts We Should NOT Reproduce

Do not reproduce:

```text
Commerce modules
Commerce workflows
Commerce entities
Commerce services
Commerce business rules
Commerce-specific module links
Commerce-specific APIs
```

---

# 71. Query Layer

Medusa provides query functionality across modules.

We should eventually provide:

```ts
query.graph({
  entity: "project",

  fields: ["id", "name", "owner.id", "owner.name"],
});
```

But this should be **Phase 2**.

First make direct service CRUD excellent.

---

# 72. Cross-Module Queries

Do not allow:

```text
Module A → Module B database directly
```

Instead:

```text
Module A
   ↓
Query Layer
   ↓
Module B
```

This maintains module boundaries.

---

# 73. Plugin System

Later:

```ts
definePlugin({
  name: "storage",

  modules: [
    storageModule,
  ],

  routes: [
    ...
  ],

  workflows: [
    ...
  ],
})
```

Plugins should be able to package:

```text
modules
routes
workflows
subscribers
jobs
middleware
```

---

# 74. Recommended Development Order

## Phase 1

Build:

```text
DML
Model metadata
Drizzle adapter
Database
Repository
Service Factory
```

This is the highest priority.

Without this, the rest of the framework has no useful foundation.

---

## Phase 2

Build:

```text
DI
Module system
Module lifecycle
```

---

## Phase 3

Build:

```text
Fastify
Routes
Middleware
Request context
Validation
```

---

## Phase 4

Build:

```text
Workflows
Steps
Transactions
Compensation
```

---

## Phase 5

Build:

```text
Events
Subscribers
Jobs
Scheduler
```

---

## Phase 6

Build:

```text
CLI
Generators
Testing utilities
Developer tooling
```

---

## Phase 7

Build:

```text
Query graph
Module links
Plugins
Redis adapters
Queue adapters
Temporal adapter
```

Only when needed.

---

# 75. Estimated Timeline

With one experienced TypeScript developer:

### Weeks 1-2

```text
Monorepo
Core
DML
Model metadata
Drizzle integration
```

### Weeks 3-4

```text
Repository
Service Factory
Automatic CRUD
Type-safe filters
Pagination
Transactions
```

### Weeks 5-6

```text
DI
Modules
Module lifecycle
Fastify
Routes
Middleware
```

### Weeks 7-8

```text
Workflows
Steps
Compensation
Retries
```

### Weeks 9-10

```text
Events
Subscribers
Jobs
Scheduler
```

### Weeks 11-12

```text
CLI
Generators
Testing
Documentation
Reference application
```

A useful **v0.1** should therefore be achievable in roughly:

```text
10-14 weeks full-time
```

The DML/service factory is the area most likely to extend the schedule because getting TypeScript inference, relations, filters, and generated CRUD APIs right requires careful design.

---

# 76. Version 0.1 Dependency List

Keep the initial runtime approximately:

```text
fastify
drizzle-orm
pg
zod
```

Development:

```text
typescript
tsx
vitest
drizzle-kit
```

Everything else is initially our code.

Potentially:

```text
pino
```

if Fastify's logging facilities aren't sufficient for our abstraction.

---

# 77. Version 1.0 Optional Dependencies

Only add when required:

```text
redis
bullmq
temporal
opentelemetry
s3 SDK
auth provider
```

These should be separate packages.

---

# 78. Dependency Philosophy

The framework should have:

```text
Small core
Few dependencies
Stable APIs
Long upgrade cycles
Strong tests
Explicit abstractions
```

Do NOT chase latest versions.

Dependency upgrades happen only for:

```text
security
critical bugs
required features
runtime compatibility
```

---

# 79. Important Rule About Reimplementing

We should NOT rewrite:

```text
PostgreSQL driver
HTTP server
SQL engine
cryptography
TLS
JSON parser
test runner
```

We SHOULD implement:

```text
DML
Service Factory
CRUD generation
DI
Module system
Workflow engine
Route discovery
Middleware abstraction
Event bus
Application lifecycle
```

Those are the framework's actual value.

---

# 80. Commercial Use

The framework should eventually have its own license.

Recommended:

```text
MIT
```

if you want:

```text
personal use
commercial applications
private applications
open-source applications
forks
```

Third-party dependencies must retain their respective licenses.

If incorporating actual Medusa source code, verify the license of every copied component. Medusa's repository currently distinguishes MIT-licensed core code from Enterprise Edition material under separate licensing terms.

For a commercial framework, prefer **independent implementation based on public concepts and documentation** unless there is a specific reason to copy MIT-licensed source.

---

# 81. The Most Important Design Decision

The framework should provide this:

```ts
const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text(),
});
```

Then:

```ts
class PostService extends ServiceFactory({
  Post,
}) {}
```

And immediately provide:

```ts
postService.createPosts(...)
postService.retrievePost(...)
postService.listPosts(...)
postService.updatePosts(...)
postService.deletePosts(...)
```

with:

```text
✓ Type-safe inputs
✓ Type-safe outputs
✓ Type-safe filters
✓ Type-safe fields
✓ Type-safe pagination
✓ Transactions
✓ Relations
✓ Custom methods
```

That should be the **north star of the framework**.

Everything else exists to make that developer experience reliable.

---

# 82. Final Architecture

```text
                        YOUR APPLICATION
                              │
             ┌────────────────┼────────────────┐
             ↓                ↓                ↓
           API            WORKFLOWS           JOBS
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                       MODULE SERVICES
                              │
                   ┌──────────┴──────────┐
                   ↓                     ↓
             CUSTOM LOGIC          GENERATED CRUD
                                         │
                                  Service Factory
                                         │
                                  Repository Factory
                                         │
                                     Model DML
                                         │
                                      Drizzle
                                         │
                                    PostgreSQL


             ┌──────────────────────────────────┐
             │          FRAMEWORK CORE          │
             │                                  │
             │ DI                               │
             │ Modules                          │
             │ Lifecycle                        │
             │ Context                          │
             │ Configuration                    │
             │ Events                           │
             │ Middleware                       │
             │ Errors                            │
             └──────────────────────────────────┘
```

---

# 83. Success Criteria

The framework is successful when creating a new domain model requires approximately:

```text
1. Define model
2. Extend ServiceFactory
3. Write custom business methods only where needed
4. Add workflow if operation spans multiple actions
5. Add API route
```

Not:

```text
model
entity
DTO
repository
repository interface
service
service interface
mapper
CRUD controller
controller interface
validation
database adapter
transaction wrapper
```

The framework exists specifically to eliminate that repetitive work while preserving strong TypeScript safety.

---

# 84. North Star Example

The ideal developer experience:

```ts
// models/project.ts

export const Project = model.define("project", {
  id: model.id().primaryKey(),

  name: model.text(),

  description: model.text().nullable(),

  status: model.enum(["draft", "active", "archived"]).default("draft"),
});
```

```ts
// service.ts

export default class ProjectModuleService extends ServiceFactory({
  Project,
}) {
  async archiveProject(id: string) {
    return this.updateProjects({
      selector: { id },
      data: {
        status: "archived",
      },
    });
  }
}
```

That's it.

The framework handles:

```text
database schema
migrations
repository
CRUD
types
transactions
serialization
dependency injection
module registration
```

while the developer handles:

```text
business logic
```

That is the framework we should build.
