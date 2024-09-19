import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardsContainer {
	catalog: HTMLElement[];
}

export class Page extends Component<ICardsContainer> {
	protected _wrapper: HTMLElement;
	constructor(protected container: HTMLElement) {
		super(container);
		this.container = container;
		this._wrapper = document.querySelector('.page__wrapper');
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
