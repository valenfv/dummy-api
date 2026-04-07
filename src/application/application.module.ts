import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';

@Module({
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    {
      provide: 'IApplicationRepository',
      useClass: ApplicationRepository,
    },
  ],
})
export class ApplicationModule {}
