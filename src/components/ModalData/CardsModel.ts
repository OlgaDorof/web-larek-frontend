import { ICard, ICardsData } from '../../types';
import { IEvents } from '../base/events';

export class CardsModel implements ICardsData {
	protected _cards: ICard[] = [];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
	}

	get cards() {
		return this._cards;
	}

	getcard(id: string): ICard {
		return this.cards.find((card) => card.id === id);
	}
}
