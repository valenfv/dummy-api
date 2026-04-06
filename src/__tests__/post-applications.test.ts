import { describe, it, expect, beforeEach } from 'vitest'
import { createApp } from '../app.js'
import type { Application } from '../types/application.types.js'

describe('POST /applications', () => {
  const app = createApp()

  describe('successful creation', () => {
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

      const data: Application = await res.json()
      expect(data).toMatchObject({
        status: 'draft',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        loan_amount: 25000,
      })
      expect(data.id).toBeDefined()
      expect(typeof data.id).toBe('string')
      expect(data.id.length).toBeGreaterThan(0)
    })

    it('should generate unique IDs for each application', async () => {
      const payload = {
        first_name: 'John',
        last_name: 'Smith',
        email: 'john@test.com',
        loan_amount: 10000,
      }

      const res1 = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const res2 = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data1: Application = await res1.json()
      const data2: Application = await res2.json()

      expect(data1.id).not.toBe(data2.id)
    })

    it('should accept minimum valid loan amount', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          loan_amount: 0.01,
        }),
      })

      expect(res.status).toBe(201)
    })

    it('should accept large loan amounts', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Rich',
          last_name: 'Person',
          email: 'rich@example.com',
          loan_amount: 1000000,
        }),
      })

      expect(res.status).toBe(201)
    })
  })

  describe('validation errors', () => {
    it('should return 422 when first_name is missing', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          last_name: 'Doe',
          email: 'jane@example.com',
          loan_amount: 25000,
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data).toEqual({
        error: 'validation_error',
        details: {
          first_name: 'This field is required',
        },
      })
    })

    it('should return 422 when last_name is missing', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          email: 'jane@example.com',
          loan_amount: 25000,
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details.last_name).toBe('This field is required')
    })

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
      expect(data.error).toBe('validation_error')
      expect(data.details.email).toBe('This field is required')
    })

    it('should return 422 when loan_amount is missing', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details.loan_amount).toBe('This field is required')
    })

    it('should return 422 when multiple fields are missing', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details).toHaveProperty('last_name')
      expect(data.details).toHaveProperty('email')
      expect(data.details).toHaveProperty('loan_amount')
    })

    it('should return 422 when email format is invalid', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'not-an-email',
          loan_amount: 25000,
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details.email).toBeDefined()
      expect(data.details.email).not.toBe('This field is required')
    })

    it('should return 422 when first_name is empty string', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: '',
          last_name: 'Doe',
          email: 'jane@example.com',
          loan_amount: 25000,
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details.first_name).toBeDefined()
    })

    it('should return 422 when loan_amount is zero', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
          loan_amount: 0,
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details.loan_amount).toBeDefined()
    })

    it('should return 422 when loan_amount is negative', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
          loan_amount: -1000,
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details.loan_amount).toBeDefined()
    })

    it('should return 422 when loan_amount is not a number', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
          loan_amount: 'not a number',
        }),
      })

      expect(res.status).toBe(422)

      const data = await res.json()
      expect(data.error).toBe('validation_error')
      expect(data.details.loan_amount).toBeDefined()
    })
  })

  describe('content type handling', () => {
    it('should handle request without Content-Type header', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
          loan_amount: 25000,
        }),
      })

      expect([422, 400, 415]).toContain(res.status)
    })

    it('should handle malformed JSON', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      })

      expect([422, 400]).toContain(res.status)
    })

    it('should handle empty body', async () => {
      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      })

      expect([422, 400]).toContain(res.status)
    })
  })
})
