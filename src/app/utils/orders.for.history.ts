import {OrderDish} from './order.dish';

export class OrdersForHistory {
  id?: number;
  comments?: string;
  consist: OrderDish[] = [];

  constructor() {
  }
}
