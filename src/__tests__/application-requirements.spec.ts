import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { ValidationExceptionFilter } from '../filters/validation-exception.filter';

describe('Application API Requirements', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    );
    
    app.useGlobalFilters(new ValidationExceptionFilter());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /applications', () => {
    it('should create application with valid payload and return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/applications')
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane.doe@example.com',
          loan_amount: 25000,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'draft');
      expect(response.body).toHaveProperty('first_name', 'Jane');
      expect(response.body).toHaveProperty('last_name', 'Doe');
      expect(response.body).toHaveProperty('email', 'jane.doe@example.com');
      expect(response.body).toHaveProperty('loan_amount', 25000);
    });

    it('should return 422 when email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/applications')
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
          loan_amount: 25000,
        })
        .expect(422);

      expect(response.body).toEqual({
        error: 'validation_error',
        details: {
          email: 'This field is required',
        },
      });
    });

    it('should return 422 when first_name is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/applications')
        .send({
          last_name: 'Doe',
          email: 'jane@example.com',
          loan_amount: 25000,
        })
        .expect(422);

      expect(response.body).toEqual({
        error: 'validation_error',
        details: {
          first_name: 'This field is required',
        },
      });
    });

    it('should return 422 when last_name is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/applications')
        .send({
          first_name: 'Jane',
          email: 'jane@example.com',
          loan_amount: 25000,
        })
        .expect(422);

      expect(response.body).toEqual({
        error: 'validation_error',
        details: {
          last_name: 'This field is required',
        },
      });
    });

    it('should return 422 when loan_amount is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/applications')
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
        })
        .expect(422);

      expect(response.body).toEqual({
        error: 'validation_error',
        details: {
          loan_amount: 'This field is required',
        },
      });
    });
  });

  describe('GET /applications/:id', () => {
    it('should return application by id with status 200', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/applications')
        .send({
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@example.com',
          loan_amount: 30000,
        });

      const applicationId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/applications/${applicationId}`)
        .expect(200);

      expect(response.body).toEqual({
        id: applicationId,
        status: 'draft',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@example.com',
        loan_amount: 30000,
      });
    });

    it('should return 404 for non-existent application', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      
      await request(app.getHttpServer())
        .get(`/applications/${fakeId}`)
        .expect(404);
    });
  });
});
