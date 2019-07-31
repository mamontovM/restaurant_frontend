import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CurrentUserService} from '../auth/currentuser.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent implements OnInit {

  public auth$ = this.currentUserService.auth$; // не убирать

  constructor(private currentUserService: CurrentUserService, private router: Router) { // private route: ActivatedRoute
  }

  ngOnInit() {
  }

  handleLogoutClick() {
    this.currentUserService.logout();
    this.router.navigate(['']); // ByUrl(this.router.url);
  }
}
