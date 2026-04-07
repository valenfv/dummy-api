import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint()
  getRoot() {
    return {
      message: 'Loan Applications API',
      version: '1.0.0',
      endpoints: {
        documentation: '/swagger',
        openapi: '/swagger-json',
        applications: {
          create: 'POST /applications',
          get: 'GET /applications/:id',
        },
      },
    };
  }
}
