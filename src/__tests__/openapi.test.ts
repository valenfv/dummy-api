import { describe, it, expect } from 'vitest'
import { createApp } from '../app.js'

describe('OpenAPI Documentation', () => {
  const app = createApp()

  describe('GET /doc', () => {
    it('should return OpenAPI JSON document', async () => {
      const res = await app.request('/doc')

      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toContain('application/json')

      const doc = await res.json()
      expect(doc).toBeDefined()
    })

    it('should have correct OpenAPI version', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      expect(doc.openapi).toBe('3.0.0')
    })

    it('should have API info', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      expect(doc.info).toBeDefined()
      expect(doc.info.title).toBe('Loan applications API')
      expect(doc.info.version).toBe('1.0.0')
      expect(doc.info.description).toBe('Dummy API for loan applications')
    })

    it('should have tags defined', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      expect(doc.tags).toBeDefined()
      expect(Array.isArray(doc.tags)).toBe(true)
      expect(doc.tags.length).toBeGreaterThan(0)
      expect(doc.tags[0].name).toBe('Applications')
    })

    it('should define POST /applications endpoint', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      expect(doc.paths).toBeDefined()
      expect(doc.paths['/applications']).toBeDefined()
      expect(doc.paths['/applications'].post).toBeDefined()

      const postEndpoint = doc.paths['/applications'].post
      expect(postEndpoint.summary).toBe('Create application')
      expect(postEndpoint.tags).toContain('Applications')
    })

    it('should define GET /applications/{id} endpoint', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      expect(doc.paths['/applications/{id}']).toBeDefined()
      expect(doc.paths['/applications/{id}'].get).toBeDefined()

      const getEndpoint = doc.paths['/applications/{id}'].get
      expect(getEndpoint.summary).toBe('Get application by id')
      expect(getEndpoint.tags).toContain('Applications')
    })

    it('should define request body schema for POST /applications', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      const postEndpoint = doc.paths['/applications'].post
      expect(postEndpoint.requestBody).toBeDefined()
      expect(postEndpoint.requestBody.required).toBe(true)
      expect(postEndpoint.requestBody.content['application/json']).toBeDefined()
    })

    it('should define response schemas', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      const postEndpoint = doc.paths['/applications'].post
      expect(postEndpoint.responses['201']).toBeDefined()
      expect(postEndpoint.responses['422']).toBeDefined()

      const getEndpoint = doc.paths['/applications/{id}'].get
      expect(getEndpoint.responses['200']).toBeDefined()
      expect(getEndpoint.responses['404']).toBeDefined()
    })

    it('should define component schemas', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      expect(doc.components).toBeDefined()
      expect(doc.components.schemas).toBeDefined()
      expect(doc.components.schemas.Application).toBeDefined()
      expect(doc.components.schemas.CreateApplicationRequest).toBeDefined()
      expect(doc.components.schemas.ValidationError).toBeDefined()
      expect(doc.components.schemas.NotFoundError).toBeDefined()
    })

    it('should define required fields in Application schema', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      const appSchema = doc.components.schemas.Application
      expect(appSchema.required).toContain('id')
      expect(appSchema.required).toContain('status')
      expect(appSchema.required).toContain('first_name')
      expect(appSchema.required).toContain('last_name')
      expect(appSchema.required).toContain('email')
      expect(appSchema.required).toContain('loan_amount')
    })

    it('should define required fields in CreateApplicationRequest schema', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      const createSchema = doc.components.schemas.CreateApplicationRequest
      expect(createSchema.required).toContain('first_name')
      expect(createSchema.required).toContain('last_name')
      expect(createSchema.required).toContain('email')
      expect(createSchema.required).toContain('loan_amount')
    })

    it('should define email format validation', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      const createSchema = doc.components.schemas.CreateApplicationRequest
      expect(createSchema.properties.email.format).toBe('email')
    })

    it('should define loan_amount as positive number', async () => {
      const res = await app.request('/doc')
      const doc = await res.json()

      const createSchema = doc.components.schemas.CreateApplicationRequest
      expect(createSchema.properties.loan_amount.type).toBe('number')
      expect(createSchema.properties.loan_amount.minimum).toBe(0)
      expect(createSchema.properties.loan_amount.exclusiveMinimum).toBe(true)
    })
  })

  describe('GET /swagger', () => {
    it('should return Swagger UI HTML', async () => {
      const res = await app.request('/swagger')

      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toContain('text/html')

      const html = await res.text()
      expect(html).toContain('swagger-ui')
    })

    it('should configure Swagger UI to use /doc endpoint', async () => {
      const res = await app.request('/swagger')
      const html = await res.text()

      expect(html).toContain('/doc')
    })
  })
})
