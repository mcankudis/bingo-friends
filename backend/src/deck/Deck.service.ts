import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatadogLogger } from '~logging';
import { DeckDAO } from './schema/Deck.schema';

@Injectable()
export class DeckService {
    constructor(
        private readonly Logger: DatadogLogger,
        @InjectModel(DeckDAO.name) private readonly deckDAO: Model<DeckDAO>
    ) {}

    public async createDeck(name: string, fields: string[]) {
        const deck = await this.deckDAO.create({
            name,
            fields: fields.map((field) => ({ text: field }))
        });

        // todo mapper to only return relevant fields
        return deck;
    }

    // todo deck access control
    public async addField(deckId: string, text: string) {
        const deck = await this.deckDAO.findOneAndUpdate(
            { deckId },
            { $push: { fields: { text } } },
            { new: true }
        );

        if (!deck) {
            throw new Error('Deck not found');
        }

        // todo mapper to only return relevant fields
        return deck;
    }

    // todo deck access control
    public async updateField(deckId: string, fieldId: string, text: string) {
        const deck = await this.deckDAO.findOneAndUpdate(
            { deckId, 'fields.fieldId': fieldId },
            { $set: { 'fields.$.text': text } },
            { new: true }
        );

        if (!deck) {
            throw new Error('Deck not found');
        }

        // todo mapper to only return relevant fields
        return deck;
    }

    // todo deck access control
    public async deleteField(deckId: string, fieldId: string) {
        const deck = await this.deckDAO.findOneAndUpdate(
            { deckId },
            { $pull: { fields: { fieldId } } },
            { new: true }
        );

        if (!deck) {
            throw new Error('Deck not found');
        }

        // todo mapper to only return relevant fields
        return deck;
    }
}
