import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter';
import { BadRequestExceptionFilter } from './filters/BadRequestException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //ap dung validation pipes global
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new BadRequestExceptionFilter());
  
  //config swagger
  const config = new DocumentBuilder()
    .setTitle('Ecommerce')
    .setDescription('API documentation for E-commerce application')
    .setVersion('1.0')

    //cấu hinh bearer token cho swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',  // Tên của authorization header (có thể đặt là 'access-token' hoặc bất kỳ tên nào)
    )
    .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory,
      {
        //set up khi reload laij khoong can nhapj laij token
        swaggerOptions:{persistAuthorization: true},
      }
    );
    
    
    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
