import {AfterViewInit, Component} from '@angular/core';

import {Missingingredient} from '../utils/missingingredient';
import {IngredientService} from '../ingredients/ingredient.service';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-missing-ingredients',
  templateUrl: './missing-ingredients.component.html',
  styleUrls: ['./missing-ingredients.component.scss'],
})
export class MissingIngredientsComponent implements AfterViewInit {

  columnsToDisplay = ['id', 'name', 'measure', 'amount', 'needAmount'];
  missingIngredients: Missingingredient[] = [];

  constructor(private ingredientService: IngredientService) {
  }

  ngAfterViewInit() {
    this.ingredientService.updateMissingIngredients().subscribe((data: Missingingredient[]) => this.missingIngredients = data);
    this.ingredientService.refreshMissingIngredients$.pipe(
      switchMap(() => {
        return this.ingredientService.updateMissingIngredients();
      }))
      .subscribe((data: Missingingredient[]) => this.missingIngredients = data);
  }
}
