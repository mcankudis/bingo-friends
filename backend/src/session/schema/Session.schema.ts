import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { SessionData } from '../Session';

@Schema({ timestamps: true, collection: 'Sessions' })
export class SessionDAO implements SessionData {
    @Prop({ index: true, required: true })
    userId: string;
    @Prop({ index: true, required: true })
    sessionId: string;
    @Prop({ required: true })
    expiresAt: Date;
    @Prop({ required: true })
    lastSeen: Date;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export type SessionDocument = HydratedDocument<SessionData>;

export const SessionSchema = SchemaFactory.createForClass(SessionDAO);
