import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service/auth-service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  logOut(){
    this.authService.logOut()
    this.router.navigate(["login/"])
  }
}
