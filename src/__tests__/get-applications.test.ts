import { describe, it, expect, beforeEach } from 'vitest'
import { createApp } from '../app.js'
import type { Application } from '../types/application.types.js'

describe('GET /applications/{id}', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    app = createApp()
  })

  describe('successful retrieval', () => {
    it('should return 200 and application data when ID exists', async () => {
      const createRes = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Alice',
          last_name: 'Smith',
          email: 'alice@example.com',
          loan_amount: 15000,
        }),
      })

      const created: Application = await createRes.json()

      const getRes = await app.request(`/applications/${created.id}`)

      expect(getRes.status).toBe(200)

      const data: Application = await getRes.json()
      expect(data).toEqual(created)
      expect(data).toMatchObject({
        id: created.id,
        status: 'draft',
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
        loan_amount: 15000,
      })
    })

    it('should return the same data on multiple GET requests', async () => {
      const createRes = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Bob',
          last_name: 'Jones',
          email: 'bob@example.com',
          loan_amount: 20000,
        }),
      })

      const created: Application = await createRes.json()

      const getRes1 = await app.request(`/applications/${created.id}`)
      const getRes2 = await app.request(`/applications/${created.id}`)

      const data1: Application = await getRes1.json()
      const data2: Application = await getRes2.json()

      expect(data1).toEqual(data2)
    })

    it('should retrieve multiple different applications correctly', async () => {
      const app1Data = {
        first_name: 'Charlie',
        last_name: 'Brown',
        email: 'charlie@example.com',
        loan_amount: 5000,
      }

      const app2Data = {
        first_name: 'Diana',
        last_name: 'Prince',
        email: 'diana@example.com',
        loan_amount: 50000,
      }

      const createRes1 = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app1Data),
      })

      const createRes2 = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app2Data),
      })

      const created1: Application = await createRes1.json()
      const created2: Application = await createRes2.json()

      const getRes1 = await app.request(`/applications/${created1.id}`)
      const getRes2 = await app.request(`/applications/${created2.id}`)

      const retrieved1: Application = await getRes1.json()
      const retrieved2: Application = await getRes2.json()

      expect(retrieved1).toMatchObject(app1Data)
      expect(retrieved2).toMatchObject(app2Data)
      expect(retrieved1.id).not.toBe(retrieved2.id)
    })
  })

  describe('not found scenarios', () => {
    it('should return 404 when application ID does not exist', async () => {
      const res = await app.request(
        '/applications/550e8400-e29b-41d4-a716-446655440000'
      )

      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data).toEqual({
        error: 'not_found',
        message: 'Application not found',
      })
    })

    it('should return 404 for random UUID', async () => {
      const res = await app.request(
        '/applications/00000000-0000-0000-0000-000000000000'
      )

      expect(res.status).toBe(404)
    })

    it('should return 404 for non-UUID ID', async () => {
      const res = await app.request('/applications/invalid-id')

      expect(res.status).toBe(404)
    })

    it('should return 404 for empty ID', async () => {
      const res = await app.request('/applications/ ')

      expect(res.status).toBe(404)
    })

    it('should return 404 for numeric ID', async () => {
      const res = await app.request('/applications/123')

      expect(res.status).toBe(404)
    })
  })

  describe('edge cases', () => {
    it('should handle special characters in ID gracefully', async () => {
      const res = await app.request('/applications/abc@#$%')

      expect(res.status).toBe(404)
    })

    it('should handle very long ID strings', async () => {
      const longId = 'a'.repeat(1000)
      const res = await app.request(`/applications/${longId}`)

      expect(res.status).toBe(404)
    })

    it('should be case-sensitive for IDs', async () => {
      const createRes = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          loan_amount: 10000,
        }),
      })

      const created: Application = await createRes.json()
      const uppercaseId = created.id.toUpperCase()

      if (uppercaseId !== created.id) {
        const res = await app.request(`/applications/${uppercaseId}`)
        expect(res.status).toBe(404)
      }
    })
  })
})
