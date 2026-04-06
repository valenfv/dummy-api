import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryApplicationRepository } from '../repositories/application.repository.js'
import type { Application } from '../types/application.types.js'

describe('InMemoryApplicationRepository', () => {
  let repository: InMemoryApplicationRepository

  beforeEach(() => {
    repository = new InMemoryApplicationRepository()
  })

  describe('save', () => {
    it('should save and return application', async () => {
      const application: Application = {
        id: 'test-id-123',
        status: 'draft',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        loan_amount: 10000,
      }

      const result = await repository.save(application)

      expect(result).toEqual(application)
    })

    it('should make application retrievable after save', async () => {
      const application: Application = {
        id: 'test-id-456',
        status: 'draft',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        loan_amount: 5000,
      }

      await repository.save(application)
      const retrieved = await repository.findById('test-id-456')

      expect(retrieved).toEqual(application)
    })

    it('should overwrite existing application with same ID', async () => {
      const application1: Application = {
        id: 'same-id',
        status: 'draft',
        first_name: 'First',
        last_name: 'Version',
        email: 'first@example.com',
        loan_amount: 1000,
      }

      const application2: Application = {
        id: 'same-id',
        status: 'draft',
        first_name: 'Second',
        last_name: 'Version',
        email: 'second@example.com',
        loan_amount: 2000,
      }

      await repository.save(application1)
      await repository.save(application2)

      const retrieved = await repository.findById('same-id')
      expect(retrieved).toEqual(application2)
      expect(retrieved?.first_name).toBe('Second')
    })

    it('should save multiple applications independently', async () => {
      const app1: Application = {
        id: 'id-1',
        status: 'draft',
        first_name: 'User1',
        last_name: 'Test1',
        email: 'user1@example.com',
        loan_amount: 1000,
      }

      const app2: Application = {
        id: 'id-2',
        status: 'draft',
        first_name: 'User2',
        last_name: 'Test2',
        email: 'user2@example.com',
        loan_amount: 2000,
      }

      await repository.save(app1)
      await repository.save(app2)

      const retrieved1 = await repository.findById('id-1')
      const retrieved2 = await repository.findById('id-2')

      expect(retrieved1).toEqual(app1)
      expect(retrieved2).toEqual(app2)
    })

    it('should handle special characters in ID', async () => {
      const application: Application = {
        id: 'test-id-with-special-chars-@#$',
        status: 'draft',
        first_name: 'Special',
        last_name: 'Chars',
        email: 'special@example.com',
        loan_amount: 1000,
      }

      await repository.save(application)
      const retrieved = await repository.findById(
        'test-id-with-special-chars-@#$'
      )

      expect(retrieved).toEqual(application)
    })

    it('should handle unicode characters in application data', async () => {
      const application: Application = {
        id: 'unicode-id',
        status: 'draft',
        first_name: '李明',
        last_name: 'François',
        email: 'unicode@example.com',
        loan_amount: 5000,
      }

      await repository.save(application)
      const retrieved = await repository.findById('unicode-id')

      expect(retrieved?.first_name).toBe('李明')
      expect(retrieved?.last_name).toBe('François')
    })

    it('should handle very large loan amounts', async () => {
      const application: Application = {
        id: 'large-amount',
        status: 'draft',
        first_name: 'Rich',
        last_name: 'Person',
        email: 'rich@example.com',
        loan_amount: Number.MAX_SAFE_INTEGER,
      }

      await repository.save(application)
      const retrieved = await repository.findById('large-amount')

      expect(retrieved?.loan_amount).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('should handle decimal loan amounts', async () => {
      const application: Application = {
        id: 'decimal-amount',
        status: 'draft',
        first_name: 'Decimal',
        last_name: 'User',
        email: 'decimal@example.com',
        loan_amount: 1234.56,
      }

      await repository.save(application)
      const retrieved = await repository.findById('decimal-amount')

      expect(retrieved?.loan_amount).toBe(1234.56)
    })
  })

  describe('findById', () => {
    it('should return null when ID does not exist', async () => {
      const result = await repository.findById('nonexistent-id')

      expect(result).toBeNull()
    })

    it('should return null for empty string ID', async () => {
      const result = await repository.findById('')

      expect(result).toBeNull()
    })

    it('should return application when ID exists', async () => {
      const application: Application = {
        id: 'existing-id',
        status: 'draft',
        first_name: 'Existing',
        last_name: 'User',
        email: 'existing@example.com',
        loan_amount: 3000,
      }

      await repository.save(application)
      const result = await repository.findById('existing-id')

      expect(result).toEqual(application)
      expect(result).not.toBeNull()
    })

    it('should be case-sensitive for IDs', async () => {
      const application: Application = {
        id: 'CaseSensitiveId',
        status: 'draft',
        first_name: 'Case',
        last_name: 'Test',
        email: 'case@example.com',
        loan_amount: 1000,
      }

      await repository.save(application)

      const result1 = await repository.findById('CaseSensitiveId')
      const result2 = await repository.findById('casesensitiveid')

      expect(result1).toEqual(application)
      expect(result2).toBeNull()
    })

    it('should return same reference on multiple calls', async () => {
      const application: Application = {
        id: 'reference-id',
        status: 'draft',
        first_name: 'Reference',
        last_name: 'Test',
        email: 'reference@example.com',
        loan_amount: 1000,
      }

      await repository.save(application)

      const result1 = await repository.findById('reference-id')
      const result2 = await repository.findById('reference-id')

      expect(result1).toEqual(result2)
    })

    it('should handle whitespace in ID lookup', async () => {
      const result = await repository.findById('   ')

      expect(result).toBeNull()
    })

    it('should handle very long IDs', async () => {
      const longId = 'a'.repeat(1000)
      const result = await repository.findById(longId)

      expect(result).toBeNull()
    })
  })

  describe('data isolation', () => {
    it('should maintain separate storage per instance', async () => {
      const repo1 = new InMemoryApplicationRepository()
      const repo2 = new InMemoryApplicationRepository()

      const application: Application = {
        id: 'isolated-id',
        status: 'draft',
        first_name: 'Isolated',
        last_name: 'Test',
        email: 'isolated@example.com',
        loan_amount: 1000,
      }

      await repo1.save(application)

      const result1 = await repo1.findById('isolated-id')
      const result2 = await repo2.findById('isolated-id')

      expect(result1).toEqual(application)
      expect(result2).toBeNull()
    })
  })

  describe('concurrent operations', () => {
    it('should handle multiple saves in sequence', async () => {
      const applications: Application[] = []

      for (let i = 0; i < 10; i++) {
        const app: Application = {
          id: `id-${i}`,
          status: 'draft',
          first_name: `User${i}`,
          last_name: `Test${i}`,
          email: `user${i}@example.com`,
          loan_amount: i * 1000,
        }
        applications.push(app)
        await repository.save(app)
      }

      for (let i = 0; i < 10; i++) {
        const result = await repository.findById(`id-${i}`)
        expect(result).toEqual(applications[i])
      }
    })

    it('should handle parallel saves correctly', async () => {
      const apps = Array.from({ length: 5 }, (_, i) => ({
        id: `parallel-${i}`,
        status: 'draft' as const,
        first_name: `User${i}`,
        last_name: `Test${i}`,
        email: `user${i}@example.com`,
        loan_amount: i * 1000,
      }))

      await Promise.all(apps.map((app) => repository.save(app)))

      const results = await Promise.all(
        apps.map((app) => repository.findById(app.id))
      )

      results.forEach((result, i) => {
        expect(result).toEqual(apps[i])
      })
    })
  })
})
