import {Component, OnInit} from '@angular/core';
import {UsersService} from '../users/users.service';
import {Orders} from '../utils/orders';
import {OrdersService} from '../utils/orders.service';
import {HistoryService} from '../utils/history.service';
import {History} from '../utils/History';
import {OrdersForHistory} from '../utils/orders.for.history';

@Component({
  selector: 'app-cook-orders',
  templateUrl: './cook-orders.component.html',
  styleUrls: ['./cook-orders.component.scss']
})
export class CookOrdersComponent implements OnInit {
  listOfMyOrders: Orders[] = [];
  newHistory: History = new History();
  isTakeCook?: string;
  isTakeWaiter?: string;
  isGivenCook?: string;
  isGivenWaiter?: string;
  selectedOrder: Orders = new Orders();

  constructor(private userService: UsersService, private orderService: OrdersService, private  historyService: HistoryService) {
  }

  ngOnInit() {
    this.getAllOrderOfCook();
  }

  getAllOrderOfCook() {
    this.orderService.getAllById(2).subscribe(resp => this.listOfMyOrders = resp); // ИЗменить ID!
  }

  updateOrder(order: Orders, status: number) {
    // this.newHistory = new History();
    // this.newHistory.order = new OrdersForHistory();
    this.newHistory.userId = 2; // Изменить на текущий!
    this.newHistory.order.id = order.id;
    this.newHistory.statusId = status;
    this.historyService.nextStatus(this.newHistory).subscribe(() =>
      this.orderService.getAllById(3).subscribe(resp => this.listOfMyOrders = resp)); // ИЗменить ID!);
  }


  isTake(order: Orders) {
    this.updateOrder(order, 3);
  }

  isReady(order: Orders) {
    this.updateOrder(order, 4);
  }

  selectMyOrder(order: Orders) {
    this.selectedOrder = order;
    for (const hist of order.historyList) {
      switch (hist.statusId) {
        case 1: {
          this.isTakeWaiter = 'Да';
          break;
        }
        case 3: {
          this.isTakeCook = 'Да';
          break;
        }
        case 4: {
          this.isGivenCook = 'Да';
          break;
        }
        case 5: {
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
      this.isTakeWaiter = 'нет';
    }
    if (this.isGivenCook !== 'Да') {
      this.isGivenCook = 'нет';
    }
    if (this.isGivenWaiter !== 'Да') {
      this.isGivenWaiter = 'нет';
    }
  }


}
