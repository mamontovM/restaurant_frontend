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
  myHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
  }

  getAllDishes(sort: string, order: string, pageIndex: number, pageSize: number, filter: string): Observable<DishApi> {
    return this.http.get<DishApi>(
      this.dishesPath + '?pageIndex=' + pageIndex + '&sortedBy=' + sort +
      '&pageSize=' + pageSize + '&sortDir=' + order + '&filter=' + filter,
      {headers: this.myHeaders});
  }

  getFilteredMenuDishes(filtr: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.dishesPath + '/inmenu/' + filtr, {headers: this.myHeaders});
  }

  getMenuDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.dishesPath + '/inmenu', {headers: this.myHeaders});
  }

  createDish(dish: {name: string, type: string, cost: number, ismenu: boolean}): Observable<{}> {
    return this.http.post(this.dishesPath, JSON.stringify(dish), {headers: this.myHeaders});
  }

  updateDish(dish: Dish): Observable<{}> {
    return this.http.put(this.dishesPath, JSON.stringify(dish), {headers: this.myHeaders});
  }


  deleteDishIngredient(dishId: number, ingId: number): Observable<{}> {
    return this.http.delete(this.dishIngredientPath + '/' + String(dishId) + '/' + String(ingId), {headers: this.myHeaders});
  }

  createDishConsist(newCons: {value: number, id: {ingredientId: number, dishId: number}}): Observable<{}> {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.dishIngredientPath, JSON.stringify(newCons), {headers: myHeaders});
  }

  deleteUnsoldDish(dishId: number): Observable<{}> {
    return this.http.delete(this.dishesPath + '/' + dishId.toString(), {headers: this.myHeaders});
  }
}
