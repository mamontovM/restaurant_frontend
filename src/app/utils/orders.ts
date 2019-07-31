import {History} from './History';
import {OrderDish} from './order.dish';

export class Orders {
  id = 0;
  comments = '';
  historyList: History[] = [];
  consist: OrderDish[] = [];

  constructor() {
  }
}
