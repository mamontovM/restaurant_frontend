import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Ingredient, IngredientApi} from '../utils/Ingredient';
import {IngredientPart} from '../utils/IngredientPart';
import {Missingingredient} from '../utils/missingingredient';
import {OrderDish} from '../utils/order.dish';


@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private ingredientsPath = '/restaurant/ingredients';
  private ingredientPartsPath = '/restaurant/ingredientparts';
  public refreshMissingIngredients$ = new Subject<boolean>();
  myHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
  }

  isUsedIngredientInDish(ingrId: number): Observable<boolean> {
    return this.http.get<boolean>(this.ingredientsPath + '/isUsed/' + ingrId, {headers: this.myHeaders});
  }

  updateMissingIngredients(): Observable<Missingingredient[]> {
    return this.http.get<Missingingredient[]>(this.ingredientsPath + '/missing', {headers: this.myHeaders});
  }

  debitIngredients(dishes: OrderDish[]): Observable<boolean> {
    return this.http.put<boolean>(this.ingredientPartsPath + '/debit', JSON.stringify(dishes), {headers: this.myHeaders});
  }

  reduceIngredientAmount(ingrId: number, delta: number): Observable<boolean> {
    return this.http.put<boolean>(this.ingredientPartsPath + '/reduce?ingredientId=' + ingrId + '&delta=' + delta,
      null, {headers: this.myHeaders});
  }

  getUsedStorage(): Observable<number> {
    return this.http.get<number>(this.ingredientPartsPath + '/summaryVolume', {headers: this.myHeaders});
  }

  getSummaryIngredientAmountNotExpired(ingredientId: number): Observable<number> {
    return this.http.get<number>(this.ingredientPartsPath + '/summary/' + ingredientId, {headers: this.myHeaders});
  }

  checkIngredientNameUnique(name: string): Observable<boolean> {
    return this.http.get<boolean>(this.ingredientsPath + '/check?name=' + name, {headers: this.myHeaders});
  }

  getAllIngredients(sort: string, order: string, pageIndex: number, pageSize: number): Observable<IngredientApi> {
    return this.http.get<IngredientApi>(
      this.ingredientsPath + '?pageIndex=' + pageIndex + '&sortedBy=' + sort + '&pageSize=' + pageSize + '&sortDir=' + order,
      {headers: this.myHeaders});
  }

  createIngredient(ing: {name: string, measure: string, volumePerUnit: number}): Observable<{}> {
    return this.http.post(this.ingredientsPath, JSON.stringify(ing), {headers: this.myHeaders});
  }

  createIngredientPart(ingPart: IngredientPart): Observable<{}> {
    return this.http.post(this.ingredientPartsPath, JSON.stringify(ingPart), {headers: this.myHeaders});
  }

  deleteIngredient(ingId: number): Observable<{}> {
    return this.http.delete(this.ingredientsPath + '/' + String(ingId), {headers: this.myHeaders});
  }

  deleteIngredientPart(ingId: number): Observable<{}> {
    return this.http.delete(this.ingredientPartsPath + '/' + String(ingId), {headers: this.myHeaders});
  }
}
