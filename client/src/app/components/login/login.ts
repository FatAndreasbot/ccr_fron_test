import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../interfaces/iuser';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  useraData: IUser = { username: "", password: "" }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logIn() {
    console.log(this.useraData)
    this.authService.logIn(this.useraData).subscribe({
      complete: () => {
        this.router.navigate([""])
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        alert("no CORS (((")
      }
    })
  }
}
