import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CurrentUserService, UserAuthInfo} from '../auth/currentuser.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.scss']
})
export class LoginformComponent implements OnInit {
  LOGIN = 'login';
  PASS = 'password';
  _loginForm: FormGroup;
  hide = true;
  isLoadingResults = false;

  constructor(private fb: FormBuilder, private currentUserService: CurrentUserService, private router: Router) {
    this._loginForm = fb.group({
      login: fb.control(undefined, [Validators.required]),
      password: fb.control(undefined, [Validators.required])
    });
  }

  ngOnInit() {
  }

  getErrorLogin() {
    return this._loginForm.controls[this.LOGIN].hasError('required') ? 'Не может быть пустым' :
      '';
  }

  getErrorPassword() {
    return this._loginForm.controls[this.PASS].hasError('required') ? 'Не может быть пустым' :
      this._loginForm.controls[this.PASS].hasError('wrongPass') ? 'Либо в логине, либо в пароле ошибка' :
        '';
  }

  handleLoginClick() {
    this.isLoadingResults = true;
    this.currentUserService.authenticate(
      (this._loginForm.value as { login: string, password: string }).login,
      (this._loginForm.value as { login: string, password: string }).password
    ).pipe(
      catchError(() => {

        return observableOf({accessToken: 'undefined', refreshToken: 'undefined', roleId: 0, username: 'undefined', id: 0});
      })
    ).subscribe((value: UserAuthInfo) => {
      if (value.accessToken === 'undefined') {
         this.isLoadingResults = false;
      } else {
        this.router.navigate(['']);
      }
    });
  }
}
