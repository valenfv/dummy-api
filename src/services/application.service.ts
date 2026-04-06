import type {
  Application,
  CreateApplicationDTO,
} from '../types/application.types.js'
import type { IApplicationRepository } from '../repositories/application.repository.js'
import { ApplicationNotFoundError } from '../types/errors.types.js'

export class ApplicationService {
  constructor(private repository: IApplicationRepository) {}

  async createApplication(data: CreateApplicationDTO): Promise<Application> {
    const application: Application = {
      id: crypto.randomUUID(),
      status: 'draft',
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      loan_amount: data.loan_amount,
    }

    return await this.repository.save(application)
  }

  async getApplicationById(id: string): Promise<Application> {
    const application = await this.repository.findById(id)

    if (!application) {
      throw new ApplicationNotFoundError(id)
    }

    return application
  }
}
