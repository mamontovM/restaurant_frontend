import {OrdersForHistory} from './orders.for.history';

export class History {
  id?: number;
  time?: Date;
  statusId?: number;
  order: OrdersForHistory = new OrdersForHistory();
  userId?: number;

  constructor() {
  }
}
