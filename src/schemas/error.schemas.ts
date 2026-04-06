import { z } from '@hono/zod-openapi'

export const ValidationErrorSchema = z
  .object({
    error: z.literal('validation_error'),
    details: z.record(z.string(), z.string()).openapi({
      example: { email: 'This field is required' },
    }),
  })
  .openapi('ValidationError')

export const NotFoundSchema = z
  .object({
    error: z.string(),
    message: z.string(),
  })
  .openapi('NotFoundError')
