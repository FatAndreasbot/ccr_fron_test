import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service/auth-service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  constructor(
    private authService: AuthService
  ) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }
}
