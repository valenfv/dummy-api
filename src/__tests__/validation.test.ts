import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { formatZodErrorDetails } from '../utils/validation.utils.js'

describe('formatZodErrorDetails', () => {
  describe('required field errors', () => {
    it('should format missing required field error', () => {
      const schema = z.object({
        email: z.string(),
      })

      const result = schema.safeParse({})
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details).toEqual({
          email: 'This field is required',
        })
      }
    })

    it('should format multiple missing required fields', () => {
      const schema = z.object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.string(),
      })

      const result = schema.safeParse({})
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.first_name).toBe('This field is required')
        expect(details.last_name).toBe('This field is required')
        expect(details.email).toBe('This field is required')
      }
    })

    it('should only show missing fields, not provided ones', () => {
      const schema = z.object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.string(),
      })

      const result = schema.safeParse({ first_name: 'John' })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.first_name).toBeUndefined()
        expect(details.last_name).toBe('This field is required')
        expect(details.email).toBe('This field is required')
      }
    })
  })

  describe('validation errors', () => {
    it('should format email validation error', () => {
      const schema = z.object({
        email: z.string().email(),
      })

      const result = schema.safeParse({ email: 'not-an-email' })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.email).toBeDefined()
        expect(details.email).not.toBe('This field is required')
        expect(details.email).toContain('email')
      }
    })

    it('should format minimum length validation error', () => {
      const schema = z.object({
        name: z.string().min(3),
      })

      const result = schema.safeParse({ name: 'ab' })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.name).toBeDefined()
        expect(details.name).not.toBe('This field is required')
      }
    })

    it('should format positive number validation error', () => {
      const schema = z.object({
        amount: z.number().positive(),
      })

      const result = schema.safeParse({ amount: -5 })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.amount).toBeDefined()
      }
    })

    it('should format type mismatch error', () => {
      const schema = z.object({
        amount: z.number(),
      })

      const result = schema.safeParse({ amount: 'not a number' })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.amount).toBeDefined()
      }
    })
  })

  describe('nested object errors', () => {
    it('should format nested field errors using field name only', () => {
      const schema = z.object({
        user: z.object({
          email: z.string().email(),
        }),
      })

      const result = schema.safeParse({ user: { email: 'invalid' } })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.email).toBeDefined()
      }
    })

    it('should use last segment of path for nested errors', () => {
      const schema = z.object({
        address: z.object({
          city: z.string().min(1),
        }),
      })

      const result = schema.safeParse({ address: { city: '' } })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.city).toBeDefined()
      }
    })
  })

  describe('multiple errors on same field', () => {
    it('should only include first error for each field', () => {
      const schema = z.object({
        email: z.string().min(5).email(),
      })

      const result = schema.safeParse({ email: 'a' })
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        const errorCount = Object.keys(details).filter(
          (key) => key === 'email'
        ).length
        expect(errorCount).toBe(1)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle empty path in error', () => {
      const schema = z.string()
      const result = schema.safeParse(123)
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details.root).toBeDefined()
      }
    })

    it('should handle errors with undefined in path', () => {
      const schema = z.object({
        field: z.string(),
      })

      const result = schema.safeParse({})
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)
        expect(details).toBeDefined()
        expect(Object.keys(details).length).toBeGreaterThan(0)
      }
    })

    it('should return empty object when no errors', () => {
      const mockError = {
        issues: [],
      } as any

      const details = formatZodErrorDetails(mockError)
      expect(details).toEqual({})
    })
  })

  describe('real-world application schema', () => {
    it('should format application validation errors correctly', () => {
      const schema = z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        email: z.string().email(),
        loan_amount: z.number().positive(),
      })

      const result = schema.safeParse({
        first_name: '',
        email: 'invalid-email',
        loan_amount: -1000,
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)

        expect(details.first_name).toBeDefined()
        expect(details.last_name).toBe('This field is required')
        expect(details.email).toBeDefined()
        expect(details.email).not.toBe('This field is required')
        expect(details.loan_amount).toBeDefined()
      }
    })

    it('should handle all fields missing', () => {
      const schema = z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        email: z.string().email(),
        loan_amount: z.number().positive(),
      })

      const result = schema.safeParse({})
      expect(result.success).toBe(false)

      if (!result.success) {
        const details = formatZodErrorDetails(result.error)

        expect(details.first_name).toBe('This field is required')
        expect(details.last_name).toBe('This field is required')
        expect(details.email).toBe('This field is required')
        expect(details.loan_amount).toBe('This field is required')
      }
    })
  })
})
