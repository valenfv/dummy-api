# Test Documentation

## Overview

Comprehensive test suite covering all API endpoints, business logic, data access, and utilities with **103 tests** achieving **95.33% code coverage**.

## Test Structure

```
src/__tests__/
├── post-applications.test.ts    # POST /applications endpoint (17 tests)
├── get-applications.test.ts     # GET /applications/{id} endpoint (11 tests)
├── integration.test.ts          # Full workflow integration (11 tests)
├── openapi.test.ts              # OpenAPI documentation (15 tests)
├── service.test.ts              # Service layer unit tests (16 tests)
├── repository.test.ts           # Repository layer unit tests (18 tests)
└── validation.test.ts           # Validation utilities (15 tests)
```

## Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Categories

### 1. API Tests (54 tests)

#### POST /applications (17 tests)
- ✅ Valid data creation (201)
- ✅ Unique ID generation
- ✅ Minimum/maximum loan amounts
- ✅ Missing required fields (422)
- ✅ Invalid email format (422)
- ✅ Empty string validation (422)
- ✅ Zero/negative loan amounts (422)
- ✅ Type mismatches (422)
- ✅ Multiple missing fields (422)
- ✅ Content-Type handling
- ✅ Malformed JSON
- ✅ Empty body

#### GET /applications/{id} (11 tests)
- ✅ Successful retrieval (200)
- ✅ Multiple retrievals consistency
- ✅ Multiple applications isolation
- ✅ Non-existent ID (404)
- ✅ Invalid ID formats (404)
- ✅ Empty/whitespace IDs (404)
- ✅ Special characters handling
- ✅ Very long IDs
- ✅ Case sensitivity

#### Integration Tests (11 tests)
- ✅ Complete create → retrieve workflow
- ✅ Multiple applications in sequence
- ✅ Data persistence across retrievals
- ✅ Error recovery
- ✅ Mixed success/failure scenarios
- ✅ Data isolation between instances
- ✅ Boundary conditions (min/max values)
- ✅ Unicode character support
- ✅ Long email addresses
- ✅ Decimal loan amounts

#### OpenAPI Documentation (15 tests)
- ✅ OpenAPI JSON document structure
- ✅ Correct version (3.0.0)
- ✅ API metadata (title, version, description)
- ✅ Tags definition
- ✅ POST endpoint definition
- ✅ GET endpoint definition
- ✅ Request body schemas
- ✅ Response schemas (201, 200, 422, 404)
- ✅ Component schemas
- ✅ Required fields definition
- ✅ Email format validation
- ✅ Positive number constraints
- ✅ Swagger UI rendering
- ✅ Swagger UI configuration

### 2. Unit Tests (49 tests)

#### Service Layer (16 tests)
- ✅ Create application with provided data
- ✅ Always set status to 'draft'
- ✅ Generate unique IDs
- ✅ Save to repository
- ✅ Handle special characters
- ✅ Handle decimal amounts
- ✅ Preserve email case
- ✅ Retrieve existing application
- ✅ Throw ApplicationNotFoundError when not found
- ✅ Error messages contain correct ID
- ✅ Retrieve multiple applications
- ✅ Consistent data on multiple retrievals
- ✅ UUID format validation
- ✅ Handle empty/whitespace IDs
- ✅ Error isolation

#### Repository Layer (18 tests)
- ✅ Save and return application
- ✅ Make saved data retrievable
- ✅ Overwrite existing ID
- ✅ Save multiple applications independently
- ✅ Handle special characters in ID
- ✅ Handle unicode in data
- ✅ Handle large loan amounts
- ✅ Handle decimal amounts
- ✅ Return null for non-existent ID
- ✅ Return null for empty ID
- ✅ Return application when exists
- ✅ Case-sensitive ID lookup
- ✅ Same reference on multiple calls
- ✅ Handle whitespace IDs
- ✅ Handle very long IDs
- ✅ Data isolation between instances
- ✅ Multiple saves in sequence
- ✅ Parallel saves

#### Validation Utilities (15 tests)
- ✅ Format missing required field
- ✅ Format multiple missing fields
- ✅ Only show missing fields
- ✅ Format email validation error
- ✅ Format minimum length error
- ✅ Format positive number error
- ✅ Format type mismatch error
- ✅ Format nested field errors
- ✅ Use last path segment for nested
- ✅ First error only per field
- ✅ Handle empty error path
- ✅ Handle undefined in path
- ✅ Return empty object for no errors
- ✅ Real-world application schema
- ✅ All fields missing scenario

## Coverage Report

```
File                           | % Stmts | % Branch | % Funcs | % Lines
-------------------------------|---------|----------|---------|--------
All files                      |   95.33 |    91.42 |   93.75 |   95.33
  app.ts                       |     100 |      100 |     100 |     100
  handlers/application.handlers|   91.66 |    85.71 |     100 |   91.66
  middleware/validation        |     100 |      100 |     100 |     100
  repositories/application     |     100 |      100 |     100 |     100
  routes/application           |     100 |      100 |     100 |     100
  schemas/application          |     100 |      100 |     100 |     100
  schemas/error                |     100 |      100 |     100 |     100
  services/application         |     100 |      100 |     100 |     100
  types/errors                 |     100 |      100 |     100 |     100
  utils/validation             |     100 |    91.66 |     100 |     100
  index.ts                     |       0 |        0 |       0 |       0
```

**Note**: `index.ts` has 0% coverage as it's the server entry point (not testable in isolation).

## Test Patterns Used

