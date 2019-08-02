import {Component, OnInit, Output} from '@angular/core';
import {IngredientService} from '../ingredients/ingredient.service';
import {switchMap} from 'rxjs/operators';
import {StorageService} from './storage.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {
  maxStorageVolume = 0;
  usedStorageVolume = 0;
  freeStorageVolume = 0;
  _editStorage: FormGroup;

  constructor(private ingredientService: IngredientService, private storageService: StorageService, private fb: FormBuilder) {
    this._editStorage = fb.group({
      value: fb.control(undefined, [Validators.required, Validators.min(0.1)]),
    });
  }

  ngOnInit() {
    this.storageService.getMaxStorageVolume().subscribe(data => {
      this.maxStorageVolume = data.maxStorageVolume;
      this.storageService.maxStorageVolume$.next(data.maxStorageVolume as number);
      this.storageService.refreshUsedStorage$.pipe(
        switchMap(() => {
          return this.ingredientService.getUsedStorage();
        }))
        .subscribe((data2: number) => {
          this.usedStorageVolume = data2;
          this.freeStorageVolume = this.maxStorageVolume - this.usedStorageVolume;
          this.storageService.freeStorageVolume$.next(this.freeStorageVolume);
        });
      this.storageService.refreshUsedStorage$.next(true);
    });
    this.storageService.maxStorageVolume$.subscribe((data: number) => {
      this.maxStorageVolume = data;
      this.storageService.refreshUsedStorage$.next(true);
    });
  }

  updateUsedStorageVolume() {
    this.storageService.refreshUsedStorage$.next(true);
  }

  changeMaxStorageVolume() {
    this.storageService.setMaxStorageVolume((this._editStorage.value as FormControl).value as number).pipe(switchMap(() => {
      return this.storageService.getMaxStorageVolume();
    })).subscribe(data => {
      this.storageService.maxStorageVolume$.next(data.maxStorageVolume);
    });
  }
}
