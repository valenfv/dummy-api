# Architecture Layers

## Request Flow

```
HTTP Request
    ↓
┌─────────────────────┐
│   index.ts          │  Entry point - starts server
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   app.ts            │  Wires up dependencies & routes
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   middleware/       │  Validation hook (422 errors)
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   routes/           │  OpenAPI route definitions
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   handlers/         │  HTTP-specific logic
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   services/         │  Business logic
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   repositories/     │  Data access
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   In-Memory Store   │  Map<string, Application>
└─────────────────────┘
```

## Layer Responsibilities

### Types (`types/`)
- Domain models (Application, ApplicationStatus)
- DTOs (CreateApplicationDTO)
- Custom errors (ApplicationNotFoundError)
- **No dependencies on other layers**

### Schemas (`schemas/`)
- Zod schemas for validation
- OpenAPI metadata
- Request/response shapes
- Uses: `@hono/zod-openapi`

### Repositories (`repositories/`)
- Data access interface (`IApplicationRepository`)
- Concrete implementations (`InMemoryApplicationRepository`)
- Returns domain models
- Uses: `types/`

### Services (`services/`)
- Business logic
- Orchestrates repositories
- Throws domain errors
- Uses: `repositories/`, `types/`

### Handlers (`handlers/`)
- HTTP request/response handling
- Converts service errors to HTTP responses
- Validates with `c.req.valid()`
- Uses: `services/`, `routes/` (for typing)

### Routes (`routes/`)
- OpenAPI route definitions with `createRoute()`
- Links schemas to endpoints
- Uses: `schemas/`

### Middleware (`middleware/`)
- Reusable cross-cutting concerns
- Validation error formatting
- Uses: `utils/`

### Utils (`utils/`)
- Pure helper functions
- No side effects
- Minimal dependencies

### App (`app.ts`)
- Dependency injection container
- Wires up all layers
- Registers routes
- Configures OpenAPI docs

### Index (`index.ts`)
- Server entry point
- Starts HTTP server
- Minimal logic

## Dependency Graph

```
index.ts
  └─→ app.ts
       ├─→ middleware/
       │    └─→ utils/
       ├─→ routes/
       │    └─→ schemas/
       ├─→ handlers/
       │    ├─→ services/
       │    │    ├─→ repositories/
       │    │    │    └─→ types/
       │    │    └─→ types/
       │    └─→ routes/ (for types only)
       └─→ repositories/
            └─→ types/
```

## Why This Structure?

### Testability
Each layer can be tested independently:
- **Services** tested with mocked repositories
- **Handlers** tested with mocked services
- **Repositories** tested with real data stores

### Flexibility
- Swap `InMemoryRepository` → `PostgresRepository` (only change `app.ts`)
- Change validation library (only change `schemas/` & `middleware/`)
- Change HTTP framework (only change `handlers/` & `routes/`)

### Scalability
- Add features by creating parallel files
- Each layer grows independently
- Clear ownership of code

### Maintainability
- "Where is X?" has an obvious answer
- Changes isolated to specific layers
- Onboarding easier with clear structure
