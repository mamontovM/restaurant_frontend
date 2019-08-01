import {Component, Input, OnInit} from '@angular/core';
import {UsersService} from '../users/users.service';
import {Users} from '../users/users';
import {OrdersService} from '../utils/orders.service';
import {DishService} from '../dishes/dish.service';
import {OrderDish} from '../utils/order.dish';
import {Orders} from '../utils/orders';
import {DishView} from '../utils/dishView';
import {HistoryService} from '../utils/history.service';
import {History} from '../utils/History';
import {Dish} from '../utils/dish';
import {IngredientService} from '../ingredients/ingredient.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrdersForHistory} from '../utils/orders.for.history';
import {CurrentUserService, UserAuthInfo} from '../auth/currentuser.service';
import {async} from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-waiter-orders',
  templateUrl: './waiter-orders.component.html',
  styleUrls: ['./waiter-orders.component.scss']
})
export class WaiterOrdersComponent implements OnInit {
  COUNT = 'count';
  newOrder: Orders = new Orders();
  cookList: Users[] = [];
  dishList: Dish[] = [];
  selectedDish: Dish = new Dish();
  nameCountDishList: DishView[] = [];
  myOrders: Orders[] = [];
  choosedCook: Users = new Users(0, '', '', '', '', 0);
  orderDishList: OrderDish[] = [];
  createdOrder: Orders = new Orders();
  newHistory: History = new History();
  isChosed: boolean;
  selectedOrder: Orders = new Orders();
  isTakeCook = '';
  isTakeWaiter = '';
  isGivenCook = '';
  isGivenWaiter = '';
  isTakeCurrentOrderButton = false;
  reservedIngredients: number[] = [];
  _dishCountForm: FormGroup;
  currentUserId = 0;
  public auth$ = this.currentUserService.auth$;

  constructor(private userService: UsersService, private orderService: OrdersService, private dishService: DishService,
              private historyService: HistoryService, private ingredientService: IngredientService, private fb: FormBuilder,
              private currentUserService: CurrentUserService) {
    this._dishCountForm = fb.group({
      count: fb.control(0, [Validators.required])
    });
    this.isChosed = false;
  }

  ngOnInit() {
    this.isChosed = false;
    this.userService.getAllCook().subscribe(resp => this.cookList = resp);
    this.dishService.getMenuDishes().subscribe(resp => this.dishList = resp);
    this.newOrder.consist = [];
    this.orderDishList = [];
    this.nameCountDishList = [];
    this.auth$.subscribe((value: UserAuthInfo | undefined | null) => {
      if (value !== undefined && value !== null) {
        this.currentUserId = value.id;
        this.orderService.getAllById(this.currentUserId).subscribe(resp => this.myOrders = resp);
      }
    });
  }

  onSelectedDish(selectedDish: Dish) {
    this.selectedDish = selectedDish;
    this.changeFormValidator(selectedDish);
  }

  // возвращает количество блюд, которое теперь нельзя сделать из-за зарезервированных ингредиентов
  usedIngredientsInCurrentOrder(dish: Dish): number {
    const tempIngredients = [];
    for (let i = 0; i < dish.consist.length; i++) {
      // tslint:disable-next-line:strict-type-predicates
      tempIngredients[i] = Math.ceil(typeof this.reservedIngredients[dish.consist[i].ingredient.id] === 'undefined' ?
        0 : this.reservedIngredients[dish.consist[i].ingredient.id] / dish.consist[i].value);
    }
    let result = Math.max(...tempIngredients);
    if (result > dish.maxCount) {
      result = dish.maxCount;
    }
    return result;
  }

  cancelOrder() {
    this.orderDishList = [];
    this.reservedIngredients = [];
    this.newOrder.consist = [];
    this.nameCountDishList = [];
  }

  changeFormValidator(dish: Dish) {
    this._dishCountForm.reset();
    this._dishCountForm.controls[this.COUNT].clearValidators();
    this._dishCountForm.controls[this.COUNT].setValidators(
      [Validators.required, Validators.min(1), Validators.max(dish.maxCount - this.usedIngredientsInCurrentOrder(dish))]);
  }

  // добавляет deltaCount блюд к заказу
  addToOrderDish(dishAdd: Dish, deltaCount: string) {
    const _deltaCount = parseInt(deltaCount, 10);
    // ищем добавляли ли уже такое блюдо
    for (const oneOrderDish of  this.newOrder.consist) {
      if (oneOrderDish.dish.id === dishAdd.id) {
        // нашли такое блюдо, значит изменяем количество блюд на новое
        const oldDishCount = oneOrderDish.count;
        oneOrderDish.count += _deltaCount;
        for (const oneDishIngredient of  dishAdd.consist) {
          // сбрасываем старое прежнее зарезервированное количество ингредиентов
          this.reservedIngredients[oneDishIngredient.ingredient.id] -= oneDishIngredient.value * oldDishCount;
          // резервируем ингредиенты по новому количеству блюд
          this.reservedIngredients[oneDishIngredient.ingredient.id] += oneDishIngredient.value * oneOrderDish.count;
        }
        this.changeFormValidator(dishAdd);
        return;
      }
    }
    // знаем что таких блюд не было
    this.newOrder.consist.push({id: {dishId: dishAdd.id, orderId: 0}, dish: dishAdd, count: _deltaCount});
    // резервируем ингредиенты по количеству блюд
    for (const oneDishIngredient of  dishAdd.consist) {
      this.reservedIngredients[oneDishIngredient.ingredient.id] =
        // tslint:disable-next-line:strict-type-predicates
        typeof this.reservedIngredients[oneDishIngredient.ingredient.id] === 'undefined' ?
          oneDishIngredient.value * _deltaCount :
          this.reservedIngredients[oneDishIngredient.ingredient.id] + oneDishIngredient.value * _deltaCount;
    }
    this.changeFormValidator(dishAdd);
  }

