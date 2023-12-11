import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/logging';
import { SessionGuard } from './Session.guard';
import { SessionService } from './Session.service';
import { SessionDAO, SessionSchema } from './schema';

@Module({
    imports: [
        LoggerModule,
        MongooseModule.forFeature([{ name: SessionDAO.name, schema: SessionSchema }])
    ],
    providers: [SessionService, SessionGuard],
    exports: [SessionService, SessionGuard]
})
export class SessionModule {}
