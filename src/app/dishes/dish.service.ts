import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Dish, DishApi} from '../utils/dish';



@Injectable({
  providedIn: 'root'
})
export class DishService {
  private dishesPath = '/restaurant/dishes';
  private dishIngredientPath = '/restaurant/dishes/consist';


  constructor(private http: HttpClient) {
  }

  getAllDishes(sort: string, order: string, pageIndex: number, pageSize: number, filter: string): Observable<DishApi> {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<DishApi>(
      this.dishesPath + '?pageIndex=' + pageIndex + '&sortedBy=' + sort +
      '&pageSize=' + pageSize + '&sortDir=' + order + '&filter=' + filter,
      {headers: myHeaders});
  }

  getFilteredMenuDishes(filtr: string): Observable<Dish[]> {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Dish[]>(this.dishesPath + '/inmenu/' + filtr, {headers: myHeaders});
  }

  getMenuDishes(): Observable<Dish[]> {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Dish[]>(this.dishesPath + '/inmenu', {headers: myHeaders});
  }

  createDish(dish: {name: string, type: string, cost: number, ismenu: boolean}): Observable<{}> {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.dishesPath, JSON.stringify(dish), {headers: myHeaders});
  }

  deleteDishIngredient(dishId: number, ingId: number): Observable<{}> {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(this.dishIngredientPath + '/' + String(dishId) + '/' + String(ingId), {headers: myHeaders});
  }

  createDishConsist(newCons: {value: number, id: {ingredientId: number, dishId: number}}): Observable<{}> {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.dishIngredientPath, JSON.stringify(newCons), {headers: myHeaders});
  }

}
