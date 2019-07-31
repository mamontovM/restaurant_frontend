import {Component, OnInit} from '@angular/core';
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
  _editStorage: FormGroup;

  constructor(private ingredientService: IngredientService, private storageService: StorageService, private fb: FormBuilder) {
    this._editStorage = fb.group({
      value: fb.control(undefined, [Validators.required, Validators.min(0.1)]),
    });
  }

  ngOnInit() {
    this.ingredientService.getUsedStorage().subscribe(data => this.usedStorageVolume = data);
    this.storageService.getMaxStorageVolume().subscribe(data => this.maxStorageVolume = data.maxStorageVolume);

    this.storageService.refreshUsedStorage$.pipe(
      switchMap(() => {
        return this.ingredientService.getUsedStorage();
      }))
      .subscribe((data: number) => this.usedStorageVolume = data);
  }

  updateUsedStorageVolume() {
    this.ingredientService.getUsedStorage().subscribe(data => this.usedStorageVolume = data);
  }

  changeMaxStorageVolume() {
    this.storageService.setMaxStorageVolume((this._editStorage.value as FormControl).value as number).pipe(switchMap(() => {
      return this.storageService.getMaxStorageVolume();
    })).subscribe(data => this.maxStorageVolume = data.maxStorageVolume);
  }
}
