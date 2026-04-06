import type { Context, Env } from 'hono'
import type { Hook } from '@hono/zod-openapi'
import { formatZodErrorDetails } from '../utils/validation.utils.js'

export const createValidationHook = <E extends Env>(): Hook<
  any,
  E,
  any,
  any
> => {
  return (result, c: Context<E, any>) => {
    if (!result.success) {
      return c.json(
        {
          error: 'validation_error' as const,
          details: formatZodErrorDetails(result.error),
        },
        422
      )
    }
  }
}
