import { ICard } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBaketView {
	items: HTMLElement[];
	basketPrice: number;
}

export class BasketView extends Component<IBaketView> {
	protected events: IEvents;
	protected _cardsList: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected _basketPrice: HTMLElement;
	protected headerBasketButton: HTMLButtonElement;
	protected headerBasketCounter: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._cardsList = this.container.querySelector('.basket__list');
		this.basketButton = this.container.querySelector('.basket__button');
		this._basketPrice = this.container.querySelector('.basket__price');
		this.headerBasketButton = document.querySelector('.header__basket');
		this.headerBasketCounter = document.querySelector(
			'.header__basket-counter'
		);

		this.basketButton.addEventListener('click', () =>
			this.events.emit('basket:buy')
		);
		this.headerBasketButton.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	renderHeaderBasketCounter(value: number) {
		this.headerBasketCounter.textContent = value.toString();
	}

	set basketPrice(price: number) {
		if (!price) {
			this.setDisabled(this.basketButton, true);
			this._cardsList.textContent = 'Корзина пуста';
		} else {
			this.setDisabled(this.basketButton, false);
		}
		this._basketPrice.textContent = price.toString() + ' синапсов';
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._cardsList.replaceChildren(...items);
		}
	}
}
