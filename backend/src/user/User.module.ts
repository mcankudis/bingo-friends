import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModule } from '~session';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { UserDAO, UserSchema } from './schema';

@Module({
    imports: [
        SessionModule,
        MongooseModule.forFeature([{ name: UserDAO.name, schema: UserSchema }])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
