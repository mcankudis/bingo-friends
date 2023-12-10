import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvVars, validate } from './config';
import { FlowIdMiddleware, LoggerModule, RequestLoggerMiddleware } from './logging';

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            isGlobal: true
        }),
        LoggerModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService<EnvVars>) => {
                return {
                    uri: configService.get('DB_CONNECTION_STRING')
                };
            },
            inject: [ConfigService]
        })
    ],
    controllers: [],
    providers: []
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
        consumer.apply(FlowIdMiddleware).forRoutes('*');
    }
}
