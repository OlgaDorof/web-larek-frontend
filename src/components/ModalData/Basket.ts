import { IBasket, TBascketCard } from '../../types';
import { IEvents } from '../base/events';

export class Basket implements IBasket {
	protected _products: TBascketCard[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._products = [];
	}

	set products(data: TBascketCard[]) {
		this._products = data;
	}

	get products() {
		return this._products;
	}

	addinBasket(card: TBascketCard) {
		let value = 0;
		if (!this.getCardsinBasket()) {
			this.products.push(card);
		} else {
			this.products.forEach((product) => {
				if (product.id === card.id) {
					value = value + 1;
				}
			});
			if (!value) {
				this.products.push(card);
			}
		}
	}

	removefromBasket(id: string) {
		this.products = this.products.filter((product) => product.id !== id);
	}

	clearBasket() {
		this.products = [];
	}

	getFullPrice(): number {
		let sum = 0;
		this.products.forEach((element) => {
			sum = sum + element.price;
		});
		return sum;
	}

	getCardsinBasket(): number {
		return this.products.length;
	}

	getCardList(): string[] {
		let cardList = [] as string[];
		this.products.forEach((element) => {
			cardList.push(element.id);
		});
		return cardList;
	}
}
