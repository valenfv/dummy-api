import { describe, it, expect } from 'vitest'
import { createApp } from '../app.js'

describe('Integration Tests', () => {
  describe('complete application workflow', () => {
    it('should create and retrieve application successfully', async () => {
      const app = createApp()

      const applicationData = {
        first_name: 'Emma',
        last_name: 'Watson',
        email: 'emma@example.com',
        loan_amount: 30000,
      }

      const createRes = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      })

      expect(createRes.status).toBe(201)
      const created = await createRes.json()

      const getRes = await app.request(`/applications/${created.id}`)

      expect(getRes.status).toBe(200)
      const retrieved = await getRes.json()

      expect(retrieved).toEqual(created)
      expect(retrieved).toMatchObject({
        ...applicationData,
        id: created.id,
        status: 'draft',
      })
    })

    it('should handle creating multiple applications in sequence', async () => {
      const app = createApp()

      const applications = [
        {
          first_name: 'User1',
          last_name: 'Test1',
          email: 'user1@test.com',
          loan_amount: 1000,
        },
        {
          first_name: 'User2',
          last_name: 'Test2',
          email: 'user2@test.com',
          loan_amount: 2000,
        },
        {
          first_name: 'User3',
          last_name: 'Test3',
          email: 'user3@test.com',
          loan_amount: 3000,
        },
      ]

      const ids: string[] = []

      for (const appData of applications) {
        const res = await app.request('/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appData),
        })

        expect(res.status).toBe(201)
        const data = await res.json()
        ids.push(data.id)
      }

      expect(ids.length).toBe(3)
      expect(new Set(ids).size).toBe(3)

      for (let i = 0; i < ids.length; i++) {
        const res = await app.request(`/applications/${ids[i]}`)
        expect(res.status).toBe(200)

        const data = await res.json()
        expect(data.first_name).toBe(applications[i].first_name)
        expect(data.loan_amount).toBe(applications[i].loan_amount)
      }
    })

    it('should persist applications across multiple retrievals', async () => {
      const app = createApp()

      const createRes = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Persistent',
          last_name: 'User',
          email: 'persistent@test.com',
          loan_amount: 12345,
        }),
      })

      const created = await createRes.json()

      for (let i = 0; i < 5; i++) {
        const res = await app.request(`/applications/${created.id}`)
        expect(res.status).toBe(200)

        const data = await res.json()
        expect(data).toEqual(created)
      }
    })
  })

  describe('error handling across operations', () => {
    it('should not create application after validation error', async () => {
      const app = createApp()

      const invalidRes = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
        }),
      })

      expect(invalidRes.status).toBe(422)

      const validRes = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@test.com',
          loan_amount: 5000,
        }),
      })

      expect(validRes.status).toBe(201)
    })

    it('should handle mix of successful and failed requests', async () => {
      const app = createApp()

      const res1 = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Valid',
          last_name: 'User',
          email: 'valid@test.com',
          loan_amount: 1000,
        }),
      })
      expect(res1.status).toBe(201)

      const res2 = await app.request('/applications/nonexistent-id')
      expect(res2.status).toBe(404)

      const res3 = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Invalid',
        }),
      })
      expect(res3.status).toBe(422)

      const created1 = await res1.json()
      const res4 = await app.request(`/applications/${created1.id}`)
      expect(res4.status).toBe(200)
    })
  })

  describe('data isolation', () => {
    it('should isolate data between different app instances', async () => {
      const app1 = createApp()
      const app2 = createApp()

      const createRes1 = await app1.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'App1',
          last_name: 'User',
          email: 'app1@test.com',
          loan_amount: 1000,
        }),
      })

      const created1 = await createRes1.json()

      const getRes2 = await app2.request(`/applications/${created1.id}`)
      expect(getRes2.status).toBe(404)
    })
  })

  describe('boundary conditions', () => {
    it('should handle minimum positive loan amount', async () => {
      const app = createApp()

      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Min',
          last_name: 'User',
          email: 'min@test.com',
          loan_amount: Number.MIN_VALUE,
        }),
      })

      expect(res.status).toBe(201)
    })

    it('should handle maximum safe integer as loan amount', async () => {
      const app = createApp()

      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Max',
          last_name: 'User',
          email: 'max@test.com',
          loan_amount: Number.MAX_SAFE_INTEGER,
        }),
      })

      expect(res.status).toBe(201)
    })

    it('should handle unicode characters in names', async () => {
      const app = createApp()

      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: '李明',
          last_name: 'François',
          email: 'unicode@test.com',
          loan_amount: 5000,
        }),
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.first_name).toBe('李明')
      expect(data.last_name).toBe('François')
    })

    it('should handle very long email addresses', async () => {
      const app = createApp()
      const longLocal = 'a'.repeat(50)
      const longEmail = `${longLocal}@example.com`

      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Long',
          last_name: 'Email',
          email: longEmail,
          loan_amount: 5000,
        }),
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.email).toBe(longEmail)
    })

    it('should handle decimal loan amounts', async () => {
      const app = createApp()

      const res = await app.request('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Decimal',
          last_name: 'User',
          email: 'decimal@test.com',
          loan_amount: 1234.56,
        }),
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.loan_amount).toBe(1234.56)
    })
  })
})
