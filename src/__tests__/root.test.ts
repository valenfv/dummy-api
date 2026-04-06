import { describe, it, expect } from 'vitest'
import { createApp } from '../app.js'

describe('GET /', () => {
  const app = createApp()

  it('should return API information', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual({
      message: 'Loan Applications API',
      version: '1.0.0',
      endpoints: {
        documentation: '/swagger',
        openapi: '/doc',
        applications: {
          create: 'POST /applications',
          get: 'GET /applications/:id',
        },
      },
    })
  })

  it('should return JSON content type', async () => {
    const res = await app.request('/')
    expect(res.headers.get('content-type')).toContain('application/json')
  })
})
