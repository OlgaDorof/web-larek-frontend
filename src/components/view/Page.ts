import { Component } from '../base/Component';

export interface ICardsContainer {
	catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer> {
	constructor(protected container: HTMLElement) {
		super(container);
		this.container = container;
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
