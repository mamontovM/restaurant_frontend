import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Orders} from './orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private orders = 'restaurant/orders';
  private head = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
  }


  createOrder(order: {comments: string}): Observable<Orders> {
    const url = this.orders;
    console.log(url + '- post order');
    return this.http.post<Orders>(url, JSON.stringify(order), {headers: this.head});
  }

  updateOrder(order: Orders): Observable<Orders> {
    const url = this.orders;
    return this.http.put<Orders>(url, JSON.stringify(order), {headers: this.head});
  }

  getAll(): Observable<Orders[]> {
    const url = this.orders + '/getAll';
    console.log(url + '- get all order');
    return this.http.get<Orders[]>(url, {headers: this.head});
  }

  getAllById(id: number): Observable<Orders[]> {
    const url = this.orders + '/allOrdersById/' + id;
    console.log(url + '- get  all order of user: ' + id);
    return this.http.get<Orders[]>(url, {headers: this.head});
  }
}