### 1. Arrange-Act-Assert (AAA)
```typescript
it('should create application with valid data', async () => {
  // Arrange
  const data = { first_name: 'John', ... }
  
  // Act
  const result = await service.createApplication(data)
  
  // Assert
  expect(result.status).toBe('draft')
})
```

### 2. Test Isolation
Each test creates a fresh app instance to avoid cross-test contamination:
```typescript
beforeEach(() => {
  app = createApp()  // Fresh instance per test
})
```

### 3. Mock Injection
Service tests use real repository, demonstrating integration without external dependencies:
```typescript
const repository = new InMemoryApplicationRepository()
const service = new ApplicationService(repository)
```

### 4. Descriptive Test Names
```typescript
describe('POST /applications', () => {
  describe('successful creation', () => {
    it('should create application with valid data and return 201', ...)
  })
  
  describe('validation errors', () => {
    it('should return 422 when email is missing', ...)
  })
})
```

## Testing Best Practices Applied

### ✅ Comprehensive Coverage
- Happy paths
- Error scenarios
- Edge cases
- Boundary conditions
- Integration flows

### ✅ Fast Execution
103 tests complete in ~200ms:
- No external dependencies
- In-memory storage
- No network calls
- Parallel execution

### ✅ Independent Tests
- No shared state
- Fresh instances per test
- No test execution order dependencies

### ✅ Clear Assertions
- Specific expectations
- Meaningful error messages
- Type-safe assertions

### ✅ Real-World Scenarios
- Complete workflows
- Unicode characters
- Decimal values
- Long strings
- Special characters

## Test Maintenance

### Adding Tests for New Features

1. **New endpoint**: Create new test file in `__tests__/`
2. **New service method**: Add tests to `service.test.ts`
3. **New repository method**: Add tests to `repository.test.ts`
4. **New utility**: Create `{utility}.test.ts`

### Test File Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createApp } from '../app.js'

describe('Feature Name', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    app = createApp()
  })

  describe('happy path', () => {
    it('should do expected thing', async () => {
      // Test implementation
    })
  })

  describe('error cases', () => {
    it('should handle error gracefully', async () => {
      // Test implementation
    })
  })
})
```

## Continuous Integration

Tests are ready for CI/CD pipelines:

```yaml
# Example GitHub Actions
- run: npm install
- run: npm run typecheck
- run: npm test
- run: npm run test:coverage
```

## Coverage Goals

Current: **95.33%** ✅

Target zones for 100%:
- `index.ts` - Server entry point (excluded, not testable)
- Handler error branches - Add error throw tests
- Validation edge case (line 13 in utils)

## Benefits

### For Development
- ✅ Catch regressions immediately
- ✅ Refactor with confidence
- ✅ Document expected behavior
- ✅ Fast feedback loop (<2 seconds)

### For Code Review
- ✅ Verify requirements are met
- ✅ Understand intended behavior
- ✅ Ensure edge cases handled

### For Production
- ✅ High confidence in deployments
- ✅ Reduced bug rate
- ✅ Faster debugging (tests reveal issues)

## Test Examples

### Happy Path Test
```typescript
it('should create application with valid data and return 201', async () => {
  const res = await app.request('/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      loan_amount: 25000,
    }),
  })

  expect(res.status).toBe(201)
  const data = await res.json()
  expect(data.status).toBe('draft')
  expect(data.id).toBeDefined()
})
```

### Error Handling Test
```typescript
it('should return 422 when email is missing', async () => {
  const res = await app.request('/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: 'Jane',
      last_name: 'Doe',
      loan_amount: 25000,
    }),
  })

  expect(res.status).toBe(422)
  const data = await res.json()
  expect(data).toEqual({
    error: 'validation_error',
    details: { email: 'This field is required' },
  })
})
```

### Integration Test
```typescript
it('should create and retrieve application successfully', async () => {
  // Create
  const createRes = await app.request('/applications', { ... })
  expect(createRes.status).toBe(201)
  const created = await createRes.json()

  // Retrieve
  const getRes = await app.request(`/applications/${created.id}`)
  expect(getRes.status).toBe(200)
  const retrieved = await getRes.json()

  // Verify
  expect(retrieved).toEqual(created)
})
```

### Unit Test
```typescript
it('should throw ApplicationNotFoundError when ID does not exist', async () => {
  await expect(
    service.getApplicationById('nonexistent-id')
  ).rejects.toThrow(ApplicationNotFoundError)
})
```

## Running Specific Tests

```bash
# Run single test file
npm test post-applications.test.ts

# Run tests matching pattern
npm test -- --grep "validation"

# Run with debug output
npm test -- --reporter=verbose

# Watch mode for specific file
npm run test:watch service.test.ts
```

## Debugging Tests

### Using Vitest UI
```bash
npm run test:ui
```
Opens interactive UI at http://localhost:51204

### Console Logging
```typescript
it('debug test', async () => {
  console.log('Debug:', data)  // Visible in test output
  expect(data).toBeDefined()
})
```

### VS Code Debugging
Add breakpoint in test file, then:
1. Open test file
2. Click "Debug" above test name
3. Step through execution

## Summary

✅ **103 tests** covering all functionality  
✅ **95.33% code coverage** across all layers  
✅ **~200ms execution time** for entire suite  
✅ **Zero external dependencies** for tests  
✅ **Production-ready** test infrastructure  

The test suite ensures:
- All API requirements are met
- Business logic is correct
- Data access works properly
- Validation handles all cases
- Error handling is robust
- OpenAPI docs are accurate
