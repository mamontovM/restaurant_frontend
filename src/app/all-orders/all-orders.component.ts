import {Component, OnInit} from '@angular/core';
import {OrdersService} from '../utils/orders.service';
import {Orders} from '../utils/orders';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {
  listOfAllOrders: Orders[];
  isTakeCook: string;
  isTakeWaiter: string;
  isGivenCook: string;
  isGivenWaiter: string;
  selectedOrder!: Orders;

  constructor(private ordersService: OrdersService) {
    this.listOfAllOrders = [];
    this.isTakeCook = '';
    this.isTakeWaiter = '';
    this.isGivenCook = '';
    this.isGivenWaiter = '';
  }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.ordersService.getAll().subscribe(resp => this.listOfAllOrders = resp);
  }

  selectMyOrder(order: Orders) {
    this.selectedOrder = order;
    for (const hist of order.historyList) {
      switch (hist.statusId) {
        case 3: {
          this.isTakeWaiter = 'Да';
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
