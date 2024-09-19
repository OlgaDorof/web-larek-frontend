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
	protected _categoryColor = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

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
		this.setText(this.index, index.toString());
	}

	protected setPrice(value: number | null): string {
		if (value === null) {
			if (this._button) {
				this.setDisabled(this._button, true);
				this.setText(this._button, 'Не продается');
			}
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			`card__category_${this._categoryColor[value]}`,
			true
		);
	}

	set image(link: string) {
		this.setImage(this._image, CDN_URL + link, this.title);
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	set price(price: number | null) {
		this.setText(this._price, this.setPrice(price));
	}

	set description(description: string) {
		this.setText(this._description, description);
	}

	set id(id: string) {
		this._cardId = id;
	}

	get id() {
		return this._cardId;
	}
}
