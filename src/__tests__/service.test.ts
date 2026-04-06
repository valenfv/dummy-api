import { describe, it, expect, beforeEach } from 'vitest'
import { ApplicationService } from '../services/application.service.js'
import { InMemoryApplicationRepository } from '../repositories/application.repository.js'
import { ApplicationNotFoundError } from '../types/errors.types.js'
import type { CreateApplicationDTO } from '../types/application.types.js'

describe('ApplicationService', () => {
  let service: ApplicationService
  let repository: InMemoryApplicationRepository

  beforeEach(() => {
    repository = new InMemoryApplicationRepository()
    service = new ApplicationService(repository)
  })

  describe('createApplication', () => {
    it('should create application with provided data', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        loan_amount: 10000,
      }

      const result = await service.createApplication(data)

      expect(result).toMatchObject({
        status: 'draft',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        loan_amount: 10000,
      })
      expect(result.id).toBeDefined()
      expect(typeof result.id).toBe('string')
      expect(result.id.length).toBeGreaterThan(0)
    })

    it('should always create applications with draft status', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        loan_amount: 5000,
      }

      const result = await service.createApplication(data)

      expect(result.status).toBe('draft')
    })

    it('should generate unique IDs for each application', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        loan_amount: 1000,
      }

      const result1 = await service.createApplication(data)
      const result2 = await service.createApplication(data)

      expect(result1.id).not.toBe(result2.id)
    })

    it('should save application to repository', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Alice',
        last_name: 'Wonder',
        email: 'alice@example.com',
        loan_amount: 7500,
      }

      const created = await service.createApplication(data)
      const retrieved = await repository.findById(created.id)

      expect(retrieved).toEqual(created)
    })

    it('should handle special characters in names', async () => {
      const data: CreateApplicationDTO = {
        first_name: "O'Brien",
        last_name: 'Müller-Schmidt',
        email: 'special@example.com',
        loan_amount: 3000,
      }

      const result = await service.createApplication(data)

      expect(result.first_name).toBe("O'Brien")
      expect(result.last_name).toBe('Müller-Schmidt')
    })

    it('should handle decimal loan amounts', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Decimal',
        last_name: 'Test',
        email: 'decimal@example.com',
        loan_amount: 12345.67,
      }

      const result = await service.createApplication(data)

      expect(result.loan_amount).toBe(12345.67)
    })

    it('should preserve email case', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Case',
        last_name: 'Sensitive',
        email: 'User@Example.COM',
        loan_amount: 1000,
      }

      const result = await service.createApplication(data)

      expect(result.email).toBe('User@Example.COM')
    })
  })

  describe('getApplicationById', () => {
    it('should retrieve existing application', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Bob',
        last_name: 'Builder',
        email: 'bob@example.com',
        loan_amount: 20000,
      }

      const created = await service.createApplication(data)
      const retrieved = await service.getApplicationById(created.id)

      expect(retrieved).toEqual(created)
    })

    it('should throw ApplicationNotFoundError when ID does not exist', async () => {
      await expect(
        service.getApplicationById('nonexistent-id')
      ).rejects.toThrow(ApplicationNotFoundError)
    })

    it('should throw error with correct ID in message', async () => {
      const id = 'test-id-123'

      await expect(service.getApplicationById(id)).rejects.toThrow(
        `Application with id ${id} not found`
      )
    })

    it('should retrieve multiple different applications', async () => {
      const data1: CreateApplicationDTO = {
        first_name: 'User1',
        last_name: 'Test1',
        email: 'user1@example.com',
        loan_amount: 1000,
      }

      const data2: CreateApplicationDTO = {
        first_name: 'User2',
        last_name: 'Test2',
        email: 'user2@example.com',
        loan_amount: 2000,
      }

      const created1 = await service.createApplication(data1)
      const created2 = await service.createApplication(data2)

      const retrieved1 = await service.getApplicationById(created1.id)
      const retrieved2 = await service.getApplicationById(created2.id)

      expect(retrieved1).toEqual(created1)
      expect(retrieved2).toEqual(created2)
      expect(retrieved1.id).not.toBe(retrieved2.id)
    })

    it('should return same data on multiple retrievals', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Consistent',
        last_name: 'Data',
        email: 'consistent@example.com',
        loan_amount: 5000,
      }

      const created = await service.createApplication(data)

      const retrieved1 = await service.getApplicationById(created.id)
      const retrieved2 = await service.getApplicationById(created.id)
      const retrieved3 = await service.getApplicationById(created.id)

      expect(retrieved1).toEqual(created)
      expect(retrieved2).toEqual(created)
      expect(retrieved3).toEqual(created)
    })

    it('should handle UUID format IDs', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'UUID',
        last_name: 'Test',
        email: 'uuid@example.com',
        loan_amount: 1000,
      }

      const created = await service.createApplication(data)

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      expect(created.id).toMatch(uuidRegex)

      const retrieved = await service.getApplicationById(created.id)
      expect(retrieved).toEqual(created)
    })
  })

  describe('error scenarios', () => {
    it('should throw error for empty string ID', async () => {
      await expect(service.getApplicationById('')).rejects.toThrow(
        ApplicationNotFoundError
      )
    })

    it('should handle whitespace ID', async () => {
      await expect(service.getApplicationById('   ')).rejects.toThrow(
        ApplicationNotFoundError
      )
    })

    it('should not affect other applications when one is not found', async () => {
      const data: CreateApplicationDTO = {
        first_name: 'Valid',
        last_name: 'User',
        email: 'valid@example.com',
        loan_amount: 1000,
      }

      const created = await service.createApplication(data)

      await expect(service.getApplicationById('invalid')).rejects.toThrow()

      const retrieved = await service.getApplicationById(created.id)
      expect(retrieved).toEqual(created)
    })
  })
})
