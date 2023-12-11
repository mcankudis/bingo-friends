import { Field } from './Field';

export interface Deck {
    deckId: string;
    name: string;
    fields: Field[];

    // todo access list
}
