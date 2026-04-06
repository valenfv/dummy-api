import { serve } from '@hono/node-server'
import { createApp } from './app.js'

const app = createApp()
const port = Number(process.env.PORT) || 3000

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
  console.log(`OpenAPI JSON: http://localhost:${info.port}/doc`)
  console.log(`Swagger UI: http://localhost:${info.port}/swagger`)
})