  chooseCook(cook: Users) {
    this.choosedCook = cook;

  }

  createOrder() {
    this.orderService.createOrder({comments: this.newOrder.comments}).subscribe((res: Orders) => {
      this.createdOrder = res;
      this.newOrder.id = res.id;
      this.newOrder.consist.forEach((x: OrderDish) => x.id.orderId = res.id);
      this.orderService.updateOrder(this.newOrder).subscribe(
        () => {
          this.ingredientService.debitIngredients(this.newOrder.consist).subscribe(
            (result) => {
              if (result) {
                // все хорошо, ингредиенты списались, ингредиентов хватило
              } else {
                // заказ не возможен, склад пуст, ингредиентов не хватило
              }
            });
          this.newHistory = new History();
          this.newHistory.order = new OrdersForHistory();
          this.newHistory.order.id = this.createdOrder.id;
          this.newHistory.statusId = 1;
          this.newHistory.userId = this.currentUserId;
          this.historyService.nextStatus(this.newHistory).subscribe();
          this.newHistory.statusId = 2;
          this.newHistory.userId = this.choosedCook.id;
          this.historyService.nextStatus(this.newHistory).subscribe();
          this.choosedCook = new Users(0, '', '', '', '', 0);
          this.newOrder = new Orders();
          this.orderService.getAllById(this.currentUserId).subscribe(resp => this.myOrders = resp);
        });
    });
  }

  givenOrder(order: Orders) {
    this.newHistory = new History();
    this.newHistory.order = new OrdersForHistory();
    this.newHistory.order.id = order.id;
    this.newHistory.statusId = 6;
    this.newHistory.userId = this.currentUserId; // Изменить на текующий!
    this.historyService.nextStatus(this.newHistory).subscribe(() =>
      this.orderService.getAllById(this.currentUserId).subscribe(resp => this.myOrders = resp)); // ИЗменить на текущий
  }

  takeOrder(order: Orders) {
    this.newHistory = new History();
    this.newHistory.order = new OrdersForHistory();
    this.newHistory.order.id = order.id;
    this.newHistory.statusId = 3;
    this.newHistory.userId = this.currentUserId; // Изменить на текующий!
    this.historyService.nextStatus(this.newHistory).subscribe(() =>
      this.orderService.getAllById(this.currentUserId).subscribe(resp => this.myOrders = resp)); // ИЗменить на текущий
  }

  selectMyOrder(order: Orders) {
    this.isTakeWaiter = 'Нет';
    this.isTakeCook = 'Нет';
    this.isGivenCook = 'Нет';
    this.isGivenWaiter = 'Нет';
    this.selectedOrder = order;
    this.isChosed = true;
    for (const hist of order.historyList) {
      switch (hist.statusId) {
        case 3: {
          this.isTakeWaiter = 'Да';
          this.isTakeCurrentOrderButton = true;
          break;
        }
        case 4: {
          this.isTakeCook = 'Да';
          break;
        }
        case 5: {
          this.isGivenCook = 'Да';
          break;
        }
        case 6: {
          this.isGivenWaiter = 'Да';
          break;
        }
      }
    }
    this.checkIsStatus();
  }

  checkIsStatus() {
    if (this.isTakeCook !== 'Да') {
      this.isTakeCook = 'нет';
    }
    if (this.isTakeWaiter !== 'Да') {
      this.isTakeCurrentOrderButton = false;
      this.isTakeWaiter = 'нет';
    }
    if (this.isGivenCook !== 'Да') {
      this.isGivenCook = 'нет';
    }
    if (this.isGivenWaiter !== 'Да') {
      this.isGivenWaiter = 'нет';
    }
  }

  minusOneDish(dish: Dish) {
    for (const oneOrderDish of this.newOrder.consist) {
      if (oneOrderDish.dish.id === dish.id) {
        if (oneOrderDish.count < 2) {
          return;
        }
        this.addToOrderDish(dish, '-1');
        return;
      }
    }
  }

  plusOneDish(dish: Dish) {
    for (const oneOrderDish of this.newOrder.consist) {
      if (oneOrderDish.dish.id === dish.id) {
        if (((dish.maxCount - this.usedIngredientsInCurrentOrder(dish))) >= 1) {
          this.addToOrderDish(dish, '1');
        }
        return;
      }
    }
  }

  removeDishFromOrder(dish: Dish) {
    for (let i = 0; i < this.newOrder.consist.length; i++) {
      if (this.newOrder.consist[i].dish.id === dish.id) {
        for (const oneDishIngredient of dish.consist) {
          this.reservedIngredients[oneDishIngredient.ingredient.id] -= oneDishIngredient.value * this.newOrder.consist[i].count;
        }
        this.newOrder.consist.splice(i, 1);
        this.changeFormValidator(dish);
      }
    }
  }
}
