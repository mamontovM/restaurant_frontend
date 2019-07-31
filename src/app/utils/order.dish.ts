import {Dish} from './dish';

export interface OrderDish {
  id: OrderDishId;
  count: number;
  dish: Dish;
}

export interface OrderDishId {
  dishId: number;
  orderId: number;
}
