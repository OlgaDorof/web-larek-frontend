import { ICard } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class CardView extends Component<ICard> {
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _description?: HTMLElement;
	protected events: IEvents;
	protected _cardId: string;
	protected index: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._category = this.container.querySelector('.card__category');
		this._title = this.container.querySelector('.card__title');
		this._image = this.container.querySelector('.card__image');
		this._price = this.container.querySelector('.card__price');
		this._button = this.container.querySelector('.card__button');
		this._description = this.container.querySelector('.card__text');
		this.index = this.container.querySelector('.basket__item-index');

		if (this._button && this._image) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:add', { card: this })
			);
		} else if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:delete', { card: this })
			);
		} else {
			this.container.addEventListener('click', () =>
				this.events.emit('card:open', { card: this })
			);
		}
	}

	renderIndex(index: number) {
		this.index.textContent = index.toString();
	}

	protected setPrice(value: number | null): string {
		if (value === null) {
			if (this._button) {
				this._button.setAttribute('disabled', '');
				this._button.textContent = 'Не продается';
			}
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	protected setCategory(category: string) {
		if (category === 'софт-скил') {
			this._category.classList.add('card__category_soft');
		} else if (category === 'другое') {
			this._category.classList.add('card__category_other');
		} else if (category === 'дополнительное') {
			this._category.classList.add('card__category_additional');
		} else if (category === 'кнопка') {
			this._category.classList.add('card__category_button');
		} else if (category === 'хард-скил') {
			this._category.classList.add('card__category_hard');
		}
	}

	set image(link: string) {
		this._image.src = CDN_URL + link;
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set category(category: string) {
		this.setCategory(category);
		this._category.textContent = category;
	}

	set price(price: number | null) {
		this._price.textContent = this.setPrice(price);
	}

	set description(description: string) {
		this._description.textContent = description;
	}

	set id(id: string) {
		this._cardId = id;
	}

	get id() {
		return this._cardId;
	}
}
