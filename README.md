# Loan Applications API - NestJS

Dummy API for loan applications built with NestJS, TypeScript, Swagger, and Zod.

## Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **Swagger/OpenAPI** - API documentation
- **class-validator** - Validation decorators
- **Zod** - Schema validation

## Getting Started

```bash
npm install
npm run dev        # Development with watch mode
npm run build      # Build for production
npm start:prod     # Run production build
```

## API Endpoints

### GET /
Root endpoint with API information

### POST /applications
Create loan application
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "loan_amount": 25000
}
```

### GET /applications/:id
Get application by ID

## Documentation

- **Swagger UI**: http://localhost:3000/swagger
- **OpenAPI JSON**: http://localhost:3000/swagger-json

## Vercel Deployment

NestJS has native Vercel support. No extra config needed.

```bash
npm install -g vercel
vercel
```

Or push to GitHub and import in Vercel Dashboard.

## Structure

```
src/
├── main.ts                    # Bootstrap
├── app.module.ts              # Root module
├── app.controller.ts          # Root controller
└── application/
    ├── application.module.ts
    ├── application.controller.ts
    ├── application.service.ts
    ├── application.repository.ts
    ├── application.entity.ts
    └── dto/
        └── create-application.dto.ts
```
