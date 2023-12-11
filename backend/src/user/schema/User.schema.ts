import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { User } from '../type/User';

@Schema({ _id: false })
class AccountDAO {
    @Prop({ required: true })
    password: string;
}

const AccountSchema = SchemaFactory.createForClass(AccountDAO);

@Schema({ timestamps: true, collection: 'Users' })
export class UserDAO implements User {
    @Prop({ index: true, required: true, unique: true, default: () => randomUUID() })
    userId: string;
    @Prop({ index: true, required: true, unique: true })
    username: string;
    @Prop({ required: true, type: AccountSchema })
    account: AccountDAO;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDAO);
