import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckController } from './Deck.controller';
import { DeckService } from './Deck.service';
import { DeckDAO, DeckSchema } from './schema/Deck.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: DeckDAO.name, schema: DeckSchema }])],
    controllers: [DeckController],
    providers: [DeckService]
})
export class DeckModule {}
