import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AppController } from './app.controller';
import { SwaggerController } from './swagger.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AppController, SwaggerController],
})
export class AppModule {}
