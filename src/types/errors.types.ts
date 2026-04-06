export interface ValidationError {
  error: 'validation_error'
  details: Record<string, string>
}

export interface NotFoundError {
  error: string
  message: string
}

export class ApplicationNotFoundError extends Error {
  constructor(id: string) {
    super(`Application with id ${id} not found`)
    this.name = 'ApplicationNotFoundError'
  }
}
