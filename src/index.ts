import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ICard, TFormPay, TFormUser } from './types';
import { CardView } from './components/view/CardView';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { FormModel } from './components/ModelData/FormModel';
import { Page } from './components/view/Page';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { FormView } from './components/view/FormView';
import { SuccessView } from './components/view/SuccessView';
import { ModelApi } from './components/ModelData/ModelApi';
import { CardsModel } from './components/ModelData/CardsModel';
import { Basket } from './components/ModelData/Basket';

const gallery: HTMLElement = document.querySelector('.gallery');
const pageCardTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;
const orderFormTemplate = document.querySelector(
	'#order'
) as HTMLTemplateElement;
const contactFormTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;

const events = new EventEmitter();
const cardsModel = new CardsModel(events);
const api = new ModelApi(API_URL);
const basket = new Basket(events);
const modal = new ModalView(document.querySelector('#modal-container'), events);
const form = new FormModel(events);
const success = new SuccessView(cloneTemplate(successTemplate), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const page = new Page(gallery);
const orderForm = new FormView(cloneTemplate(orderFormTemplate), events);
const contactForm = new FormView(cloneTemplate(contactFormTemplate), events);

api
	.getCards()
	.then((data) => {
		cardsModel.cards = data.items as ICard[];
		events.emit('cards:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

events.on('cards:loaded', () => {
	const cardsArray = cardsModel.cards.map((card) => {
		const cardInstant = new CardView(cloneTemplate(pageCardTemplate), events);
		return cardInstant.render({
			title: card.title,
			id: card.id,
			image: card.image,
			price: card.price,
			category: card.category,
		});
	});
	page.render({ catalog: cardsArray });
});

events.on('card:open', (data: { card: CardView }) => {
	const { card } = data;
	const cardElement = cardsModel.getcard(card.id);
	const cardPreview = new CardView(cloneTemplate(cardPreviewTemplate), events);
	modal.render({
		content: cardPreview.render(cardElement),
	});
});

events.on('basket:open', () => {
	let cardsArray: HTMLElement[] = [];
	let i = 0;
	basket.products.forEach((card) => {
		const cardInstant = new CardView(cloneTemplate(cardBasketTemplate), events);
		const cardelement = cardInstant.render(card);
		cardsArray.push(cardelement);
		i = i + 1;
		cardInstant.renderIndex(i);

		return [cardsArray];
	});

	modal.render({
		content: basketView.render({
			items: cardsArray,
			basketPrice: basket.getFullPrice(),
		}),
	});
});

events.on('basket:add', (data: { card: CardView }) => {
	const { card } = data;
	const { title, price, id } = cardsModel.getcard(card.id);
	basket.addinBasket({ title, price, id });
	basketView.renderHeaderBasketCounter(basket.getCardsinBasket());
	modal.close();
});

events.on('basket:delete', (data: { card: CardView }) => {
	const { card } = data;
	basket.removefromBasket(card.id);
	let i = 0;
	let cardsArray: HTMLElement[] = [];
	basket.products.forEach((card) => {
		const cardInstant = new CardView(cloneTemplate(cardBasketTemplate), events);
		const cardelement = cardInstant.render(card);
		cardsArray.push(cardelement);
		i = i + 1;
		cardInstant.renderIndex(i);
		return cardsArray;
	});
	basketView.renderHeaderBasketCounter(basket.getCardsinBasket());
	basketView.render({ items: cardsArray, basketPrice: basket.getFullPrice() });
});

events.on('basket:buy', () => {
	modal.render({
		content: orderForm.render(),
	});
	form.setItems(basket.getCardList());
	form.setTotal(basket.getFullPrice());
});

events.on(
	'order.address:change',
	(data: { field: keyof TFormPay; value: string }) => {
		orderForm.valid = form.setFormPay(data.field, data.value);
		orderForm.errors = [form.formErrors.address, form.formErrors.payment].join(
			' '
		);
	}
);

events.on(
	`payment:change`,
	(data: { field: keyof TFormPay; value: string }) => {
		orderForm.valid = form.setFormPay(data.field, data.value);
		orderForm.errors = [form.formErrors.address, form.formErrors.payment].join(
			' '
		);
	}
);

events.on(
	'contacts.email:change',
	(data: { field: keyof TFormUser; value: string }) => {
		contactForm.valid = form.setFormUser(data.field, data.value);
		contactForm.errors = [form.formErrors.email, form.formErrors.phone].join(
			' '
		);
	}
);

events.on(
	'contacts.phone:change',
	(data: { field: keyof TFormUser; value: string }) => {
		contactForm.valid = form.setFormUser(data.field, data.value);
		contactForm.errors = [form.formErrors.email, form.formErrors.phone].join(
			' '
		);
	}
);

events.on('order:submit', (func: { submitCallback: Function }) => {
	modal.render({
		content: contactForm.render(),
	});
});

events.on('contacts:submit', (func: { submitCallback: Function }) => {
	api
		.postOrder(form.getUserInfo())
		.then(() => {
			modal.render({
				content: success.render({ fullSum: basket.getFullPrice() }),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('success', () => {
	modal.close();
	basket.clearBasket();
	basketView.renderHeaderBasketCounter(basket.getCardsinBasket());
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
