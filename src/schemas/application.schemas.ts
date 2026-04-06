import { z } from '@hono/zod-openapi'

export const CreateApplicationBodySchema = z
  .object({
    first_name: z.string().min(1).openapi({
      example: 'Jane',
      description: 'Applicant first name',
    }),
    last_name: z.string().min(1).openapi({
      example: 'Doe',
      description: 'Applicant last name',
    }),
    email: z.string().email().openapi({
      example: 'jane.doe@example.com',
      description: 'Contact email',
    }),
    loan_amount: z.number().positive().openapi({
      example: 25000,
      description: 'Requested loan amount',
    }),
  })
  .openapi('CreateApplicationRequest')

export const ApplicationResponseSchema = z
  .object({
    id: z.string().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    status: z.literal('draft'),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    loan_amount: z.number(),
  })
  .openapi('Application')

export const ApplicationIdParamSchema = z.object({
  id: z.string().min(1).openapi({
    param: { name: 'id', in: 'path' },
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),
})
