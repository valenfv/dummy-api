import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { InMemoryApplicationRepository } from './repositories/application.repository.js'
import { ApplicationService } from './services/application.service.js'
import { ApplicationHandlers } from './handlers/application.handlers.js'
import {
  getApplicationRoute,
  postApplicationRoute,
} from './routes/application.routes.js'
import { createValidationHook } from './middleware/validation.middleware.js'

export function createApp() {
  const app = new OpenAPIHono({
    defaultHook: createValidationHook(),
  })

  const repository = new InMemoryApplicationRepository()
  const service = new ApplicationService(repository)
  const handlers = new ApplicationHandlers(service)

  app.get('/', (c) => {
    return c.json({
      message: 'Loan Applications API',
      version: '1.0.0',
      endpoints: {
        documentation: '/swagger',
        openapi: '/doc',
        applications: {
          create: 'POST /applications',
          get: 'GET /applications/:id',
        },
      },
    })
  })

  app.openapi(postApplicationRoute, handlers.createApplication)
  app.openapi(getApplicationRoute, handlers.getApplicationById)

  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Loan applications API',
      version: '1.0.0',
      description: 'Dummy API for loan applications',
    },
    tags: [{ name: 'Applications', description: 'Application lifecycle' }],
  })

  app.get('/swagger', swaggerUI({ url: '/doc' }))

  return app
}
