import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatadogLogger } from './logging';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');
    const env = configService.get('environment');

    const logger = app.get(DatadogLogger);
    logger.log(`Starting app on port ${port} in ${env} mode`);

    await app.listen(7010);
}

bootstrap();
