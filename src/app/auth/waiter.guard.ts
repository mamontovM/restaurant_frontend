import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PermissionService} from './permision.service';


@Injectable({
  providedIn: 'root'
})
export class WaiterGuard implements CanActivate {

  constructor(private permissionService: PermissionService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.permissionService.has(3);
  }

}
