import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { DatadogLogger } from '~logging';
import { SessionGuard } from '~session';
import { DeckService } from './Deck.service';
import { CreateDeckDTO } from './dto/CreateDeckDTO';

@Controller('deck')
export class DeckController {
    constructor(
        private readonly Logger: DatadogLogger,
        private readonly deckService: DeckService
    ) {}

    @UseGuards(SessionGuard)
    @Post()
    async create(@Body() deck: CreateDeckDTO) {
        return await this.deckService.createDeck(deck.name, deck.fields);
    }

    @UseGuards(SessionGuard)
    @Post(':deckId/field')
    async addField() {
        return {};
    }

    @UseGuards(SessionGuard)
    @Patch(':deckId/field/:fieldId')
    async updateField() {
        return {};
    }

    @UseGuards(SessionGuard)
    @Delete(':deckId/field/:fieldId')
    async deleteField() {
        return {};
    }
}
