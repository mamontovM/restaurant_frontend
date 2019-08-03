import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Ingredient, IngredientApi} from '../utils/Ingredient';
import {IngredientService} from './ingredient.service';
import {IngredientPart} from '../utils/IngredientPart';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject, merge, of as observableOf, Subject} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {StorageService} from '../storage/storage.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {validatorIngredientUniqueName} from './validatorIngredientUniqueName';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../dialog/delete.dialog';
import {AlertDialogComponent} from '../dialog/alert.dialog';


@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IngredientsComponent implements AfterViewInit {
  VALUE = 'value';
  ingredients: Ingredient[] = [];
  columnsToDisplay = ['id', 'name', 'measure', 'summaryFreshAmount', 'summaryRottenAmount', 'volumePerUnit', 'summaryVolume', 'delete'];
  newIngredient: Ingredient = new Ingredient();
  resultsLength = 0;
  expandedElement: Ingredient | null = null;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  _newIngredientForm: FormGroup;
  _newIngredientPartForm: FormGroup;
  freeStorageVolume = 0;
  maxStorageVolume = 0;
  refreshIngredientsTable$ = new Subject<boolean>();

  constructor(private ingredientService: IngredientService, private storageService: StorageService,
              private fb: FormBuilder, private dialog: MatDialog) {
    this._newIngredientForm = fb.group({
      name: fb.control(undefined, [Validators.required], [validatorIngredientUniqueName(this.ingredientService)]),
      measure: fb.control(undefined, [Validators.required]),
      volumePerUnit: fb.control(undefined, [Validators.required, Validators.min(0.0000000001)])
    });
    this._newIngredientPartForm = fb.group({
      value: fb.control(undefined, [Validators.required, Validators.min(0.0000000001)]),
      expirationDate: fb.control(undefined, [Validators.required]),
      ingredientId: fb.control(undefined, [Validators.required])
    });
  }

  changeFormValidator() {
    let ingrId = 0;
    let ingrVolumePerUnit = 0;
    if (this.expandedElement !== null) {
      ingrId = this.expandedElement.id;
      ingrVolumePerUnit = this.expandedElement.volumePerUnit;
      this._newIngredientPartForm.reset();
      this._newIngredientPartForm.patchValue({ingredientId: ingrId});
      this._newIngredientPartForm.controls[this.VALUE].clearValidators();
      this._newIngredientPartForm.controls[this.VALUE].setValidators(
        [Validators.required, Validators.min(0.0000000001), Validators.max(this.freeStorageVolume / ingrVolumePerUnit)]);
    }
  }

  ngAfterViewInit() {
    this.storageService.maxStorageVolume$.subscribe((data: number) => {
      this.maxStorageVolume = data;
      this.changeFormValidator();
    });
    this.storageService.freeStorageVolume$.subscribe((data: number) => {
      this.freeStorageVolume = data;
      this.changeFormValidator();
    });

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.refreshIngredientsTable$.pipe(
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
        a.summaryRottenAmount = sum - a.summaryFreshAmount;
        a.summaryVolume = sum * a.volumePerUnit;
      });
      this.ingredients = data;
    });
    this.refreshIngredientsTable$.next(true);
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.refreshIngredientsTable$.next(true);
    });
  }


  createIng() {
    this.ingredientService
      .createIngredient(this._newIngredientForm.value as { name: string, measure: string, volumePerUnit: number }).subscribe(() => {
      this.refreshIngredientsTable$.next(true);
      this.newIngredient.name = '';
      this.newIngredient.measure = '';
      this.newIngredient.volumePerUnit = 0;
      this._newIngredientForm.reset();
    });
  }

  createIngPart() {
    this.ingredientService.createIngredientPart(this._newIngredientPartForm.value as IngredientPart).subscribe(() => {
      this.refreshIngredientsTable$.next(true);
      this.ingredientService.refreshMissingIngredients$.next(true);
      this.storageService.refreshUsedStorage$.next(true);
    });
  }

  getErrorMessage() {
    return this._newIngredientPartForm.controls[this.VALUE].hasError('required') ? 'Не может быть пустым' :
      this._newIngredientPartForm.controls[this.VALUE].hasError('notEnoughSpace') ? 'Не хватит места на складе' :
        '';
  }

  openDialogDeleteIngredient(ingredient: Ingredient): void {
    this.ingredientService.isUsedIngredientInDish(ingredient.id).subscribe((isUsed: boolean) => {
      if (isUsed) {
        const alertRef = this.dialog.open(AlertDialogComponent, {
          width: '250px',
          data: {subject: ingredient.name, message: 'Нельзя удалить используемый в блюде ингредиент'}
        });
      } else {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '250px',
          data: {subject: ingredient.name, message: 'Вы точно хотите удалить ингредиент'}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.ingredientService.deleteIngredient(ingredient.id).subscribe(() => {
              this.refreshIngredientsTable$.next(true);
              this.ingredientService.refreshMissingIngredients$.next(true);
              this.storageService.refreshUsedStorage$.next(true);
            });
          }
        });
      }
    });
  }

  openDialogDeleteIngredientPart(ingr: Ingredient, part: IngredientPart): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {subject: part.id.toString(), message: 'Вы точно хотите удалить партию с Id = '}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ingredientService.deleteIngredientPart(part.id).subscribe(() => {
          this.refreshIngredientsTable$.next(true);
          this.ingredientService.refreshMissingIngredients$.next(true);
          this.storageService.refreshUsedStorage$.next(true);
        });
      }
    });
  }
}
