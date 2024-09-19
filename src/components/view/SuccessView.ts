import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISuccess {
	fullSum: number;
}

export class SuccessView extends Component<ISuccess> {
	protected button: HTMLButtonElement;
	protected events: IEvents;
	protected _fullSum: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.button = this.container.querySelector('.order-success__close');
		this._fullSum = this.container.querySelector('.order-success__description');

		this.button.addEventListener('click', () => this.events.emit('success'));
	}

	set fullSum(value: number) {
		this.setText(this._fullSum, 'Списано ' + value.toString() + ' синапсов');
	}
}
