import { TFormPay, TFormUser } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IFormView {
	errors: string;
	valid: boolean;
}

export class FormView extends Component<IFormView> {
	protected events: IEvents;
	protected submitButton: HTMLButtonElement;
	protected formName: string;
	protected _errors: HTMLElement;
	protected _paymentButton?: HTMLButtonElement[];

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.submitButton = this.container.querySelector('button[type="submit"]');
		this._errors = this.container.querySelector('.form__errors');
		this.formName = this.container.getAttribute('name');
		this._paymentButton = Array.from(
			this.container.querySelectorAll('.button_alt')
		);
		if (this._paymentButton) {
			this._paymentButton.forEach((button) => {
				button.addEventListener('click', (e: Event) => {
					this.selectButton(button.name);
					const target = e.target as HTMLButtonElement;
					const field = 'payment';
					const value = target.name;
					this.events.emit(`payment:change`, { field, value });
				});
			});
		}

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof TFormPay | keyof TFormUser;
			const value = target.value;
			this.events.emit(`${this.formName}.${field.toString()}:change`, {
				field,
				value,
			});
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`);
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

	protected selectButton(pay: string) {
		this._paymentButton.forEach((item) => {
			this.toggleClass(item, 'button_alt-active', item.name === pay);
		});
	}

	set errors(error: string) {
		this.setText(this._errors, error);
	}
}
