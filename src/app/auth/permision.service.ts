import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {distinctUntilChanged, first, map, shareReplay} from 'rxjs/operators';
import {CurrentUserService} from './currentuser.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private currentUserService: CurrentUserService) {
  }

  watch(permittedRoleId: number): Observable<boolean> {
    return this.currentUserService.auth$.pipe(
      map(auth => {
        if (auth == undefined) {
          return false;
        }
        return auth.roleId === permittedRoleId;
      }),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  has(permittedRoleId: number): Observable<boolean> {
    return this.watch(permittedRoleId).pipe(first());
  }
}
