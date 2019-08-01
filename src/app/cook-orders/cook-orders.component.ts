import {Component, OnInit} from '@angular/core';
import {UsersService} from '../users/users.service';
import {Orders} from '../utils/orders';
import {OrdersService} from '../utils/orders.service';
import {HistoryService} from '../utils/history.service';
import {History} from '../utils/History';
import {CurrentUserService, UserAuthInfo} from '../auth/currentuser.service';

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
  isTakeCurrentOrderButton = false;
  currentUserId = 0;
  public auth$ = this.currentUserService.auth$;
  selectedOrder: Orders = new Orders();


  constructor(private userService: UsersService, private orderService: OrdersService, private  historyService: HistoryService,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
    this.auth$.subscribe((value: UserAuthInfo | undefined | null) => {
      if (value !== undefined && value !== null) {
        this.currentUserId = value.id;
        this.orderService.getAllById(this.currentUserId).subscribe(resp => this.listOfMyOrders = resp);
      }
    });
  }

  updateOrder(order: Orders, status: number) {
    this.newHistory.userId = this.currentUserId; // Изменить на текущий!
    this.newHistory.order.id = order.id;
    this.newHistory.statusId = status;
    this.historyService.nextStatus(this.newHistory).subscribe(() =>
      this.orderService.getAllById(this.currentUserId).subscribe(resp => this.listOfMyOrders = resp)); // ИЗменить ID!);
  }


  isTake(order: Orders) {
    this.updateOrder(order, 4);
  }

  isReady(order: Orders) {
    this.updateOrder(order, 5);
  }

  selectMyOrder(order: Orders) {
    this.isTakeWaiter = 'Нет';
    this.isTakeCook = 'Нет';
    this.isGivenCook = 'Нет';
    this.isGivenWaiter = 'Нет';
    this.selectedOrder = order;
    for (const hist of order.historyList) {
      switch (hist.statusId) {
        case 3: {
          this.isTakeWaiter = 'Да';
          break;
        }
        case 4: {
          this.isTakeCook = 'Да';
          this.isTakeCurrentOrderButton = true;
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
      this.isTakeCurrentOrderButton = false;
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
