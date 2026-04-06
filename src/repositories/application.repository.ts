import type { Application } from '../types/application.types.js'

export interface IApplicationRepository {
  save(application: Application): Promise<Application>
  findById(id: string): Promise<Application | null>
}

export class InMemoryApplicationRepository implements IApplicationRepository {
  private applications = new Map<string, Application>()

  async save(application: Application): Promise<Application> {
    this.applications.set(application.id, application)
    return application
  }

  async findById(id: string): Promise<Application | null> {
    return this.applications.get(id) ?? null
  }
}
