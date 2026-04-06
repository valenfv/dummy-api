# Loan Applications API

A well-architected dummy API for loan applications built with TypeScript, Hono, and Zod.

## Architecture

This project follows **clean architecture principles** with clear separation of concerns:

```
src/
├── types/              # Domain models and DTOs
│   ├── application.types.ts
│   └── errors.types.ts
├── schemas/            # Zod validation schemas (OpenAPI)
│   ├── application.schemas.ts
│   └── error.schemas.ts
├── repositories/       # Data access layer (interface + implementation)
│   └── application.repository.ts
├── services/           # Business logic layer
│   └── application.service.ts
├── handlers/           # HTTP request handlers
│   └── application.handlers.ts
├── routes/             # OpenAPI route definitions
│   └── application.routes.ts
├── middleware/         # Custom middleware
│   └── validation.middleware.ts
├── utils/              # Helper functions
│   └── validation.utils.ts
├── app.ts              # Application setup & dependency injection
└── index.ts            # Server entry point
```

### Architecture Benefits

#### ✅ Low Coupling
- **Repository Interface**: `IApplicationRepository` allows easy swapping of data sources (in-memory → database)
- **Service Layer**: Business logic isolated from HTTP concerns
- **Handler Layer**: HTTP-specific logic separated from business logic
- **Middleware**: Validation logic extracted and reusable

#### ✅ High Cohesion
- **Types folder**: All domain models in one place
- **Schemas folder**: All validation schemas together
- **Each layer has single responsibility**: Repository (data), Service (business), Handler (HTTP)

#### ✅ Testability
- Services can be unit tested with mocked repositories
- Handlers can be tested with mocked services
- No tight coupling to HTTP framework in business logic

#### ✅ Maintainability
- Easy to locate code: "Where's validation?" → `schemas/` and `middleware/`
- Easy to extend: Add new entity? Create matching files in each layer
- Easy to swap implementations: Change `InMemoryRepository` to `PostgresRepository`

## API Endpoints

### POST /applications
Create a new loan application.

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "loan_amount": 25000
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "draft",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "loan_amount": 25000
}
```

**Validation Error (422):**
```json
{
  "error": "validation_error",
  "details": {
    "email": "This field is required"
  }
}
```

### GET /applications/{id}
Retrieve an application by ID.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "draft",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "loan_amount": 25000
}
```

**Not Found (404):**
```json
{
  "error": "not_found",
  "message": "Application not found"
}
```

## Documentation

- **OpenAPI JSON**: `GET /doc`
- **Swagger UI**: `GET /swagger`

## Stack

- **[Hono](https://hono.dev/)** - Fast, lightweight web framework
- **[@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)** - OpenAPI + Zod validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[@hono/swagger-ui](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)** - Interactive API documentation
- **TypeScript** - Type safety

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev        # Watch mode with tsx
```

### Production

```bash
npm run build      # Compile TypeScript
npm run serve      # Run compiled JS
```

### Deploy to Vercel

This API is ready to deploy on Vercel. You can deploy using:

#### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option 2: Vercel Dashboard
1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Vercel will automatically detect the configuration

#### Option 3: Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

The project includes:
- `vercel.json` - Vercel configuration with routing
- `api/index.ts` - Serverless function entry point
- Automatic builds on push

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start server without hot reload (tsx)
- `npm run build` - Compile TypeScript to `dist/`
- `npm run serve` - Run compiled JavaScript
- `npm run typecheck` - Type check without emitting files
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:coverage` - Run tests with coverage report

### Environment Variables

- `PORT` - Server port (default: 3000)

## Design Patterns Used

### 1. Repository Pattern
Abstracts data access behind `IApplicationRepository` interface, making it easy to swap implementations.

```typescript
// Can easily swap InMemoryApplicationRepository with:
// - PostgresApplicationRepository
// - MongoApplicationRepository
// - etc.
```

### 2. Dependency Injection
Dependencies injected through constructors in `app.ts`:

```typescript
const repository = new InMemoryApplicationRepository()
const service = new ApplicationService(repository)  // DI
const handlers = new ApplicationHandlers(service)   // DI
```

### 3. Custom Error Types
Domain-specific errors for better error handling:

```typescript
throw new ApplicationNotFoundError(id)  // Caught and converted to 404
```

### 4. Factory Pattern
`createApp()` function encapsulates application setup and wiring.

## SOLID Principles

- **Single Responsibility**: Each class/module has one reason to change
- **Open/Closed**: Open for extension (add new repositories), closed for modification
- **Liskov Substitution**: Any `IApplicationRepository` implementation works
- **Interface Segregation**: Interfaces are minimal and focused
- **Dependency Inversion**: Depend on abstractions (`IApplicationRepository`), not concretions

## Adding New Features

### Adding a new entity (e.g., "User"):

1. **Types**: Create `types/user.types.ts`
2. **Schemas**: Create `schemas/user.schemas.ts`
3. **Repository**: Create `repositories/user.repository.ts` with interface
4. **Service**: Create `services/user.service.ts`
5. **Handlers**: Create `handlers/user.handlers.ts`
6. **Routes**: Create `routes/user.routes.ts`
7. **Wire up**: Register routes in `app.ts`

This structure ensures consistency and maintainability across features.

## Testing Strategy

The architecture supports multiple testing levels:

- **Unit Tests**: Test services with mocked repositories
- **Integration Tests**: Test handlers with real services + in-memory repos
- **E2E Tests**: Test full HTTP endpoints

Example:
```typescript
// Unit test
const mockRepo = { findById: jest.fn() }
const service = new ApplicationService(mockRepo)
await service.getApplicationById('123')
expect(mockRepo.findById).toHaveBeenCalledWith('123')
```

## Testing

### Test Suite

The project includes a comprehensive test suite with **103 tests** achieving **95.33% code coverage**:

- **54 API tests** - Complete endpoint testing (POST, GET, validation, OpenAPI)
- **49 unit tests** - Service, repository, and utility layers
- **Fast execution** - Full suite runs in ~200ms

See [TESTS.md](TESTS.md) for detailed test documentation.

### Run Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # With coverage report
```

### Test Coverage

```
Overall Coverage: 95.33%
- Statements: 95.33%
- Branches: 91.42%
- Functions: 93.75%
- Lines: 95.33%
```

All critical paths covered:
- ✅ Happy paths
- ✅ Error scenarios
- ✅ Edge cases
- ✅ Validation rules
- ✅ Integration flows

## License

ISC
