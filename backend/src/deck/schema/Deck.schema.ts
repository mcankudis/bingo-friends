import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Deck } from '../types';

@Schema({ _id: false })
class FieldDAO {
    @Prop({ required: true, index: true, unique: true, default: () => randomUUID() })
    fieldId: string;

    @Prop({ required: true })
    text: string;
}

const FieldSchema = SchemaFactory.createForClass(FieldDAO);

@Schema({ timestamps: true, collection: 'Decks' })
export class DeckDAO implements Deck {
    @Prop({ index: true, required: true, unique: true, default: () => randomUUID() })
    deckId: string;

    @Prop({ index: true, required: true })
    name: string;

    @Prop({ required: true, type: [FieldSchema] })
    fields: FieldDAO[];

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const DeckSchema = SchemaFactory.createForClass(DeckDAO);
