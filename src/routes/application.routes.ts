import { createRoute } from '@hono/zod-openapi'
import {
  ApplicationIdParamSchema,
  ApplicationResponseSchema,
  CreateApplicationBodySchema,
} from '../schemas/application.schemas.js'
import {
  NotFoundSchema,
  ValidationErrorSchema,
} from '../schemas/error.schemas.js'

export const postApplicationRoute = createRoute({
  method: 'post',
  path: '/applications',
  tags: ['Applications'],
  summary: 'Create application',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateApplicationBodySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Application created',
      content: {
        'application/json': {
          schema: ApplicationResponseSchema,
        },
      },
    },
    422: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: ValidationErrorSchema,
        },
      },
    },
  },
})

export const getApplicationRoute = createRoute({
  method: 'get',
  path: '/applications/{id}',
  tags: ['Applications'],
  summary: 'Get application by id',
  request: {
    params: ApplicationIdParamSchema,
  },
  responses: {
    200: {
      description: 'Application found',
      content: {
        'application/json': {
          schema: ApplicationResponseSchema,
        },
      },
    },
    404: {
      description: 'Application not found',
      content: {
        'application/json': {
          schema: NotFoundSchema,
        },
      },
    },
  },
})
