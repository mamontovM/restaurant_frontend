import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UsersComponent} from './users/users.component';
import {HttpClientModule} from '@angular/common/http';
import {
  MatButtonModule,
  MatToolbarModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatCardModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IngredientsComponent} from './ingredients/ingredients.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DishesComponent} from './dishes/dishes.component';
import {WaiterOrdersComponent} from './waiter-orders/waiter-orders.component';
import {CookOrdersComponent} from './cook-orders/cook-orders.component';
import {UtilsComponent} from './utils/utils.component';
import {AllOrdersComponent} from './all-orders/all-orders.component';
import {MissingIngredientsComponent} from './missing-ingredients/missing-ingredients.component';
import {StorageComponent} from './storage/storage.component';
import {CommonModule} from '@angular/common';
import {LoginformComponent} from './loginform/loginform.component';
import {HistoryComponent} from './history/history.component';
import {GuardsCheckEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {AUTH_INITIALIZER} from './auth/currentuser.service';
import {HTTP_AUTH_INTERCEPTOR_PROVIDER} from './auth/http.interceptor';
import {PermitDirective} from './auth/permit.directive';
import {UserMenuComponent} from './user-menu/user-menu.component';
import {DeleteDialogComponent} from './dialog/delete.dialog';
import {AlertDialogComponent} from './dialog/alert.dialog';
import {IngredientsAdminComponent} from './ingredients-admin/ingredients-admin.component';
import {IngredientsCookComponent} from './ingredients-cook/ingredients-cook.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    IngredientsComponent,
    DishesComponent,
    WaiterOrdersComponent,
    CookOrdersComponent,
    UtilsComponent,
    AllOrdersComponent,
    MissingIngredientsComponent,
    StorageComponent,
    LoginformComponent,
    HistoryComponent,
    LoginformComponent,
    PermitDirective,
    UserMenuComponent,
    DeleteDialogComponent,
    AlertDialogComponent,
    IngredientsAdminComponent,
    IngredientsCookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,

  ],
  entryComponents: [
    DeleteDialogComponent,
    AlertDialogComponent
  ],
  providers: [
    HTTP_AUTH_INTERCEPTOR_PROVIDER,
    AUTH_INITIALIZER,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private router: Router) {
    router.events.pipe(
      filter(event => event instanceof GuardsCheckEnd),
      map(event => (event as GuardsCheckEnd).shouldActivate)
    ).subscribe(shouldActivate => {
      if (!shouldActivate) {
        this.router.navigate(['auth']);
      }
    });
  }
}
