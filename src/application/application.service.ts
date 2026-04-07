import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './application.entity';
import { IApplicationRepository } from './application.repository';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject('IApplicationRepository')
    private repository: IApplicationRepository,
  ) {}

  async createApplication(data: CreateApplicationDto): Promise<Application> {
    const application: Application = {
      id: crypto.randomUUID(),
      status: 'draft',
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      loan_amount: data.loan_amount,
    };

    return await this.repository.save(application);
  }

  async getApplicationById(id: string): Promise<Application> {
    const application = await this.repository.findById(id);

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    return application;
  }
}
