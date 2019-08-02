import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IngredientService} from '../ingredients/ingredient.service';
import {Ingredient} from '../utils/Ingredient';


@Component({
  selector: 'app-ingredients-cook',
  templateUrl: './ingredients-cook.component.html',
  styleUrls: ['./ingredients-cook.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IngredientsCookComponent implements AfterViewInit {
  ingredients: Ingredient[] = [];
  columnsToDisplay = ['id', 'name', 'measure', 'summaryAmount'];
  resultsLength = 0;
  expandedElement?: Ingredient | null;

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  constructor(private ingredientService: IngredientService) {
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.ingredientService
            .getAllIngredients(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(data => {
          this.resultsLength = data.totalCount;
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe((data: Ingredient[]) => {
      data.forEach((a: Ingredient) => {
        let sum = 0;
        for (const part of a.parts) {
          // tslint:disable-next-line:no-unsafe-any
          sum += part.value;
        }
        a.summaryAmount = sum;
        a.summaryVolume = sum * a.volumePerUnit;
      });
      this.ingredients = data;
    });
  }
}
