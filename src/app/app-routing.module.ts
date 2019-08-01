import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsersComponent} from './users/users.component';
import {IngredientsComponent} from './ingredients/ingredients.component';
import {DishesComponent} from './dishes/dishes.component';
import {CookOrdersComponent} from './cook-orders/cook-orders.component';
import {WaiterOrdersComponent} from './waiter-orders/waiter-orders.component';
import {IngredientsReadOnlyComponent} from './ingredients-read-only/ingredients-read.component';
import {AllOrdersComponent} from './all-orders/all-orders.component';
import {HistoryComponent} from './history/history.component';
import {LoginformComponent} from './loginform/loginform.component';
import {KeeperGuard} from './auth/keeper.guard';
import {AdminGuard} from './auth/admin.guard';
import {CookGuard} from './auth/cook.guard';
import {WaiterGuard} from './auth/waiter.guard';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'ingredients',
    component: IngredientsComponent,
    canActivate: [KeeperGuard],
    runGuardsAndResolvers: 'always',

  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'ingredients-read',
    component: IngredientsReadOnlyComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'dishes',
    component: DishesComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'cookOrders',
    component: CookOrdersComponent,
    canActivate: [CookGuard],
  },

  {
    path: 'waiterOrders',
    component: WaiterOrdersComponent,
    canActivate: [WaiterGuard],
  },
  {
    path: 'allOrders',
    component: AllOrdersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'auth',
    component: LoginformComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
