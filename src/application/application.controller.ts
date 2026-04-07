import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './application.entity';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new loan application' })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully',
    type: Application,
  })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.createApplication(createApplicationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({
    status: 200,
    description: 'Application found',
    type: Application,
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getApplicationById(@Param('id') id: string): Promise<Application> {
    return this.applicationService.getApplicationById(id);
  }
}
