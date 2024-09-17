export interface ICard {
	title: string;
	id: string;
	description?: string;
	image?: string;
	price: number | null;
	category?: string;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IApiResponse {
	items: ICard[];
}

export interface ICardsData {
	cards: ICard[];
	getcard(id: string): ICard;
}

export interface IBasket {
	products: TBascketCard[];
	addinBasket(card: TBascketCard): void;
	removefromBasket(id: string): void;
	getFullPrice(): number;
	getCardsinBasket(): number;
	getCardList(): string[];
	clearBasket(): void;
}

export interface IForm {
	setFormPay(field: keyof TFormPay, value: string): boolean;
	setFormUser(field: keyof TFormUser, value: string): boolean;
	setItems(items: string[]): void;
	setTotal(total: number): void;
	getUserInfo(): IOrder;
}

export type TBascketCard = Pick<ICard, 'title' | 'price' | 'id'>;
export type TFormPay = Pick<IOrder, 'payment' | 'address'>;
export type TFormUser = Pick<IOrder, 'email' | 'phone'>;
