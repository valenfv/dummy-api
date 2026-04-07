import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AppController } from './app.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AppController],
})
export class AppModule {}
