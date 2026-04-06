import type { ApplicationService } from '../services/application.service.js'
import { ApplicationNotFoundError } from '../types/errors.types.js'
import type {
  getApplicationRoute,
  postApplicationRoute,
} from '../routes/application.routes.js'
import type { RouteHandler } from '@hono/zod-openapi'

export class ApplicationHandlers {
  constructor(private service: ApplicationService) {}

  createApplication: RouteHandler<typeof postApplicationRoute> = async (c) => {
    const body = c.req.valid('json')
    const application = await this.service.createApplication(body)
    return c.json(application, 201)
  }

  getApplicationById: RouteHandler<typeof getApplicationRoute> = async (c) => {
    const { id } = c.req.valid('param')

    try {
      const application = await this.service.getApplicationById(id)
      return c.json(application, 200)
    } catch (error) {
      if (error instanceof ApplicationNotFoundError) {
        return c.json(
          { error: 'not_found', message: 'Application not found' },
          404
        )
      }
      throw error
    }
  }
}
