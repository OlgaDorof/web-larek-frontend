import { IApiResponse, IOrder } from '../../types';
import { Api } from '../base/api';

export class ModelApi extends Api {
	getCards(): Promise<IApiResponse> {
		return this.get('/product') as Promise<IApiResponse>;
	}

	postOrder(data: IOrder) {
		return this.post('/order', data);
	}
}
