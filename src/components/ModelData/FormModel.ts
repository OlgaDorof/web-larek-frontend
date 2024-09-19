import { FormErrors, IForm, IOrder, TFormPay, TFormUser } from '../../types';
import { IEvents } from '../base/events';

export class FormModel implements IForm {
	protected order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
	protected events: IEvents;
	formErrors: FormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
	}

	setFormPay(field: keyof TFormPay, value: string) {
		if (field === 'address') {
			this.order[field] = value;
		}
		if (field === 'payment') {
			this.order[field] = value;
		}
		if (this.validateFormPay()) {
			return true;
		}
		return false;
	}

	setFormUser(field: keyof TFormUser, value: string) {
		if (field === 'email') {
			this.order[field] = value;
		} else if (field === 'phone') {
			this.order[field] = value;
		}

		if (this.validateFormUser()) {
			return true;
		}
		return false;
	}

	protected validateFormPay() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderformErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	protected validateFormUser() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactformErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setItems(items: string[]) {
		this.order.items = items;
	}

	setTotal(total: number) {
		this.order.total = total;
	}

	getUserInfo() {
		return this.order;
	}
}
